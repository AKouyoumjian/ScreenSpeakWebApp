import { React, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import * as client from "../search/client.js";
import * as uClient from "../login/client.js";
import { useSelector } from "react-redux";

function Screening(props) {
 const [result, setResult] = useState();
 const [views, setViews] = useState(props.viewers.length);
 const [joined, setJoined] = useState(false);
 const { currentUser } = useSelector((state) => state.UserReducer);
 const [users, setUsers] = useState([]);
 const fetchUsers = async () => {
  const reps = await uClient.findAllUsers();
  setUsers(reps);
 };

 const user = users.filter((u) => props.user === u.username)[0];

 const [screenings, setScreenings] = useState([]);

 const fetchScreenings = async () => {
  const scs = await client.findAllScreenings();
  setScreenings(scs);
 };

 const options = {
  method: "GET",
  url: `https://api.themoviedb.org/3/movie/${props.movie}?language=en-US`,
  headers: {
   accept: "application/json",
   Authorization:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGQ2NWQ4NGZlYmNhMWQwMTFjMWY5MWYwNWQxMDc1NSIsInN1YiI6IjY1NTY1YzJiN2YwNTQwMDBjNTc5MDU3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Xm54P0547jeEewjjkj6nhyB4iN0spOT8jFxmI-wMoO8",
  },
 };

 const handleJoin = async () => {
  const i = screenings.find((s) => s.movie_id === result.id.toString());

  i.viewers = [...i.viewers, currentUser.username];

  try {
   const newSS = await client.updateScreening(i);
   setScreenings([newSS, ...screenings]);
  } catch (err) {
   console.log(err);
  }

  setViews(views + 1);
  setJoined(true);
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

 useEffect(() => {
   getInfo();
   fetchScreenings();
   fetchUsers();
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);
 return (
  <li class="round  my-1">
   {result && (
    <div class="grid row d-flex align-items-center">
     <div class="my-2 peek row grid ">
      <div class="d-flex justify-content-between">
       <div>
        <div class="d-flex">
         {" "}
         <img
          className="col-2 mx-1"
          style={{ height: "200px", width: "auto" }}
          alt="poster"
          src={`https://image.tmdb.org/t/p/w300/${result.poster_path}`}
         />{" "}
         <div>
          {" "}
          <h1 class="mx-2">
           {result.original_title
            ? result.original_title
            : result.original_name}
          </h1>
          {user && (
           <h6 class="mx-2 col">
            Created by User:{" "}
            <Link to={`/profile/${user.id}`} className="col">
             {props.user}
            </Link>
           </h6>
          )}
          <div class="mx-2">Runtime: {result.runtime} min</div>
          <div class="mx-2">Date: {props.date}</div>
         </div>
        </div>
       </div>
       <div className="flex-shrink-1 align-items-end flex-column">
        {currentUser && (
         <div>
          {!props.viewers.includes(currentUser.username) && !joined ? (
           <button class="btnx py-0 px-2 float-end" onClick={handleJoin}>
            Join
           </button>
          ) : (
           <button disabled class="btnx py-0 px-2 float-end">
            Joined
           </button>
          )}
         </div>
        )}
        <div class="my-3">Viewers: {views}</div>
       </div>
      </div>
     </div>
    </div>
   )}
  </li>
 );
}
export default Screening;
