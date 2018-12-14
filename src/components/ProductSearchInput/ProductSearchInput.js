import React, { Component } from "react";
import PropTypes from "prop-types";
import { DataSearch } from "@appbaseio/reactivesearch";
import { withStyles } from "@material-ui/core/styles";
import { productSearchPagination } from "./query";

const styles = ({
  container: {
    marginLeft: "auto"
  }
});

@withStyles(styles)
export default class ProductSearchInput extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
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
      </div>
    );
  }
}
