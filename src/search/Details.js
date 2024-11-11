import Nav from "../Nav";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import * as client from "./client";
import * as uClient from "../login/client";
import Review from "./Review";
import Modal from "react-modal";
import { setCurrentUser } from "../login/UserReducer";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaClock,
  FaStar,
} from "react-icons/fa";

function Details() {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.UserReducer);
  const { from } = location.state;
  const [result, setResult] = useState();
  const [reviews, setReviews] = useState([]);

  console.log(from);
  const fetchReviews = async () => {
    const revs = await client.findAllReviews();
    setReviews(revs);
  };

  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGQ2NWQ4NGZlYmNhMWQwMTFjMWY5MWYwNWQxMDc1NSIsInN1YiI6IjY1NTY1YzJiN2YwNTQwMDBjNTc5MDU3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Xm54P0547jeEewjjkj6nhyB4iN0spOT8jFxmI-wMoO8",
    },
  };

  const getInfo = async () => {
    axios
      .request(options)
      .then(function (response) {
        setResult(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const [open, setOpen] = React.useState(false);
  const [com, setCom] = React.useState("");
  const [rat, setRat] = React.useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    setOpen(false);

    const rev = {
      _id: new Date().getTime().toString(),
      movie_id: result.id,
      user_id: currentUser.id,
      user: currentUser.username,
      comment: com,
      rating: rat,
    };
    try {
      const newRev = await client.createReview(rev);
      setReviews([newRev, ...reviews]);
    } catch (err) {
      console.log(err);
    }
  };

  const dispatch = useDispatch();

  const bookmark = async () => {
    const newU = {
      ...currentUser,
      bookmarks: [...currentUser.bookmarks, result.id],
    };

    try {
      await uClient.updateUser(newU);
    } catch (err) {
      console.log(err);
    }
  };

  const unbookmark = async () => {
    const newU = {
      ...currentUser,
      bookmarks: currentUser.bookmarks.filter((b) => b !== result.id),
    };
    try {
      await uClient.updateUser(newU);
      dispatch(setCurrentUser(newU));
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  // initial get info and reviews on load of the component.
  // only called on inital mount so suppress warning.
  useEffect(() => {
    getInfo();
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  return (
    <div class="px-2 bg-main">
      <Nav />
      <Link to={from} class="link">
        <i className="fa fa-chevron-left float-start mx-1 my-1"></i> Back
      </Link>
      {result && (
        <div class="grid round outline mx-3 my-3">
          <div className=" row">
            <img
              className="col-2 mx-1"
              style={{ height: "30vw", width: "auto" }}
              alt="poster"
              src={`https://image.tmdb.org/t/p/w300/${result.poster_path}`}
            />
            <div className="col-8">
              <h1>{result.original_title || result.original_name}</h1>
              <h5 className="tagline">{result.tagline}</h5>
              <p className="overview">{result.overview}</p>
              <div className="movie-details">
                <p>
                  <FaStar className="icon" /> <strong>Rating:</strong> {result.vote_average}
                </p>
                <p>
                  <strong>Genre:</strong> {result.genres.map((e) => e.name).join(", ")}
                </p>
                <p>
                  <FaCalendarAlt className="icon" /> <strong>Release Date:</strong>{" "}
                  {result.release_date}
                </p>
                <p>
                  <FaDollarSign className="icon" /> <strong>Revenue:</strong> $
                  {result.revenue.toLocaleString()}
                </p>
                <p>
                  <FaClock className="icon" /> <strong>Runtime:</strong> {result.runtime} min
                </p>

                {currentUser && (
                  <div>
                    {/* display bookmark as filled in if it is already bookmarked */}
                    {currentUser.bookmarks.includes(result.id) ? (
                      <button class="my-2 mx-2 book" onClick={(e) => unbookmark()}>
                        <i className="fa fa-2x fa-solid fa-bookmark"></i>
                      </button>
                    ) : (
                      <button class="my-2 mx-2 book" onClick={(e) => bookmark()}>
                        <i className="fa fa-2x fa-bookmark not-ac"></i>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div class="my-4">
            <div class="d-flex row align-items-center">
              {" "}
              <h5 placeholder="Search movies by title..." class="m-2 py-1 col-9">
                Reviews
              </h5>
              <div className="col-2">
                {" "}
                {currentUser && currentUser.userType === "Typical User" && (
                  <button onClick={handleOpen} class="btnx py-0  float-end">
                    Add a Review
                  </button>
                )}
              </div>
            </div>
            <div class="list-group">
              {reviews
                .filter((r) => r.movie_id === id)
                .map((rev) => (
                  <Review
                    id={rev._id}
                    movie={rev.movie_id}
                    user={rev.user}
                    rating={rev.rating}
                    comment={rev.comment}
                    det={true}
                  />
                ))}
            </div>
          </div>
          <Modal isOpen={open} onClose={handleClose} className="add">
            <>
              <h1>Review</h1>
              <h3>
                Add a review for{" "}
                {result.original_title ? result.original_title : result.original_name}
              </h3>
              <label className="my-1">
                {" "}
                Comment:{" "}
                <textarea
                  class="form-control"
                  onChange={(e) => setCom(e.target.value)}
                  id="exampleFormControlTextarea1"
                  rows="4"
                  cols="68"
                ></textarea>
              </label>
              <div>
                <label className="my-3">
                  Star Rating:{" "}
                  <input
                    onChange={(e) => setRat(e.target.value)}
                    type="number"
                    min="1"
                    placeholder="5"
                    max="5"
                    className="form-control "
                  ></input>
                </label>
              </div>

              <div className="my-5">
                {" "}
                <button class="btnx py-0 mx-2 float-end" onClick={handleSave}>
                  {" "}
                  save
                </button>
                <button class="btnx py-0  float-end" onClick={handleClose}>
                  {" "}
                  close
                </button>
              </div>
            </>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Details;
