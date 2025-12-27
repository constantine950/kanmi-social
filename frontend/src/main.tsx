import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import Font from "./components/Font.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Font />
    <App />
  </StrictMode>
);
