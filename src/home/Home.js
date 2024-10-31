import { useState, useEffect } from "react";
import Nav from "../Nav";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Review from "../search/Review";
import * as client from "../search/client"
import * as uClient from "../login/client";
import Pagination from "./Pagination";
function Home() {
 const [upcomingMovies, setUpcomingMovies] = useState([]);
 const [trendingMovies, setTrendingMovies] = useState([]);
 const [popularMovies, setPopularMovies] = useState([]);
 const [users, setUsers] = useState([]);
 const { currentUser } = useSelector((state) => state.UserReducer);
 const [reviews, setReviews] = useState([]);

 //Pagination for Reviews
 const [currentPageUser, setCurrentPageUser] = useState(1);
 const [currentPageNonUser, setCurrentPageNonUser] = useState(1);
 const [reviewsPerPage] = useState(10); // Assuming you want 5 reviews per page
 

 // Filter reviews for currentUser
 const filteredReviewsForUser = currentUser
   ? reviews.filter(review => currentUser.following.includes(review.user_id))
   : [];


 const totalReviewsForUser = filteredReviewsForUser.length;
 const totalReviewsNonUser = reviews.length;


 const indexOfLastReviewUser = currentPageUser * reviewsPerPage;
 const indexOfFirstReviewUser = indexOfLastReviewUser - reviewsPerPage;
 const currentReviewsUser = filteredReviewsForUser.slice(indexOfFirstReviewUser, indexOfLastReviewUser);


 const indexOfLastReviewNonUser = currentPageNonUser * reviewsPerPage;
 const indexOfFirstReviewNonUser = indexOfLastReviewNonUser - reviewsPerPage;
 const currentReviewsNonUser = reviews.slice(indexOfFirstReviewNonUser, indexOfLastReviewNonUser);

 const paginateUser = pageNumber => setCurrentPageUser(pageNumber);
 const paginateNonUser = pageNumber => setCurrentPageNonUser(pageNumber);


 const fetchUsers = async () => {
  const users = await uClient.findAllUsers();
  setUsers(users);
 }
 const fetchReviews = async () => {
  const reviews = await client.findAllReviews();
  setReviews(reviews);
 };
 useEffect(() => {
  const options = {
   method: "GET",
   headers: {
    accept: "application/json",
    Authorization:
     "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MjA3MTcxNWViMDc5ZGNiOGUyNjVkMTk4MTg4NjNhYyIsInN1YiI6IjY1NWYyYTgzN2RmZGE2MDEzOGY5MGUzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HKY7Hf1XSS6VdDa1wgIiCKb_MOq2LFA71sCv6aZ9Mm4",
   },
  };

  fetch(
   "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
   options
  )
   .then((response) => response.json())
   .then((data) => {
    setUpcomingMovies(data.results);
   })
   .catch((err) => console.error(err));
  fetch(
    'https://api.themoviedb.org/3/trending/movie/day?language=en-US', options
  )
  .then((response) => response.json())
  .then((data) => {
    setTrendingMovies(data.results);
  })
  .catch((err) => console.error(err));
  fetch(
   "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
   options
  )
   .then((response) => response.json())
   .then((data) => {
    setPopularMovies(data.results);
   })
   .catch((err) => console.error(err));
   
  fetchReviews();
  fetchUsers();
 }, []);
 return (
  <div class="px-2 bg-main">
   <Nav />
   { currentUser ? (<h1> Welcome { currentUser.name }! </h1> ) : <h1> Welcome!</h1> }
   <div>
    <div className="row" style={{width:'100%' }}>
      <div className="col-xl-8 col-lg-7 col-md-6 col-sm-12 col-xs-12">
      <ul className="home list-group">
        <li className="list-group-item active"><h4>Latest Activity</h4> </li>
        {currentUser ? (
          //Filter all the following users for the activity feed
          currentReviewsUser.map((review, index) => (
            <Link
              key={index}
              to={`/details/${review.movie_id}`}
              state={{ from: `/` }}
            >
              <li key={index} className="list-group-item">
                <Review
                  id={review._id}
                  movie={review.movie_id}
                  user={review.user}
                  rating={review.rating}
                  comment={review.comment}
                />
              </li>
            </Link>
          ))
          ) : (
          currentReviewsNonUser.map((review, index) => (
            <Link
              key={index}
              to={`/details/${review.movie_id}`}
              state={{ from: `/` }}
            >
              <li key={index} className="list-group-item">
                <Review
                  id={review._id}
                  movie={review.movie_id}
                  user={review.user}
                  rating={review.rating}
                  comment={review.comment}
                />
              </li>
            </Link>
          ))
        )}
      </ul>
      {currentUser ? (
      <Pagination
        reviewsPerPage={reviewsPerPage}
        totalReviews={totalReviewsForUser}
        paginate={paginateUser}
        currentPage={currentPageUser}
      />
    ) : (
      <Pagination
        reviewsPerPage={reviewsPerPage}
        totalReviews={totalReviewsNonUser}
        paginate={paginateNonUser}
        currentPage={currentPageNonUser}
      />
    )}
      </div>
      <div className="col-xl-4 col-lg-5 col-md-6 col-sm-12 col-xs-12">
      <ul className="home list-group">
        <li className="list-group-item active"><h4>Upcoming Movies</h4></li>
        {upcomingMovies.slice(0,3).map((movie) => (
          <li className="list-group-item" key={movie.id}>
            <Link to={`/details/${movie.id}`} state={{ from: `/` }} className="homeDetails">
              <div className="row">
                <div className="upcomingMoviesContainer">
                  <div className="poster-display-flex">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={`${movie.title} Poster`}
                      className="poster-size"
                    />
                  </div>
                  <div className="details-display-flex">
                    <h4 className="mb-1">{movie.title}</h4>
                    <p className="mb-1">Release Date: {movie.release_date}</p>
                    <p className="mb-1"><i className="fas fa-star star-icon"></i> {movie.vote_average}</p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
        <Link to={`/upcoming/?page=1`}>
        <li className="list-group-item"><button className="viewButton">View more <i class="fas fa-chevron-right"></i></button></li>
        </Link>
      </ul>
      <ul className="home list-group">
        <li className="list-group-item active"><h4>Popular Movies</h4></li>
        {popularMovies.slice(0,3).map((movie) => (
          <li className="list-group-item" key={movie.id}>
            <Link to={`/details/${movie.id}`} state={{ from: `/` }} className="homeDetails">
              <div className="row">
                <div className="upcomingMoviesContainer">
                  <div className="poster-display-flex">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={`${movie.title} Poster`}
                      className="poster-size"
                    />
                  </div>
                  <div className="details-display-flex">
                    <h4 className="mb-1">{movie.title}</h4>
                    <p className="mb-1">Release Date: {movie.release_date}</p>
                    <p className="mb-1"><i className="fas fa-star star-icon"></i> {movie.vote_average}</p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
        <Link to={`/popular/?page=1`}>
        <li className="list-group-item"><button className="viewButton">View more <i class="fas fa-chevron-right"></i></button></li>
        </Link>
      </ul>
      <ul className="home list-group">
        <li className="list-group-item active"><h4>Trending Movies</h4></li>
        {trendingMovies.slice(0,3).map((movie) => (
          <li className="list-group-item" key={movie.id}>
            <Link to={`/details/${movie.id}`} state={{ from: `/` }} className="homeDetails">
              <div className="row">
                <div className="upcomingMoviesContainer">
                  <div className="poster-display-flex">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={`${movie.title} Poster`}
                      className="poster-size"
                    />
                  </div>
                  <div className="details-display-flex">
                    <h4 className="mb-1">{movie.title}</h4>
                    <p className="mb-1">Release Date: {movie.release_date}</p>
                    <p className="mb-1"><i className="fas fa-star star-icon"></i> {movie.vote_average}</p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
        <Link to={`/trending`}>
        <li className="list-group-item"><button className="viewButton">View more <i className="fas fa-chevron-right"></i></button></li>
        </Link>
      </ul>
      <ul className="home list-group">
        <li className="list-group-item active"><h4>Trending Users</h4></li>
        {users.slice(0,3).map((user) => (
          <li className="list-group-item" key={user.id}>
            <Link to={`/profile/${user.id}`} state={{ from: `/` }} className="homeDetails">
              <p className="people-trending">{user.name}</p>
            </Link> 
          </li>
        ))}
      </ul>
    </div>
     <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12">
    </div>
    </div>
   </div>
  </div>
  
 );
}
export default Home;
