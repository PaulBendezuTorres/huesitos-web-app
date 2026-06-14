/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        oscuro: {
          base: '#0B1A30',      // Fondo base principal
          secundario: '#102442',// Fondo secundario para secciones
          tarjeta: '#152E54',   // Fondo de cards, inputs y modales
          borde: '#1D3E70',     // Color de bordes y separadores
        }
      }
    },
  },
  plugins: [],
}

