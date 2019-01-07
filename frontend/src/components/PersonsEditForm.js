import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";
import { fetchCatalogs } from "../services/catalogs";
import { getPersonById, updatePerson } from "../services/people";

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

class PersonEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      firstName: "",
      lastName: "",
      mobile: "",
      role: 0,
      department: 0,
      jobPosition: 0,
      open: false,
      catalogs: { departments: [], roles: [], jobPosition: [] },
      loadingCatalogs: true,
      loadingPerson: true
    };
  }

  componentDidMount() {
    const { person_id } = this.props.match.params;
    this.props.fetchCatalogs().then(catalogs => {
      this.setState({ catalogs: catalogs, loadingCatalogs: false });
    });
    this.props.getPersonById(person_id).then(response => {
      let splittedName = response.name.split(" ");
      this.setState(
        {
          id: response.id,
          firstName: splittedName[0],
          lastName: splittedName[1],
          mobile: response.mobile,
          role: response.role,
          department: response.department,
          jobPosition: response.jobPosition,
          loadingPerson: false
      });
    });
  }

savePerson = () => {
  let personJson = {
    person_id: this.state.id,
    mobile: this.state.mobile,
    name: this.state.firstName + " " + this.state.lastName,
    role: this.state.role,
    department: this.state.department,
    jobPosition: this.state.jobPosition
  };
  this.props.updatePerson(personJson,this.props.history);
};


  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { classes } = this.props;
    const {
      firstName,
      lastName,
      mobile,
      role,
      department,
      jobPosition,
      catalogs,
      loadingCatalogs,
      loadingPerson
    } = this.state;
    return (
      <Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Edit a person
            </Typography>
            {loadingCatalogs || loadingPerson ? (
              <CircularProgress />
            ) : (
              <Fragment>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      fullWidth
                      autoComplete="name"
                      value={firstName}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      autoComplete="lastName"
                      value={lastName}
                      onChange={this.handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="mobile"
                      name="mobile"
                      label="Phone Number"
                      fullWidth
                      autoComplete="mobile"
                      value={mobile}
                      onChange={this.handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={6}>
                    <FormControl required fullWidth>
                      <InputLabel htmlFor="role">Role</InputLabel>
                      <Select
                        value={
                          role === 0
                            ? ""
                            : catalogs.roles.filter(
                                catalogRole => catalogRole.id === role
                              )[0].id
                        }
                        onChange={this.handleChange}
                        inputProps={{
                          name: "role",
                          id: "role"
                        }}
                      >
                        {catalogs.roles.map(role => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl required fullWidth>
                      <InputLabel htmlFor="department">Department</InputLabel>
                      <Select
                        value={
                          department === 0
                            ? ""
                            : catalogs.departments.filter(
                                catalogDepartment =>
                                  catalogDepartment.id === department
                              )[0].id
                        }
                        onChange={this.handleChange}
                        inputProps={{
                          name: "department",
                          id: "department"
                        }}
                      >
                        {catalogs.departments.map(department => (
                          <MenuItem key={department.id} value={department.id}>
                            {department.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {role === 1 && (
                    <Grid item xs={12} sm={6}>
                      <FormControl required fullWidth>
                        <InputLabel htmlFor="jobPosition">
                          Job position
                        </InputLabel>
                        <Select
                          value={
                            jobPosition === 0
                              ? ""
                              : catalogs.jobPositions.filter(
                                  catalogJobPosition =>
                                    catalogJobPosition.id === jobPosition
                                )[0].id
                          }
                          onChange={this.handleChange}
                          inputProps={{
                            name: "jobPosition",
                            id: "jobPosition"
                          }}
                        >
                          {catalogs.jobPositions.map(jobPosition => (
                            <MenuItem
                              key={jobPosition.id}
                              value={jobPosition.id}
                            >
                              {jobPosition.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
                <Fragment>
                  <div className={classes.buttons}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.savePerson}
                      className={classes.button}
                    >
                      Save
                    </Button>
                  </div>
                </Fragment>
              </Fragment>
            )}
          </Paper>
        </main>
      </Fragment>
    );
  }
}

PersonEditForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = {
  getPersonById,
  updatePerson,
  fetchCatalogs
};

const connected = connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(PersonEditForm));
export { connected as PersonEditForm };
