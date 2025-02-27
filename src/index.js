import "./firebase/firebase"; // This should be the first import
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { StaffProvider } from "./context/StaffContext";
import { HeaderProvider } from "./context/HeaderContext";
import ImageViewerContext from "./context/ImageViewerContext";
import { SOSProvider } from "./context/SosContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <HeaderProvider>
        <ImageViewerContext>
          <StaffProvider>
          <SOSProvider>
            <App />
            </SOSProvider>
          </StaffProvider>
        </ImageViewerContext>
      </HeaderProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
