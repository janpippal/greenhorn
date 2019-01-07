import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TopBar from "./TopBar";
import { getUser, getIsAuthenticated } from "../reducers/userReducer";
import { ErrorAlert } from "./ErrorAlert";
import {withRouter} from 'react-router';


class PrivateRoute extends Component {
  render() {
    const { component: Component, isAuthenticated, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <div className="dp-1">
              <TopBar
                className={getPageTitleLabel(this.props.path)}
                idmenu="0"
                user={this.props.user}
              >
                <ErrorAlert />
                <Component
                  {...props}
                  user={this.props.user}
                  errorDispatch={this.props}
                />
              </TopBar>
            </div>
          ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
        }
      />
    );
  }
}

const getPageTitleLabel = path => {
  switch (path) {
    case "/dashboard":
      return "Dashboard";
    case "/tasks":
      return "Tasks";
    case "/templates":
      return "Task templates";
    case "/people":
      return "People";
    case "/setting":
      return "Settings";
    case "/tasks/add":
      return "Create task";
    case "/people/add":
      return "Create user";
    case "/templates/add":
      return "Create template";
    case "/templates/assign":
      return "Assign template";  
    default:
      return "Navigation";
  }
};

const mapStateToProps = state => {
  const { user } = state;
  return {
    isAuthenticated: getIsAuthenticated(user),
    user: getUser(user)
  };
};

const connectedPrivateRoute = connect(mapStateToProps)(withRouter(PrivateRoute));
export { connectedPrivateRoute as PrivateRoute };
