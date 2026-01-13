import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx.js";
import Font from "./components/Font.tsx.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Font />
    <App />
  </StrictMode>
);
