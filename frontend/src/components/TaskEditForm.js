import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import IconDescription from "@material-ui/icons/Description";
import Dropzone from "react-dropzone";
import { fromEvent } from "file-selector";
import AddIcon from "@material-ui/icons/Add";

import { connect } from "react-redux";
import { getTaskById, updateTask } from "../services/tasks";
import { uploadFile } from "../services/files";
import { getUser } from "../reducers/userReducer";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  }
});

class TaskEditForm extends Component {
  state = {
    activeStep: 0,
    task_name: "",
    task_instructions: "",
    files: [],
    deadline: ""
  };

  handleDatePicker = e => {
    this.setState({ deadline: e.target.value });
  };

  componentDidMount() {
    const { task_id } = this.props.match.params;
    this.props.getTaskById(task_id).then(response => {
      this.setState({
        task_name: response.task_name,
        task_instructions: response.task_instructions,
        deadline: response.deadline,
        files: response.files
      });
    });
  }

  handleTaskInfo = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDeleteFile = filename => {
    this.setState({
      files: this.state.files.filter(file => file.name !== filename)
    });
  };

  handleAddFile = filesToBeAdded => {
    let files = this.state.files;
    for (var i = 0; i < filesToBeAdded.length; i++) {
      files.push(filesToBeAdded[i]);
    }
    this.setState({ files: files });
  };

  submitTasks = async state => {
    let uploadedDocumentsIDs = [];
    console.log(state.files)
    if (state.files.length !== 0) {
      uploadedDocumentsIDs = await this.props.uploadFile(state.files,"tasks","owner");
    }

    var taskJson = {
      task_id: this.props.match.params.task_id,
      task_name: state.task_name,
      task_instructions: state.task_instructions,
      files: uploadedDocumentsIDs,
      deadline: state.deadline,
      owner_id: this.props.user.id
    };
    console.log(taskJson)

    await this.props.updateTask(taskJson,this.props.history);
  };

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;
    const values = this.state;
    return (
      <Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Edit Task
            </Typography>
            <Fragment>
              <Fragment>
                <Typography variant="h6" gutterBottom>
                  Task Details
                </Typography>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="task_name"
                      name="task_name"
                      label="Task Title"
                      fullWidth
                      autoComplete="title"
                      value={values.task_name}
                      onChange={this.handleTaskInfo}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="task_instructions"
                      name="task_instructions"
                      label="Instructions"
                      fullWidth
                      multiline
                      rowsMax="5"
                      value={values.task_instructions}
                      onChange={this.handleTaskInfo}
                    />
                  </Grid>
                </Grid>
              </Fragment>
              <Fragment>
                <Grid container spacing={24}>
                  <Grid item={true} xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Attachments
                    </Typography>
                    <Fragment>
                      <div className="pt-2 pb-2" justify="center">
                        <Dropzone
                          className="flex items-center border-grey hover:border-black border rounded h-full"
                          getDataTransferItems={evt => fromEvent(evt)}
                          onDrop={(accepted, rejected) => {
                            this.handleAddFile(accepted);
                          }}
                        >
                          <AddIcon className="text-grey" />
                          <div className="text-grey">
                            Click or drop files here
                          </div>
                        </Dropzone>
                      </div>
                      {values.files.map((f, i) => (
                        <Chip
                          icon={<IconDescription />}
                          key={i}
                          label={f.path || f.name}
                          color="primary"
                          onDelete={() => {
                            this.handleDeleteFile(f.name);
                          }}
                          className={classes.chip}
                          variant="outlined"
                        />
                      ))}
                    </Fragment>
                  </Grid>
                </Grid>
              </Fragment>
              <Fragment>
                <Typography variant="h6" gutterBottom>
                  Task deadlines
                </Typography>
                <Grid item xs={4}>
                  <TextField
                    required
                    label="Deadline"
                    type="date"
                    onChange={event => {
                      this.handleDatePicker(event);
                    }}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={values.deadline}
                  />
                </Grid>
              </Fragment>
              <div className={classes.buttons}>
                {activeStep === 0 && (
                  <Link to="/tasks" className="no-underline ">
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                    >
                      Back to tasks
                    </Button>
                  </Link>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={ ()=> { this.submitTasks(this.state) } }
                  className={classes.button}
                >
                  Save
                </Button>
              </div>
            </Fragment>
          </Paper>
        </main>
      </Fragment>
    );
  }
}

TaskEditForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { user } = state;
  return {
    user: getUser(user)
  };
};

const mapDispatchToProps = {
  getTaskById,
  uploadFile,
  updateTask
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TaskEditForm));
export { connected as TaskEditForm };
