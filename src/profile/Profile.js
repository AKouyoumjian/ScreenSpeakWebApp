import { useParams } from "react-router-dom";
import Nav from "../Nav";
import React, { useEffect, useState } from "react";
import "./Profile.css";
import Review from "../search/Review";
import MiniScreening from "../screenings/MiniScreening";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as client from "../search/client.js";
import * as uClient from "../login/client.js";
import MiniMovie from "../screenings/MiniMovie";
import { setCurrentUser } from "../login/UserReducer";

// Profile page for a user. Only displays sensitive information if this screen is the logged in user's profile
function Profile() {
  const { currentUser } = useSelector((state) => state.UserReducer);
  const { uId } = useParams();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();

  // generate a list of followers and following from the indices in the user object
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchUsers = async () => {
    const fetchedUsers = await uClient.findAllUsers();
    await setUsers(fetchedUsers);
    if (uId) {
      await setUser(fetchedUsers.find((user) => user.id === uId));
      await setFollowers(fetchedUsers.filter((u) => u.following.includes(uId)));
      await setFollowing(fetchedUsers.filter((u) => u.followers.includes(uId)));
    }
  };

  const dispatch = useDispatch();
  const [screenings, setScreenings] = useState([]);
  const fetchScreenings = async () => {
    const scs = await client.findAllScreenings();
    setScreenings(scs);
  };

  const [reviews, setReviews] = useState([]);
  const fetchReviews = async () => {
    const revs = await client.findAllReviews();
    setReviews(revs);
  };

  const [response, setResponse] = useState([]);
  const fetchResponses = async () => {
    const reps = await client.findAllResponses();
    setResponse(reps);
  };

  // boolean for if the logged in user is viewing their own profile
  let isOwnProfile = false;

  useEffect(() => {
    if (!uId) {
      setUser(currentUser);
      isOwnProfile = true;
    }
  }, [uId, currentUser]);

  if (uId && currentUser) {
    isOwnProfile = uId === currentUser.id;
  }

  if (!uId) {
    isOwnProfile = true;
  }

  const [showFollowers, setShowFollowers] = useState(true);
  const [showFollowing, setShowFollowing] = useState(true);
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showReviews, setShowReviews] = useState(true);
  const [showAddedMovies, setShowAddedMovies] = useState(true);
  const [showResponses, setShowResponses] = useState(true);

  useEffect(() => {
    fetchScreenings();
    fetchReviews();
    fetchResponses();
    fetchUsers();
  }, [uId]);

  const handleFollow = async () => {
    try {
      // Update user's followers list locally
      const updatedUser = {
        ...user,
        followers: [...user.followers, currentUser.id],
      };
      setUser(updatedUser);

      // Update current user's following list locally
      const updatedCurrentUser = {
        ...currentUser,
        following: [...currentUser.following, user.id],
      };
      dispatch(setCurrentUser(updatedCurrentUser));

      // Update user and current user on the server
      await uClient.updateUser(updatedUser);
      await uClient.updateUser(updatedCurrentUser);
      await fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      // update user's followers list
      const updatedUser = {
        ...user,
        followers: user.followers.filter((f) => f !== currentUser.id),
      };
      setUser(updatedUser);

      // update current user's following list
      const updatedCurrentUser = {
        ...currentUser,
        following: currentUser.following.filter((f) => f !== user.id),
      };
      dispatch(setCurrentUser(updatedCurrentUser));

      // now on server update user and current user
      await uClient.updateUser(updatedUser);
      await uClient.updateUser(updatedCurrentUser);
      await fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-2 bg-main bg-dark">
      <Nav />
      {user && (
        <div className="mx-5 my-2">
          <div className="row" style={{ width: "100%" }}>
            {/* column for Profile Picture, Name, and Bio */}
            <div
              // checks if this is the users own profile, if not it makes this div larger.
              className={`col-md-5 border rounded p-4 me-3 mt-2 bg-mint ${
                isOwnProfile ? "wd-scrollable-div" : "wd-scrollable-div-large"
              } `}
            >
              {/* <div className="col-md-4 border rounded p-4 me-3 mt-2 bg-mint wd-scrollable-div"> */}
              <h2
                className="rounded mb-3"
                style={{
                  textAlign: "center",
                  fontFamily: "Arial, sans-serif",
                  border: "2px solid black",
                  fontSize: "1.5em",
                }}
              >
                Profile Information
              </h2>
              <img
                src={user.profilePicture}
                alt="Profile"
                className="img-fluid rounded-circle mx-auto d-block"
              />
              <h1 className="text-center">{user.name}</h1>
              <div className="d-flex justify-content-center mb-2 mt-4">
                {/* EDIT PROFILE BUTTON only if this is logged in user, otherwise follow/unfollow button */}
                {isOwnProfile ? (
                  <Link
                    className="wd-link border-dark border-2 rounded wd-li bg-success p-2 text-center form-control"
                    to={`/profile/profileEditor/${currentUser.id}`}
                  >
                    Edit Your Profile
                  </Link>
                ) : (
                  // Render the follow/unfollow buttons only if there is a currentUser
                  currentUser &&
                  (!currentUser.following.includes(user.id) ? (
                    // Follow button for if not already following user
                    <button
                      onClick={handleFollow}
                      className="wd-link border-dark border-2 rounded wd-li bg-warning p-2 text-center form-control"
                    >
                      Follow {user.name}
                    </button>
                  ) : (
                    // Unfollow button for if user is already following
                    <button
                      onClick={handleUnfollow}
                      className="wd-link border-dark border-2 rounded wd-li bg-warning p-2 text-center form-control"
                    >
                      Unfollow {user.name}
                    </button>
                  ))
                )}
              </div>
              <h5 className="ms-1 mb-2 mt-4">Biography:</h5>
              <p
                className="bg-white p-2 rounded"
                style={{ maxHeight: "calc(1.5em * 5)", overflowY: "auto" }}
              >
                {user.bio}
              </p>
            </div>

            {/* column for reviews/bookmarks or added movies/responses depending on user type */}
            <div
              // checks if this is the users own profile, if not it makes this div larger.
              className={`col border rounded p-4 me-3 mt-2 bg-mint ${
                isOwnProfile ? "wd-scrollable-div" : "wd-scrollable-div-large"
              } `}
            >
              <h2
                className="rounded mb-4"
                style={{
                  textAlign: "center",
                  fontFamily: "Arial, sans-serif",
                  border: "2px solid black",
                  fontSize: "1.5em",
                }}
              >
                {user.userType === "Typical User"
                  ? "Reviews and Bookmarks"
                  : "Movies and Responses"}
              </h2>
              {user.userType === "Typical User" && (
                <div>
                  <div className="wd-section mb-3">
                    <button
                      className="btn btn-light form-control"
                      onClick={() => setShowReviews(!showReviews)}
                    >
                      {showReviews ? "Hide Reviews" : "Display Reviews"} (
                      {reviews.filter((r) => r.user === user.username).length})
                    </button>{" "}
                  </div>
                  {showReviews && (
                    <ul className="list-group">
                      {reviews
                        .filter((r) => r.user === user.username)
                        .map((review, index) => (
                          <Link
                            to={`/details/${review.movie_id}`}
                            state={{ from: `/profile/${user.id}` }}
                          >
                            <Review
                              id={review._id}
                              movie={review.movie_id}
                              user={review.user}
                              rating={review.rating}
                              comment={review.comment}
                              det={false}
                            />
                          </Link>
                        ))}
                    </ul>
                  )}
                  <div className="wd-section mb-3">
                    <button
                      className="btn btn-light mt-4 form-control"
                      onClick={() => setShowBookmarks(!showBookmarks)}
                    >
                      {showBookmarks ? "Hide Bookmarks" : "Display Bookmarks"}
                    </button>
                  </div>
                  {showBookmarks && (
                    <ul className="list-group flex-wrap flex-row">
                      {user?.bookmarks.map((b, index) => (
                        <Link to={`/details/${b}`} state={{ from: `/profile/${user.id}` }}>
                          <MiniMovie movie={b} key={index} />
                        </Link>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {user.userType === "Director" && (
                <div>
                  <div className="wd-section mb-3">
                    <button
                      className="btn btn-light form-control"
                      onClick={() => setShowAddedMovies(!showAddedMovies)}
                    >
                      {showAddedMovies ? "Hide Screenings" : "Display Screenings"}
                    </button>
                  </div>
                  {showAddedMovies && (
                    <ul className="list-group flex-wrap flex-row">
                      {screenings
                        .filter((s) => s.user === user.username)
                        .map((addedMovie, index) => (
                          <MiniScreening
                            user={user.name}
                            date={addedMovie.date}
                            viewers={addedMovie.viewers}
                            movie={addedMovie.movie_id}
                            key={index}
                          />
                        ))}
                    </ul>
                  )}
                  <div className="wd-section mb-3">
                    <button
                      className="btn btn-light mt-4 form-control"
                      onClick={() => setShowResponses(!showResponses)}
                    >
                      {showResponses ? "Hide Responses" : "Display Responses"}
                    </button>
                  </div>
                  {showResponses && (
                    <ul className="list-group">
                      {response
                        .filter((r) => r.user === user.username)
                        .map((response, index) => (
                          <Link
                            to={`/details/${response.movie_id}`}
                            state={{ from: `/profile/${user.id}` }}
                          >
                            <li
                              className="list-group-item border-dark border-2 rounded wd-li"
                              key={index}
                            >
                              <div>{response.comment}</div>
                            </li>
                          </Link>
                        ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {/* column for followers/following */}
            <div
              // checks if this is the users own profile, if not it makes this div larger.
              className={`col border rounded p-4 mt-2 bg-mint ${
                isOwnProfile ? "wd-scrollable-div" : "wd-scrollable-div-large"
              } `}
            >
              <h2
                className="rounded mb-4"
                style={{
                  textAlign: "center",
                  fontFamily: "Arial, sans-serif",
                  border: "2px solid black",
                  fontSize: "1.5em",
                }}
              >
                Social Network
              </h2>
              <div className="wd-section mb-3">
                <button
                  className="btn btn-light form-control"
                  onClick={() => setShowFollowers(!showFollowers)}
                >
                  {showFollowers ? "Hide Followers" : "Display Followers"} ({user.followers.length})
                </button>
              </div>
              {showFollowers && (
                <ul className="list-group">
                  {user.followers.map((f) => (
                    <Link className="wd-link" to={`/profile/${f}`}>
                      <li className="list-group-item border-dark border-2 rounded wd-li" key={f}>
                        {/* find user whos id matches f.id and display their name */}
                        {users.find((u) => u.id === f)?.name || "User not found"}
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
              <div className="wd-section mb-3">
                <button
                  className="btn btn-light mt-4 form-control"
                  onClick={() => setShowFollowing(!showFollowing)}
                >
                  {showFollowing ? "Hide Following" : "Display Following"} ({user.following.length})
                </button>
              </div>
              {showFollowing && (
                <ul className="list-group">
                  {user.following.map((f) => (
                    <Link to={`/profile/${f}`} className="wd-link">
                      <li className="list-group-item border-dark border-2 rounded wd-li" key={f}>
                        {/* find user whos id matches f.id and display their name */}
                        {users.find((u) => u.id === f)?.name || "User not found"}
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>

            {/* Private information only visible to the signed-in user */}
            {isOwnProfile && (
              <div className="private-info rounded bg-mint">
                <h2>Your Private Account Information</h2>
                <p>Email: {user.email}</p>
                <p>Phone Number: {user.phoneNumber}</p>
                <p>Address: {user.address}</p>
                <hr className="mt-4" />
                <p className="mt-3 text-danger">
                  <b>
                    ***Disclaimer: This information is only available if you are signed in to this
                    account. <u>We value your privacy!</u>
                  </b>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
