import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

// Igual que useState, pero el valor se guarda en localStorage y se
// recupera al recargar la página. Usa las mismas claves que la versión
// original ("carrito", "usuarios", "sesion", "productos"...).
export function useLocalStorage<T>(
  clave: string,
  valorInicial: T
): [T, Dispatch<SetStateAction<T>>] {
  const [valor, setValor] = useState<T>(() => {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado !== null ? (JSON.parse(guardado) as T) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      if (valor === null) {
        localStorage.removeItem(clave);
      } else {
        localStorage.setItem(clave, JSON.stringify(valor));
      }
    } catch {
      // localStorage lleno o bloqueado: la app sigue funcionando en memoria.
    }
  }, [clave, valor]);

  return [valor, setValor];
}
