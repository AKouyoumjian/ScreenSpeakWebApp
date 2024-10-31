import Nav from "../Nav";
import Screening from "./Screening";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import * as client from "../search/client.js";
import { useSelector } from "react-redux";

function Screenings() {
 const { currentUser } = useSelector((state) => state.UserReducer);
 const [open, setOpen] = useState(false);
 const [mov, setMov] = useState("");
 const [dat, setDat] = useState("");

 const [screenings, setScreenings] = useState([]);

 const fetchScreenings = async () => {
  const scs = await client.findAllScreenings();
  setScreenings(scs);
 };

 const handleClose = () => {
  setOpen(false);
 };

 const handleSave = async () => {
  setOpen(false);
  const screen = {
   _id: new Date().getTime().toString(),
   movie_id: mov,
   user: currentUser.username,
   date: dat,
   viewers: [],
  };

  try {
   const newSc = await client.createScreening(screen);
   setScreenings([newSc, ...screenings]);
  } catch (err) {
   console.log(err);
  }
 };

 const handleOpen = () => {
  setOpen(true);
 };

 useEffect(() => {
  fetchScreenings();
 }, []);

 return (
  <div class="px-2 bg-main">
   <Nav />{" "}
   <div className="row">
    <div class="page-title col-8">Screenings</div>
    <div className="col-3 py-2 px-0">
     {currentUser && currentUser.userType === "Director" && (
      <button class="btnx py-0  float-end" onClick={handleOpen}>
       Create New
      </button>
     )}
    </div>
   </div>
   <div class="d-flex row align-items-center"></div>
   <div class="list-group">
    {screenings.map((s) => (
     <Screening
      user={s.user}
      date={s.date}
      viewers={s.viewers}
      movie={s.movie_id}
     />
    ))}
   </div>
   <Modal isOpen={open} onClose={handleClose} className="add">
    <>
     <h3>Add a Screening</h3>
     <label className="my-1">
      {" "}
      Movie ID:{" "}
      <input
       class="form-control"
       placeholder="12"
       onChange={(e) => setMov(e.target.value)}
      ></input>
     </label>
     <div>
      <label className="my-3">
       Date:{" "}
       <input
        onChange={(e) => setDat(e.target.value)}
        type="date"
        placeholder="10-10-2024"
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
 );
}
export default Screenings;
