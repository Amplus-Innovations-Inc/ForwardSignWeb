import React, { Component } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import logo from "../static/images/Forward-signs.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import * as userActions from "../redux/actions/userActions";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import FormValidation from "./validations/FormValidation";
import Cookies from "universal-cookie";
import axios from "axios";
import BackgroundLogin from "../static/images/background1.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordShown: false,
      userName: "",
      password: "",
    };

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.cookies = new Cookies();
  }

  togglePasswordVisiblity = () => {
    const temp = this.state.passwordShown ? false : true;
    this.setState({
      passwordShown: temp,
    });
  };

  componentDidMount() {}

  onChange = (e) => {
    const { name } = e.target;
    this.setState({
      [name]: e.target.value,
    });
    if (!this.validator.fieldValid(name)) {
      this.validator.showMessageFor(name);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      axios
        .post("/api/login", {
          userName: this.state.userName,
          password: this.state.password,
        })
        .then((res) => {
          if (res.data.token === "0000" && res.data.firstName === "") {
            toast.error("Email has not been activated yet!");
          } else {
            if (res.data.token === "" && res.data.firstName === "") {
              toast.error("Invalid email and password!");
            } else {
              sessionStorage.setItem("token", res.data.token);
              sessionStorage.setItem("firstName", res.data.firstName);
              this.props.userLogin(res.data.firstName);
              this.props.history.push("/home");
            }
          }
        })
        .catch((e) => {
          toast.error("Failed to login:" + e);
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    return (
      <div
        className="App"
        style={{
          backgroundImage: `url(${BackgroundLogin})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="outer justify-content-center">
          <div className="container">
            <div className="row justify-content-center">
              <div
                className="col-4 inner inner-extension"
                style={{ marginRight: "10%", backgroundColor: "white" }}
              >
                <ToastContainer />
                <form onSubmit={this.handleSubmit}>
                  <h3>
                    <div className="shoe-container">
                      <img src={logo} alt="" width="76" height="76" />
                    </div>
                  </h3>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      name="userName"
                      value={this.state.userName}
                      className="form-control"
                      placeholder="Enter email"
                      onChange={this.onChange}
                    />
                    <FormValidation
                      validator={this.validator}
                      field="userName"
                      value={this.state.userName}
                      rule="required|email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type={this.state.passwordShown ? "text" : "password"}
                      name="password"
                      value={this.state.password}
                      className="form-control"
                      placeholder="Enter password"
                      onChange={this.onChange}
                    />
                    <i
                      className="login-i float-right"
                      onClick={this.togglePasswordVisiblity}
                    >
                      {this.state.passwordShown ? eye : eyeSlash}
                    </i>
                    <div className="float-none">
                      <FormValidation
                        validator={this.validator}
                        field="password"
                        value={this.state.password}
                        rule="required"
                      />
                    </div>
                  </div>
                  <br />
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block"
                  >
                    Sign In
                  </button>
                  <br />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
