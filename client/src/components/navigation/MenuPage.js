import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav, Container } from "react-bootstrap";
import LogoImg from "../../static/images/Forward-signs.png";

function MenuPage({ userName }) {
  function clickSignOut(e) {
    sessionStorage.removeItem("data");
    sessionStorage.removeItem("token");
    window.parent.location = "/";
  }

  return (
    <>
      {userName !== "" && (
        <Navbar expand="lg" className="navbar-light fixed-top zindex-menu">
          <Container fluid>
            <Navbar.Brand href="" style={{ color: "white" }}>
              <img src={LogoImg} width="36" height="36" alt="user" />{" "}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Nav className="me-auto">
                <ul className="navbar-nav ml-auto">
                  <div className="d-flex justify-content-between">
                    <h6
                      className="menu-h6-center"
                      style={{ marginLeft: "30px" }}
                    >
                      <img
                        src={`https://ui-avatars.com/api/name=${userName}&background=random`}
                        width="36"
                        height="36"
                        alt="user"
                        style={{ borderRadius: "18px" }}
                      />{" "}
                      &nbsp;&nbsp;&nbsp;
                      <b>{userName} </b>
                    </h6>

                    <div
                      className="signout-header"
                      style={{ marginLeft: "30px" }}
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className=" subject-level-star-icon fa-lg"
                        onClick={clickSignOut}
                      />
                    </div>
                  </div>
                </ul>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    userName: state.userReducer.userName,
  };
}

export default connect(mapStateToProps)(MenuPage);
