// 45000 -> "$45.000 CLP"
export function formatearPrecio(valor: number): string {
  return "$" + Number(valor).toLocaleString("es-CL") + " CLP";
}

// 45000 -> "$45.000"
export function formatearMonto(valor: number): string {
  return "$" + Number(valor).toLocaleString("es-CL");
}

// Arma la ruta de una imagen de public/images (funciona aunque el sitio
// se publique dentro de una subcarpeta).
export function urlImagen(nombre: string): string {
  return `${import.meta.env.BASE_URL}images/${nombre}`;
}

// Edad en años cumplidos a partir de "YYYY-MM-DD" (para el descuento FELICES50).
// Devuelve null si no hay fecha.
export function calcularEdad(fechaNacimiento: string | null | undefined): number | null {
  if (!fechaNacimiento) return null;

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento + "T00:00:00");
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
