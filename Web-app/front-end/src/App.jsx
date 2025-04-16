import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import CreatePost from "./pages/createPost/create";
import Login from "./pages/login/login";
import Navbar from "./component/navbar";
import Profile from "./pages/profile/profile";
import PostDetail from "./pages/postDetails/postDetail";
import SearchBar from "./component/searchBar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Accueil</h1>
              <SearchBar />
            </>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} /> {/* connecté */}
        <Route path="/user/:id" element={<Profile />} /> {/* profil public */}
        <Route path="/post/:post_id" element={<PostDetail />} />
      </Routes>
    </>
  );
};

export default App;
