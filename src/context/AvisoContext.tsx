import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ReactNode,
} from "react";
import type { TipoAviso } from "../types";

// Aviso flotante (esquina inferior derecha): "Producto agregado",
// "Compra realizada", errores, etc. Se oculta solo a los 2,8 segundos.

interface EstadoAviso {
  texto: string;
  tipo: TipoAviso;
  visible: boolean;
}

interface AvisoContextValue {
  mostrarAviso: (texto: string, tipo?: TipoAviso) => void;
}

const AvisoContext = createContext<AvisoContextValue | null>(null);

export function AvisoProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<EstadoAviso>({ texto: "", tipo: "ok", visible: false });
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const mostrarAviso = useCallback((texto: string, tipo: TipoAviso = "ok") => {
    clearTimeout(temporizador.current);
    setAviso({ texto, tipo, visible: true });
    temporizador.current = setTimeout(() => {
      setAviso((actual) => ({ ...actual, visible: false }));
    }, 2800);
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  return (
    <AvisoContext.Provider value={{ mostrarAviso }}>
      {children}
      <div
        id="aviso-sistema"
        role="status"
        aria-live="polite"
        className={`aviso-sistema ${aviso.tipo} ${aviso.visible ? "visible" : ""}`}
      >
        {aviso.texto}
      </div>
    </AvisoContext.Provider>
  );
}

export function useAviso(): AvisoContextValue {
  const contexto = useContext(AvisoContext);
  if (!contexto) throw new Error("useAviso debe usarse dentro de <AvisoProvider>");
  return contexto;
}
