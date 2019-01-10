import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import IconDescription from "@material-ui/icons/Description";
import IconDone from "@material-ui/icons/Done";
import IconDoneAll from "@material-ui/icons/DoneAll";
import IconUndo from "@material-ui/icons/Undo";
import IconClose from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Dropzone from "react-dropzone";
import { fromEvent } from "file-selector";
import AddIcon from "@material-ui/icons/Add";
import { connect } from "react-redux";
import { updateTaskWithFiles, updateTaskState } from "../services/tasks";
import { uploadFile } from "../services/files";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    minWidth: 500
  },
  paperScrollPaper: {
    minWidth: 500
  },
  chip: {
    margin: theme.spacing.unit
  },
  typo: {
    paddingBottom: 5,
    paddingTop: 5
  }
});

class TaskDetail extends React.Component {
  state = {
    scroll: "paper",
    files: []
  };

  giveMeDueDaysResultLabel = days => {
    if (days > 0) {
      return <span className="text-green">( {days} days to deadline )</span>;
    } else if (days < 0) {
      let daysWithoutMinus = days * -1;
      return (
        <span className="text-red">
          ( {daysWithoutMinus} days after deadline )
        </span>
      );
    } else if (days === 0) {
      return <span className="text-orange">( Deadline is today! )</span>;
    }
  };

  handleAddFile = filesToBeAdded => {
    let files = this.state.files;
    for (var i = 0; i < filesToBeAdded.length; i++) {
      files.push(filesToBeAdded[i]);
    }
    this.setState({ files: files });
  };

  handleDeleteFile = filename => {
    this.setState({
      files: this.state.files.filter(file => file.name !== filename)
    });
  };

  submitNewFiles = async task_id => {
    let uploadedDocumentsIDs = [];
    if (this.state.files.length !== 0) {
      uploadedDocumentsIDs = await this.props.uploadFile(
        this.state.files,
        "tasks",
        "assignee"
      );

      var taskJson = {
        task_id: task_id,
        files: uploadedDocumentsIDs
      };
      await this.props.updateTaskWithFiles(taskJson, this.props.history);
      this.props.handleClose();
    }
  };


  handleChangeState = (taskId, taskState, userId) => {
    this.props.updateTaskState(taskId, taskState, userId).then(() => {
      this.props.loadTasks();
    })

  };

