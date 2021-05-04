import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Schools from "./components/Schools";
import DisplaySchools from "./components/DisplaySchools";
import Register from "./components/Register";
import Verify from "./components/Verify";
import VerifyEmail from "./components/VerifyEmail";
import Login from "./components/Login";

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/school" component={Schools} />
            <Route
              exact
              path="/search"
              component={(props) => (
                <DisplaySchools schools={props.location.state.data} />
              )}
            />
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/verify" component={Verify}></Route>
            <Route exact path="/verifyEmail" component={VerifyEmail}></Route>
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
