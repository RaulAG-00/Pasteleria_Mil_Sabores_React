import { Link, useParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useProductos } from "../context/ProductosContext";
import { formatearPrecio, urlImagen } from "../utils/formato";

// Ruta: /producto/TC001
export default function ProductoDetalle() {
  const { codigo = "" } = useParams<{ codigo: string }>();
  const { obtenerProducto } = useProductos();
  const { agregar } = useCarrito();
  const producto = obtenerProducto(codigo);

  if (!producto) {
    return (
      <main>
        <section className="detalle-producto">
          <p>No encontramos este producto.</p>
          <Link className="btn" to="/productos">Volver al catálogo</Link>
        </section>
      </main>
    );
  }

  const agotado = producto.stock <= 0;

  return (
    <main>
      <section className="detalle-producto">
        <img src={urlImagen(producto.imagen)} alt={producto.nombre} />
        <div className="detalle-info">
          <p className="detalle-categoria">{producto.categoria}</p>
          <h1>{producto.nombre}</h1>
          <span className="codigo">{producto.codigo}</span>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          <p className="precio">{formatearPrecio(producto.precio)}</p>
          <p className="stock">
            {agotado ? "Producto agotado" : "Unidades disponibles: " + producto.stock}
          </p>
          <button
            type="button"
            className="btn btn-agregar"
            disabled={agotado}
            onClick={() => agregar(producto.codigo)}
          >
            {agotado ? "Sin stock" : "Agregar al carrito"}
          </button>
          <Link className="btn btn-secundario" to="/productos">Seguir comprando</Link>
        </div>
      </section>
    </main>
  );
}