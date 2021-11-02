import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import MenuPage from "./components/navigation/MenuPage";
import UnauthorizedPage from "./components/UnauthorizedPage";
import FooterPage from "./components/navigation/FooterPage";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./static/css/App.css";
import "./static/css/style.css";
import HomePage from "./components/HomePage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
    };
  }

  isAuthorized = () => {
    return this.props.userName !== "" && this.props.userName !== undefined;
  };

  isRender = (Page, location) =>
    this.isAuthorized() ? <Page /> : <Redirect to="/sign-in" />;

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/sign-in" component={LoginPage} />
          <React.Fragment>
            <div>
              <MenuPage />
              <div className="root-app" style={{ paddingTop: "54px" }}>
                <Switch>
                  <Route
                    exact
                    path="/home"
                    render={() => this.isRender(HomePage)}
                  />
                </Switch>
              </div>
              <FooterPage />
            </div>
          </React.Fragment>
          <Route path="*" component={UnauthorizedPage} />
        </Switch>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    userName: state.userReducer.userName,
  };
}

export default connect(mapStateToProps)(App);
