import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<main><h1 className="titulo-principal">Pastelería Mil Sabores</h1></main>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}