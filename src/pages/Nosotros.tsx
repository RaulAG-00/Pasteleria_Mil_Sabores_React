import type { ReactNode } from "react";
import { urlImagen } from "../utils/formato";

interface BloqueProps {
  encabezado?: "h2" | "h3";
  titulo: string;
  imagen: string;
  alt: string;
  children: ReactNode;
}

// Bloque de texto + imagen que se repite en toda la página.
function Bloque({ encabezado: Encabezado = "h3", titulo, imagen, alt, children }: BloqueProps) {
  return (
    <section className="nosotros-contenido">
      <div className="nosotros-texto">
        <Encabezado>{titulo}</Encabezado>
        {children}
      </div>
      <img className="FotoNosotros" src={urlImagen(imagen)} alt={alt} />
    </section>
  );
}

export default function Nosotros() {
  return (
    <main>
      <section className="nosotros">
        <h1 className="titulo-principal">Pastelería Mil Sabores</h1>

        <div className="info">
          <Bloque
            encabezado="h2"
            titulo="Historia y Récord Guinness"
            imagen="historia.jpg"
            alt="Historia de Pastelería Mil Sabores"
          >
            <p>
              Desde hace 50 años, Pastelería 1000 Sabores ha sido parte del corazón de la
              repostería chilena. Un hito imborrable en nuestra historia ocurrió en 1995,
              cuando colaboramos con orgullo en la creación de la torta más grande del
              mundo, hito reconocido en el Récord Guinness. Esta pasión por los desafíos
              dulces y por compartir con la comunidad sigue viva en cada receta que
              elaboramos día a día.
            </p>
          </Bloque>

          <h2 className="titulo-seccion">Origen de productos y recetas tradicionales</h2>

          <Bloque
            titulo="Torta Circular de Manjar y Nueces"
            imagen="torta-circular-manjar.jpg"
            alt="Torta Circular de Manjar y Nueces"
          >
            <p>
              Elaborada siguiendo la auténtica receta artesanal chilena, utilizando manjar
              casero cocinado a fuego lento y nueces seleccionadas de la zona central.
            </p>
          </Bloque>

          <Bloque titulo="Tarta de Santiago" imagen="tarta-santiago.jpg" alt="Tarta de Santiago">
            <p>
              Inspirada en la repostería tradicional española, elaborada a base de almendras
              molidas, huevos y azúcar, coronada con la emblemática Cruz de Santiago en
              azúcar flor.
            </p>
          </Bloque>

          <Bloque
            titulo="Empanada de Manzana Especiada"
            imagen="empanada-manzana.jpg"
            alt="Empanada de Manzana Especiada"
          >
            <p>
              Receta clásica de la repostería criolla chilena que combina manzanas
              horneadas con toques de canela y una masa suave y hojaldrada.
            </p>
          </Bloque>

          <Bloque
            titulo="Líneas Dietéticas y Especiales"
            imagen="cheesecake-sin-azucar.jpg"
            alt="Cheesecake sin azúcar"
          >
            <p>
              Sin azúcar, sin gluten y vegana. Adaptaciones modernas de nuestras recetas de
              antaño que sustituyen ingredientes sin perder la textura esponjosa y el sabor
              característico de 50 años de tradición.
            </p>
          </Bloque>

          <h2 className="titulo-seccion">Misión y Visión</h2>

          <section className="nosotros-contenido">
            <div className="nosotros-texto">
              <h3>Misión</h3>
              <p>
                Ofrecer una experiencia dulce y memorable a nuestros clientes,
                proporcionando tortas y productos de repostería de alta calidad para todas
                las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos
                la creatividad en la repostería.
              </p>

              <h3>Visión</h3>
              <p>
                Convertirnos en la tienda online líder de productos de repostería en Chile,
                conocida por nuestra innovación, calidad y el impacto positivo en la
                comunidad, especialmente en la formación de nuevos talentos en
                gastronomía.
              </p>
            </div>
            <img
              className="FotoNosotros"
              src={urlImagen("mision-vision.jpg")}
              alt="Misión y Visión de Pastelería Mil Sabores"
            />
          </section>
        </div>
      </section>
    </main>
  );
}