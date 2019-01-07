import React, { Component } from "react";
import { PeopleList } from "./PeopleList";
import ButtonCreate from "./ButtonCreate";
import { connect } from "react-redux";
import { getPeople } from "../reducers/peopleReducer";
import { fetchPeople } from "../services/people";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import IconSearch from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from "prop-types";

const styles = theme => ({
  textfield: {
    marginBottom: 30
  }
});

class PeoplePage extends Component {
  componentDidMount() {
    this.loadPeople();
  }

  loadPeople = () => {
    this.props.fetchPeople().then(() => {
      this.setState({
        people: this.props.people,
        filteredPeople: this.props.people
      });
    });
  };

  state = {
    people: [],
    filteredPeople: []
  };

  handleChange = e => {
    let peopleBeforeFiltering = this.state.people;
    let searchValue = e.target.value.toLowerCase();
    let filteredPeople = peopleBeforeFiltering.filter(
      person =>
        person.name.toLowerCase().includes(searchValue) ||
        person.department.toLowerCase().includes(searchValue) ||
        (person.jobPosition &&
          person.jobPosition.toLowerCase().includes(searchValue)) ||
        person.role.toLowerCase().includes(searchValue)
    );
    this.setState({ filteredPeople: filteredPeople });
  };

  render() {
    const { user, classes } = this.props;
    return (
      <div className="pp-2">
        <Grid container justify="space-between">
          {user.role === "admin" && (
            <Grid item>
              <ButtonCreate redirectTo="/people/add" title="new employee" />
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
        <PeopleList user={user} people={this.state.filteredPeople} loadPeople={ this.loadPeople } />
      </div>
    );
  }
}

PeoplePage.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { people } = state;
  return {
    people: getPeople(people)
  };
};

const mapDispatchToProps = {
  fetchPeople
};

const connectedPeoplePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PeoplePage));
export { connectedPeoplePage as PeoplePage };
