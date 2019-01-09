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
import Moment from "react-moment";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import { DashTable } from "./DashTable";
import moment from "moment";

const styles = theme => ({
  root: {
    justifyContent: "space-around",
    overflow: "hidden",
    padding: 10
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)"
  },

  gridTile: {
    backgroundColor: theme.palette.background.paper,
    marginRight: theme.spacing.unit * 2
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
      filteredTasks: []
    };
  }

  componentDidMount() {
    this.loadTasks();
  }

  loadTasks = () => {
    this.props.fetchTasks().then(() => {
      this.setState({
        tasks: this.props.tasks.filter(task => task.state !== "done" || task.state !== "cancelled"),
        filteredTasks: this.props.tasks.filter(task => task.state !== "done" || task.state !== "cancelled")
      });
    });
  };

  filterTasks = (days) => {
    let filteredTasks
    switch (days) {
      case 'all':
      this.setState({ filteredTasks: this.state.tasks })
      break;
      case 'today':
      filteredTasks = this.state.tasks.filter(task => this.dayDiff(task) < 1 && this.dayDiff(task) > -1)
      this.setState({ filteredTasks: filteredTasks })
      break;
      case 'week':
      filteredTasks = this.state.tasks.filter(task => this.dayDiff(task) < 8 && this.dayDiff(task) > -1)
      this.setState({ filteredTasks: filteredTasks })
      break;
      case 'month':
      filteredTasks = this.state.tasks.filter(task => this.dayDiff(task) < 32 && this.dayDiff(task) > -1)
      this.setState({ filteredTasks: filteredTasks })
      break;
      default:
      this.setState({ filteredTasks: this.state.tasks })
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

  dayDiff = task => {
    let today = moment(this.state.today);
    let deadline = moment(task.deadline);
    return deadline.diff(today, "days");
  };

  render() {
    const {  classes } = this.props;
    const todayBadge = this.state.tasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 1
    ).length;
    const weekBadge = this.state.tasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 8
    ).length;
    const monthBadge = this.state.tasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 32
    ).length;
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={3}>
          { this.state.filteredTasks.length === 0 && (
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
            <GridListTile key={task.id} className={classes.gridTile}>
              <Button color="primary" size="medium" fullWidth className={task.days_to_deadline < 0 ? "bg-red-light" : task.days_to_deadline === 0 ? "bg-yellow-light" : ''}>
                <List component="nav" className={classes.root}>
                  <ListItem />
                  <ListItemText
                    primary={
                      <Typography
                        component="h2"
                        variant="headline"
                        gutterBottom
                      >
                        {task.task_name}
                      </Typography>
                    }
                  />
                  <ListItemText
                    primary={
                      <Moment format="DD.MM.YYYY">{task.deadline}</Moment>
                    }
                  />
                  <ListItemText primary={"Owner: " + task.owner} />
                  <ListItemText primary={"State: " + task.state} />
                </List>
              </Button>
            </GridListTile>
          ))}
        </GridList>

        <Grid container spacing={24} className={classes.cardGrid}>
          <Grid item xs={12} md={8} />
          <Grid item xs={12} md={8}>
            <Badge
              color="secondary"
              className={classes.margin}
              badgeContent={todayBadge}
            >
              <Button color="primary" variant="contained" onClick={ () => { this.filterTasks('today') } }>
                Today
              </Button>
            </Badge>
            <Badge
              color="secondary"
              className={classes.margin}
              badgeContent={weekBadge}
            >
              <Button color="primary" variant="contained" onClick={ () => { this.filterTasks('week') } }>
                This Week
              </Button>
            </Badge>
            <Badge
              color="secondary"
              className={classes.margin}
              badgeContent={monthBadge}
            >
              <Button color="primary" variant="contained" onClick={ () => { this.filterTasks('month') } }>
                This Month
              </Button>
            </Badge>
            <Button
              className={classes.margin}
              color="secondary"
              variant="contained"
              onClick={ () => { this.filterTasks('all') } }
            >
              All
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Recently returned tasks</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.cardGrid}>
          <Grid item xs={12} md={8}>
            <DashTable
              headers={this.headersOverall}
              data={this.state.filteredTasks.filter(task => task.state !== "done" || task.state !== "cancelled")}
              type="overall_employee"
              user={this.props.user}
              loadTasks={ this.loadTasks }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashTable
              headers={this.headersReturned}
              data={this.state.filteredTasks.filter(task => task.state === "returned")}
              type="returned_employee"
              user={this.props.user}
              loadTasks={ this.loadTasks }
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
