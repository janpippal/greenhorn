import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import LeftMenu from './LeftMenu'
import { UserInfo } from './UserInfo';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbarIcon: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-center',
  //padding: '0 8px',
  ...theme.mixins.toolbar,
},
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '40px 5px 0',
},
  grow: {
    flexGrow: 1
  }
});

class TopBar extends React.Component {
  state = {
    mobileOpen: false,
    selectedIndex: null
  };

  handleDrawerToggle = () => {
    this.setState(state => ({
      mobileOpen: !state.mobileOpen
    }));
  };

  render() {
    const { classes, theme } = this.props;
    const { user } = this.props;
    const pageName = this.props.className;
    const children = this.props.children;
    return (
      <div className={classes.root}>
      <CssBaseline/>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerToggle} className={classes.menuButton}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" color="inherit">
            {pageName}
          </Typography>
          <div className={classes.grow}/>
          <UserInfo user={user}/>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer}>
        <Hidden implementation="css">
          <Drawer container={this.props.container} variant="temporary" anchor={theme.direction === 'rtl'
              ? 'right'
              : 'left'} open={this.state.mobileOpen} onClose={this.handleDrawerToggle} classes={{
              paper: classes.drawerPaper
            }} ModalProps={{
              keepMounted: true,
            }}>
            <LeftMenu user={ user }/>
          </Drawer>
        </Hidden>
        <Hidden xsDown={ true } implementation="css">
          <Drawer classes={{
              paper: classes.drawerPaper
            }} variant="permanent" open={ true }>
            <LeftMenu user={ user }/>
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <div className={classes.mainContent}>{children}</div>
      </main>

    </div>);
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, {withTheme: true})(TopBar);
