/** @type {import('next').NextConfig} */
const nextConfig = {
  // Añadimos esta configuración para Webpack
  webpack: (config) => {
    // Agregamos una regla para que Webpack trate 'canvas' como un módulo externo.
    // Esto evita que intente empaquetarlo para el navegador, que es donde falla.
    config.externals.push('canvas');
    return config;
  },
};

export default nextConfig;