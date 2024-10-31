import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../Nav";

function TrendingMovies() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MjA3MTcxNWViMDc5ZGNiOGUyNjVkMTk4MTg4NjNhYyIsInN1YiI6IjY1NWYyYTgzN2RmZGE2MDEzOGY5MGUzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HKY7Hf1XSS6VdDa1wgIiCKb_MOq2LFA71sCv6aZ9Mm4",
      },
    };
    fetch(
      'https://api.themoviedb.org/3/trending/movie/day?language=en-US', options
    )
    .then((response) => response.json())
    .then((data) => {
      setTrendingMovies(data.results);
    })

    
  }, []);


  return (
    <div className="px-2 bg-main">
    <Nav />
    <Link to='/' class="link">
    <i className="fa fa-chevron-left float-start mx-1 my-1"></i> Back
   </Link>
   <br/>
    <span className="movieHeading">Trending Movies</span>
    <div className="row movie">
      {trendingMovies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <Link to={`/details/${movie.id}`} state={{ from: `/trending` }} className="movie-link">
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={`${movie.title} Poster`}
            className="movie-poster"
          />
          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-release-date">Release Date: {movie.release_date}</p>
            <i className="fas fa-star star-icon"></i> {movie.vote_average}
          </div>
          </Link>
        </div>
      ))}
    </div>
    </div>
  );
}

export default TrendingMovies;
