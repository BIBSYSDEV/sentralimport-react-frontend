import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import logo from '../Header/logo.svg';
import preval from 'preval.macro';
import { version } from '../../../package.json';

export default function Footer() {
  let dateTimeStamp = preval`module.exports = new Date().toLocaleString('no');`;

  const footerStyle = {
    marginTop: '10px',
  };

  return (
    <Navbar expand="sm" bg="light" variant="dark" style={footerStyle}>
      <Nav>
        <img src={logo} alt="CRISTIN - Current Research Information SysTem In Norway" />
      </Nav>
      <Navbar.Collapse>
        <Nav className="mr-auto" />
        <Nav>
          <Nav.Item className="footer-title">
            {' '}
            Versjon: {version} (Sist oppdatert: {dateTimeStamp})
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
