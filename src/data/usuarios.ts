import type { Usuario } from "../types";

// Cuentas de prueba: se crean la primera vez que se abre el sitio.
export const USUARIOS_INICIALES: Usuario[] = [
  { run: "11.111.111-1", nombre: "Ana", apellidos: "Administradora", correo: "admin@gmail.com", fechaNacimiento: "1985-03-12", tipoUsuario: "Administrador", region: "Metropolitana de Santiago", comuna: "Santiago", direccion: "Av. Providencia 1000", password: "admin1" },
  { run: "22.222.222-2", nombre: "Carlos", apellidos: "Cliente", correo: "cliente@gmail.com", fechaNacimiento: "1992-07-20", tipoUsuario: "Cliente", region: "Metropolitana de Santiago", comuna: "Ñuñoa", direccion: "Irarrázaval 2500", password: "1234" },
  { run: "33.333.333-3", nombre: "Daniela", apellidos: "Estudiante", correo: "alumno@duoc.cl", fechaNacimiento: "2003-11-05", tipoUsuario: "Cliente", region: "Valparaíso", comuna: "Viña del Mar", direccion: "Av. Libertad 400", password: "duoc1" },
  { run: "44.444.444-4", nombre: "Elena", apellidos: "Mayor", correo: "mayor@gmail.com", fechaNacimiento: "1968-01-30", tipoUsuario: "Cliente", region: "Metropolitana de Santiago", comuna: "Maipú", direccion: "Pajaritos 2100", password: "1234" },
];