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
    // console.log("request", JSON.stringify(request));
    const [preference, elasticQuery] = request.body.split("\n");
    // console.log("elasticQuery", JSON.parse(elasticQuery));

    // const graphqlQuery = get(JSON.parse(elasticQuery), "query");
    let graphqlQuery = get(JSON.parse(elasticQuery), "query.bool.must[0].bool.must.graphqlQuery");
    if (!graphqlQuery) {
      console.log("graphqlQuery", graphqlQuery);


      graphqlQuery = get(JSON.parse(elasticQuery), "query.bool.must[0].bool.must[0].graphqlQuery");
    }

    const q = `
      {
        from: ${elasticQuery.from || 0},
        query: ${graphqlQuery},
        size: ${elasticQuery.size || 10},
        _source: ${elasticQuery._source || { excludes: [], includes: ["*"] }}
      }
      `;

    request.body = JSON.parse({
      ...preference,
      ...q
    });
    // console.log("graphQLRequest", request.body);

    return request;
  }

  render() {
    const { Component, pageProps, shop, viewer, ...rest } = this.props;
    const { route } = this.props.router;
    const { stripe } = this.state;

    return <Container>
      <ComponentsProvider value={components}>
        <JssProvider registry={this.pageContext.sheetsRegistry} generateClassName={this.pageContext.generateClassName}>
          <ReactiveBase
            app="reaction.cdc.reaction.catalog.json-gen1"
            url="http://graphql-proxy.search-api.reaction.localhost:9201"
            transformRequest={this.transformSearchRequest}
          >
            <RuiThemeProvider theme={componentTheme}>
              <MuiThemeProvider theme={this.pageContext.theme} sheetsManager={this.pageContext.sheetsManager}>
                <CssBaseline />
                {route === "/checkout" || route === "/login" ? <StripeProvider stripe={stripe}>
                  <Component pageContext={this.pageContext} shop={shop} {...rest} {...pageProps} />
                </StripeProvider> : <Layout shop={shop} viewer={viewer}>
                  <Component pageContext={this.pageContext} shop={shop} {...rest} {...pageProps} />
                </Layout>}
              </MuiThemeProvider>
            </RuiThemeProvider>
          </ReactiveBase>
        </JssProvider>
      </ComponentsProvider>
    </Container>;
  }
}
