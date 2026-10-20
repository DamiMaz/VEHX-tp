/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial obligatoria:
        river: {
          DEFAULT: '#13191F', // Fondo principal
          dark: '#0E1318',
          light: '#1B232B'
        },
        carbon: {
          DEFAULT: '#2B2F2E', // Tarjetas, tiles y navbar
          surface: '#333736',
          border: '#3D4241'
        },
        tea: {
          DEFAULT: '#594C3D', // Bordes, divisores, pistas de barras
          light: '#6E5F4E'
        },
        wood: {
          DEFAULT: '#906D4B', // Iconos secundarios, gráficos, acentos de apoyo
          light: '#A7815B'
        },
        amber: {
          autumn: '#CA9C68', // Acento principal
          glow: 'rgba(202, 156, 104, 0.25)',
          muted: '#8A6E4F'
        },
        text: {
          primary: '#F2E6D6', // Títulos y valores destacados
          secondary: '#B9AA97', // Texto secundario / etiquetas
          muted: '#86796A'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 8px 30px rgba(0, 0, 0, 0.45)',
        'amber-glow': '0 0 20px rgba(202, 156, 104, 0.25)',
        'amber-glow-lg': '0 0 35px rgba(202, 156, 104, 0.35)',
      },
      borderRadius: {
        'card': '22px',
      }
    },
  },
  plugins: [],
}
