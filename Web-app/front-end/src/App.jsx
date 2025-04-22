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
import SearchedProfile from "./pages/searchedProfil.jsx/searchedProfil";
import Chat from "./pages/message/chat/chat";
import MessageList from "./pages/message/messageList";

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
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/user/:id" element={<SearchedProfile />} />
        <Route path="/post/:post_id" element={<PostDetail />} />
        <Route path="/messages" element={<MessageList />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </>
  );
};

export default App;
