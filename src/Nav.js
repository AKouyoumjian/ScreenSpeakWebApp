import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./login/client";
import { setCurrentUser } from "./login/UserReducer";
import { useDispatch } from "react-redux";
function Nav() {
  // get the current user
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.UserReducer);

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/login");
  };

  return (
    <nav className="nav nav-tabs mb-2 grid row">
      <div>
        {" "}
        <Link className="float-start nav-linkx" to="/">
          Home
        </Link>
        {currentUser && (
          <Link className="float-end nav-linkx" onClick={signout}>
            Sign Out
          </Link>
        )}
        {!currentUser && (
          <Link className="float-end nav-linkx" to="/login">
            Login
          </Link>
        )}
        {currentUser && (
        <Link className="float-end nav-linkx" to="/profile">
          Profile
        </Link>
        )}
        <Link className="float-end nav-linkx" to="/Screenings">
          Screenings
        </Link>
        <Link className="float-end nav-linkx" to="/Search">
          Search
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
