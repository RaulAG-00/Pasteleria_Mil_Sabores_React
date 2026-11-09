import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Productos from "./pages/Productos";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<main><h1 className="titulo-principal">Pastelería Mil Sabores</h1></main>} />
        <Route path="/productos" element={<Productos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}