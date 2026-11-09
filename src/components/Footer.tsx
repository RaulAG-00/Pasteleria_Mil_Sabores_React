import type { FormEvent } from "react";
import { useAviso } from "../context/AvisoContext";

export default function Footer() {
  const { mostrarAviso } = useAviso();

  function suscribir(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();
    evento.currentTarget.reset();
    mostrarAviso("¡Gracias por suscribirte!", "ok");
  }

  return (
    <footer>
      <div className="newsletter">
        <h3>Suscríbete al Newsletter</h3>
        <form onSubmit={suscribir}>
          <input type="email" placeholder="Ingresa tu correo" required />
          <button type="submit" className="btn">Suscribirme</button>
        </form>
      </div>

      <div className="footer-info">
        <p>Redes Sociales | Instagram | Facebook</p>
        <p>Todos los derechos reservados - Pastelería Mil Sabores © 2026</p>
      </div>
    </footer>
  );
}