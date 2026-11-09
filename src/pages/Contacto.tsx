import { useState, type ChangeEvent, type FormEvent } from "react";
import { Campo, CampoTextarea } from "../components/Campo";
import { useAviso } from "../context/AvisoContext";
import { validarComentario, validarCorreo, validarNombre } from "../utils/validaciones";
import type { Errores, MensajeContacto } from "../types";

// Nombre: obligatorio, máx. 100. Correo: opcional, máx. 100, dominios permitidos.
// Comentario: obligatorio, máx. 500.
// No hay servidor de correo: el mensaje se guarda en localStorage
// ("mensajesContacto") para simular que se envió.

type ValoresContacto = Pick<MensajeContacto, "nombre" | "correo" | "comentario">;

const VACIO: ValoresContacto = { nombre: "", correo: "", comentario: "" };

export default function Contacto() {
  const { mostrarAviso } = useAviso();
  const [valores, setValores] = useState<ValoresContacto>(VACIO);
  const [errores, setErrores] = useState<Errores<keyof ValoresContacto>>({});

  function cambiar(evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = evento.target;
    setValores((actual) => ({ ...actual, [name]: value }));
  }

  function enviar(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();

    const erroresNuevos: Errores<keyof ValoresContacto> = {
      nombre: validarNombre(valores.nombre, 100, "El nombre"),
      correo: validarCorreo(valores.correo, false),
      comentario: validarComentario(valores.comentario),
    };
    setErrores(erroresNuevos);
    if (Object.values(erroresNuevos).some(Boolean)) return;

    try {
      const mensajes = JSON.parse(
        localStorage.getItem("mensajesContacto") ?? "[]"
      ) as MensajeContacto[];
      mensajes.push({
        nombre: valores.nombre.trim(),
        correo: valores.correo.trim(),
        comentario: valores.comentario.trim(),
        fecha: new Date().toISOString(),
      });
      localStorage.setItem("mensajesContacto", JSON.stringify(mensajes));
    } catch {
      // Si localStorage no está disponible, igual se confirma el envío simulado.
    }

    setValores(VACIO);
    mostrarAviso("Mensaje enviado. Te contactaremos pronto.", "ok");
  }

  return (
    <main>
      <section className="contacto">
        <h1 className="titulo-principal">Contáctanos</h1>
        <p className="texto-formulario">
          Cuéntanos tu consulta. Te responderemos a la brevedad.
        </p>

        <form className="formulario" noValidate onSubmit={enviar}>
          <Campo id="nombre" label="Nombre" maxLength={100}
            value={valores.nombre} onChange={cambiar} error={errores.nombre} />

          <Campo id="correo" label="Correo" type="email" maxLength={100}
            placeholder="correo@gmail.com"
            ayuda="Opcional. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com."
            value={valores.correo} onChange={cambiar} error={errores.correo} />

          <CampoTextarea id="comentario" label="Comentario" rows={6} maxLength={500}
            ayuda={`${valores.comentario.length} / 500`}
            value={valores.comentario} onChange={cambiar} error={errores.comentario} />

          <button type="submit" className="btn">Enviar mensaje</button>
        </form>
      </section>
    </main>
  );
}