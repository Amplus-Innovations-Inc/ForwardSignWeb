import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav, Container } from "react-bootstrap";
import MaleImg from "../../static/images/male_user.png";

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
            <Navbar.Brand href="#home" style={{ color: "white" }}>
              Logo
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Nav className="me-auto">
                <ul className="navbar-nav ml-auto">
                  <div className="d-flex justify-content-between">
                    <div className="input-group rounded percentage-45">
                      <input
                        type="search"
                        className="form-control rounded"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="search-addon"
                      />
                    </div>

                    <div
                      className="signout-header"
                      style={{ marginLeft: "20px" }}
                    >
                      <FontAwesomeIcon
                        icon={faBell}
                        className=" subject-level-star-icon fa-lg"
                      />
                    </div>

                    <h6
                      className="menu-h6-center"
                      style={{ marginLeft: "30px" }}
                    >
                      <img src={MaleImg} width="40" height="36" alt="user" />{" "}
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
