import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../Header/logo.svg";


export default function Footer() {
    const { version } = require('../../../package.json');

    const footerStyle = {
        marginTop: "10px"
    }
    
    return (
        <Navbar expand="sm" bg="light" variant="dark" style={footerStyle}>
            <Nav>
                <img
                    src={logo}
                    alt="CRISTIN - Current Research Information SysTem In Norway"
                />
            </Nav>
            <Navbar.Collapse>
                <Nav className="mr-auto" />
                <Nav>
                    <Nav.Item className="footer-title"> Versjon: {version} </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}