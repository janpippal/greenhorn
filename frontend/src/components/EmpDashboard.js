import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { fetchTasks } from "../services/tasks";
import { getTasks } from "../reducers/tasksReducer";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import { DashTable } from "./DashTable";
import { TaskDetail } from "./TaskDetail";
import IconPriority from "@material-ui/icons/PriorityHigh";
import moment from "moment";

const styles = theme => ({
  root: {
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    padding: 10
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)"
  },
  avatar: {
  marginRight: 0,
  width: 30,
  height: 30,
  backgroundColor: "white"
},
  title: {
    fontSize: 14
  },
  gridTile: {
    paddingBottom: 10
  },
  margin: {
    marginRight: theme.spacing.unit * 5
  }
});

class EmpDashboard extends Component {
  constructor() {
    super();
    let today = new Date(),
      date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
    this.state = {
      today: date,
      tasks: [],
      filteredTasks: [],
      selectedId: 0
    };
  }

  componentDidMount() {
    this.loadTasks();
  }

  isSelected = id => {
    console.log('are you ready?')
    return this.state.selectedId === id
  };

  loadTasks = () => {
    this.props.fetchTasks().then(() => {
      this.setState({
        tasks: this.props.tasks.filter(
          task => task.state !== "done" && task.state !== "cancelled"
        ),
        filteredTasks: this.props.tasks.filter(
          task => task.state !== "done" && task.state !== "cancelled"
        )
      });
    });
  };

  filterTasks = days => {
    let filteredTasks;
    switch (days) {
      case "all":
        this.setState({ filteredTasks: this.state.tasks });
        break;
      case "today":
        filteredTasks = this.state.tasks.filter(
          task => this.dayDiff(task) < 1 && this.dayDiff(task) > -1
        );
        this.setState({ filteredTasks: filteredTasks });
        break;
      case "week":
        filteredTasks = this.state.tasks.filter(
          task => this.dayDiff(task) < 8 && this.dayDiff(task) > -1
        );
        this.setState({ filteredTasks: filteredTasks });
        break;
      case "month":
        filteredTasks = this.state.tasks.filter(
          task => this.dayDiff(task) < 32 && this.dayDiff(task) > -1
        );
        this.setState({ filteredTasks: filteredTasks });
        break;
      default:
        this.setState({ filteredTasks: this.state.tasks });
    }
  };

  headersOverall = [
    { id: "deadline", label: "Deadline" },
    { id: "days_to_deadline", label: "Days to Deadline" },
    { id: "owner", label: "Owner" },
    { id: "task_name", label: "Task" },
    { id: "state", label: "State" }
  ];
  headersReturned = [
    { id: "owner", label: "Owner" },
    { id: "task_name", label: "Task" },
    { id: "state", label: "State" }
  ];


    handleClose = () => {
      console.log('closing')
      this.setState({ selectedId: 0 },()=>{
        (console.log(this.state.selectedId))
      });
    };

    handleClick = (task_id) => {
      console.log(task_id)
      this.setState({ selectedId: task_id });
    };

  dayDiff = task => {
    let today = moment(this.state.today);
    let deadline = moment(task.deadline);
    return deadline.diff(today, "days");
  };

  giveMeColorBadge = status => {
    let label = "";
    switch (status) {
      case "new":
        label = "green-light";
        break;
      case "submitted":
        label = "yellow-dark";
        break;
      case "returned":
        label = "grey-darkt";
        break;
      case "done":
        label = "primary";
        break;
      case "cancelled":
        label = "black";
        break;
      default:
        label = "white";
        break;
    }
    return label;
  };

  handleChangeState = (taskId, taskState, userId) => () => {
    this.props.updateTaskState(taskId, taskState, userId);
    this.props.loadTasks();
  };

  render() {
    const { classes } = this.props;
    const todayBadge = this.state.tasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 1
    ).length;
    const weekBadge = this.state.tasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 8
    ).length;
    const monthBadge = this.state.tasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 32
    ).length;
    const allBadge = this.state.tasks.length;
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={3}>
          {this.state.filteredTasks.length === 0 && (
            <GridListTile className={classes.gridTile}>
              <Button color="primary" size="medium" fullWidth>
                <List component="nav" className={classes.root}>
                  <ListItem />
                  <ListItemText
                    primary={
                      <Typography
                        component="h2"
                        variant="headline"
                        gutterBottom
                      >
                        You have no tasks assigned currently
                      </Typography>
                    }
                  />
                </List>
              </Button>
            </GridListTile>
          )}
          {this.state.filteredTasks.map(task => (
            <GridListTile key={task.id} className={classes.gridTile} >
              <Card onClick={() => {this.handleClick(task.id)}}>
              <CardHeader classes={{ avatar: classes.avatar, title: classes.title }} title={ <Typography variant="body1">{task.task_name}</Typography>} avatar={ <IconPriority className={
                                  task.days_to_deadline < 0
                                    ? "text-red-light"
                                    : task.days_to_deadline === 0
                                    ? "text-yellow-light"
                                    : task.days_to_deadline > 0
                                    ? "text-white"
                                    : ""
                                }/> } />
              <Divider />
                <CardContent>
                  <Typography align="center" gutterBottom>Latest till {task.deadline}</Typography>
                  <Typography align="center" gutterBottom>{task.owner}</Typography>
                  <Typography align="center" className={ 'text-' + this.giveMeColorBadge(task.state) } gutterBottom>{task.state}</Typography>
                </CardContent>
              </Card>
              <TaskDetail
                task={task}
                open={this.isSelected(task.id)}
                handleClose={this.handleClose}
                handleChangeState={this.handleChangeState}
                giveMeColorBadge={this.giveMeColorBadge}
                user={this.props.user}
              />
            </GridListTile>
          ))}
        </GridList>

        <Grid container spacing={24} className={classes.cardGrid}>
          <Grid item xs={12} md={8} />
          <Grid item xs={12} md={8}>
            <Badge
              color="primary"
              className={classes.margin}
              badgeContent={todayBadge}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.filterTasks("today");
                }}
              >
                Today
              </Button>
            </Badge>
            <Badge
              color="primary"
              className={classes.margin}
              badgeContent={weekBadge}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.filterTasks("week");
                }}
              >
                This Week
              </Button>
            </Badge>
            <Badge
              color="primary"
              className={classes.margin}
              badgeContent={monthBadge}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.filterTasks("month");
                }}
              >
                This Month
              </Button>
            </Badge>
            <Badge
              color="primary"
              className={classes.margin}
              badgeContent={allBadge}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  this.filterTasks("all");
                }}
              >
                All
              </Button>
            </Badge>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Recently returned tasks</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.cardGrid}>
          <Grid item xs={12} md={8}>
            <DashTable
              headers={this.headersOverall}
              data={this.state.filteredTasks}
              type="overall_employee"
              user={this.props.user}
              loadTasks={this.loadTasks}
              isSelected={ this.isSelected }
              handleChangeState={ this.handleChangeState}
              handleClick={ this.handleClick}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashTable
              headers={this.headersReturned}
              data={this.state.filteredTasks.filter(
                task => task.state === "returned"
              )}
              type="returned_employee"
              user={this.props.user}
              loadTasks={this.loadTasks}
              isSelected={ this.isSelected }
              handleChangeState={ this.handleChangeState}
              handleClick={ this.handleClick}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

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
)(withStyles(styles)(EmpDashboard));
export { connectedTasksTable as EmpDashboard };
