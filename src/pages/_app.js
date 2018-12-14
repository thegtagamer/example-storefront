import NextApp, { Container } from "next/app";
import React from "react";
import { ReactiveBase } from "@appbaseio/reactivesearch";
import { ThemeProvider as RuiThemeProvider } from "styled-components";
import { StripeProvider } from "react-stripe-elements";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import { ComponentsProvider } from "@reactioncommerce/components-context";
import get from "lodash.get";
import getConfig from "next/config";
import track from "lib/tracking/track";
import dispatch from "lib/tracking/dispatch";
import withApolloClient from "lib/apollo/withApolloClient";
import withShop from "containers/shop/withShop";
import withViewer from "containers/account/withViewer";
import withTags from "containers/tags/withTags";
import Layout from "components/Layout";
import withMobX from "lib/stores/withMobX";
import rootMobXStores from "lib/stores";
import defaultCatalogQuery from "components/ProductGrid/defaultQuery";
import components from "../lib/theme/components";
import getPageContext from "../lib/theme/getPageContext";
import componentTheme from "../lib/theme/componentTheme";

const { publicRuntimeConfig } = getConfig();

@withApolloClient
@withMobX
@withShop
@withViewer
@withTags
@track({}, { dispatch })
export default class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
    this.state = { stripe: null };
  }

  pageContext = null;

  componentDidMount() {
    // Fetch and update auth token in auth store
    rootMobXStores.cartStore.setAnonymousCartCredentialsFromLocalStorage();
    rootMobXStores.keycloakAuthStore.setTokenFromLocalStorage();

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const { stripePublicApiKey } = publicRuntimeConfig;
    if (stripePublicApiKey && window.Stripe) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ stripe: window.Stripe(stripePublicApiKey) });
    }
  }

  transformSearchRequest = (request) => {
    const [preference, esQuery] = request.body.split("\n");
    const elasticQuery = JSON.parse(esQuery);
    const { size, from: startFrom } = elasticQuery;
    // If "from" is not defined, default to 0
    const page = ((startFrom / size) || 0) + 1;
    // console.log("elasticClientQuery", elasticQuery);

    // Get query from sensor component, i.e. SearchInput component
    let graphqlQuery = get(elasticQuery, "query.bool.must[0].bool.must.graphqlQuery");
    if (!graphqlQuery) {
      // Get query from a results component, i.e. ResultCard
      graphqlQuery = get(elasticQuery, "query.bool.must[0].bool.must[0].graphqlQuery");
      // Otherwise, use default initial query, "match_all: {}"
      if (!graphqlQuery) {
        graphqlQuery = defaultCatalogQuery;
      }
    }
    const transformedBody = {
      field: JSON.parse(preference).preference,
      query: graphqlQuery.replace(/PAGE/, page).replace(/PER_PAGE/, size)
    };

    request.body = JSON.stringify(transformedBody);
    console.log("transformedBody", request.body);

    return request;
  };

  render() {
    const { Component, pageProps, shop, viewer, ...rest } = this.props;
    const { route } = this.props.router;
    const { stripe } = this.state;

    return (
      <Container>
        <ComponentsProvider value={components}>
          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >
            <ReactiveBase
              app="reaction.cdc.reaction.catalog.json-gen1"
              transformRequest={this.transformSearchRequest}
              url="http://graphql-proxy.search-api.reaction.localhost:9201"
            >
              <RuiThemeProvider theme={componentTheme}>
                <MuiThemeProvider theme={this.pageContext.theme} sheetsManager={this.pageContext.sheetsManager}>
                  <CssBaseline />
                  {route === "/checkout" || route === "/login" ? (
                    <StripeProvider stripe={stripe}>
                      <Component pageContext={this.pageContext} shop={shop} {...rest} {...pageProps} />
                    </StripeProvider>
                  ) : (
                    <Layout shop={shop} viewer={viewer}>
                      <Component pageContext={this.pageContext} shop={shop} {...rest} {...pageProps} />
                    </Layout>
                  )}
                </MuiThemeProvider>
              </RuiThemeProvider>
            </ReactiveBase>
          </JssProvider>
        </ComponentsProvider>
      </Container>
    );
  }
}
