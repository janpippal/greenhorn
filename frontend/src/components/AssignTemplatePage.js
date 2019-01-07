import React, { Component } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconAdd from "@material-ui/icons/Add";
import IconClose from "@material-ui/icons/Close";
import { connect } from "react-redux";
import {
  fetchTemplates,
  fetchAssignedTemplates,
  unassignTemplate,
  assignTemplate
} from "../services/templates";
import {
  getTemplates,
  getAssignedTemplates
} from "../reducers/templatesReducer";
import AssignTemplateModal from "./AssignTemplateModal";

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  column: {
    flexBasis: "33.33%"
  }
});

class AssignTemplatePage extends Component {
  state = {
    assignedTemplates: null,
    opened: []
  };

  handleOpen = id => {
    let newArray = [];
    newArray.push(id);
    this.setState({
      opened: newArray
    });
  };

  handleClose = () => {
    this.setState({
      opened: []
    });
  };

  componentDidMount() {
    this.props.fetchAssignedTemplates();
    this.props.fetchTemplates();
  }

  unassign = (job_position_id, template_id) => {
    this.props.unassignTemplate(job_position_id, template_id).then(() => {
      this.props.fetchAssignedTemplates();
    });
  };

  assign = (templatesIds, job_position_id) => {
    this.props.assignTemplate(job_position_id, templatesIds).then(() => {
      this.props.fetchAssignedTemplates();
      this.setState({ opened: [] })
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="ctp-2">
        <div className={classes.root}>
          {this.props.assignedTemplates &&
            this.props.assignedTemplates.map((assignment,i) => (
              <ExpansionPanel key={i}>
                <AssignTemplateModal
                  handleClose={this.handleClose}
                  opened={this.state.opened}
                  assignment={assignment}
                  templates={this.props.templates}
                  assign={this.assign}
                />
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div className={classes.column}>
                    <Typography className={classes.heading}>
                      {assignment.name}
                    </Typography>
                  </div>
                  <div
                    className="column hover:shadow-inner"
                    onClick={() => {
                      this.handleOpen(assignment.job_position_id);
                    }}
                  >
                    <Typography className={classes.heading}>
                      <IconAdd className={classes.heading} />
                      Assign template
                    </Typography>
                  </div>
                </ExpansionPanelSummary>
                {assignment.templates.length === 0 && (
                  <ExpansionPanelDetails>
                    <div className={classes.column}>
                      <Typography>No templates assigned</Typography>
                    </div>
                  </ExpansionPanelDetails>
                )}
                {assignment.templates.map((template,i) => (
                  <ExpansionPanelDetails key={ i + 'd' }>
                    <div className={classes.column}>
                      <Typography>{template.template_name}</Typography>
                    </div>
                    <div
                      className="column hover:shadow-inner"
                      onClick={() => {
                        this.unassign(
                          assignment.job_position_id,
                          template.template_id
                        );
                      }}
                    >
                      <Typography className={classes.heading}>
                        <IconClose className={classes.heading} />
                        Unassign template
                      </Typography>
                    </div>
                  </ExpansionPanelDetails>
                ))}
              </ExpansionPanel>
            ))}
        </div>
      </div>
    );
  }
}

AssignTemplatePage.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { templates } = state;
  return {
    templates: getTemplates(templates),
    assignedTemplates: getAssignedTemplates(templates)
  };
};

const mapDispatchToProps = {
  fetchTemplates,
  fetchAssignedTemplates,
  unassignTemplate,
  assignTemplate
};

const assignTemplatePageWithStyles = withStyles(styles)(AssignTemplatePage);
const connectedAssignTemplatePageWithStyles = connect(
  mapStateToProps,
  mapDispatchToProps
)(assignTemplatePageWithStyles);
export { connectedAssignTemplatePageWithStyles as AssignTemplatePage };
