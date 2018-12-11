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

  onChangeQuery = async (client, query) => {
    if (!query) {
      return;
    }

    console.log("query", query);

    const { data } = await client.query({
      query: productSearch,
      variables: { query }
    });
    console.log("Search query response", data);
  };

  renderCustomSearch = () => (
    <ApolloConsumer>
      {(client) => (
        <Field name="product-search" label="Search" helpText="What are you looking for?" labelFor="query">
          <TextInput id="query" name="query" placeholder="" onChange={this.onChangeQuery.bind(null, client)} />
        </Field>
      )}
    </ApolloConsumer>
  );

  renderReactiveSearch = () => (
    <DataSearch
      componentId="productSearch"
      dataField={["product.title"]}
      style={{ maxWidth: "200px" }}
      customQuery={function (value, props) {
        return {
          graphqlQuery: `
                {
                  productSearch( query: { match: { product__title: { query: "${value}" } } }) {
                    hits {
                      _id
                      _index
                      _score
                      _source {
                        product {
                          title
                        }
                      }
                      _type
                    }
                    count
                    max_score
                    took
                    timed_out
                    _shards {
                      failed
                      successful
                      total
                    }
                  }
                }
              `
        };
      }}
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
