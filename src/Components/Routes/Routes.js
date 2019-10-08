import React from "react"
import { Route } from "react-router-dom"
import App from "../../App";
import Login from "../Login/Login";

const Routes = () => {
    return (
        <div>
            <Route exact path="/" component={App} />
            <Route path="/login" component={Login} />
        </div>
    );
};

export default Routes