import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 users: [],
 user: {
  name: "Name",
  id: 0,
  followers: [],
  following: [],
  bio: "Biography",
  profilePicture: "URL",
  userType: "Typical User",
  reviews: [],
  like: [],
  addedMovies: [],
  responsesToReviews: [],
  email: "example@email.com",
  phoneNumber: "987-654-3210",
  address: "10 Example Street, City, State, Country",
 },
};

const profileSlice = createSlice({
 name: "profile",
 initialState,
 reducers: {
  updateUser: (state, action) => {
   state.users = state.users.map((user) => {
    if (user._id === action.payload._id) {
     return action.payload;
    } else {
     return user;
    }
   });
  },
  selectUser: (state, action) => {
   state.user = action.payload;
  },
 },
});

export const { updateUser, selectUser } = profileSlice.actions;
export default profileSlice.reducer;
