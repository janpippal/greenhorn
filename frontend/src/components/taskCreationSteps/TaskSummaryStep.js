import React, { Component, Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import IconDescription from "@material-ui/icons/Description";
import IconPerson from "@material-ui/icons/Person";
import IconTime from "@material-ui/icons/AccessTime";

export class TaskSummaryStep extends Component {
  render() {
    const { values } = this.props;
    return (
      <Fragment>
        <Typography variant="h6" gutterBottom>
          Task summary
        </Typography>
        <Typography variant="h6" gutterBottom color="primary">
          Task title :
        </Typography>
        <Typography variant="h6" gutterBottom>
          {values.task_name}
        </Typography>
        <Typography variant="h6" gutterBottom color="primary">
          Task Instructions:
        </Typography>
        <Typography variant="h6" gutterBottom>
          {values.task_instructions}
        </Typography>
        <Typography variant="h6" gutterBottom color="primary">
          Deadlines:
        </Typography>
        {values.selectedEmployees.map((employee, i) => (
          <Fragment key={i}>
            <Grid container spacing={0} direction="row" alignItems="center" justify="center">
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  <IconPerson className="pr-2"/>
                  {employee.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  <IconTime className="pr-2"/>
                  {
                    values.deadlines.filter(deadline => {
                      return deadline.id === employee.id;
                    })[0].deadline
                  }
                </Typography>
              </Grid>
            </Grid>
          </Fragment>
        ))}
        {values.files.length !== 0 && (
          <Fragment>
            <Typography variant="h6" gutterBottom color="primary">
              Files:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {values.files.map((file, i) => (
                <Chip
                  icon={<IconDescription />}
                  key={i}
                  label={file.name}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Typography>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
export default TaskSummaryStep;
