import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],

  // Ruta base para publicar MundoViajes en GitHub Pages.
  base: '/Bimestre_09_DFII_Exp2_S5_FranciscoHenriquez/',

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: true,
  },
});