import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './auth';
import roles from './roles';

export default class ProtectedRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isAuthentic: false,
            token: ''
        };

        auth.isAuthenticated()
            .then(token => {
                if (token) {
                    roles.checkRoles()
                        .then(() => {
                            this.setState({
                                isLoading: false,
                                isAuthentic: true,
                                token: token
                            });
                        })
                        .catch(err => console.log(err));
                } else {
                    this.setState({
                        isLoading: false,
                        isAuthentic: false
                    });
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        return this.state.isLoading ? null : this.state.isAuthentic ? <Route path={this.props.path} component={this.props.component} /> : <Redirect to='/acceso' />
    }
}
