import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './auth';
import roles from './roles';
import { Role } from './Role';
import loading from '../assets/loading.gif';

export default class ProtectedRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isAuthentic: false,
      isCouncilModifier: false,
      isUserModifier: false
    }

    auth.verifyToken()
      .then(res => {
        if (res) {
          roles.checkRoles()
            .then(() => {
              if (roles.isUserModifier()) {
                this.setState({
                  isUserModifier: true
                });
              }
              if (roles.isCouncilModifier()) {
                this.setState({
                  isCouncilModifier: true
                });
              }
              this.setState({
                isLoading: false,
                isAuthentic: true
              });
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({
            isLoading: false
          });
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="row m-0" style={{ height: '90vh' }}>
          <div className="col-sm-12 my-auto">
            <img src={loading} className='img-fluid m-auto d-block' style={{ opacity: 0.6 }} alt='logo' />
          </div>
        </div>
      );
    }
    if (this.state.isAuthentic) {
      if (this.props.role === Role.UserModifier) {
        if (this.state.isUserModifier) {
          return <Route path={this.props.path} component={this.props.component} />;
        }
        return <Redirect to='/consejos' />;
      }
      if (this.props.role === Role.CouncilModifier) {
        if (this.state.isCouncilModifier) {
          return <Route path={this.props.path} component={this.props.component} />;
        }
        return <Redirect to='/consejos' />;
      }
      return <Route path={this.props.path} component={this.props.component} />;
    }
    return <Redirect to='/acceso' />;
  }
}
