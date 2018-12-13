import React, { Component } from "react";
import { DataSearch } from "@appbaseio/reactivesearch";
import { productSearchPagination } from "./query";

export default class ProductSearchInput extends Component {
  render() {
    return (
      <DataSearch
        componentId="productSearchPagination"
        dataField={["product.title"]}
        style={{ maxWidth: "200px" }}
        customQuery={function (value, props) {
          // console.log("props", props);
          return {
            graphqlQuery: productSearchPagination(value)
          };
        }}
      />
    );
  }
}
