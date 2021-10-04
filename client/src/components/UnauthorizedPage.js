import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

function UnauthorizedPage({ role }, props) {
  const history = useHistory();
  const onClick = (e) => {};
  return (
    <div className="App vh-100">
      <div className="outer justify-content-center">
        <div className="container-fluid h-100">
          <div className="row justify-content-center h-100">
            <div className="inner inner-extension d-flex justify-content-between">
              <div className="col-12 text-center">
                <h1 style={{ color: "gray" }}>401</h1>
                <br />
                <h2>WE'RE SORRY, YOUR REQUEST IS UNAUTHORIZED</h2>
                {role && (
                  <>
                    <h5>
                      PLEASE CKICK THE "HOME" BUTTON BELOW TO RETURN TO HOME
                      PAGE
                    </h5>
                    <br />
                    <button
                      type="button"
                      class="btn btn-info"
                      onClick={onClick}
                    >
                      HOME
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userName: state.userReducer.userName,
  };
}

export default connect(mapStateToProps)(UnauthorizedPage);
