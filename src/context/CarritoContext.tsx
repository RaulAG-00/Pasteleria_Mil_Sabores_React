import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { useAuth } from "./AuthContext";
import { useProductos } from "./ProductosContext";
import { useAviso } from "./AvisoContext";
import { calcularEdad, formatearMonto } from "../utils/formato";
import type { Descuento, ItemCarrito, ResultadoCompra, TotalesCarrito } from "../types";

// CARRITO DE COMPRAS
// Se guarda en localStorage ("carrito"), así que sobrevive a recargas y
// cambios de página.
//
// Reglas de negocio:
//  1. Unicidad: si el producto ya está, se suma 1 a la cantidad.
//  2. Stock: no se puede pedir más unidades que las disponibles.
//  3. Agotado: con stock 0 no se puede agregar.
//  4. Mínimo: la cantidad no baja de 1 (para sacarlo se usa Eliminar).
//  5. FELICES50: 50% si el usuario logueado tiene 50 años o más.
//  6. DUOC: 20% si el correo termina en @duoc.cl (no @profesor.duoc.cl).
//  7. Si aplican ambos descuentos se usa el MAYOR (no se suman).
//  8. Comprar exige sesión iniciada y descuenta el stock del catálogo.

interface CarritoContextValue {
  carrito: ItemCarrito[];
  cantidadTotal: number;
  totales: TotalesCarrito;
  agregar: (codigo: string) => void;
  aumentar: (codigo: string) => void;
  disminuir: (codigo: string) => void;
  eliminar: (codigo: string) => void;
  comprar: () => ResultadoCompra;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useLocalStorage<ItemCarrito[]>("carrito", []);
  const { sesion } = useAuth();
  const { obtenerProducto, descontarStock } = useProductos();
  const { mostrarAviso } = useAviso();

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  function agregar(codigo: string): void {
    const producto = obtenerProducto(codigo);

    if (!producto) {
      mostrarAviso("No se encontró el producto.", "error");
      return;
    }
    if (producto.stock <= 0) {
      mostrarAviso("Este producto está agotado.", "error");
      return;
    }

    const existente = carrito.find((item) => item.codigo === codigo);
    const cantidadActual = existente ? existente.cantidad : 0;

    if (cantidadActual + 1 > producto.stock) {
      mostrarAviso("No hay más stock disponible de este producto.", "error");
      return;
    }

    if (existente) {
      setCarrito(carrito.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([
        ...carrito,
        {
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          cantidad: 1,
        },
      ]);
    }
    mostrarAviso(producto.nombre + " se agregó al carrito.", "ok");
  }

  function aumentar(codigo: string): void {
    const item = carrito.find((i) => i.codigo === codigo);
    if (!item) return;

    const stock = obtenerProducto(codigo)?.stock ?? 0;
    if (item.cantidad + 1 > stock) {
      mostrarAviso("Alcanzaste el stock máximo de este producto.", "error");
      return;
    }
    setCarrito(carrito.map((i) =>
      i.codigo === codigo ? { ...i, cantidad: i.cantidad + 1 } : i
    ));
  }

  function disminuir(codigo: string): void {
    setCarrito(carrito.map((i) =>
      i.codigo === codigo && i.cantidad > 1 ? { ...i, cantidad: i.cantidad - 1 } : i
    ));
  }

  function eliminar(codigo: string): void {
    setCarrito(carrito.filter((i) => i.codigo !== codigo));
  }

  // ---------- Descuentos y totales ----------
  const totales = useMemo<TotalesCarrito>(() => {
    const subtotal = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

    let descuento: Descuento = { porcentaje: 0, nombre: "" };

    if (sesion) {
      const edad = calcularEdad(sesion.fechaNacimiento);
      const esDuoc =
        /@duoc\.cl$/i.test(sesion.correo) && !/@profesor\.duoc\.cl$/i.test(sesion.correo);

      if (edad !== null && edad >= 50) {
        descuento = { porcentaje: 50, nombre: "FELICES50 (50 años o más)" };
      } else if (esDuoc) {
        descuento = { porcentaje: 20, nombre: "Descuento estudiante DUOC" };
      }
    }

    const montoDescuento = Math.round(subtotal * (descuento.porcentaje / 100));
    return { subtotal, descuento, montoDescuento, total: subtotal - montoDescuento };
  }, [carrito, sesion]);

  // ---------- Comprar ----------
  // Pasos: carrito con cosas -> usuario logueado -> stock suficiente
  // -> descontar stock -> vaciar carrito -> aviso de éxito.
  function comprar(): ResultadoCompra {
    if (carrito.length === 0) {
      mostrarAviso("Tu carrito está vacío.", "error");
      return { ok: false };
    }

    if (!sesion) {
      mostrarAviso("Inicia sesión para completar la compra.", "error");
      return { ok: false, requiereLogin: true };
    }

    for (const item of carrito) {
      const stock = obtenerProducto(item.codigo)?.stock ?? 0;
      if (item.cantidad > stock) {
        mostrarAviso("No hay stock suficiente de " + item.nombre + ".", "error");
        return { ok: false };
      }
    }

    descontarStock(carrito);
    setCarrito([]);
    mostrarAviso("Compra realizada por " + formatearMonto(totales.total) + ".", "ok");
    return { ok: true };
  }

  const valor: CarritoContextValue = {
    carrito, cantidadTotal, totales, agregar, aumentar, disminuir, eliminar, comprar,
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): CarritoContextValue {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return contexto;
}