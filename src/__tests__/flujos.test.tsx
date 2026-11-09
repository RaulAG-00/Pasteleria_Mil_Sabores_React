import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AvisoProvider } from "../context/AvisoContext";
import { AuthProvider } from "../context/AuthContext";
import { ProductosProvider } from "../context/ProductosContext";
import { CarritoProvider } from "../context/CarritoContext";
import type { ItemCarrito, Producto, Sesion, Usuario, MensajeContacto } from "../types";

// jsdom no implementa estos métodos del navegador.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
window.HTMLElement.prototype.scrollIntoView = vi.fn();

function montar(ruta = "/") {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AvisoProvider>
        <AuthProvider>
          <ProductosProvider>
            <CarritoProvider>
              <App />
            </CarritoProvider>
          </ProductosProvider>
        </AuthProvider>
      </AvisoProvider>
    </MemoryRouter>
  );
}
// ---------- ayudas ----------
const cabecera = () => screen.getByRole("banner");

const tarjetaDe = (nombre: string): HTMLElement =>
  screen.getByText(nombre).closest(".producto") as HTMLElement;

const filaDe = (texto: string): HTMLElement =>
  screen.getByText(texto).closest("tr") as HTMLElement;

const leer = <T,>(clave: string): T => JSON.parse(localStorage.getItem(clave) ?? "null") as T;

const textoDe = (selector: string): string =>
  document.querySelector(selector)?.textContent ?? "";

async function iniciarSesion(user: ReturnType<typeof userEvent.setup>, correo: string, pass: string) {
  await user.click(within(cabecera()).getByText("Iniciar sesión"));
  await user.type(screen.getByLabelText("Correo"), correo);
  await user.type(screen.getByLabelText("Contraseña"), pass);
  await user.click(screen.getByRole("button", { name: "Entrar" }));
}

async function agregarDesdeCatalogo(user: ReturnType<typeof userEvent.setup>, nombre: string) {
  await user.click(within(tarjetaDe(nombre)).getByRole("button"));
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe("catálogo y carrito", () => {
  it("el catálogo dibuja los 16 productos agrupados en 8 categorías", () => {
    montar("/productos");
    expect(screen.getAllByRole("button", { name: /Agregar al carrito/ })).toHaveLength(16);
    const principal = within(screen.getByRole("main"));
    expect(principal.getAllByRole("heading", { level: 2 })).toHaveLength(8);
  });

  it("agregar suma al contador, no duplica y respeta el stock (TE002 = 4)", async () => {
    const user = userEvent.setup();
    montar("/productos");
    const boton = within(tarjetaDe("Torta Especial de Boda")).getByRole("button");
    for (let i = 0; i < 6; i++) await user.click(boton);

    expect(within(cabecera()).getByText(/Carrito \(4\)/)).toBeTruthy(); // tope = stock
    await user.click(within(cabecera()).getByText(/Carrito/));
    expect(screen.getAllByText("Torta Especial de Boda")).toHaveLength(1); // una sola línea
    expect(leer<ItemCarrito[]>("carrito")[0].cantidad).toBe(4);
  });

  it("el carrito persiste al recargar (localStorage)", async () => {
    const user = userEvent.setup();
    montar("/productos");
    await agregarDesdeCatalogo(user, "Pan Sin Gluten");
    cleanup();
    montar("/carrito");
    expect(screen.getByText("Pan Sin Gluten")).toBeTruthy();
  });

  it("el botón − no baja de 1 y Eliminar vacía el carrito", async () => {
    const user = userEvent.setup();
    montar("/productos");
    await agregarDesdeCatalogo(user, "Pan Sin Gluten");
    await user.click(within(cabecera()).getByText(/Carrito/));
    await user.click(screen.getByLabelText("Disminuir cantidad"));
    expect(leer<ItemCarrito[]>("carrito")[0].cantidad).toBe(1);
    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByText("Tu carrito está vacío.")).toBeTruthy();
  });
});

