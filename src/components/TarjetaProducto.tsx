import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { formatearPrecio, urlImagen } from "../utils/formato";
import type { Producto } from "../types";

interface Props {
  producto: Producto;
  /** Versión del Home: sin stock ni enlace al detalle. */
  compacta?: boolean;
}

export default function TarjetaProducto({ producto, compacta = false }: Props) {
  const { agregar } = useCarrito();
  const agotado = producto.stock <= 0;

  const cabecera = (
    <>
      <img src={urlImagen(producto.imagen)} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
    </>
  );

  return (
    <div className={`producto ${agotado ? "agotado" : ""}`}>
      {compacta ? cabecera : <Link to={`/producto/${producto.codigo}`}>{cabecera}</Link>}

      <span className="codigo">{producto.codigo}</span>
      <span className="precio">{formatearPrecio(producto.precio)}</span>
      {!compacta && (
        <span className="stock">{agotado ? "Agotado" : "Stock: " + producto.stock}</span>
      )}

      <button
        type="button"
        className="btn btn-agregar"
        disabled={agotado}
        onClick={() => agregar(producto.codigo)}
      >
        {agotado ? "Sin stock" : compacta ? "Añadir al 🛒" : "Agregar al carrito"}
      </button>
    </div>
  );
}