import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Layout from "./scenes/Layout"
import Home from "./scenes/Home";
import UserProfile from "./scenes/UserProfile"
import CreateListing from "./scenes/CreateListing"
import ViewListing from "./scenes/ViewListing";
import EditForm from "./scenes/EditListing";

function App() {
  const user = localStorage.getItem("token");
  return (
    <Routes>
      {/* {user && <Route path="/" exact element={<Main />} />} */}
      {user && <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home route={"/home"} />} />
        <Route path="/userProfile" element={<UserProfile user_id ={user} route={'/home'}/>} />
        <Route path="/createListing" element={<CreateListing />} />
        <Route path="/home" element={<ViewListing />} />
        <Route path="/editListing" element={<EditForm/>}/>
        <Route path="/viewListing" element={<ViewListing />} />
      </Route>}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" exact element={<Navigate replace to="/login" />} />
      <Route path="/home" exact element={<Navigate replace to="/login" />} />
      <Route path="/userProfile" exact element={<Navigate replace to="/login" />} />
      <Route path="/createListing" exact element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
