import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./client";
import * as uClient from "../login/client.js";
import "../App.css";

function Review(props) {
 const { currentUser } = useSelector((state) => state.UserReducer);
 const [Repping, setRep] = useState(false);
 const [reply, setReply] = useState("");
 const [users, setUsers] = useState([]);
 const fetchUsers = async () => {
  const reps = await uClient.findAllUsers();
  setUsers(reps);
 };

 const user = users.filter((u) => props.user === u.username)[0];

 const [response, setResponse] = useState([]);
 const fetchResponses = async () => {
  const reps = await client.findAllResponses();
  setResponse(reps);
 };

 const stars = [];
 for (let i = 0; i < props.rating; i++) {
  stars.push(" ");
 }

 const handleSave = async () => {
  setRep(false);
  const res = {
   _id: new Date().getTime().toString(),
   rev_id: props.id,
   movie_id: props.movie,
   user: currentUser.username,
   comment: reply,
  };
  try {
   const newRep = await client.createResponse(res);
   setResponse([newRep, ...response]);
  } catch (err) {
   console.log(err);
  }
 };

 useEffect(() => {
  fetchUsers();
  fetchResponses();
 }, []);

 return (
   <li class="round  my-1">
     <div class="grid row d-flex align-items-center">
       <div class="my-2 peek ">
         <div class="d-flex">
           <i className="fa fa-comment fa-flip-horizontal" style={{ color: "#229660" }}></i>
           {user && (
             <Link to={`/profile/${user.id}`}>
               {" "}
               <h6 class="mx-2 my-0 col">{props.user}</h6>
             </Link>
           )}
         </div>
         <p className="my-1">{props.comment}</p>
         <div class="d-flex">
           {stars.map((e, index) => (
             <i key={index} className="fa fa-star" style={{ color: "#a7a700" }} />
           ))}
         </div>
       </div>
     </div>
     <div>
       {response
         .filter((r) => r.rev_id === props.id)
         .map((res) => (
           <div key={res._id} className="res mx-4 my-2">
             <Link to={`/profile/${users.find((u) => res.user === u.username)?.id}`}>
               <h6 class="col">{res.user}</h6>
             </Link>

             {res.comment}
           </div>
         ))}
     </div>
     {currentUser && currentUser.userType === "Director" && props.det && !Repping && (
       <button class="btnx py-0 px-2 mx-4 float-end" onClick={(e) => setRep(true)}>
         Reply
       </button>
     )}
     {Repping && (
       <div class="mx-4 my-2">
         <hr />
         <input
           class="form-control my-2"
           placeholder="Type reply..."
           type="text"
           onChange={(e) => setReply(e.target.value)}
         ></input>{" "}
         <button class="btnx py-0 px-2 float-end" onClick={(e) => setRep(false)}>
           cancel
         </button>
         <button class="btnx py-0 px-2 mx-2 float-end" onClick={(e) => handleSave()}>
           save
         </button>
       </div>
     )}
   </li>
 );
}
export default Review;
