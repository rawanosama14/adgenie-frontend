/** tailwind.config.ts — AdGenie design tokens. */
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Segoe UI', 'Inter', 'Arial', 'sans-serif'] },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,.05), 0 12px 32px rgba(15,23,42,.06)',
        float: '0 20px 60px rgba(15,23,42,.12)'
      }
    }
  },
  plugins: []
};
export default config;
