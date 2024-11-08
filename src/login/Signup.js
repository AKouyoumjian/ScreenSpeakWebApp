import Nav from "../Nav";
import React, { useEffect, useState } from "react";
import * as client from "./client";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "./UserReducer";

function Signup() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    userType: "Typical User",
    id: "",
  });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRoleChange = (e) => {
    setCredentials({ ...credentials, userType: e.target.value });
  };
  const signup = async () => {
    // if no username is inputted
    if (!credentials.username) {
      setError("Please enter a username.");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
    // if no name is inputted
    if (!credentials.name) {
      setError("Please enter a name.");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
    // if no email is inputted
    if (!credentials.email) {
      setError("Please enter a email.");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
    // if no password is inputted
    if (!credentials.password) {
      setError("Please enter a password.");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
    // if passwords do not match
    if (credentials.password !== confirmPassword) {
      setError("Passwords do not match!");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    } 

    try {
      await client.signup(credentials);
      navigate("/login");
    } catch (err) {
      console.log("error");
      setError(err.response.data.message);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };


  useEffect(() => {
    const idString = new Date().getTime().toString();
    const updatedCredentials = { ...credentials, id: idString };
    setCredentials(updatedCredentials);
    setCurrentUser(updatedCredentials);
  }, [credentials])
  return (
    <div className="background-sign">
      <Nav />
      <div className="container sign1">
        <div className="container sign">
          <div className="d-flex justify-content-center">
            <h2 className="webtitle">Create an account</h2>
          </div>
          {showError && ( // Displays error message if showError is true
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
          <form>
            <div className="form-group sign">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div className="form-group sign">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={credentials.name}
                onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
              />
            </div>
            <div className="form-group sign">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>
            <div className="form-group sign">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <div className="form-group sign">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} // Update the confirmPassword state
              />
            </div>
            <div className="mb-3">
              <div className="form-check sign">
                <input
                  className="form-check-input"
                  type="radio"
                  name="TypeOfUser"
                  id="Reviewer"
                  value="Typical User"
                  checked={credentials.userType === "Typical User"}
                  onChange={handleRoleChange}
                />
                <label className="register-sent" for="Reviewer">
                  Reviewer
                </label>
              </div>
              <div className="form-check sign">
                <input
                  className="form-check-input"
                  type="radio"
                  name="TypeOfUser"
                  id="Director"
                  value="Director"
                  checked={credentials.userType === "Director"}
                  onChange={handleRoleChange}
                />
                <label className="register-sent" for="Director">
                  Director
                </label>
              </div>
            </div>

            <p className="sign-sent">
              {" "}
              Already have an account?{" "}
              <a href="#/login/*" className="sign-link">
                Login now
              </a>
            </p>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn-sign" onClick={signup}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
