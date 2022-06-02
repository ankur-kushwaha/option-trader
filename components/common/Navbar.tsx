import React from 'react'
import { Container, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
import { UserContext } from './UserContext';
// import Navbar from 'react-bootstrap/Navbar'

export default function NavigationBar() {

  let {user} = React.useContext(UserContext);

  return (
    <Navbar bg="dark" variant="dark" className='navbar'>
      <Container>
        <NavbarBrand href="/">Option Trader</NavbarBrand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/watchlist">WatchList</Nav.Link>
          <Nav.Link href="/positions">Positions</Nav.Link>
        </Nav>
        <Nav justify={true}>
        {user?
          <Nav.Link href="/">Login</Nav.Link>:
          <Nav.Link href="/">Logout</Nav.Link>}
        </Nav>
      </Container>
    </Navbar>
  )
}
