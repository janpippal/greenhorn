import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginBottom: 30,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

class ButtonCreate extends Component {
  render() {

  const { classes } = this.props;

  return (
    <Link to={this.props.redirectTo} className="no-underline">
      <Fab color="primary" variant="extended"  aria-label="Add" className={classes.button}>
        <AddIcon className={classes.extendedIcon} />
        {this.props.title}
      </Fab>
    </Link>
  );
  }
}


ButtonCreate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonCreate);
