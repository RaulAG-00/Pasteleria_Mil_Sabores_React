import { useState } from "react";
import FormularioUsuario from "../components/FormularioUsuario";
import { useAuth } from "../context/AuthContext";
import { useAviso } from "../context/AvisoContext";
import type { Usuario } from "../types";

// Panel de administración de usuarios: listar, crear, editar y eliminar.
// La ruta está protegida por <RutaAdmin> en App.tsx.
export default function Admin() {
  const { usuarios, guardarUsuario, eliminarUsuario } = useAuth();
  const { mostrarAviso } = useAviso();

  // Usuario que se está editando (null = creando uno nuevo).
  const [editando, setEditando] = useState<Usuario | null>(null);
  // Cambiar la `key` reinicia el formulario (lo deja vacío o con otro usuario).
  const [claveForm, setClaveForm] = useState(0);

  function reiniciarFormulario(usuario: Usuario | null = null): void {
    setEditando(usuario);
    setClaveForm((k) => k + 1);
  }

  function guardar(usuario: Usuario): string {
    const error = guardarUsuario(usuario, editando ? editando.run : "");
    if (error) return error;

    mostrarAviso(editando ? "Usuario actualizado." : "Usuario creado.", "ok");
    reiniciarFormulario();
    return "";
  }

  function editar(usuario: Usuario): void {
    reiniciarFormulario(usuario);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function eliminar(run: string): void {
    const error = eliminarUsuario(run);
    if (error) {
      mostrarAviso(error, "error");
    } else {
      mostrarAviso("Usuario eliminado.", "ok");
      if (editando && editando.run === run) reiniciarFormulario();
    }
  }

  return (
    <main className="admin-pagina">
      <h1 className="titulo-principal">Usuarios</h1>
      <p className="texto-formulario">
        Listar, crear, editar y eliminar usuarios. Mismos campos que el registro público.
      </p>

      <section className="formulario-pagina ancho">
        <h2>{editando ? "Editar usuario" : "Crear usuario"}</h2>
        <FormularioUsuario
          key={claveForm}
          esAdmin
          usuario={editando}
          onGuardar={guardar}
          onCancelar={() => reiniciarFormulario()}
          textoBoton={editando ? "Actualizar usuario" : "Crear usuario"}
        />
      </section>

      <section className="tabla-contenedor">
        <h2>Listado de usuarios</h2>
        <div className="tabla-scroll">
          <table id="tabla-usuarios" className="tabla-admin">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Comuna</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.run}>
                  <td>{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>{u.tipoUsuario}</td>
                  <td>{u.comuna}</td>
                  <td>
                    <button type="button" className="btn btn-pequeno" onClick={() => editar(u)}>
                      Editar
                    </button>
                    <button type="button" className="btn btn-pequeno btn-eliminar" onClick={() => eliminar(u.run)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}