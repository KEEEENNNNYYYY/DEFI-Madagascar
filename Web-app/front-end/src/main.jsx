import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext"; // 👈 ajoute cette ligne

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 👈 enveloppe App ici */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
