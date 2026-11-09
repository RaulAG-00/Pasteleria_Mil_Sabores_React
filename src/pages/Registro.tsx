import { Link, useNavigate } from "react-router-dom";
import FormularioUsuario from "../components/FormularioUsuario";
import { useAuth } from "../context/AuthContext";
import type { Usuario } from "../types";

export default function Registro() {
  const { registrarCliente } = useAuth();
  const navigate = useNavigate();

  // Devuelve el error (correo/RUN duplicado) o, si todo sale bien,
  // inicia sesión automáticamente y va al Home.
  function guardar(usuario: Usuario): string {
    const error = registrarCliente(usuario);
    if (!error) navigate("/");
    return error;
  }

  return (
    <main className="formulario-pagina ancho">
      <h1 className="titulo-principal">Crear cuenta</h1>
      <p className="texto-formulario">
        El registro usa los mismos datos que crear un usuario en el administrador. Las
        cuentas nuevas se guardan como tipo Cliente.
      </p>

      <FormularioUsuario onGuardar={guardar} textoBoton="Registrarme" />

      <p className="texto-formulario">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </main>
  );
}