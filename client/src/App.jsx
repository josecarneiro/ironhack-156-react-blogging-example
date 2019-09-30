import React, { Component, Fragment } from "react";

import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import BlogNavbar from "./components/BlogNavbar";

import ListView from "./views/List";
import CreateView from "./views/Create";
import PostView from "./views/Post";
import EditView from "./views/Edit";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import ErrorView from "./views/Error";
import CatchAll from "./views/CatchAll";

import Container from "react-bootstrap/Container";

import {
  verify as verifyService,
  signOut as signOutService
} from "./services/authentication-api";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.signOut = this.signOut.bind(this);
    this.loadUser = this.loadUser.bind(this);
  }

  componentDidMount() {
    verifyService()
      .then(user => {
        if (user) {
          this.setState({
            user
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  signOut(event) {
    event.preventDefault();
    signOutService()
      .then(() => {
        this.setState({
          user: null
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  loadUser(user) {
    this.setState({
      user
    });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Container>
            <BlogNavbar user={this.state.user} signOut={this.signOut} />
            <Switch>
              <Route path="/" exact component={ListView} />
              <Route path="/post/create" component={CreateView} />
              <Route path="/post/:id/edit" component={EditView} />
              <Route
                path="/sign-up"
                render={props => (
                  <SignUp {...props} exact loadUser={this.loadUser} />
                )}
              />
              <Route
                path="/sign-in"
                render={props => (
                  <SignIn {...props} exact loadUser={this.loadUser} />
                )}
              />
              <Route path="/post/:id" exact component={PostView} />
              <Route path="/error/:code" component={ErrorView} />
              <Route path="/" component={CatchAll} />
            </Switch>
          </Container>
        </Router>
      </div>
    );
  }
}
