import Nav from "../Nav";
import { Link } from "react-router-dom";
import { useState } from "react";

function Search() {
 const [term, setTerm] = useState();

 return (
  <div className="px-2 bg-main">
   {" "}
   <Nav /> <div className="page-title">Search</div>
   <div className="d-flex align-items-center">
    {" "}
    <input
     placeholder="Search movies by title..."
     className=" form-control m-2 py-1"
     onChange={(e) => setTerm(e.target.value)}
    />
    <Link to={`/result/${term}`}>
     <button className="btnx py-0">Search</button>
    </Link>
   </div>
   <div className="list-group"></div>
  </div>
 );
}
export default Search;
