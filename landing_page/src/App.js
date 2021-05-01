import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Landing from "./components/Landing";
import Navbar from "./components/Navbar";


const App = () => {
  // <Provider>
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          {/* <Alert /> */}
          <Switch>
            <Route exact path="/register"></Route>
            <Route exact path="/login"></Route>
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
  // </Provider>
};

export default App;
