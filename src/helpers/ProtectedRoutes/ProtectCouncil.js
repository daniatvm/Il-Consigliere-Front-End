import React from "react";
import { Route, Redirect } from "react-router-dom";
import roles from "../roles";

export const ProtectCouncil = ({
    component: Component,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (roles.isCouncilModifier()) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect to="/" />
                    );
                }
            }}
        />
    );
};