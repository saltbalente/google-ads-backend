/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Las credenciales se leen solo en el servidor (process.env en /pages/api).
  // No se declaran en `env`: eso las incrustaría en el JavaScript del navegador
  // si algún componente llegara a usarlas.
  poweredByHeader: false,
}

module.exports = nextConfig
