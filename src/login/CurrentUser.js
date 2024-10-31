import { setCurrentUser } from "./UserReducer";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
function CurrentUser({ children }) {
 const dispatch = useDispatch();
 const fetchUser = async () => {
  try {
   const user = await client.account();
   dispatch(setCurrentUser(user));
  } catch (error) {}
 };

 // call fetchUser once when the component mounts, suppress the dep array warning.
 useEffect(() => {
   fetchUser();
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);
 return (
  <div>
   {children}
  </div>
 );
}

export default CurrentUser;
