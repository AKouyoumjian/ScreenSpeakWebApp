import { useParams } from "react-router-dom";
import Nav from "../Nav";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SearchRes() {
 const { que } = useParams();
 const [term, setTerm] = useState(que);
 const [results, setResults] = useState([]);
 const options = {
  method: "GET",
  url: "https://api.themoviedb.org/3/search/movie",
  params: { query: term, include_adult: "false", language: "en-US", page: "1" },
  headers: {
   accept: "application/json",
   Authorization:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGQ2NWQ4NGZlYmNhMWQwMTFjMWY5MWYwNWQxMDc1NSIsInN1YiI6IjY1NTY1YzJiN2YwNTQwMDBjNTc5MDU3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Xm54P0547jeEewjjkj6nhyB4iN0spOT8jFxmI-wMoO8",
  },
 };

 const handleSearch = async () => {
  options.params.query = term;
  axios
   .request(options)
   .then(function (response) {
    setResults(response.data.results);
   })
   .catch(function (error) {
    console.error(error);
   });
 };

 useEffect(() => {
  handleSearch();
 }, []);

 return (
  <div class="px-2 bg-main">
   <Nav /> <div class="page-title">Search</div>
   <div class="d-flex align-items-center">
    {" "}
    <input
     placeholder="Search movies by title..."
     class=" form-control m-2 py-1"
     onChange={(e) => setTerm(e.target.value)}
    />
    <Link to={`/result/${term}`}>
     {" "}
     <button class="btnx py-0" onClick={() => handleSearch()}>
      Search
     </button>
    </Link>
   </div>
   <div class="list-group">
    {results.map((res) => (
     <Link to={`/details/${res.id}`} state={{ from: `/result/${term}` }}>
      <li class="round  my-1">
       <div class="grid row d-flex align-items-center">
        <div class="my-2 peek col-11">
         <div className="row">
          {" "}
          <img
           className="col-2 mx-1"
           src={`https://image.tmdb.org/t/p/w300/${res.poster_path}`}
           alt=""
          />{" "}
          <h6 className="col-8 my-2">
           {res.original_title ? res.original_title : res.original_name}
           <p>Release Date: {res.release_date}</p>
          </h6>
         </div>
        </div>

        <i className="fa fa-chevron-right float-end col-1"></i>
       </div>
      </li>
     </Link>
    ))}
   </div>
  </div>
 );
}
export default SearchRes;
