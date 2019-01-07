import React, {Component} from 'react';
import { LoginForm } from './LoginForm';
import Logo from './Logo';
import { ErrorAlert } from './ErrorAlert';

export class LoginPage extends Component {
 render() {
  return (
   <div className="lp-1">
      <ErrorAlert />
      <Logo/>
      <LoginForm />
   </div>
  );
  }
}
