import React, { Component } from "react";
import { Navbar, NavbarBrand, Nav } from "reactstrap";

class LogoHeader extends Component {
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand>CRISTIN Sentralimport</NavbarBrand>
          <Nav className="ml-auto" navbar />
        </Navbar>
      </div>
    );
  }
}

export default LogoHeader;
