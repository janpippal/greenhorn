import React, {Component, Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconClose from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

class AssignTemplateModal extends Component {
  state = {
    scroll: 'paper',
    selectedTemplatesId: []
  };

  handleAddIntoSelectedTemplates = (id) => {
    const { selectedTemplatesId } = this.state;
    const currentIndex = selectedTemplatesId.indexOf(id);
    const newChecked = [...selectedTemplatesId];
    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      selectedTemplatesId: newChecked,
    });
  }

  assign = (job_position_id) => {
    this.props.assign(this.state.selectedTemplatesId, job_position_id)
    this.setState({ selectedTemplatesId: [] })
  }

  render() {
    const { templates, assignment } = this.props;
    const { classes } = this.props;
    return (
        <Dialog
          open={this.props.opened.indexOf(assignment.job_position_id) !== -1 }
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title" fullWidth>
          <DialogTitle id="scroll-dialog-title">
            Assign template to {assignment.name}
            <IconClose onClick={ this.props.handleClose } className="float-right hover:shadow-inner" />
            </DialogTitle>
          <DialogContent>
          <Fragment>
          <List dense className={classes.root}>
            <Grid container spacing={24}>
            {templates.map((template,i) => (
              <Grid item={ true } xs={12} key={template.id}>
              <ListItem  button onClick={() => {this.handleAddIntoSelectedTemplates(template.id)}}>
                <ListItemText primary={template.template_name}/>
                <ListItemSecondaryAction onClick={() => {this.handleAddIntoSelectedTemplates(template.id)}}>
                  <Checkbox
                    color='primary' checked={this.state.selectedTemplatesId.indexOf(template.id) !== -1}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              </Grid>
            ))}
            </Grid>
          </List>
          </Fragment>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.assign(assignment.job_position_id) } } color="primary">
              Assign
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default withStyles(styles)(AssignTemplateModal);
