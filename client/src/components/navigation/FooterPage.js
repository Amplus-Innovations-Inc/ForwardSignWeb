import React from "react";
import { connect } from "react-redux";

function FooterPage({ userName }) {
  return (
    <>
      {userName !== "" && (
        <nav className="navbar navbar-expand-lg navbar-light fixed-bottom height-45px zindex-menu">
          <div className="footage">
            <b>
              Copyright © {new Date().getFullYear()} | Designed by Amplus
              Innovations Inc Digital
            </b>
          </div>
        </nav>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    userName: state.userReducer.userName,
  };
}

export default connect(mapStateToProps)(FooterPage);