describe("descuentos y compra", () => {
  it("sin sesión: sin descuento, y Comprar manda al login", async () => {
    const user = userEvent.setup();
    montar("/productos");
    await agregarDesdeCatalogo(user, "Torta Vegana de Chocolate"); // $50.000
    await user.click(within(cabecera()).getByText(/Carrito/));
    expect(textoDe("#total-carrito")).toBe("$50.000");
    expect(textoDe("#nombre-descuento")).toBe("Sin descuento");
    await user.click(screen.getByRole("button", { name: "Comprar" }));
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeTruthy();
  });

  it("mayor de 50 → FELICES50 (50%)", async () => {
    const user = userEvent.setup();
    montar("/");
    await iniciarSesion(user, "mayor@gmail.com", "1234");
    await user.click(within(cabecera()).getByText(/Productos/));
    await agregarDesdeCatalogo(user, "Torta Vegana de Chocolate");
    await user.click(within(cabecera()).getByText(/Carrito/));
    expect(textoDe("#descuento-carrito")).toBe("-$25.000");
    expect(textoDe("#total-carrito")).toBe("$25.000");
    expect(textoDe("#nombre-descuento")).toContain("FELICES50");
  });

  it("estudiante @duoc.cl → 20%; la compra descuenta stock y vacía el carrito", async () => {
    const user = userEvent.setup();
    montar("/");
    await iniciarSesion(user, "alumno@duoc.cl", "duoc1");
    expect(within(cabecera()).getByText("Hola, Daniela")).toBeTruthy();
    await user.click(within(cabecera()).getByText(/Productos/));
    await agregarDesdeCatalogo(user, "Torta Vegana de Chocolate");
    await user.click(within(cabecera()).getByText(/Carrito/));
    expect(textoDe("#total-carrito")).toBe("$40.000");
    await user.click(screen.getByRole("button", { name: "Comprar" }));
    expect(screen.getByText("Tu carrito está vacío.")).toBeTruthy();
    const productos = leer<Producto[]>("productos");
    expect(productos.find((p) => p.codigo === "PV001")?.stock).toBe(6); // 7 - 1
  });

  it("@profesor.duoc.cl NO recibe el 20%", async () => {
    const user = userEvent.setup();
    const profesor: Usuario = {
      run: "1-9", nombre: "Prof", apellidos: "X", correo: "p@profesor.duoc.cl",
      fechaNacimiento: "1990-01-01", tipoUsuario: "Cliente", region: "a", comuna: "b",
      direccion: "c", password: "1234",
    };
    localStorage.setItem("usuarios", JSON.stringify([profesor]));
    montar("/");
    await iniciarSesion(user, "p@profesor.duoc.cl", "1234");
    await user.click(within(cabecera()).getByText(/Productos/));
    await agregarDesdeCatalogo(user, "Torta Vegana de Chocolate");
    await user.click(within(cabecera()).getByText(/Carrito/));
    expect(textoDe("#total-carrito")).toBe("$50.000");
  });
});

