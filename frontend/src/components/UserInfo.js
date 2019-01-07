import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import { logout } from '../services/user';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
});

class UserInfo extends React.Component {
  state = {
    open: false,
  };

  onClick = (e) => {
    if (this.anchorEl.contains(e.target)) {
      return;
    }

    this.setState({ open: false });
    const { logout } = this.props;
    logout();
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = (e) => {
    if (this.anchorEl.contains(e.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    const { name, role } = this.props.user;

    return (
      <div className={classes.root}>
        <div>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
            onClick={this.handleToggle}
          >
            <div className="no-underline" >
            <div className="text-base">{ name }</div>
            <div className="text-xs">{ role }</div>
            </div>
          </Button>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      <div className="no-underline" to="/"><MenuItem onClick={this.onClick}>Logout</MenuItem></div>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

UserInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

const withStylesProfileList  = withStyles(styles)(UserInfo);

const mapDispatchToProps = {
  logout,
};

const connectedProfileList = connect(null,mapDispatchToProps)(withStylesProfileList);
export { connectedProfileList as UserInfo };
