import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

 class SummaryStep extends Component {

  render() {
    const { values } = this.props;
    return (

      <React.Fragment>
        <Typography variant="headline" gutterBottom>
        Employee summary
        </Typography>
        &nbsp;

        <Typography variant="subheading" gutterBottom color="primary">
        First name:
        </Typography>
        <Typography variant="title" gutterBottom>
        {values.firstName}
        </Typography>
        &nbsp;

        <Typography variant="subheading" gutterBottom color="primary">
        Last name:
        </Typography>
        <Typography variant="title" gutterBottom>
        {values.lastName}
        </Typography>
        &nbsp;

        <Typography variant="subheading" gutterBottom color="primary">
        Email:
        </Typography>
        <Typography variant="title" gutterBottom>
        {values.email}
        </Typography>
        &nbsp;

        <Typography variant="subheading" gutterBottom color="primary">
        Mobile:
        </Typography>
        <Typography variant="title" gutterBottom>
        {values.mobile}
        </Typography>
        &nbsp;

        <Typography variant="subheading" gutterBottom color="primary">
        Role:
        </Typography>
        <Typography variant="title" gutterBottom>
        {values.catalogs.roles.filter(role => role.id === values.role)[0].name}
        </Typography>
        &nbsp;

        <Typography variant="subheading" gutterBottom color="primary">
        Department:
        </Typography>
        <Typography variant="title" gutterBottom>
        {values.catalogs.departments.filter(department => department.id === values.department)[0].name}
        </Typography>
        &nbsp;

        {values.jobPosition !==0 &&
        <React.Fragment>
        <Typography variant="subheading" gutterBottom color="primary">
        Job position:
        </Typography>
        <Typography variant="title" gutterBottom>
        {values.catalogs.jobPositions.filter(jobPosition => jobPosition.id === values.jobPosition)[0].name}
        </Typography>
        </React.Fragment>}

      </React.Fragment>
    )
  }

}
export default SummaryStep;
