import type {
  InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes,
} from "react";

// Un campo de formulario: etiqueta + control + ayuda + mensaje de error.
// Hay una variante por tipo de control para que TypeScript valide los
// atributos de cada uno (input, select y textarea).

interface PropsBase {
  id: string;
  label: string;
  error?: string;
  ayuda?: string;
}

function Envoltura({ id, label, ayuda, error, children }: PropsBase & { children: ReactNode }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      {children}
      {ayuda && <span className="ayuda-campo">{ayuda}</span>}
      <span className="error-campo" id={`error-${id}`}>{error}</span>
    </div>
  );
}

type PropsInput = PropsBase & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "className">;

export function Campo({ id, label, ayuda, error, ...resto }: PropsInput) {
  return (
    <Envoltura id={id} label={label} ayuda={ayuda} error={error}>
      <input id={id} name={id} className={error ? "campo-invalido" : ""} {...resto} />
    </Envoltura>
  );
}

type PropsSelect = PropsBase & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "className">;

export function CampoSelect({ id, label, ayuda, error, children, ...resto }: PropsSelect) {
  return (
    <Envoltura id={id} label={label} ayuda={ayuda} error={error}>
      <select id={id} name={id} className={error ? "campo-invalido" : ""} {...resto}>
        {children}
      </select>
    </Envoltura>
  );
}

type PropsTextarea = PropsBase & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name" | "className">;

export function CampoTextarea({ id, label, ayuda, error, ...resto }: PropsTextarea) {
  return (
    <Envoltura id={id} label={label} ayuda={ayuda} error={error}>
      <textarea id={id} name={id} className={error ? "campo-invalido" : ""} {...resto} />
    </Envoltura>
  );
}
