import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto";
import { useProductos } from "../context/ProductosContext";
import { CATEGORIAS } from "../data/productos";
import type { Producto } from "../types";

// Agrupa el arreglo plano en { "Tortas Cuadradas": [...], "Veganos": [...] }
function agruparPorCategoria(productos: Producto[]): Map<string, Producto[]> {
  const grupos = new Map<string, Producto[]>();
  productos.forEach((producto) => {
    const lista = grupos.get(producto.categoria) ?? [];
    lista.push(producto);
    grupos.set(producto.categoria, lista);
  });
  return grupos;
}

export default function Productos() {
  const { productos } = useProductos();
  const [params] = useSearchParams();
  const categoria = params.get("categoria");
  const grupos = agruparPorCategoria(productos);

  // /productos?categoria=vegana baja hasta esa sección.
  useEffect(() => {
    if (!categoria) return;
    document.getElementById(categoria)?.scrollIntoView({ behavior: "smooth" });
  }, [categoria]);

  return (
    <main>
      <section className="productos">
        <h1 className="titulo-principal">Nuestros Productos</h1>

        {[...grupos.entries()].map(([nombre, lista]) => {
          const slug = CATEGORIAS.find((c) => c.categoria === nombre)?.slug;
          return (
            <section key={nombre} id={slug} className="categoria-productos">
              <h2>{nombre}</h2>
              <div className="productos-container">
                {lista.map((producto) => (
                  <TarjetaProducto key={producto.codigo} producto={producto} />
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}