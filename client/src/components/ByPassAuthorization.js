import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as userActions from "../redux/actions/userActions";

function ByPassAuthorization(props) {
  const decodeString = (data) => {
    let base64ToString = Buffer.from(data, "base64").toString();
    return JSON.parse(base64ToString);
  };

  useEffect(() => {
    //ewoibmFtZSI6ImFuaCIsCiJhcHAiOiJ3aXAiLAoid28iOiIyMEo2NTQ3IiwKInRpbWUiOjE2NDA4NDI2NTAKfQ==
    const query = new URLSearchParams(props.location.search);
    let id = query.get("id");
    if (id !== "" && id !== undefined) {
      const decodeData = decodeString(id);
      var seconds = new Date().getTime() / 1000;
      if (decodeData.time >= seconds && decodeData.time <= seconds + 900) {
        //if (decodeData.time >= seconds) {
        sessionStorage.setItem("firstName", decodeData.name);
        sessionStorage.setItem("wo", decodeData.wo);
        props.userLogin(decodeData.name);
        props.history.push("/home");
      }
    }
  }, []);

  return <></>;
}

function mapStateToProps(state) {
  return {
    userName: state.userReducer.userName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogin: (userName) => dispatch(userActions.userLogin(userName)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ByPassAuthorization);
