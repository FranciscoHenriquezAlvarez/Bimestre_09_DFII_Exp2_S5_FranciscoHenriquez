import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpiar los componentes renderizados después de cada prueba.
// Esto evita que una prueba afecte a las siguientes.
afterEach(() => {
  cleanup();
});