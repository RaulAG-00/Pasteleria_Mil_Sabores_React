import type { ErroresUsuario, ValoresFormularioUsuario } from "../types";

// Validaciones compartidas. Cada función devuelve "" si el dato está bien
// o un texto con el error si está mal.

export function largoMaximo(valor: string, maximo: number): boolean {
  return String(valor).trim().length <= maximo;
}

export function largoEntre(valor: string, minimo: number, maximo: number): boolean {
  const largo = String(valor).length;
  return largo >= minimo && largo <= maximo;
}

// ---------- Correo ----------
// Máximo 100 caracteres y solo @duoc.cl, @profesor.duoc.cl o @gmail.com.
export function correoPermitido(correo: string): boolean {
  const valor = String(correo).trim().toLowerCase();
  if (!valor || valor.length > 100) return false;
  return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(valor);
}

// obligatorio = true  -> login y registro
// obligatorio = false -> contacto (puede ir vacío)
export function validarCorreo(correo: string, obligatorio: boolean): string {
  const valor = String(correo || "").trim();

  if (!valor) {
    return obligatorio ? "El correo es obligatorio." : "";
  }
  if (!largoMaximo(valor, 100)) {
    return "El correo no puede superar los 100 caracteres.";
  }
  if (!correoPermitido(valor)) {
    return "Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com.";
  }
  return "";
}

// ---------- Contraseña (4 a 10 caracteres) ----------
export function validarPassword(password: string): string {
  const valor = String(password || "");

  if (!valor) return "La contraseña es obligatoria.";
  if (!largoEntre(valor, 4, 10)) {
    return "La contraseña debe tener entre 4 y 10 caracteres.";
  }
  return "";
}

// ---------- Nombre / apellidos / dirección ----------
export function validarNombre(nombre: string, maximo: number, etiqueta = "El nombre"): string {
  const valor = String(nombre || "").trim();

  if (!valor) return etiqueta + " es obligatorio.";
  if (!largoMaximo(valor, maximo)) {
    return etiqueta + " no puede superar los " + maximo + " caracteres.";
  }
  return "";
}

// ---------- RUN chileno ----------
export function limpiarRUN(run: string): string {
  return String(run || "").replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
}

// 123456785 -> 12.345.678-5
export function formatearRUN(run: string): string {
  const limpio = limpiarRUN(run);
  if (limpio.length < 2) return run;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
}

export function runValido(run: string): boolean {
  const limpio = limpiarRUN(run);
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

export function validarRUN(run: string): string {
  const valor = String(run || "").trim();

  if (!valor) return "El RUN es obligatorio.";
  if (!runValido(valor)) {
    return "Ingresa un RUN chileno válido, por ejemplo 12.345.678-5.";
  }
  return "";
}

// ---------- Contacto ----------
export function validarComentario(comentario: string): string {
  const valor = String(comentario || "").trim();

  if (!valor) return "El comentario es obligatorio.";
  if (valor.length > 500) return "El comentario no puede superar los 500 caracteres.";
  return "";
}

// ---------- Formulario de usuario (registro y admin) ----------
interface OpcionesValidacionUsuario {
  esEdicion: boolean;
  esAdmin: boolean;
}

export function validarUsuario(
  usuario: ValoresFormularioUsuario,
  { esEdicion, esAdmin }: OpcionesValidacionUsuario
): ErroresUsuario {
  const errores: ErroresUsuario = {
    run: validarRUN(usuario.run),
    nombre: validarNombre(usuario.nombre, 50, "El nombre"),
    apellidos: validarNombre(usuario.apellidos, 100, "Los apellidos"),
    correo: validarCorreo(usuario.correo, true),
    region: usuario.region ? "" : "La región es obligatoria.",
    comuna: usuario.comuna ? "" : "La comuna es obligatoria.",
    direccion: validarNombre(usuario.direccion, 300, "La dirección"),
    password: "",
  };

  // Al editar, si dejan la contraseña vacía se mantiene la anterior.
  if (!esEdicion || usuario.password) {
    errores.password = validarPassword(usuario.password);
  }

  if (esAdmin && !usuario.tipoUsuario) {
    errores.tipoUsuario = "El tipo de usuario es obligatorio.";
  }

  return errores;
}

export function hayErrores(errores: Record<string, string | undefined>): boolean {
  return Object.values(errores).some(Boolean);
}