import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import SimpleModal from "./SimpleModal";
import { deletePerson } from "../services/people";
import { connect } from "react-redux";
import DeleteUserDialog from "./DeleteUserDialog";
import { Link } from "react-router-dom";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  actionButton: {
    maxWidth: "33%"
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  }
});

class PeopleList extends Component {
  deletePerson = id => {
    this.props.deletePerson(id).then(() => {
      this.props.loadPeople();
    });
  };

  render() {
    const { user, classes, people } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Grid container spacing={40}>
            {people.length === 0 ? (
              <Grid item>No Greenhorns to show! Start by creating one</Grid>
            ) : (
              people.map(person => (
                <Grid item key={person.id} sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {person.name}{" "}
                        <span className="text-primary font-bold float-right">
                          {person.role === "admin" ? "A" : "E"}
                        </span>
                      </Typography>
                      <Grid container direction="column" alignItems="stretch">
                        <Grid item>Department : {person.department}</Grid>
                        {person.role !== "admin" && (
                          <Grid item>Job position : {person.jobPosition}</Grid>
                        )}
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Grid
                        container
                        direction="row"
                        alignItems="stretch"
                        justify="space-between"
                      >
                        {user.role === "admin" && user.department === "HR" && (
                          <Grid item className={ classes.actionButton }>
                            <Link to={"/people/edit/" + person.id} className="no-underline">
                              <Button size="small" color="primary">
                                Edit
                              </Button>
                            </Link>
                          </Grid>
                        )}
                        {user.role === "admin" && user.department === "HR" && (
                          <Grid item className={ classes.actionButton }>
                            <DeleteUserDialog
                              deletePerson={this.deletePerson}
                              person={person}
                            />
                          </Grid>
                        )}
                        <Grid item className={ classes.actionButton }>
                          <SimpleModal person={person} />
                        </Grid>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </main>
      </React.Fragment>
    );
  }
}

PeopleList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = {
  deletePerson
};

const connected = connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(PeopleList));
export { connected as PeopleList };
