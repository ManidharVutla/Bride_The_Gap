//import React from "react";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import "./App.css";

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path="/Register" component={Register}></Route>
          <Route exact path="/Login" component={Login}></Route>
        </Switch>
      </section>
      <Landing />
    </Fragment>
  </Router>
);

export default App;
