import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const raiz = document.getElementById("root");
if (!raiz) throw new Error("No se encontró el elemento #root");

ReactDOM.createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>
);