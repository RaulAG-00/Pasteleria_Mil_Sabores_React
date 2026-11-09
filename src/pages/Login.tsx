import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Campo } from "../components/Campo";
import { useAuth } from "../context/AuthContext";
import { validarCorreo, validarPassword } from "../utils/validaciones";
import type { Errores } from "../types";

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState<Errores<"correo" | "password">>({});

  function enviar(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();

    const erroresNuevos = {
      correo: validarCorreo(correo, true),
      password: validarPassword(password),
    };
    setErrores(erroresNuevos);
    if (erroresNuevos.correo || erroresNuevos.password) return;

    const usuario = iniciarSesion(correo, password);
    if (!usuario) {
      setErrores({ password: "Correo o contraseña incorrectos." });
      return;
    }

    navigate(usuario.tipoUsuario === "Administrador" ? "/admin" : "/");
  }

  return (
    <main className="formulario-pagina">
      <h1 className="titulo-principal">Iniciar sesión</h1>
      <p className="texto-formulario">
        Simulación de acceso sin base de datos. Los usuarios se guardan en este navegador.
      </p>

      <form className="formulario" noValidate onSubmit={enviar}>
        <Campo id="correo" label="Correo" type="email" maxLength={100}
          placeholder="correo@gmail.com"
          value={correo} onChange={(e) => setCorreo(e.target.value)} error={errores.correo} />

        <Campo id="password" label="Contraseña" type="password" minLength={4} maxLength={10}
          placeholder="4 a 10 caracteres"
          value={password} onChange={(e) => setPassword(e.target.value)} error={errores.password} />

        <button type="submit" className="btn">Entrar</button>
      </form>

      <p className="texto-formulario">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>

      <section className="cuentas-demo">
        <h2>Cuentas de prueba</h2>
        <ul>
          <li><strong>Administrador:</strong> admin@gmail.com / admin1</li>
          <li><strong>Cliente:</strong> cliente@gmail.com / 1234</li>
          <li><strong>Estudiante DUOC (20%):</strong> alumno@duoc.cl / duoc1</li>
          <li><strong>Mayor de 50 (50%):</strong> mayor@gmail.com / 1234</li>
        </ul>
      </section>
    </main>
  );
}