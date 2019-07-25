import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../LogoHeader/logo.svg";

export default function LogoHeader() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="dark">
      <Nav>
        <img
          src={logo}
          alt="CRISTIN - Current Research Information System In Norway"
        />
      </Nav>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto" />
        <Nav>
          <Nav.Item>CRISTIN Sentralimport</Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
