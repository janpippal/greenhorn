import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import { TaskDetail } from "./TaskDetail";
import { updateTaskState } from "../services/tasks";
import { connect } from "react-redux";
const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginBottom: 30
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 20
  },
  root: {
    color: "white",
    "&:hover": {
      color: "white"
    },
    "&:focus": {
      color: "white"
    }
  }
});

class DashTable extends Component {
  state = {
    order: "asc",
    orderBy: "deadline",
    page: 0,
    rowsPerPage: 10,
    selectedRowIds: []
  };

  createSortHandler = property => event => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  getSorting = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => this.desc(a, b, orderBy)
      : (a, b) => -this.desc(a, b, orderBy);
  };

  desc = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  };

  handleChangeState = (taskId, taskState, userId) => () => {
    this.props.updateTaskState(taskId, taskState, userId);
    this.props.loadTasks();
  };

  handleClose = () => {
    this.setState({ selectedRowIds: [] });
  };

  handleClick = (event, task) => {
    const { selectedRowIds } = this.state;
    let id = task.id;
    const selectedRowIdIndex = selectedRowIds.indexOf(id);
    let newSelectedRowIds = [];

    if (selectedRowIdIndex === -1) {
      newSelectedRowIds = newSelectedRowIds.concat(selectedRowIds, id);
    } else if (selectedRowIdIndex === 0) {
      newSelectedRowIds = newSelectedRowIds.concat(selectedRowIds.slice(1));
    } else if (selectedRowIdIndex === selectedRowIds.length - 1) {
      newSelectedRowIds = newSelectedRowIds.concat(selectedRowIds.slice(0, -1));
    } else if (selectedRowIdIndex > 0) {
      newSelectedRowIds = newSelectedRowIds.concat(
        selectedRowIds.slice(0, selectedRowIdIndex),
        selectedRowIds.slice(selectedRowIdIndex + 1)
      );
    }

    this.setState({ selectedRowIds: newSelectedRowIds });
  };

  giveMeColorBadge = status => {
    let label = "";
    switch (status) {
      case "new":
        label = "green-light";
        break;
      case "submitted":
        label = "yellow-light";
        break;
      case "returned":
        label = "grey-light";
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

  isSelected = id => this.state.selectedRowIds.indexOf(id) !== -1;

  getTableRow = (type, task, isSelected) => {
    if (type === "overall_employee") {
      return (
        <Fragment>
          <TableRow
            key={task.id}
            className={
              task.days_to_deadline < 0
                ? "bg-red-light"
                : task.days_to_deadline === 0
                ? "bg-yellow-light"
                : ""
            }
            onClick={e => {
              this.handleClick(e, task);
            }}
          >
            <TableCell>{task.deadline}</TableCell>
            <TableCell>{task.days_to_deadline}</TableCell>
            <TableCell>{task.owner}</TableCell>
            <TableCell>{task.task_name}</TableCell>
            <TableCell>{task.state}</TableCell>
          </TableRow>
          <TaskDetail
            task={task}
            open={isSelected}
            handleClose={this.handleClose}
            handleChangeState={this.handleChangeState}
            giveMeColorBadge={this.giveMeColorBadge}
            user={this.props.user}
          />
        </Fragment>
      );
    } else if (type === "returned_employee") {
      return (
        <Fragment>
          <TableRow
            key={task.id}
            className={
              task.days_to_deadline < 0
                ? "bg-red-light"
                : task.days_to_deadline === 0
                ? "bg-yellow-light"
                : ""
            }
            onClick={e => {
              this.handleClick(e, task);
            }}
          >
            <TableCell>{task.owner}</TableCell>
            <TableCell>{task.task_name}</TableCell>
            <TableCell>{task.state}</TableCell>
          </TableRow>
          <TaskDetail
            task={task}
            open={isSelected}
            handleClose={this.handleClose}
            handleChangeState={this.handleChangeState}
            giveMeColorBadge={this.giveMeColorBadge}
            user={this.props.user}
          />
        </Fragment>
      );
    }
  };

  render() {
    const { classes, headers, data, type } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map(header => {
                  return (
                    <TableCell
                      key={header.id}
                      padding={"default"}
                      sortDirection={orderBy === header.id ? order : false}
                      className={classes.head}
                    >
                      <TableSortLabel
                        active={orderBy === header.id}
                        direction={order}
                        onClick={this.createSortHandler(header.id)}
                        className={classes.root}
                      >
                        {header.label}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.stableSort(data, this.getSorting(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).length === 0 && (
                <TableRow style={{ height: 49 }}>
                  <TableCell colSpan={6}>No rows to display</TableCell>
                </TableRow>
              )}
              {this.stableSort(data, this.getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(task => {
                  const isSelected = this.isSelected(task.id);
                  return this.getTableRow(type, task, isSelected);
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

DashTable.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = {
  updateTaskState
};

const connected = connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(DashTable));
export { connected as DashTable };
