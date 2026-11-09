import { Link } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto";
import { useProductos } from "../context/ProductosContext";
import { CATEGORIAS, CODIGOS_DESTACADOS } from "../data/productos";
import { urlImagen } from "../utils/formato";
import type { Producto } from "../types";

export default function Home() {
  const { obtenerProducto } = useProductos();
  const destacados = CODIGOS_DESTACADOS
    .map(obtenerProducto)
    .filter((p): p is Producto => p !== undefined);

  return (
    <main>
      {/* HERO */}
      <section id="hero">
        <div className="hero-texto">
          <span>¡50 AÑOS DE DULZURA EN CHILE!</span>
          <p>Tortas artesanales hechas con ingredientes locales y recetas de tradición.</p>
          <Link to="/productos" className="btn">🛒 Ver Catálogo Completo</Link>
        </div>
        <img
          className="FotoMain"
          src={urlImagen("hero-tortas.jpg")}
          alt="Torta artesanal Pastelería Mil Sabores"
        />
      </section>

      {/* CATEGORÍAS */}
      <section className="categorias">
        <h2 className="titulo-principal">Explora por Categorías</h2>
        <div className="categorias-container">
          {CATEGORIAS.map((c) => (
            <Link key={c.slug} to={`/productos?categoria=${c.slug}`} className="categoria">
              <span>{c.icono}</span>
              <h3>{c.etiqueta}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="productos destacados">
        <h2 className="titulo-principal">Nuestros Productos Destacados</h2>
        <div className="productos-container">
          {destacados.map((producto) => (
            <TarjetaProducto key={producto.codigo} producto={producto} compacta />
          ))}
        </div>
      </section>

      {/* PROMOCIONES */}
      <section className="promociones">
        <div className="promocion">
          <span className="promocion-icono">🎁</span>
          <div>
            <h2>Celebra nuestro 50° aniversario</h2>
            <p>
              Ingresa el código <strong>FELICES50</strong> y obtén un 10% de descuento.
            </p>
          </div>
        </div>

        <div className="promocion">
          <span className="promocion-icono">👵</span>
          <div>
            <h2>Beneficio especial</h2>
            <p>50% de descuento en todas las compras para mayores de 50 años.</p>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="blog-inicio">
        <h2 className="titulo-principal">Historias & Blog</h2>
        <div className="blog-container">
          <article className="blog-card">
            <img src={urlImagen("historia.jpg")} alt="Historia Pastelería Mil Sabores" />
            <div className="blog-texto">
              <h3>El Récord Guinness de 1995</h3>
              <p>
                Conoce uno de los momentos más importantes de nuestra historia y cómo
                participamos en la creación de la torta más grande del mundo.
              </p>
              <Link to="/blogs" className="btn">Leer más</Link>
            </div>
          </article>

          <article className="blog-card">
            <img src={urlImagen("tarta-santiago.jpg")} alt="Recetas tradicionales" />
            <div className="blog-texto">
              <h3>Tradición y nuevas generaciones</h3>
              <p>
                Descubre cómo las recetas tradicionales siguen formando parte de nuestra
                pastelería.
              </p>
              <Link to="/blogs" className="btn">Leer más</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}