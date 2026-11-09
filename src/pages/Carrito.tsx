import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { formatearMonto, urlImagen } from "../utils/formato";

export default function Carrito() {
  const { carrito, totales, aumentar, disminuir, eliminar, comprar } = useCarrito();
  const navigate = useNavigate();

  function finalizarCompra(): void {
    const resultado = comprar();
    if (resultado.requiereLogin) navigate("/login");
  }

  return (
    <section className="carrito-pagina">
      <h1>Mi Carrito</h1>

      <div className="carrito-contenedor">
        <div className="lista-carrito">
          <h2>Productos</h2>
          <div id="productos-carrito">
            {carrito.length === 0 && <p>Tu carrito está vacío.</p>}

            {carrito.map((item) => (
              <div key={item.codigo} className="producto-carrito">
                <img src={urlImagen(item.imagen)} alt={item.nombre} className="imagen-carrito" />
                <div className="info-carrito">
                  <h3>{item.nombre}</h3>
                  <p>Código: {item.codigo}</p>
                  <p>Precio: {formatearMonto(item.precio)}</p>

                  <div className="cantidad-producto">
                    <button type="button" className="btn btn-cantidad"
                      aria-label="Disminuir cantidad" onClick={() => disminuir(item.codigo)}>−</button>
                    <span>{item.cantidad}</span>
                    <button type="button" className="btn btn-cantidad"
                      aria-label="Aumentar cantidad" onClick={() => aumentar(item.codigo)}>+</button>
                  </div>

                  <p className="subtotal">
                    Subtotal: {formatearMonto(item.precio * item.cantidad)}
                  </p>
                  <button type="button" className="btn btn-eliminar" onClick={() => eliminar(item.codigo)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resumen-carrito">
          <h2>Resumen</h2>
          <p>Subtotal: <span id="subtotal-carrito">{formatearMonto(totales.subtotal)}</span></p>
          <p id="nombre-descuento">{totales.descuento.nombre || "Sin descuento"}</p>
          <p>
            Descuento:{" "}
            <span id="descuento-carrito">
              {totales.montoDescuento ? "-" + formatearMonto(totales.montoDescuento) : "$0"}
            </span>
          </p>
          <p>Total de la compra</p>
          <span id="total-carrito">{formatearMonto(totales.total)}</span>
          <button type="button" className="btn" id="btn-comprar" onClick={finalizarCompra}>
            Comprar
          </button>
        </div>
      </div>
    </section>
  );
}
