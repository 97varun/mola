import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import React from "react";

function Nav(props) {
  return (
    <Navbar fixed="top" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>MOLA</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Nav;
