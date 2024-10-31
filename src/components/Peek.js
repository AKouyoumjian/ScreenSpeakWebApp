import { React, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Peek({ props }) {
 return (
  <li class="round  my-1">
   <div class="grid row d-flex align-items-center">
    <div class="my-2 peek col-11">
     <img src={`https://image.tmdb.org/t/p/w300/${props.poster}`}></img>
     <h6>{props.title}</h6>
     <p>Release Date: {props.release}</p>
    </div>

    <i className="fa fa-chevron-right float-end col-1"></i>
   </div>
  </li>
 );
}
export default Peek;
