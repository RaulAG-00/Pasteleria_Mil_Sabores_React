import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AvisoProvider } from "./context/AvisoContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductosProvider } from "./context/ProductosContext";
import { CarritoProvider } from "./context/CarritoContext";
import "./index.css";

const raiz = document.getElementById("root");
if (!raiz) throw new Error("No se encontró el elemento #root");

// HashRouter (URLs tipo /#/productos) funciona en cualquier hosting estático,
// también al recargar la página. Si tu servidor redirige todo a index.html,
// puedes cambiarlo por BrowserRouter.
//
// Orden de los proveedores: cada uno usa a los que están por fuera de él
// (Carrito necesita Auth, Productos y Aviso).
ReactDOM.createRoot(raiz).render(
  <StrictMode>
    <HashRouter>
      <AvisoProvider>
        <AuthProvider>
          <ProductosProvider>
            <CarritoProvider>
              <App />
            </CarritoProvider>
          </ProductosProvider>
        </AuthProvider>
      </AvisoProvider>
    </HashRouter>
  </StrictMode>
);