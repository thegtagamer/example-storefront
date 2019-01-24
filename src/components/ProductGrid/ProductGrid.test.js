import React from "react";
import renderer from "react-test-renderer";
import { Provider } from "mobx-react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "custom/reactionTheme";
import { ReactiveBase } from "@appbaseio/reactivesearch";
import { reactiveSearchSettings } from "../../pages/productGrid";
import ProductGrid from "./ProductGrid";
import initialSearchData from "./__mocks__/searchResults.mock";

const routingStore = {
  pathname: "tag",
  query: {
    slug: "test-tag",
    querystring: "?this&that"
  }
};

test("basic snapshot", () => {
  const component = renderer.create((
    <MuiThemeProvider theme={theme}>
      <Provider routingStore={routingStore}>
        <ReactiveBase
          {...reactiveSearchSettings}
          initialState={initialSearchData}
        >
          <ProductGrid />
        </ReactiveBase>
      </Provider>
    </MuiThemeProvider>
  ));
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
