import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Image,
  NavLink,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";
import logo from "../../assets/images/cred-logo.png";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { userInfo, profileInfo } = user;

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        collapseOnSelect
        className="navbar-fixed-bottom navbar-inner"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <Image style={{ width: "40%", height: "auto" }} src={logo} />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {userInfo ? (
                <>
                  {/* {coins && (
                    <LinkContainer
                      style={{ paddingRight: "2rem" }}
                      to="/rewards"
                    >
                      <NavLink>
                        <i className="fas fa-coins fa-lg"></i> {coins}
                      </NavLink>
                    </LinkContainer>
                  )} */}
                  <NavDropdown title={userInfo.user.email} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
