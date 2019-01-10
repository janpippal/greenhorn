import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';


class AssignmentStep extends React.Component {

  render() {
  const { values,handleChange } = this.props;
  console.log(values)
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Assignment
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
        <FormControl required fullWidth>
          <InputLabel htmlFor="role">Role</InputLabel>
          <Select
          value={ values.role === 0 ? '' : values.catalogs.roles.filter(role => role.id === values.role)[0].id }
          onChange={ handleChange }
            inputProps={{
              name: 'role',
              id: 'role',
            }}
            >{
              values.catalogs.roles.map(role => (
                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
        <FormControl required fullWidth>
          <InputLabel htmlFor="department">Department</InputLabel>
          <Select
          value={ values.department === 0 ? '' : values.catalogs.departments.filter(department => department.id === values.department)[0].id }
          onChange={ handleChange }
            inputProps={{
              name: 'department',
              id: 'department',
            }}
            >
            {
              values.catalogs.departments.map(department => (
                <MenuItem key={department.id} value={department.id}>{department.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        </Grid>
        { values.role === 1 && <Grid item xs={12} sm={6}>
        <FormControl required fullWidth>
          <InputLabel htmlFor="jobPosition">Job position</InputLabel>
          <Select
          value={ values.jobPosition === 0 ? '' : values.catalogs.jobPositions.filter(jobPosition => jobPosition.id === values.jobPosition)[0].id }
          onChange={ handleChange }
            inputProps={{
              name: 'jobPosition',
              id: 'jobPosition',
            }}
            >
            {
              values.catalogs.jobPositions.map(jobPosition => (
                <MenuItem key={jobPosition.id} value={jobPosition.id}>{jobPosition.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        </Grid> }
        <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={ values.assignTasks }
              onChange= { handleChange }
              value="assignTasks"
              name="assignTasks"
            />
          }
          label="Assign tasks for job position?"
        />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
}

export default (AssignmentStep);
