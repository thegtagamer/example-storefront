import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "@reactioncommerce/components/Field/v1";
import TextInput from "@reactioncommerce/components/TextInput/v1";
import withApolloSearchClient from "lib/apollo-search/withApolloSearchClient";
import { ApolloConsumer } from "react-apollo";
import { DataSearch } from "@appbaseio/reactivesearch";
import { productSearch } from "./queries.gql";

@withApolloSearchClient
export default class ProductSearchInput extends Component {
  static propTypes = {
    query: PropTypes.string,
    searchClient: PropTypes.object
  };

  // onChangeQuery = async (client, query) => {
  //   if (!query) {
  //     return;
  //   }

  //   console.log("query", query);

  //   const { data } = await client.query({
  //     query: productSearch,
  //     variables: { query }
  //   });
  //   console.log("Search query response", data);
  // };

  // renderCustomSearch = () => (
  //   <ApolloConsumer>
  //     {(client) => (
  //       <Field name="product-search" label="Search" helpText="What are you looking for?" labelFor="query">
  //         <TextInput id="query" name="query" placeholder="" onChange={this.onChangeQuery.bind(null, client)} />
  //       </Field>
  //     )}
  //   </ApolloConsumer>
  // );

  renderReactiveSearch = () => (
    <DataSearch
      componentId="productSearchConnection"
      dataField={["product.title"]}
      style={{ maxWidth: "200px" }}
      customQuery={function (value, props) {
        console.log("searchInputProps", props);

        // TODO: rewrite query as a boolean query
        return {
          graphqlQuery: `
            {
              productSearchConnection(
                query: { match: { product__title: { query: "${value}" } } }
                sort: [_score, id__asc]
                first: 10 
                ) {
                  _shards {
                    successful,
                    failed
                    total
                  }
                  count
                  max_score
                  took
                  timed_out
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                  }
                  edges {
                    cursor
                    node {
                      _score
                      _source {
                        product {
                          description
                          media
                          pricing
                          slug
                          title
                          vendor
                        }
                      }
                    }
                  }

              }
            }
          `
        };
      }}
      urlParams={true}
    />
  );

  render() {
    const { primaryShopId, query } = this.props;

    const variables = {
      query,
      primaryShopId
    };

    return this.renderReactiveSearch();
  }
}
