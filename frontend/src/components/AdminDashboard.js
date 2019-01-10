import React, { Component, Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import { fetchTasks, } from "../services/tasks";
import { fetchDashboard } from "../services/dashboard";
import { getTasks } from "../reducers/tasksReducer";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader/ListSubheader";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import { DashTable } from "./DashTable";
import IconFace from "@material-ui/icons/Face";
import IconArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import IconArrowBackIos from "@material-ui/icons/ArrowBackIos";
import moment from "moment";

const styles = theme => ({
  root: {
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "space-around",
    overflow: "hidden",
    padding: 10
  },
  listGrid: {
    width: "100%",
    height: 300,
    overflow: "auto"
  },
  listRoot: {
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    height: 300
  },
  listWrapper: {
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    height: 350
  },
  listBottomButtonGrid: {
    width: "100%",
    maxHeight: 50
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)",
    minWidth: "100%"
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
  },
  card: {
    borderColor: theme.palette.primary.main,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: "0.25em"
  },
  buttonRibbon: {
    paddingTop: 10,
    paddingBottom: 10
  }
});

class AdminDashboard extends Component {
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
      selectedId: 0,
      dashboard: [],
      selectedPersonId: 0
    };
  }

  componentDidMount() {
    this.loadTasks();
  }

  isSelected = id => {
    return this.state.selectedId === id;
  };

  loadTasks = async () => {
    await this.props.fetchTasks().then(() => {
      this.setState({
        tasks: this.props.tasks,
        filteredTasks: this.props.tasks
      });
    });
    this.props.fetchDashboard().then(response => {
      this.setState(
        {
          dashboard: response.dashboard
        });
    });
  };

  filterByPerson = () => {
    let filteredTasks;
    filteredTasks = this.state.filteredTasks.filter(task => task.assignee_id === this.state.selectedPersonId );
    this.setState({ filteredTasks: filteredTasks });
  }

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

  headersOverallAdmin = [
    { id: "deadline", label: "Deadline" },
    { id: "days_to_deadline", label: "Days to Deadline" },
    { id: "assignee", label: "Assignee" },
    { id: "task_name", label: "Task" },
    { id: "state", label: "State" }
  ];
  headersSubmitted = [
    { id: "assignee", label: "Assignee" },
    { id: "task_name", label: "Task" },
    { id: "state", label: "State" }
  ];

  handleClose = () => {
    this.setState({ selectedId: 0 });
  };

  handleClick = task_id => {
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

  handleListItemClick = (event, index) => {
    if (index === 0) {
      this.loadTasks()
      this.setState({ selectedPersonId: index })
    } else if (index !== this.state.selectedPersonId) {
      this.loadTasks().then(()=>{
        this.setState({ selectedPersonId: index },()=> {
          this.filterByPerson()
        })
      })
    } else {
      this.setState({ selectedPersonId: index },()=> {
        this.filterByPerson()
      })
    }


  };

  giveMeContent = () => {
    if (this.state.selectedPersonId === 0) {
      return (
        <CardHeader
          avatar={<IconArrowBackIos />}
          title={
            <Typography align="center" variant="h6">
              Select greenhorn from the list
            </Typography>
          }
        />
      );
    } else {
      let personData = this.state.dashboard.filter(
        dashItem => dashItem.user_id === this.state.selectedPersonId
      )[0];
      return (
        <Fragment>
          <CardHeader
            title={
              <Typography align="center" variant="h6">
                {personData.user_name}
              </Typography>
            }
          />
          <CardContent>
            <Typography color="primary" align="center" variant="h6">
              Task count by status
            </Typography>
            <Divider style={{ margin: 10 }} />
            {personData.status.map((status,i) => (
              <Grid
                container
                spacing={8}
                direction="row"
                justify="center"
                alignItems="stretch"
                key={i}
              >
                <Grid item>
                  <Typography>{status.label} </Typography>
                </Grid>
                <Grid item>
                  <Typography>{" : "}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{status.count}</Typography>
                </Grid>
              </Grid>
            ))}
          </CardContent>
        </Fragment>
      );
    }
  };

  giveMeFaceColor = earliest_deadline => {
    let today = moment(this.state.today);
    let deadline = moment(earliest_deadline);
    let difference = deadline.diff(today, "days");
    let color = "";
    if (difference < 0) {
      color = "text-red";
    } else if (difference === 0) {
      color = "text-yellow";
    } else {
      color = "text-primary";
    }
    return color;
  };

  render() {
    const { classes } = this.props;
    const todayBadge = this.state.filteredTasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 1
    ).length;
    const weekBadge = this.state.filteredTasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 8
    ).length;
    const monthBadge = this.state.filteredTasks.filter(
      task => this.dayDiff(task) > -1 && this.dayDiff(task) < 32
    ).length;
    const allBadge = this.state.filteredTasks.length;
    return (
      <div className={classes.root}>
        <Grid container className={classes.listWrapper}>
          <Grid item className={classes.listGrid}>
            <List
              subheader={<ListSubheader>Greenhorns by dues</ListSubheader>}
              className={classes.listRoot}
            >
              {this.state.dashboard.length === 0 && (
                <Fragment>
                  <ListItem button>
                    <ListItemText
                      primary={"No tasks available"}
                      secondary={"Start with creating tasks"}
                    />
                  </ListItem>
                  <Divider />
                </Fragment>
              )}
              {this.state.dashboard.length > 0 &&
                this.state.dashboard.map(dashItem => (
                  <Fragment key={dashItem.user_id}>
                    <ListItem
                      button
                      selected={
                        this.state.selectedPersonId === dashItem.user_id
                      }
                      onClick={event =>
                        this.handleListItemClick(event, dashItem.user_id)
                      }
                    >
                      <IconFace
                        className={this.giveMeFaceColor(
                          dashItem.earliest_deadline
                        )}
                      />
                      <ListItemText
                        primary={dashItem.user_name}
                        secondary={
                          "Earliest deadline : " + dashItem.earliest_deadline
                        }
                      />
                      <IconArrowForwardIos />
                    </ListItem>
                    <Divider />
                  </Fragment>
                ))}
            </List>
          </Grid>
          <Grid item className={classes.listBottomButtonGrid}>
            <List>
              <Fragment>
                <ListItem
                  button
                  onClick={event => this.handleListItemClick(event, 0)}
                >
                  <ListItemText
                    primary={
                      <Typography align="center">Reset selection</Typography>
                    }
                  />
                </ListItem>
              </Fragment>
            </List>
          </Grid>
        </Grid>
        <Card style={{ width: "50%" }}>{this.giveMeContent()}</Card>
        <div style={{ paddingTop: 20, width: "100%" }}>
          <Grid container spacing={8} className={classes.buttonRibbon}>
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
              <Typography variant="h6">Recently submitted tasks</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={12} md={8} className={classes.cardGrid}>
              <DashTable
                headers={this.headersOverallAdmin}
                data={this.state.filteredTasks.filter(
                  task => 1===1
                )}
                type="overall_admin"
                user={this.props.user}
                loadTasks={this.loadTasks}
                isSelected={this.isSelected}
                handleClick={this.handleClick}
                handleClose={this.handleClose}
              />
            </Grid>
            <Grid item xs={12} md={4} className={classes.cardGrid}>
              <DashTable
                headers={this.headersSubmitted}
                data={this.state.filteredTasks.filter(
                  task => task.state === "submitted"
                )}
                type="submitted_employee"
                user={this.props.user}
                loadTasks={this.loadTasks}
                isSelected={this.isSelected}
                handleClick={this.handleClick}
                handleClose={this.handleClose}
              />
            </Grid>
          </Grid>
        </div>
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
  fetchTasks,
  fetchDashboard
};

const connectedTasksTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminDashboard));
export { connectedTasksTable as AdminDashboard };
