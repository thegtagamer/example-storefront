import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";
import Helmet from "react-helmet";
import trackProductListViewed from "lib/tracking/trackProductListViewed";
import { productSearchInputProps } from "components/ProductSearchInput";
import ProductGrid, { searchResultCardProps } from "components/ProductGrid";
import get from "lodash.get";
import {
  DataSearch,
  ResultCard
} from "@appbaseio/reactivesearch";
import initReactivesearch from "@appbaseio/reactivesearch/lib/server";
import defaultCatalogQuery from "components/ProductGrid/defaultQuery";

/**
 * @name transformSearchRequest
 * @param {Object} request - the request
 * @return {Object} -  the transformed request
 */
function transformSearchRequest(request) {
  // console.log("====== transformSearchRequest(request)", JSON.stringify(request));

  let preference;
  let elasticQuery;
  if (Array.isArray(request)) {
    // On the server, the request is an Array
    [preference, elasticQuery] = request;
  } else {
    // "parse" ndjson - new line delimited JSON
    const parsedBody = request.body.split("\n");
    [preference, elasticQuery] = parsedBody;
  }

  elasticQuery = typeof elasticQuery === "string" ? JSON.parse(elasticQuery) : elasticQuery;

  // console.log("parsedESQuery", parsedESQuery);
  const { size, from: startFrom } = elasticQuery;

  const page = ((startFrom / size) || 0) + 1;

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
    query: graphqlQuery.replace(/PAGE/, page).replace(/PER_PAGE/, size)
  };

  // console.log("********************transformedBody", transformedBody);
  // return transformedBody;
  if (typeof window === "undefined") {
    // Executing in Node
    return transformedBody;
  }

  request.body = JSON.stringify(transformedBody);
  return request;
}

export const reactivesearchSettings = {
  app: "reaction.cdc.reaction.catalog.json-gen1",
  transformRequest: transformSearchRequest,
  url: "http://graphql-proxy.api.reaction.localhost:9201"
};

@inject("routingStore", "uiStore")
@observer
class ProductGridPage extends Component {
  static propTypes = {
    catalogItems: PropTypes.array,
    catalogItemsPageInfo: PropTypes.object,
    initialGridSize: PropTypes.object,
    isLoadingCatalogItems: PropTypes.bool,
    routingStore: PropTypes.object,
    shop: PropTypes.shape({
      currency: PropTypes.shape({
        code: PropTypes.string.isRequired
      })
    }),
    tag: PropTypes.object,
    uiStore: PropTypes.shape({
      pageSize: PropTypes.number.isRequired,
      setPageSize: PropTypes.func.isRequired,
      setSortBy: PropTypes.func.isRequired,
      sortBy: PropTypes.string.isRequired
    })
  };

  static async getInitialProps({ req }) {
    // It is not perfect, but the only way we can guess at the screen width of the
    // requesting device is to parse the `user-agent` header it sends.
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const width = (userAgent && userAgent.indexOf("Mobi")) > -1 ? 320 : 1024;

    const searchStore = await initReactivesearch(
      [
        {
          ...productSearchInputProps,
          type: "DataSearch",
          source: DataSearch
        },
        {
          ...searchResultCardProps,
          type: "ResultCard",
          source: ResultCard
        }
      ],
      null,
      reactivesearchSettings,
    );

    return { initialGridSize: { width }, searchStore };
  }

  @trackProductListViewed()
  componentDidMount() {
    const { routingStore } = this.props;
    routingStore.setTag({});
  }

  componentDidUpdate(prevProps) {
    if (this.props.catalogItems !== prevProps.catalogItems) {
      this.trackEvent(this.props);
    }
  }

  @trackProductListViewed()
  trackEvent() {}

  setPageSize = (pageSize) => {
    this.props.routingStore.setSearch({ limit: pageSize });
    this.props.uiStore.setPageSize(pageSize);
  };

  setSortBy = (sortBy) => {
    this.props.routingStore.setSearch({ sortby: sortBy });
    this.props.uiStore.setSortBy(sortBy);
  };

  render() {
    const {
      shop
    } = this.props;
    const pageTitle = shop && shop.description ? `${shop.name} | ${shop.description}` : shop.name;

    return (
      <Fragment>
        <Helmet
          title={pageTitle}
          meta={[{ name: "description", content: shop && shop.description }]}
        />
        <ProductGrid />
      </Fragment>
    );
  }
}

export default ProductGridPage;
