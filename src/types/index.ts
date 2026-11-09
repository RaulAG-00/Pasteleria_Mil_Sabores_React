// Modelos de dominio compartidos por toda la aplicación.

// ---------- Catálogo ----------
export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  /** Solo el nombre del archivo dentro de public/images */
  imagen: string;
  descripcion: string;
}

export interface CategoriaInfo {
  /** Ancla de la URL: /productos?categoria=<slug> */
  slug: string;
  etiqueta: string;
  /** Nombre exacto de la categoría que usan los productos */
  categoria: string;
  icono: string;
}

// ---------- Usuarios y sesión ----------
export type TipoUsuario = "Administrador" | "Cliente" | "Vendedor";

export interface Usuario {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  /** Formato YYYY-MM-DD (puede ir vacío) */
  fechaNacimiento: string;
  tipoUsuario: TipoUsuario;
  region: string;
  comuna: string;
  direccion: string;
  password: string;
}

/** Lo que se guarda al iniciar sesión: nunca incluye la contraseña. */
export type Sesion = Pick<
  Usuario,
  "run" | "nombre" | "apellidos" | "correo" | "fechaNacimiento" | "tipoUsuario"
>;

/** Valores del formulario de usuario: el tipo puede estar sin elegir (""). */
export type ValoresFormularioUsuario = Omit<Usuario, "tipoUsuario"> & {
  tipoUsuario: TipoUsuario | "";
};

// ---------- Carrito ----------
export interface ItemCarrito {
  codigo: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

export interface Descuento {
  porcentaje: number;
  nombre: string;
}

export interface TotalesCarrito {
  subtotal: number;
  descuento: Descuento;
  montoDescuento: number;
  total: number;
}

export interface ResultadoCompra {
  ok: boolean;
  requiereLogin?: boolean;
}

// ---------- Interfaz ----------
export type TipoAviso = "ok" | "error";

/** Mensajes de error por campo; un campo sin error no aparece o va vacío. */
export type Errores<Campo extends string> = Partial<Record<Campo, string>>;

export type ErroresUsuario = Errores<keyof Usuario>;

export interface MensajeContacto {
  nombre: string;
  correo: string;
  comentario: string;
  /** Fecha ISO */
  fecha: string;
}