describe("registro, login y admin", () => {
  it("login con clave incorrecta muestra error", async () => {
    const user = userEvent.setup();
    montar("/login");
    await user.type(screen.getByLabelText("Correo"), "cliente@gmail.com");
    await user.type(screen.getByLabelText("Contraseña"), "mala");
    await user.click(screen.getByRole("button", { name: "Entrar" }));
    expect(screen.getByText("Correo o contraseña incorrectos.")).toBeTruthy();
  });

  it("login rechaza correos de otros dominios", async () => {
    const user = userEvent.setup();
    montar("/login");
    await user.type(screen.getByLabelText("Correo"), "x@hotmail.com");
    await user.type(screen.getByLabelText("Contraseña"), "1234");
    await user.click(screen.getByRole("button", { name: "Entrar" }));
    expect(screen.getByText(/Solo se permiten correos/)).toBeTruthy();
  });

  it("registro: RUN inválido → error; RUN válido → crea Cliente y abre sesión", async () => {
    const user = userEvent.setup();
    montar("/registro");
    const escribirRun = async (run: string) => {
      await user.clear(screen.getByLabelText("RUN"));
      await user.type(screen.getByLabelText("RUN"), run);
    };
    await escribirRun("12.345.678-9");
    await user.type(screen.getByLabelText("Correo"), "nuevo@gmail.com");
    await user.type(screen.getByLabelText("Nombre"), "Nora");
    await user.type(screen.getByLabelText("Apellidos"), "Prueba");
    await user.selectOptions(screen.getByLabelText("Región"), "Valparaíso");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Quilpué");
    await user.type(screen.getByLabelText("Dirección"), "Calle 1");
    await user.type(screen.getByLabelText("Contraseña"), "abcd");
    await user.click(screen.getByRole("button", { name: "Registrarme" }));
    expect(screen.getByText(/RUN chileno válido/)).toBeTruthy();

    await escribirRun("12.345.678-5");
    await user.click(screen.getByRole("button", { name: "Registrarme" }));
    await waitFor(() => expect(within(cabecera()).getByText("Hola, Nora")).toBeTruthy());

    const nuevo = leer<Usuario[]>("usuarios").find((u) => u.correo === "nuevo@gmail.com");
    expect(nuevo?.tipoUsuario).toBe("Cliente");
    expect(nuevo?.run).toBe("12.345.678-5");
    expect(leer<Sesion & { password?: string }>("sesion").password).toBeUndefined();
  });

  it("registro: un correo ya existente se rechaza", async () => {
    const user = userEvent.setup();
    montar("/registro");
    await user.type(screen.getByLabelText("RUN"), "12.345.678-5");
    await user.type(screen.getByLabelText("Correo"), "cliente@gmail.com");
    await user.type(screen.getByLabelText("Nombre"), "N");
    await user.type(screen.getByLabelText("Apellidos"), "P");
    await user.selectOptions(screen.getByLabelText("Región"), "Maule");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Talca");
    await user.type(screen.getByLabelText("Dirección"), "d");
    await user.type(screen.getByLabelText("Contraseña"), "abcd");
    await user.click(screen.getByRole("button", { name: "Registrarme" }));
    expect(screen.getByText("Ya existe un usuario con ese correo.")).toBeTruthy();
  });

  it("cambiar la región reinicia la comuna", async () => {
    const user = userEvent.setup();
    montar("/registro");
    await user.selectOptions(screen.getByLabelText("Región"), "Maule");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Talca");
    await user.selectOptions(screen.getByLabelText("Región"), "Aysén");
    expect((screen.getByLabelText("Comuna") as HTMLSelectElement).value).toBe("");
  });

  it("/admin sin ser administrador redirige al login", () => {
    montar("/admin");
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeTruthy();
  });

  it("cliente no ve el link Admin; el administrador crea, edita y elimina usuarios", async () => {
    const user = userEvent.setup();
    montar("/");
    await iniciarSesion(user, "cliente@gmail.com", "1234");
    expect(within(cabecera()).queryByText("Admin")).toBeNull();
    await user.click(within(cabecera()).getByText("Cerrar sesión"));
    expect(within(cabecera()).getByText("Iniciar sesión")).toBeTruthy();

    await iniciarSesion(user, "admin@gmail.com", "admin1");
    expect(screen.getByRole("heading", { name: "Usuarios" })).toBeTruthy(); // admin → /admin
    expect(screen.getAllByRole("row")).toHaveLength(5); // cabecera + 4

    // crear un Vendedor
    await user.type(screen.getByLabelText("RUN"), "9.999.999-3");
    await user.type(screen.getByLabelText("Correo"), "vende@gmail.com");
    await user.type(screen.getByLabelText("Nombre"), "Vera");
    await user.type(screen.getByLabelText("Apellidos"), "Vendedora");
    await user.selectOptions(screen.getByLabelText("Tipo de usuario"), "Vendedor");
    await user.selectOptions(screen.getByLabelText("Región"), "Maule");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Talca");
    await user.type(screen.getByLabelText("Dirección"), "Calle 2");
    await user.type(screen.getByLabelText("Contraseña"), "vv11");
    await user.click(screen.getByRole("button", { name: "Crear usuario" }));
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getByText("vende@gmail.com")).toBeTruthy();

    // editar sin tocar la contraseña → se conserva
    await user.click(within(filaDe("vende@gmail.com")).getByRole("button", { name: "Editar" }));
    expect(screen.getByRole("heading", { name: "Editar usuario" })).toBeTruthy();
    await user.clear(screen.getByLabelText("Nombre"));
    await user.type(screen.getByLabelText("Nombre"), "Valeria");
    await user.click(screen.getByRole("button", { name: "Actualizar usuario" }));
    const guardado = leer<Usuario[]>("usuarios").find((u) => u.correo === "vende@gmail.com");
    expect(guardado?.nombre).toBe("Valeria");
    expect(guardado?.password).toBe("vv11");
    expect(screen.getByRole("heading", { name: "Crear usuario" })).toBeTruthy();

    // eliminar a otro usuario funciona; eliminarse a sí mismo se bloquea
    await user.click(within(filaDe("vende@gmail.com")).getByRole("button", { name: "Eliminar" }));
    expect(screen.queryByText("vende@gmail.com")).toBeNull();
    await user.click(within(filaDe("admin@gmail.com")).getByRole("button", { name: "Eliminar" }));
    expect(screen.getByText("No puedes eliminar tu propio usuario.")).toBeTruthy();
    expect(screen.getByText("admin@gmail.com")).toBeTruthy();
  });
});

describe("otras páginas", () => {
  it("contacto valida y guarda el mensaje", async () => {
    const user = userEvent.setup();
    montar("/contacto");
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.getByText("El nombre es obligatorio.")).toBeTruthy();
    expect(screen.getByText("El comentario es obligatorio.")).toBeTruthy();
    await user.type(screen.getByLabelText("Nombre"), "Ana");
    await user.type(screen.getByLabelText("Comentario"), "Hola");
    expect(screen.getByText("4 / 500")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(leer<MensajeContacto[]>("mensajesContacto")).toHaveLength(1);
    expect(screen.getByText("0 / 500")).toBeTruthy();
  });

  it("detalle de producto y producto inexistente", () => {
    montar("/producto/PV001");
    expect(screen.getByRole("heading", { name: "Torta Vegana de Chocolate" })).toBeTruthy();
    cleanup();
    montar("/producto/NOEXISTE");
    expect(screen.getByText("No encontramos este producto.")).toBeTruthy();
  });

  it("home: las categorías enlazan a /productos?categoria=… y la sección existe", () => {
    montar("/");
    const enlace = screen.getByText("Vegana").closest("a");
    expect(enlace?.getAttribute("href")).toContain("/productos?categoria=vegana");
    cleanup();
    montar("/productos?categoria=vegana");
    expect(document.getElementById("vegana")).toBeTruthy();
  });

  it("nosotros y blogs renderizan; el footer solo aparece en las páginas que corresponde", () => {
    montar("/blogs");
    expect(screen.getByText(/Alfajores Chilenos/)).toBeTruthy();
    expect(document.querySelector("footer")).toBeTruthy();
    cleanup();
    montar("/carrito");
    expect(document.querySelector("footer")).toBeNull();
  });
});