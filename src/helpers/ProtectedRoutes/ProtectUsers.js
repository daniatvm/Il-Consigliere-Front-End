import React from "react";
import { Route, Redirect } from "react-router-dom";
import roles from "../roles";
import auth from "../auth";

export const ProtectUsers = ({
    component: Component,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (roles.isUserModifier()) {
                    return <Component {...props} />;
                } if(auth.isAuthenticated()){
                    return (
                        <Redirect to='/consejos' />
                    )
                } else {
                    return (
                        <Redirect to="/" />
                    );
                }
            }}
        />
    );
};