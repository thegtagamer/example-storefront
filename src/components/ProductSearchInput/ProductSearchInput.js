import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "@reactioncommerce/components/Field/v1";
import TextInput from "@reactioncommerce/components/TextInput/v1";
import { catalogBySearch } from "./queries.gql";
import withApolloSearchClient from "lib/apollo-search/withApolloSearchClient";
import { Query } from "react-apollo";

@withApolloSearchClient
export default class ProductSearchInput extends Component {
  static propTypes = {
    query: PropTypes.string,
    primaryShopId: PropTypes.string.isRequired,
    routingStore: PropTypes.shape({
      query: PropTypes.shape({
        orderId: PropTypes.string.isRequired,
        token: PropTypes.string
      })
    })
  };

  render() {
    const { primaryShopId, query } = this.props;

    const variables = {
      query,
      primaryShopId
    };

    return (
      <div>
        <Query
          query={catalogBySearch}
          variables={variables}
          client={this.props.searchClient}
        >
          {({ loading: isLoading, data: results }) => {
            return (
              <Field
                name="product-search"
                label="Search"
                helpText="What are you looking for?"
                labelFor="query"
              >
                <TextInput id="query" name="query" placeholder="" />
              </Field>
            );
          }}
        </Query>
      </div>
    );
  }
}
