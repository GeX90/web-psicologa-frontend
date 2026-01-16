import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProviderWrapper } from "./context/auth.context";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProviderWrapper>
        <App />
      </AuthProviderWrapper>
    </BrowserRouter>
  </StrictMode>
);
