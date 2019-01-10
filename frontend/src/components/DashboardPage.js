import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUser } from '../reducers/userReducer'
import { AdminDashboard } from './AdminDashboard'
import { EmpDashboard } from './EmpDashboard'

class DashboardPage extends Component {
  render() {
    const {user} = this.props;
    return (
          <div className="dp-1">
            {user.role === 'admin' ?
            (<AdminDashboard user={user}/>)
            :
            (<EmpDashboard user={user}/>)}
          </div>
    );
  }
}

const mapStateToProps = state  => {
    const { user } = state
    return {
      user: getUser(user)
    };
}

const connectedDashboardPage = connect(mapStateToProps)(DashboardPage);
export { connectedDashboardPage as DashboardPage };
