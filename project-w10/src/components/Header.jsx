import { Container, Navbar } from "react-bootstrap";
import logo from "../assets/logo.png";

function Header() {
  return (
    <Navbar bg="light" className="py-3 shadow-sm">
      <Container className="justify-content-center">
        <Navbar.Brand>
          <img
            src={logo}
            alt="logo"
            height="50"
            className="d-inline-block align-middle me-2"
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
