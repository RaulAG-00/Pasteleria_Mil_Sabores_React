import type { CategoriaInfo, Producto } from "../types";

// Catálogo inicial. En `imagen` va solo el nombre del archivo que está en
// public/images; la ruta completa se arma con urlImagen() (utils/formato.ts).
export const PRODUCTOS_INICIALES: Producto[] = [
  { codigo: "TC001", nombre: "Torta Cuadrada de Chocolate", categoria: "Tortas Cuadradas", precio: 45000, stock: 12, imagen: "torta-cuadrada-chocolate.jpg", descripcion: "Bizcocho de chocolate húmedo, relleno de ganache y cubierto con frosting de cacao. Ideal para celebraciones familiares." },
  { codigo: "TC002", nombre: "Torta Cuadrada de Frutas", categoria: "Tortas Cuadradas", precio: 50000, stock: 10, imagen: "torta-cuadrada-frutas.jpg", descripcion: "Torta de vainilla con crema pastelera y frutas de estación. Fresca, colorida y perfecta para meriendas." },
  { codigo: "TT001", nombre: "Torta Circular de Vainilla", categoria: "Tortas Circulares", precio: 40000, stock: 14, imagen: "torta-circular-vainilla.jpg", descripcion: "Clásica torta circular de vainilla con manjar y merengue. Receta tradicional de la casa." },
  { codigo: "TT002", nombre: "Torta Circular de Manjar", categoria: "Tortas Circulares", precio: 42000, stock: 11, imagen: "torta-circular-manjar.jpg", descripcion: "Elaborada con manjar casero y nueces de la zona central, siguiendo la receta artesanal chilena." },
  { codigo: "PI001", nombre: "Mousse de Chocolate", categoria: "Postres Individuales", precio: 5000, stock: 30, imagen: "mousse-chocolate.jpg", descripcion: "Postre individual aireado de chocolate belga. Porción lista para servir." },
  { codigo: "PI002", nombre: "Tiramisú Clásico", categoria: "Postres Individuales", precio: 5500, stock: 24, imagen: "tiramisu-clasico.jpg", descripcion: "Tiramisú en vaso con café, cacao y crema de mascarpone. Receta italiana adaptada en la pastelería." },
  { codigo: "PSA001", nombre: "Torta Sin Azúcar de Naranja", categoria: "Productos Sin Azúcar", precio: 48000, stock: 8, imagen: "torta-sin-azucar-naranja.jpg", descripcion: "Torta de naranja endulzada con sucralosa. Pensada para quienes cuidan el consumo de azúcar." },
  { codigo: "PSA002", nombre: "Cheesecake Sin Azúcar", categoria: "Productos Sin Azúcar", precio: 47000, stock: 9, imagen: "cheesecake-sin-azucar.jpg", descripcion: "Cheesecake cremoso sin azúcar añadida, con base de galleta y cobertura de berries." },
  { codigo: "PT001", nombre: "Empanada de Manzana", categoria: "Pastelería Tradicional", precio: 3000, stock: 40, imagen: "empanada-manzana.jpg", descripcion: "Empanada hojaldrada rellena de manzana especiada con canela. Receta criolla chilena." },
  { codigo: "PT002", nombre: "Tarta de Santiago", categoria: "Pastelería Tradicional", precio: 6000, stock: 18, imagen: "tarta-santiago.jpg", descripcion: "Tarta de almendras inspirada en la repostería española, coronada con la Cruz de Santiago." },
  { codigo: "PG001", nombre: "Brownie Sin Gluten", categoria: "Productos Sin Gluten", precio: 4000, stock: 22, imagen: "brownie-sin-gluten.jpg", descripcion: "Brownie húmedo elaborado con harina de almendras. Sin gluten y con intenso sabor a cacao." },
  { codigo: "PG002", nombre: "Pan Sin Gluten", categoria: "Productos Sin Gluten", precio: 3500, stock: 16, imagen: "pan-sin-gluten.jpg", descripcion: "Pan de molde sin gluten, suave y listo para acompañar meriendas o desayunos." },
  { codigo: "PV001", nombre: "Torta Vegana de Chocolate", categoria: "Productos Veganos", precio: 50000, stock: 7, imagen: "torta-vegana-chocolate.jpg", descripcion: "Torta de chocolate sin ingredientes de origen animal. Esponjosa y con cobertura de cacao." },
  { codigo: "PV002", nombre: "Galletas Veganas de Avena", categoria: "Productos Veganos", precio: 4500, stock: 28, imagen: "galletas-veganas-avena.jpg", descripcion: "Galletas crocantes de avena, pasas y chía. Envase de 6 unidades." },
  { codigo: "TE001", nombre: "Torta Especial de Cumpleaños", categoria: "Tortas Especiales", precio: 55000, stock: 6, imagen: "torta-especial-cumpleanos.jpg", descripcion: "Torta decorada para cumpleaños, con relleno a elección y diseño personalizado al encargar." },
  { codigo: "TE002", nombre: "Torta Especial de Boda", categoria: "Tortas Especiales", precio: 60000, stock: 4, imagen: "torta-especial-boda.jpg", descripcion: "Torta de dos pisos para matrimonios, con flores de azúcar y relleno de frutas o manjar." },
];

// Categorías del Home y anclas del catálogo.
export const CATEGORIAS: CategoriaInfo[] = [
  { slug: "tortas-cuadradas", etiqueta: "Tortas Cuadradas", categoria: "Tortas Cuadradas", icono: "🎂" },
  { slug: "tortas-circulares", etiqueta: "Tortas Circulares", categoria: "Tortas Circulares", icono: "🍰" },
  { slug: "individuales", etiqueta: "Individuales", categoria: "Postres Individuales", icono: "🧁" },
  { slug: "sin-azucar", etiqueta: "Sin Azúcar", categoria: "Productos Sin Azúcar", icono: "🍊" },
  { slug: "tradicional", etiqueta: "Tradicional", categoria: "Pastelería Tradicional", icono: "🥧" },
  { slug: "sin-gluten", etiqueta: "Sin Gluten", categoria: "Productos Sin Gluten", icono: "🌾" },
  { slug: "vegana", etiqueta: "Vegana", categoria: "Productos Veganos", icono: "🌱" },
  { slug: "especiales", etiqueta: "Especiales", categoria: "Tortas Especiales", icono: "🎉" },
];

export const CODIGOS_DESTACADOS: string[] = ["TT002", "PI002", "PSA002"];