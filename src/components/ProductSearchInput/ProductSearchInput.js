import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "@reactioncommerce/components/Field/v1";
import TextInput from "@reactioncommerce/components/TextInput/v1";
import { productSearch } from "./queries.gql";
import withApolloSearchClient from "lib/apollo-search/withApolloSearchClient";
import { ApolloConsumer, Query } from "react-apollo";

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
    const { data } = await client.query({
      query: productSearch,
      variables: { query }
    });
    console.log("Search query response", data);
  };

  render() {
    const { primaryShopId, query } = this.props;

    const variables = {
      query,
      primaryShopId
    };

    return (
      <ApolloConsumer>
        {client => (
          <Field
            name="product-search"
            label="Search"
            helpText="What are you looking for?"
            labelFor="query"
          >
            <TextInput
              id="query"
              name="query"
              placeholder=""
              onChange={this.onChangeQuery.bind(null, client)}
            />
          </Field>
        )}
      </ApolloConsumer>
    );
  }
}
/*
<Query
  query={catalogBySearch}
  variables={variables}
  client={this.props.searchClient}
>
</Query>
*/
