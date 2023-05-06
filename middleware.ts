export { default } from "next-auth/middleware";

// Asegura las siguientes rutas para usuarios no autorizados.
export const config = {
  matcher: [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites",
  ]
}