import React from "react"
import { Route } from "react-router-dom"
import App from "../../App";
import Login from "../Login/Login";

export default function Routes() {
    let comp = localStorage.getItem("authorized") ? App : Login;
    return (
        <div>
            <Route exact path="/" component={comp} />
            <Route path="/login" component={Login} />
        </div>
    );
};