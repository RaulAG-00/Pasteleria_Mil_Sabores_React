import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";

interface Props {
  titulo: string;
}

export default function Header({ titulo }: Props) {
  const { sesion, esAdministrador, cerrarSesion } = useAuth();
  const { cantidadTotal } = useCarrito();

  return (
    <header id="header">
      <h2>{titulo}</h2>

      <nav className="navbar">
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/contacto">Contacto</Link>
          {esAdministrador && <Link to="/admin">Admin</Link>}
        </div>
      </nav>

      <nav className="navbar">
        <div className="links">
          {sesion && <span className="saludo-usuario">Hola, {sesion.nombre}</span>}
          {!sesion && <Link to="/registro">Registrarse</Link>}
          {sesion ? (
            <Link to="/" onClick={cerrarSesion}>Cerrar sesión</Link>
          ) : (
            <Link to="/login">Iniciar sesión</Link>
          )}
          <Link to="/carrito">🛒Carrito ({cantidadTotal})</Link>
        </div>
      </nav>
    </header>
  );
}