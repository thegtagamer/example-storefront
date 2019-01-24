import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";
import Helmet from "react-helmet";
import withCatalogItems from "containers/catalog/withCatalogItems";
import trackProductListViewed from "lib/tracking/trackProductListViewed";
import { DataSearch, ResultCard } from "@appbaseio/reactivesearch";
import { searchInputProps } from "components/SearchInput";
import ProductGrid, { searchResultCardProps } from "components/ProductGrid";
import initReactivesearch from "@appbaseio/reactivesearch/lib/server";

export const reactiveSearchSettings = {
  app: "catalog",
  url: "http://elasticsearch.api.reaction.localhost:9200"
};

@withCatalogItems
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
    tag: PropTypes.object
  };

  static async getInitialProps({ req }) {
    // It is not perfect, but the only way we can guess at the screen width of the
    // requesting device is to parse the `user-agent` header it sends.
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const width = (userAgent && userAgent.indexOf("Mobi")) > -1 ? 320 : 1024;

    // Get search URL query params
    let searchQueryParams = null;
    if (req && req.query) {
      const { query } = req;
      if (query.search && query.search.trim() !== "") {
        searchQueryParams = { search: query.search };
      }
    }

    // Retrieve initial data for ReactiveSearch on the server
    const searchInitData = await initReactivesearch(
      [
        {
          ...searchInputProps,
          type: "DataSearch",
          source: DataSearch
        },
        {
          ...searchResultCardProps,
          type: "ResultCard",
          source: ResultCard
        }
      ],
      searchQueryParams,
      reactiveSearchSettings,
    );

    return { initialGridSize: { width }, searchInitData };
  }

  @trackProductListViewed()
  componentDidMount() {
    const { routingStore } = this.props;
    routingStore.setTagId(null);
  }

  componentDidUpdate(prevProps) {
    if (this.props.catalogItems !== prevProps.catalogItems) {
      this.trackEvent(this.props);
    }
  }

  @trackProductListViewed()
  trackEvent() {}

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
