import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getError,getIsError } from '../reducers/errorReducer';
import { dismissError } from '../services/error';
import { connect } from 'react-redux';

class ErrorAlert extends React.Component {

  handleClose = () => {
    this.props.dismissError()
  };

  render() {
    const { isError, error } = this.props;
    return (
      <div>
        <Dialog
          open={ isError }
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Something went wrong</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { error }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state  => {
    const { error } = state
    return {
      error: getError(error),
      isError: getIsError(error)
    };
}

const mapDispatchToProps = {
  dismissError
};

const connectedErrorAlert = connect(mapStateToProps,mapDispatchToProps)(ErrorAlert);
export { connectedErrorAlert as ErrorAlert };