  render() {
    const task = this.props.task;
    const { classes, user } = this.props;
    const url =
      process.env.REACT_APP_ENVIRONMENT === "local "
        ? "http://localhost:3030"
        : process.env.REACT_APP_ENVIRONMENT === "dev "
        ? "http://dev.backend.team08.vse.handson.pro"
        : "http://dev.backend.xpipj04.vse.handson.pro";
    return (
      <Dialog
        onEscapeKeyDown={() => {this.props.handleClose()}}
        open={this.props.open}
        scroll="paper"
      >
        <DialogTitle
          className={"text-white bg-primary"}
          disableTypography={true}
        >
          {task.task_name}
          <IconClose
            onClick={()=> {this.props.handleClose()}}
            className="float-right hover:shadow-inner hover:bg-white hover:text-green-dark"
          />
        </DialogTitle>
        <DialogContent style={{ minWidth: 500 }}>
          <Typography variant="h6" className={classes.typo}>
            Deadline:
          </Typography>
          <span>
            {task.deadline}{" "}
            {this.giveMeDueDaysResultLabel(task.days_to_deadline)}
          </span>
          <Typography variant="h6">Owner: </Typography>
          <span> {task.owner}</span>
          <Typography variant="h6">Assignee: </Typography>
          <span>{task.assignee} </span>
          <Typography variant="h6">State:</Typography>
          <svg height="20" width="20">
            <circle
              cx="10"
              cy="10"
              r="10"
              className={
                "fill-current text-" + this.props.giveMeColorBadge(task.state)
              }
            />
          </svg>{" "}
          <span>{task.state}</span>
          <Typography variant="h6">Instructions</Typography>
          <span>{task.task_instructions} </span>
          {task.history.length > 0 && (
            <ExpansionPanel className="shadow-none bg-white">
              <ExpansionPanelSummary
                className="p-0 bg-white"
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography variant="h6">Task history</Typography>
              </ExpansionPanelSummary>
              {task.history.map(historyItem => (
                <ExpansionPanelDetails key={historyItem.id}>
                  <Typography>
                    {historyItem.action}
                    {" by "}
                    {historyItem.by}
                    {" on "}
                    {historyItem.at}
                  </Typography>
                </ExpansionPanelDetails>
              ))}
            </ExpansionPanel>
          )}
          {task.files.filter(file => file.uploaded_by === "owner").length >
            0 && <Typography variant="h6">Attachments from owner</Typography>}
          <Grid item={true} xs={12}>
            {task.files &&
              task.files.filter(file => file.uploaded_by === "owner").length >
                0 &&
              task.files
                .filter(file => file.uploaded_by === "owner")
                .map((file, i) => (
                  <a
                    key={file.id}
                    href={url + file.url}
                    className="no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip
                      key={file.id}
                      icon={<IconDescription />}
                      label={file.name}
                      color="primary"
                      className={classes.chip}
                      variant="outlined"
                    />
                  </a>
                ))}
          </Grid>
          {task.files.filter(file => file.uploaded_by === "assignee").length >
            0 && (
            <Typography variant="h6">Attachments from assignee</Typography>
          )}
          <Grid item={true} xs={12}>
            {task.files &&
              task.files.filter(file => file.uploaded_by === "assignee")
                .length > 0 &&
              task.files
                .filter(file => file.uploaded_by === "assignee")
                .map((file, i) => (
                  <a
                    key={file.id}
                    href={url + file.url}
                    className="no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Chip
                      key={file.id}
                      icon={<IconDescription />}
                      label={file.name}
                      color="primary"
                      className={classes.chip}
                      variant="outlined"
                    />
                  </a>
                ))}
          </Grid>
          {user.role === "employee" &&
            (task.state === "returned" || task.state === "new") && (
              <Grid item={true} xs={12}>
                <Typography variant="h6">Wanna attach some files?</Typography>
                <div className="pt-2 pb-2" justify="center">
                  <Dropzone
                    className="flex items-center border-grey hover:border-black border rounded h-full"
                    getDataTransferItems={evt => fromEvent(evt)}
                    onDrop={(accepted, rejected) => {
                      this.handleAddFile(accepted);
                    }}
                  >
                    <AddIcon className="text-grey" />
                    <div className="text-grey">Click or drop files here</div>
                  </Dropzone>
                </div>
                {this.state.files.map((f, i) => (
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
                <Fab
                  color="primary"
                  variant="extended"
                  onClick={() => {
                    this.submitNewFiles(task.id);
                  }}
                >
                  Upload files
                </Fab>
              </Grid>
            )}
        </DialogContent>
        <DialogActions>
          {user.role === "employee" &&
            (task.state === "new" || task.state === "returned") && (
              <Fab
                onClick={() => {
                  this.handleChangeState(task.id, "submitted", user.id);
                }}
                color="primary"
                variant="extended"
              >
                Submit
                <IconDone />
              </Fab>
            )}
          {user.role === "admin" && task.state === "submitted" && (
            <Fab
              onClick={() => {
                this.handleChangeState(task.id, "returned", user.id);
              }}
              color="primary"
              variant="extended"
            >
              Return
              <IconUndo />
            </Fab>
          )}
          {user.role === "admin" && task.state === "submitted" && (
            <Fab
              onClick={() => {
                this.handleChangeState(task.id, "done", user.id);
              }}
              color="primary"
              variant="extended"
            >
              Confirm
              <IconDoneAll />
            </Fab>
          )}
          {user.role === "admin" && task.state !== "cancelled" && (
            <Fab
              onClick={() => {
                this.handleChangeState(task.id, "cancelled", user.id);
              }}
              color="primary"
              variant="extended"
            >
              Cancel
              <IconClose />
            </Fab>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

const mapDispatchToProps = {
  updateTaskWithFiles,
  updateTaskState,
  uploadFile
};

const connected = connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(TaskDetail));
export { connected as TaskDetail };
