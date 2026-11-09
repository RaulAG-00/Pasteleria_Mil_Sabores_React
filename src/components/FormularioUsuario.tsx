import { useState, type ChangeEvent, type FormEvent } from "react";
import { Campo, CampoSelect } from "./Campo";
import { REGIONES_CHILE } from "../data/regiones";
import { formatearRUN, hayErrores, validarUsuario } from "../utils/validaciones";
import type { ErroresUsuario, TipoUsuario, Usuario, ValoresFormularioUsuario } from "../types";

// Formulario compartido por el registro público y el panel de administración
// (mismos campos). En el registro el tipo queda fijo en "Cliente"; en el
// admin se puede elegir Administrador / Cliente / Vendedor.

interface Props {
  esAdmin?: boolean;
  /** Si viene, se está EDITANDO ese usuario. */
  usuario?: Usuario | null;
  /** Recibe el usuario ya validado y devuelve un error (p. ej. correo duplicado) o "". */
  onGuardar: (usuario: Usuario) => string;
  /** Si viene, se muestra el botón Cancelar. */
  onCancelar?: () => void;
  textoBoton: string;
}

const VACIO: ValoresFormularioUsuario = {
  run: "", nombre: "", apellidos: "", correo: "", fechaNacimiento: "",
  tipoUsuario: "", region: "", comuna: "", direccion: "", password: "",
};

export default function FormularioUsuario({
  esAdmin = false, usuario = null, onGuardar, onCancelar, textoBoton,
}: Props) {
  const esEdicion = usuario !== null;
  const [valores, setValores] = useState<ValoresFormularioUsuario>(
    usuario ? { ...usuario, password: "" } : VACIO
  );
  const [errores, setErrores] = useState<ErroresUsuario>({});

  const comunas = REGIONES_CHILE[valores.region] ?? [];

  function cambiar(evento: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = evento.target;
    setValores((actual) => ({ ...actual, [name]: value }));
  }

  // Al cambiar la región, las comunas cambian y se vacía la elegida.
  function cambiarRegion(evento: ChangeEvent<HTMLSelectElement>): void {
    setValores((actual) => ({ ...actual, region: evento.target.value, comuna: "" }));
  }

  function enviar(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();

    const nuevo: ValoresFormularioUsuario = {
      run: formatearRUN(valores.run),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim().toLowerCase(),
      fechaNacimiento: valores.fechaNacimiento,
      tipoUsuario: esAdmin ? valores.tipoUsuario : "Cliente",
      region: valores.region,
      comuna: valores.comuna,
      direccion: valores.direccion.trim(),
      password: valores.password,
    };

    const erroresNuevos = validarUsuario(nuevo, { esEdicion, esAdmin });
    setErrores(erroresNuevos);
    if (hayErrores(erroresNuevos)) return;

    // Tras validar, el tipo ya no puede estar vacío (en el admin es obligatorio).
    const duplicado = onGuardar({ ...nuevo, tipoUsuario: nuevo.tipoUsuario as TipoUsuario });
    if (duplicado) {
      setErrores({ [duplicado.includes("RUN") ? "run" : "correo"]: duplicado });
    }
  }

  return (
    <form className="formulario" noValidate onSubmit={enviar}>
      <div className="fila-form">
        <Campo id="run" label="RUN" maxLength={12} placeholder="12.345.678-5"
          value={valores.run} onChange={cambiar} error={errores.run} />
        <Campo id="correo" label="Correo" type="email" maxLength={100}
          placeholder={esAdmin ? undefined : "correo@gmail.com"}
          value={valores.correo} onChange={cambiar} error={errores.correo} />
      </div>

      <div className="fila-form">
        <Campo id="nombre" label="Nombre" maxLength={50}
          value={valores.nombre} onChange={cambiar} error={errores.nombre} />
        <Campo id="apellidos" label="Apellidos" maxLength={100}
          value={valores.apellidos} onChange={cambiar} error={errores.apellidos} />
      </div>

      {esAdmin ? (
        <div className="fila-form">
          <Campo id="fechaNacimiento" label="Fecha de nacimiento" type="date"
            value={valores.fechaNacimiento} onChange={cambiar} />
          <CampoSelect id="tipoUsuario" label="Tipo de usuario"
            value={valores.tipoUsuario} onChange={cambiar} error={errores.tipoUsuario}>
            <option value="">Selecciona un tipo</option>
            <option value="Administrador">Administrador</option>
            <option value="Cliente">Cliente</option>
            <option value="Vendedor">Vendedor</option>
          </CampoSelect>
        </div>
      ) : (
        <Campo id="fechaNacimiento" label="Fecha de nacimiento (opcional)" type="date"
          ayuda="Si tienes 50 años o más se aplica el descuento FELICES50."
          value={valores.fechaNacimiento} onChange={cambiar} />
      )}

      <div className="fila-form">
        <CampoSelect id="region" label="Región"
          value={valores.region} onChange={cambiarRegion} error={errores.region}>
          <option value="">Selecciona una región</option>
          {Object.keys(REGIONES_CHILE).map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </CampoSelect>
        <CampoSelect id="comuna" label="Comuna"
          value={valores.comuna} onChange={cambiar} error={errores.comuna}>
          <option value="">Selecciona una comuna</option>
          {comunas.map((comuna) => (
            <option key={comuna} value={comuna}>{comuna}</option>
          ))}
        </CampoSelect>
      </div>

      <Campo id="direccion" label="Dirección" maxLength={300}
        value={valores.direccion} onChange={cambiar} error={errores.direccion} />

      <Campo id="password" label="Contraseña" type="password" minLength={4} maxLength={10}
        ayuda={esAdmin ? "Obligatoria al crear. En edición, déjala vacía para no cambiarla." : undefined}
        value={valores.password} onChange={cambiar} error={errores.password} />

      {onCancelar ? (
        <div className="acciones-form">
          <button type="submit" className="btn">{textoBoton}</button>
          <button type="button" className="btn btn-secundario" onClick={onCancelar}>Cancelar</button>
        </div>
      ) : (
        <button type="submit" className="btn">{textoBoton}</button>
      )}
    </form>
  );
}