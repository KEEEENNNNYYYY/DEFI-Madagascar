import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import CreatePost from "./pages/createPost/create";
import Login from "./pages/login/login";
import Navbar from "./component/navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Accueil</h1>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<CreatePost />} />
      </Routes>
    </>
  );
};

export default App;
