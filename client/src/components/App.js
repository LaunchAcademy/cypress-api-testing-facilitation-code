import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom"

import BrandsListPage from "./BrandsListPage.js"
import BrandShowPage from "./BrandShowPage.js"
import BrandNewPage from "./BrandNewPage.js"

import { hot } from "react-hot-loader/root";

import "../assets/scss/main.scss";

const App = props => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={BrandsListPage} />
        <Route exact path="/brands" component={BrandsListPage} />
        <Route exact path="/brands/new" component={BrandNewPage} />
        <Route exact path="/brands/:id" component={BrandShowPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default hot(App);
