import React, { Component } from "react";
import ButtonCreate from "./ButtonCreate";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { fetchTemplates } from "../services/templates";
import { getTemplates } from "../reducers/templatesReducer";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import IconSearch from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TemplatesTable from './TemplatesTable';

const styles = theme => ({
  textfield: {
    margin: theme.spacing.unit,
    marginBottom: 30
  }
});

class TemplatesPage extends Component {
  componentDidMount() {
    this.loadTemplates();
  }

  loadTemplates = () => {
    this.props.fetchTemplates().then(() => {
      this.setState({
        templates: this.props.templates,
        filteredTemplates: this.props.templates
      });
    });
  };

  state = {
    templates: [],
    filteredTemplates: []
  };

  handleChange = e => {
    let templatesBeforeFiltering = this.state.templates;
    let searchValue = e.target.value.toLowerCase();
    let filteredTemplates = templatesBeforeFiltering.filter(
      template =>
        template.template_name.toLowerCase().includes(searchValue)
    );
    this.setState({ filteredTemplates: filteredTemplates });
  };

  render() {
    const { user, classes } = this.props;
    return (
      <div className="tp-2">
        <Grid container justify="space-between">
          {user.role === "admin" && (
            <Grid item>
              <ButtonCreate title="new template" redirectTo="/templates/add" />
              <ButtonCreate title="Assign template" redirectTo="/templates/assign" />
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
        <TemplatesTable templates= { this.state.filteredTemplates }/>
      </div>
    );
  }
}

TemplatesPage.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { templates } = state;
  return {
    templates: getTemplates(templates)
  };
};

const mapDispatchToProps = {
  fetchTemplates
};

const connectedTasksTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TemplatesPage));
export { connectedTasksTable as TemplatesPage };
