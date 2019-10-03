import React, { Component, Fragment } from "react";

import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
      user: null,
      loaded: false
    };
    this.signOut = this.signOut.bind(this);
    this.loadUser = this.loadUser.bind(this);
    this.verifyAuthenticated = this.verifyAuthenticated.bind(this);
    this.verifyUnauthenticated = this.verifyUnauthenticated.bind(this);
  }

  componentDidMount() {
    verifyService()
      .then(user => {
        this.setState({
          ...(user && { user }),
          loaded: true
        });
      })
      .catch(error => {
        this.setState({
          loaded: true
        });
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

  verifyAuthenticated() {
    return !!this.state.user;
  }

  verifyUnauthenticated() {
    return !this.state.user;
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Container>
            <BlogNavbar user={this.state.user} signOut={this.signOut} />
            {this.state.loaded && (
              <Switch>
                <Route path="/" exact component={ListView} />
                <ProtectedRoute
                  path="/post/create"
                  component={CreateView}
                  verify={this.verifyAuthenticated}
                />
                <ProtectedRoute
                  path="/post/:id/edit"
                  component={EditView}
                  verify={this.verifyAuthenticated}
                />
                <Route path="/post/:id" exact component={PostView} />
                <ProtectedRoute
                  path="/sign-up"
                  verify={this.verifyUnauthenticated}
                  render={props => (
                    <SignUp {...props} exact loadUser={this.loadUser} />
                  )}
                />
                <ProtectedRoute
                  path="/sign-in"
                  verify={this.verifyUnauthenticated}
                  render={props => (
                    <SignIn {...props} exact loadUser={this.loadUser} />
                  )}
                />
                <Route path="/error/:code" component={ErrorView} />
                <Redirect path="/" to="/error/404" />
              </Switch>
            )}
          </Container>
        </Router>
      </div>
    );
  }
}
