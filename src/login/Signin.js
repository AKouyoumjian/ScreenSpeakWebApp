import * as client from "./client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./UserReducer";
import Nav from "../Nav";

function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signin = async () => {
    if (!credentials.username) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
    if (!credentials.password) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
    try {
      const user = await client.signin(credentials);
      dispatch(setCurrentUser(user));
      navigate("/");
    } catch (error) {
      console.error("Sign-in failed:", error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
  };
  return (
    <div className="background-sign">
      <Nav />
      {showError && ( // Displays error message if showError is true
        <div
          className="alert alert-danger d-flex align-items-center justify-content-center"
          role="alert"
          style={{
            position: "absolute",
            width: "90%",
            height: "100px",
            fontSize: "2vw",
            marginTop: "70px",
            marginLeft: "5%",
            marginRight: "5%",
          }}
        >
          Login unsuccessful. Please try again.
        </div>
      )}
      <div className="container sign1">
        <div className="container sign">
          <div className="d-flex justify-content-center">
            <h2 className="webtitle">ScreenSpeak</h2>
          </div>
          <form>
            <div className="form-group sign">
              <input
                type="text"
                class="form-control"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div className="form-group sign">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <p className="sign-sent">
              {" "}
              Don't have an account?{" "}
              <a href="#/register/*" className="sign-link">
                Sign up
              </a>
            </p>
            <div className="d-flex justify-content-center">
              <button type="submit" class="btn-sign" onClick={signin}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
