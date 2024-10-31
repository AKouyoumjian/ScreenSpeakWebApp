import { setCurrentUser } from "./UserReducer";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
function CurrentUser({ children }) {
 const [user, setUser] = useState(null);
 const dispatch = useDispatch();
 const fetchUser = async () => {
  try {
   const user = await client.account();
   setUser(user);
   dispatch(setCurrentUser(user));
  } catch (error) {}
 };
 useEffect(() => {
  fetchUser();
 }, []);
 return (
  <div>
   {children}
  </div>
 );
}

export default CurrentUser;
