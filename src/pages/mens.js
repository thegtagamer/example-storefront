import React, { Component, Fragment } from "react";
// import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { inject, observer } from "mobx-react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
// import CartEmptyMessage from "@reactioncommerce/components/CartEmptyMessage/v1";
// import CartSummary from "@reactioncommerce/components/CartSummary/v1";
import withCart from "containers/cart/withCart";
// import CartItems from "components/CartItems";
// import CheckoutButtons from "components/CheckoutButtons";
// import Link from "components/Link";
import { Router } from "routes";
import PageLoading from "components/PageLoading";
import track from "lib/tracking/track";
// import variantById from "lib/utils/variantById";
import trackCartItems from "lib/tracking/trackCartItems";
// import TRACKING from "lib/tracking/constants";

const styles = (theme) => ({
  cartEmptyMessageContainer: {
    margin: "80px 0"
  },
  checkoutButtonsContainer: {
    backgroundColor: theme.palette.reaction.black02,
    padding: theme.spacing.unit * 2
  },
  customerSupportCopy: {
    paddingLeft: `${theme.spacing.unit * 4}px !important`
  },
  phoneNumber: {
    fontWeight: theme.typography.fontWeightBold
  },
  title: {
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: "1.6rem",
    marginBottom: "3.1rem"
  },
  itemWrapper: {
    borderTop: theme.palette.borders.default,
    borderBottom: theme.palette.borders.default
  }
});

@withStyles(styles)
@withCart
@inject("uiStore")
@track()
@observer
class Men extends Component {

  componentDidMount() {

  }

  handleClick = () => Router.pushRoute("/");


  @trackCartItems()
  trackAction() {}


  render() {
    const { cart, classes, shop } = this.props;
    // when a user has no item in cart in a new session, this.props.cart is null
    // when the app is still loading, this.props.cart is undefined
    if (typeof cart === "undefined") return <PageLoading delay={0} />;

    return (
      <Fragment>
        <Helmet
          title={`Men | ${shop && shop.name}`}
          meta={[{ name: "description", content: shop && shop.description }]}
        />
        <section>
          <Typography className={classes.title} variant="h6" align="center">
           Men
          </Typography>
          <Grid container spacing={24}>
          <img src="https://ds.asort.com/resources/men/1.jpg" style={{'display':'block','margin': 'auto'}} />
          </Grid>
        </section>
      </Fragment>
    );
  }
}

export default Men;
