import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import PeopleIcon from "@material-ui/icons/People";
import DashboardIcon from "@material-ui/icons/Assessment";
import TasksIcon from "@material-ui/icons/Assignment";
import TemplatesIcon from "@material-ui/icons/LibraryBooks";

import { Link } from "react-router-dom";
import Logo from './ghlogo.png';

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  toolbar: theme.mixins.toolbar,
  logo: {
    padding: 5
  }
});

class LeftMenu extends Component {
  state = {
    selectedIndex: null
  };

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { classes } = this.props;
    const { user } = this.props;
    return (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <Link className="no-underline" to="/dashboard">
            <ListItem
              button={true}
              selected={this.state.selectedIndex === 0}
              onClick={event => this.handleListItemClick(event, 0)}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
          <Link className="no-underline" to="/tasks">
            <ListItem
              button={true}
              selected={this.state.selectedIndex === 1}
              onClick={event => this.handleListItemClick(event, 1)}
            >
              <ListItemIcon>
                <TasksIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItem>
          </Link>
          {user.role === "admin" && (
            <Link className="no-underline" to="/people">
              <ListItem
                button={true}
                selected={this.state.selectedIndex === 2}
                onClick={event => this.handleListItemClick(event, 2)}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="People" />
              </ListItem>
            </Link>
          )}
          {user.role === "admin" && (
            <Link className="no-underline" to="/templates">
              <ListItem
                button={true}
                selected={this.state.selectedIndex === 3}
                onClick={event => this.handleListItemClick(event, 3)}
              >
                <ListItemIcon>
                  <TemplatesIcon />
                </ListItemIcon>
                <ListItemText primary="Templates" />
              </ListItem>
            </Link>
          )}
        </List>
        <Divider />
        <img src={Logo} alt="" className={classes.logo}/>
      </div>
    );
  }
}

LeftMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LeftMenu);
