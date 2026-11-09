import { urlImagen } from "../utils/formato";

interface Receta {
  titulo: string;
  descripcion: string;
  ingredientes: string;
  preparacion: string;
  imagen: string;
  alt: string;
}

interface Noticia {
  titulo: string;
  titular: string;
  contenido: string;
  pie?: string;
  imagen: string;
  alt: string;
}

const RECETAS: Receta[] = [
  {
    titulo: "1. Alfajores Chilenos de Hojarasca",
    descripcion: "Crujientes capas de hojarasca artesanal rellenadas con manjar casero espeso.",
    ingredientes: "2 tazas de harina, 5 yemas de huevo, 2 cucharadas de mantequilla derretida, 1 cucharada de pisco o aguardiente, manjar casero.",
    preparacion: "Mezclar la harina, las yemas, la mantequilla y el pisco hasta formar una masa suave. Urdir círculos delgados con el uslero y ahuecar con un tenedor. Hornear a 180°C durante 5 minutos hasta que se doren ligeramente. Una vez fríos, rellenar generosamente con manjar.",
    imagen: "blog/alfajor-hojarasca.jpg",
    alt: "Alfajores Chilenos de Hojarasca",
  },
  {
    titulo: "2. Cucharitas de Manjar y Nuez",
    descripcion: "Crocantes galletas redondas tradicionales chilenas horneadas a la perfección y unidas con abundante dulce de leche y nueces picadas.",
    ingredientes: "250g de harina, 125g de mantequilla sin sal, 3 cucharadas de azúcar flor, 1 yema, manjar y nueces picadas.",
    preparacion: "Batir la mantequilla con el azúcar flor, agregar la yema y la harina hasta formar una masa homogénea. Cortar pequeños discos y hornear a 170°C por 8-10 minutos. Rellenar de a pares con manjar y espolvorear nueces en el borde.",
    imagen: "blog/cucharitas-manjar-nuez.jpg",
    alt: "Cucharitas de Manjar y Nuez",
  },
  {
    titulo: "3. Chilenitos de Merengue Tradicionales",
    descripcion: "El clásico pastel de las carreteras y ferias chilenas: suave masa con relleno de manjar y cubierta de merengue horneado.",
    ingredientes: "2 tazas de harina, 4 yemas, 50g de mantequilla, manjar. Para el merengue: 2 claras de huevo, 1 taza de azúcar.",
    preparacion: "Preparar la masa hojaldrada, hornear los discos por 6 minutos. Rellenar con manjar. Batir las claras a punto de nieve con el azúcar, cubrir los chilenitos y dar un golpe de horno a 100°C por 10 minutos para secar el merengue.",
    imagen: "blog/chilenitos-merengue.jpg",
    alt: "Chilenitos de Merengue",
  },
];

const NOTICIAS: Noticia[] = [
  {
    titulo: "1. Hito Histórico: El Récord Guinness de la Torta más Grande del Mundo (1995)",
    titular: "Cuando la Pastelería Mil Sabores hizo historia internacional.",
    contenido: "En 1995, nuestro taller repostero lideró una hazaña sin precedentes al colaborar en la elaboración de la torta más grande del mundo, acreditada por el libro de Récords Guinness. Utilizando más de 20 toneladas de harina y manjar artesanal, este evento reunió a la comunidad en un hito benéfico que consolidó nuestro compromiso con la tradición y el impacto social en Chile.",
    pie: "Récord Guinness Torta más Grande del Mundo 1995.",
    imagen: "blog/record-torta-gigante.jpg",
    alt: "Tarta Gigante",
  },
  {
    titulo: "2. Vinculación con el Medio: Estudiantes de Duoc UC imparten Taller de Repostería Comunitario",
    titular: "Manos que Cuidan: Estudiantes de Gastronomía enseñan repostería a mujeres de San Bernardo.",
    contenido: "En el marco de las iniciativas de Vinculación con el Medio de Duoc UC, estudiantes de las carreras de Gastronomía lideraron un taller práctico en el que enseñaron técnicas de pastelería básica y costeo de productos a vecinas y emprendedoras locales. La jornada permitió a las participantes aprender recetas tradicionales y herramientas digitales para potenciar sus propios emprendimientos.",
    imagen: "blog/noticia-vcm.jpg",
    alt: "Estudiantes de Duoc UC impartiendo taller de repostería comunitario",
  },
];

export default function Blogs() {
  return (
    <main className="blogs">
      <h1 className="titulo-principal">Blogs</h1>

      <section className="blog-section">
        <h2>🍰 Recetas Tradicionales Chilenas (Fáciles de Hacer)</h2>
        {RECETAS.map((r) => (
          <article key={r.titulo} className="blog-card">
            <h3>{r.titulo}</h3>
            <p><strong>Descripción:</strong> {r.descripcion}</p>
            <p><strong>Ingredientes:</strong> {r.ingredientes}</p>
            <p><strong>Preparación:</strong> {r.preparacion}</p>
            <img className="blog-imagen" src={urlImagen(r.imagen)} alt={r.alt} />
          </article>
        ))}
      </section>

      <section className="blog-section">
        <h2>📰 Historias y Noticias Destacadas</h2>
        {NOTICIAS.map((n) => (
          <article key={n.titulo} className="blog-card">
            <h3>{n.titulo}</h3>
            <p className="titular"><strong>Titular:</strong> {n.titular}</p>
            <p><strong>Contenido:</strong> {n.contenido}</p>
            {n.pie && <p className="pie-nota"><em>{n.pie}</em></p>}
            <img className="blog-imagen" src={urlImagen(n.imagen)} alt={n.alt} />
          </article>
        ))}
      </section>
    </main>
  );
}