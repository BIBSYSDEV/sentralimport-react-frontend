import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import logo from "./logo.svg";
import "./logo.css";
import {Button} from "reactstrap";
import {useHistory} from "react-router-dom";

export default function LogoHeader() {
    let history = useHistory();

    function handleLogout() {
        let id = localStorage.getItem("id_token");
        localStorage.clear();
        window.location.href = "https://auth.dataporten.no/openid/endsession?post_logout_redirect_uri=https://d3m6lae8lxzp62.cloudfront.net/login" +
            "&id_token_hint=" + id;
    }

    const style = {
        marginRight: 20
    };

    function login() {
        history.push("/login");
    }

    return (
        <Navbar expand="sm" bg="light" variant="dark">
            <Nav>
                <img
                    src={logo}
                    alt="CRISTIN - Current Research Information System In Norway"
                />
            </Nav>
            <Navbar.Collapse>
                <Nav className="mr-auto" />
                <Nav style={style}>
                    {(localStorage.getItem("authorized") && localStorage.getItem("authorized") === "true") ? <Button onClick={handleLogout}>Logg ut</Button> :
                        <Button onClick={login}>Logg inn</Button>}
                </Nav>
                <Nav>
                    <Nav.Item className="header-title">Sentralimport</Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
