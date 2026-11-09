import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { PRODUCTOS_INICIALES } from "../data/productos";
import type { ItemCarrito, Producto } from "../types";

// Catálogo con stock. Se guarda en localStorage ("productos") para que,
// al comprar, las unidades bajen y se recuerden al recargar.

type ItemVendido = Pick<ItemCarrito, "codigo" | "cantidad">;

interface ProductosContextValue {
  productos: Producto[];
  obtenerProducto: (codigo: string) => Producto | undefined;
  descontarStock: (items: ItemVendido[]) => void;
}

const ProductosContext = createContext<ProductosContextValue | null>(null);

export function ProductosProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useLocalStorage<Producto[]>("productos", PRODUCTOS_INICIALES);

  function obtenerProducto(codigo: string): Producto | undefined {
    return productos.find((p) => p.codigo === codigo);
  }

  // Lo usa el carrito al comprar.
  function descontarStock(items: ItemVendido[]): void {
    setProductos((actuales) =>
      actuales.map((producto) => {
        const item = items.find((i) => i.codigo === producto.codigo);
        if (!item) return producto;
        return { ...producto, stock: Math.max(0, producto.stock - item.cantidad) };
      })
    );
  }

  return (
    <ProductosContext.Provider value={{ productos, obtenerProducto, descontarStock }}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos(): ProductosContextValue {
  const contexto = useContext(ProductosContext);
  if (!contexto) throw new Error("useProductos debe usarse dentro de <ProductosProvider>");
  return contexto;
}