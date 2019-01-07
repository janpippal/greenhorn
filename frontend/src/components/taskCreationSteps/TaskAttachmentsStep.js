import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import IconDescription from "@material-ui/icons/Description";
import Dropzone from "react-dropzone";
import { fromEvent } from "file-selector";
import AddIcon from "@material-ui/icons/Add";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing.unit
  }
});

class TaskAttachmentsStep extends Component {

  render() {
    const { classes, values, handleDeleteFile, handleAddFile } = this.props;
    return (
      <Fragment>
        <Grid container spacing={24}>
          <Grid item={true} xs={12}>
            <Typography variant="h6" gutterBottom>
              Attachments
            </Typography>
            <Fragment>
              <div className="pt-2 pb-2" justify="center">
                <Dropzone
                  className="flex items-center border-grey hover:border-black border rounded h-full"
                  getDataTransferItems={evt => fromEvent(evt)}
                  onDrop={(accepted, rejected) => {
                    handleAddFile(accepted);
                  }}
                >
                  <AddIcon className="text-grey" />
                  <div className="text-grey">Click or drop files here</div>
                </Dropzone>
              </div>
              {values.files.map((f, i) => (
                <Chip
                  icon={<IconDescription />}
                  key={i}
                  label={f.path || f.name}
                  color="primary"
                  onDelete={() => {
                    handleDeleteFile(f.name);
                  }}
                  className={classes.chip}
                  variant="outlined"
                />
              ))}
            </Fragment>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(TaskAttachmentsStep);
