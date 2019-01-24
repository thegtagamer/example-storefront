import React, { Component } from "react";
import PropTypes from "prop-types";
import { ResultCard } from "@appbaseio/reactivesearch";
import { withStyles } from "@material-ui/core/styles";
import track from "lib/tracking/track";
import trackProductClicked from "lib/tracking/trackProductClicked";

const styles = () => ({
  resultCard: {
    "& .resultImage": {
      boxShadow: "none"
    }
  }
});

export const searchResultCardProps = {
  componentId: "searchResultCard",
  dataField: "product.title",
  size: 1,
  onData: (res) =>
    ({
      description: res.product.vendor,
      image: `http://localhost:3000/${res.product.media[0].URLs.small}`,
      title: (
        <div>
          {res.product.title}
          {res.product.pricing.USD.displayPrice}
        </div>
      ),
      url: `/product/${res.product.slug}`
    }),
  pagination: true,
  react: {
    and: ["search"]
  },
  target: "_self"
};

@withStyles(styles, { name: "SkProductGrid" })
@track()
export default class ProductGrid extends Component {
  static propTypes = {
    classes: PropTypes.object
  };

  @trackProductClicked()
  onItemClick = (event, product) => {} // eslint-disable-line no-unused-vars

  render() {
    const { classes } = this.props;

    return (
      <ResultCard
        {...searchResultCardProps}
        className={classes.resultCard}
        innerClass={{ listItem: "resultImage" }}
      />
    );
  }
}
