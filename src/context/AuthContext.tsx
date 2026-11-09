import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { USUARIOS_INICIALES } from "../data/usuarios";
import { limpiarRUN } from "../utils/validaciones";
import type { Sesion, Usuario } from "../types";

// Usuarios + sesión (simulación sin base de datos, todo en localStorage).
//   "usuarios" -> lista de cuentas
//   "sesion"   -> quién está logueado (sin contraseña) o nada

interface AuthContextValue {
  usuarios: Usuario[];
  sesion: Sesion | null;
  esAdministrador: boolean;
  iniciarSesion: (correo: string, password: string) => Usuario | null;
  cerrarSesion: () => void;
  /** Devuelve un mensaje de error o "" si todo salió bien. */
  registrarCliente: (usuario: Usuario) => string;
  /** Crea (runOriginal vacío) o actualiza. Devuelve un error o "". */
  guardarUsuario: (usuario: Usuario, runOriginal?: string) => string;
  /** Devuelve un error o "" si se eliminó. */
  eliminarUsuario: (run: string) => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// En la sesión NO se guarda la contraseña.
function sesionDesdeUsuario(usuario: Usuario): Sesion {
  return {
    run: usuario.run,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    fechaNacimiento: usuario.fechaNacimiento,
    tipoUsuario: usuario.tipoUsuario,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>("usuarios", USUARIOS_INICIALES);
  const [sesion, setSesion] = useLocalStorage<Sesion | null>("sesion", null);

  const esAdministrador = sesion?.tipoUsuario === "Administrador";

  // Devuelve el usuario si correo y contraseña coinciden; si no, null.
  function iniciarSesion(correo: string, password: string): Usuario | null {
    const usuario = usuarios.find(
      (u) => u.correo === correo.trim().toLowerCase() && u.password === password
    );
    if (!usuario) return null;

    setSesion(sesionDesdeUsuario(usuario));
    return usuario;
  }

  function cerrarSesion(): void {
    setSesion(null);
  }

  // Evita dos cuentas con el mismo correo o RUN. runOriginal se usa al
  // editar para que el usuario no "choque" consigo mismo.
  function usuarioDuplicado(usuario: Usuario, runOriginal = ""): string {
    const mismoCorreo = usuarios.some(
      (u) => u.correo === usuario.correo && u.run !== runOriginal
    );
    if (mismoCorreo) return "Ya existe un usuario con ese correo.";

    const mismoRun = usuarios.some(
      (u) => limpiarRUN(u.run) === limpiarRUN(usuario.run) && u.run !== runOriginal
    );
    if (mismoRun) return "Ya existe un usuario con ese RUN.";

    return "";
  }

  // Registro público: siempre Cliente y entra con sesión iniciada.
  function registrarCliente(usuario: Usuario): string {
    const error = usuarioDuplicado(usuario);
    if (error) return error;

    setUsuarios([...usuarios, usuario]);
    setSesion(sesionDesdeUsuario(usuario));
    return "";
  }

  // Panel admin: crea o actualiza un usuario.
  function guardarUsuario(usuario: Usuario, runOriginal = ""): string {
    const error = usuarioDuplicado(usuario, runOriginal);
    if (error) return error;

    if (runOriginal) {
      const anterior = usuarios.find((u) => u.run === runOriginal);
      if (!anterior) return "No se encontró el usuario a editar.";

      // Si dejan la contraseña vacía, se mantiene la anterior.
      const actualizado: Usuario = { ...usuario, password: usuario.password || anterior.password };
      setUsuarios(usuarios.map((u) => (u.run === runOriginal ? actualizado : u)));

      // Si el administrador se edita a sí mismo, la sesión refleja el cambio.
      if (sesion?.run === runOriginal) setSesion(sesionDesdeUsuario(actualizado));
    } else {
      setUsuarios([...usuarios, usuario]);
    }
    return "";
  }

  function eliminarUsuario(run: string): string {
    if (sesion?.run === run) return "No puedes eliminar tu propio usuario.";
    setUsuarios(usuarios.filter((u) => u.run !== run));
    return "";
  }

  const valor: AuthContextValue = {
    usuarios,
    sesion,
    esAdministrador,
    iniciarSesion,
    cerrarSesion,
    registrarCliente,
    guardarUsuario,
    eliminarUsuario,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}