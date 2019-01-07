import React, { Component } from "react";
import { TasksTable } from "./TasksTable";
import ButtonCreate from "./ButtonCreate";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { fetchTasks } from "../services/tasks";
import { getTasks } from "../reducers/tasksReducer";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import IconSearch from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({
  textfield: {
    margin: theme.spacing.unit,
    marginBottom: 30
  }
});

class TasksPage extends Component {
  componentDidMount() {
    this.loadTasks();
  }

  loadTasks = () => {
    this.props.fetchTasks().then(() => {
      this.setState({
        tasks: this.props.tasks,
        filteredTasks: this.props.tasks
      });
    });
  };

  state = {
    tasks: [],
    filteredTasks: []
  };

  handleChange = e => {
    let tasksBeforeFiltering = this.state.tasks;
    let searchValue = e.target.value.toLowerCase();
    let filteredTasks = tasksBeforeFiltering.filter(
      task =>
        task.task_name.toLowerCase().includes(searchValue) ||
        task.deadline.toLowerCase().includes(searchValue) ||
        task.task_instructions.toLowerCase().includes(searchValue) ||
        task.assignee.toLowerCase().includes(searchValue) ||
        task.owner.toLowerCase().includes(searchValue)
    );
    this.setState({ filteredTasks: filteredTasks });
  };

  removeSearch = () => {
    this.loadTasks();
  };

  render() {
    const { user, classes } = this.props;
    return (
      <div className="tp-2">
        <Grid container justify="space-between">
          {user.role === "admin" && (
            <Grid item>
              <ButtonCreate title="new task" redirectTo="/tasks/add" />
            </Grid>
          )}
          <Grid item>
            <TextField
              placeholder="Search"
              className={classes.textfield}
              onKeyUp={this.handleChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
        <TasksTable
          user={user}
          tasks={this.state.filteredTasks}
          loadTasks={this.loadTasks}
        />
      </div>
    );
  }
}

TasksPage.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { tasks } = state;
  return {
    tasks: getTasks(tasks)
  };
};

const mapDispatchToProps = {
  fetchTasks
};

const connectedTasksTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TasksPage));
export { connectedTasksTable as TasksPage };
