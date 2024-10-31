import "./App.css";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Home from "./home/Home";
import Screenings from "./screenings/Screenings";
import Search from "./search/Search";
import Profile from "./profile/Profile";
import Details from "./search/Details";
import ProfileEditor from "./profile/ProfileEditor";
import Signin from "./login/Signin";
import Signup from "./login/Signup";
import { Provider } from "react-redux";
import store from "./store";
import SearchRes from "./search/SearchRes";
import CurrentUser from "./login/CurrentUser"
import UpcomingMovies from "./home/UpcomingMovies";
import TrendingMovies from "./home/TrendingMovies";
import PopularMovies from "./home/PopularMovies";
function App() {
 return (
   <Provider store={store}>
     <CurrentUser>
       <HashRouter>
         <div class="body">
           <Routes>
             <Route path="/login/*" element={<Signin />} />
             <Route path="/register/*" element={<Signup />} />
             <Route path="/" element={<Home />} />
             <Route path="/upcoming" element={<UpcomingMovies />} />
             <Route path="/trending" element={<TrendingMovies />} />
             <Route path="/popular" element={<PopularMovies />} />
             <Route path="/screenings/*" element={<Screenings />} />
             <Route path="/search/" element={<Search />} />
             <Route path="/result/:que" element={<SearchRes />} />
             <Route path="/profile" element={<Profile />} />
             <Route path="/profile/:uId" element={<Profile />} />
             <Route path="/profile/noUser" element={<Signin />} />
             <Route path="/profile/profileEditor/:uId" element={<ProfileEditor />} />
             <Route path="/details/:id" element={<Details />} />
           </Routes>
         </div>
       </HashRouter>
     </CurrentUser>
   </Provider>
 );
}

export default App;
