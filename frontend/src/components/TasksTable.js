import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import { TaskDetail } from "./TaskDetail";
import IconEdit from "@material-ui/icons/Edit";
import IconArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import { Link } from "react-router-dom";
import { updateTaskState } from "../services/tasks";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

const CustomTableHeaderCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 20
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableSortLabel = withStyles({
  root: {
    color: "white",
    "&:hover": {
      color: "white"
    },
    "&:focus": {
      color: "white"
    }
  }
})(TableSortLabel);

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  headRow = [
    { id: "task_name", numeric: false, disablePadding: true, label: "Task" },
    { id: "deadline", numeric: true, disablePadding: false, label: "Deadline" },
    { id: "owner", numeric: true, disablePadding: false, label: "Owner" },
    { id: "assignee", numeric: true, disablePadding: false, label: "Assignee" },
    { id: "state", numeric: true, disablePadding: false, label: "State" },
    { id: "actions", numeric: false, disablePadding: false, label: "Actions" }
  ];

  render() {
    const { order, orderBy } = this.props;
    return (
      <TableHead>
        <TableRow>
          <CustomTableHeaderCell padding="none" />
          {this.headRow.map(row => {
            return (
              <CustomTableHeaderCell
                key={row.id}
                align="left"
                padding="dense"
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title={"Sort " + row.label}
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <StyledTableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </StyledTableSortLabel>
                </Tooltip>
              </CustomTableHeaderCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}
EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

class TasksTable extends Component {
  state = {
    order: "asc",
    orderBy: "deadline",
    page: 0,
    rowsPerPage: 10,
    selectedRowIds: []
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleClose = () => {
    this.setState({ selectedRowIds: [] });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selectedRowIds.indexOf(id) !== -1;

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

  render() {
    const { tasks } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, tasks.length - page * rowsPerPage);
    return (
      <Paper>
        <div>
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={tasks.length}
            />

            <TableBody>
              {this.stableSort(tasks, this.getSorting(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).length === 0 && (
                <TableRow style={{ height: 49 }}>
                  <TableCell colSpan={6}>No rows to display</TableCell>
                </TableRow>
              )}
              {this.stableSort(tasks, this.getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);

                  return (
                    <Fragment key={n.id}>
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n)}
                        tabIndex={-1}
                      >
                        <TableCell
                          padding="dense"
                          className={"bg-" + this.giveMeColorBadge(n.state)}
                        />
                        <TableCell>{n.task_name}</TableCell>
                        <TableCell align="left">{n.deadline}</TableCell>
                        <TableCell align="left">{n.owner}</TableCell>
                        <TableCell align="left">{n.assignee}</TableCell>
                        <TableCell align="left">{n.state}</TableCell>
                        {this.props.user.role === "admin" && (
                          <TableCell align="left">
                            <Link
                              className="no-underline text-primary"
                              to={"tasks/edit/" + n.id}
                            >
                              <IconEdit />
                            </Link>
                          </TableCell>
                        )}
                        {this.props.user.role === "employee" && (
                          <TableCell align="left">
                            <IconArrowForwardIos className="no-underline text-primary" />
                          </TableCell>
                        )}
                      </TableRow>
                      <TaskDetail
                        task={n}
                        open={isSelected}
                        handleClose={this.handleClose}
                        handleChangeState={this.handleChangeState}
                        giveMeColorBadge={this.giveMeColorBadge}
                        user={this.props.user}
                        loadTasks={ this.props.loadTasks }
                      />
                    </Fragment>
                  );
                })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell padding="dense" />
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={tasks.length}
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

const mapDispatchToProps = {
  updateTaskState
};

const connectedTasksTable = connect(
  null,
  mapDispatchToProps
)(TasksTable);
export { connectedTasksTable as TasksTable };
