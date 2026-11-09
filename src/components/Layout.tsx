import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// Texto del título del header según la página.
const TITULOS: Record<string, string> = {
  "/productos": "Productos",
  "/nosotros": "Nosotros",
  "/blogs": "Blogs",
  "/contacto": "Contacto",
  "/admin": "Administrador",
  "/carrito": "Carrito",
};

// Páginas que muestran el footer con el newsletter.
const CON_FOOTER: string[] = ["/", "/productos", "/nosotros", "/blogs", "/contacto"];

function tituloDe(pathname: string): string {
  if (pathname.startsWith("/producto/")) return "Detalle";
  return TITULOS[pathname] ?? "Pastelería Mil Sabores";
}

export default function Layout() {
  const { pathname, search } = useLocation();

  // Al cambiar de página se vuelve arriba, salvo cuando se viene a una
  // categoría concreta del catálogo (esa página hace su propio scroll).
  useEffect(() => {
    if (!search.includes("categoria=")) window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <>
      <Header titulo={tituloDe(pathname)} />
      <Outlet />
      {CON_FOOTER.includes(pathname) && <Footer />}
    </>
  );
}