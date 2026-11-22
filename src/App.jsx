import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';

import Inicio from './pages/Inicio';
import Destinos from './pages/Destinos';
import DetalleDestino from './pages/DetalleDestino';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  // Recuperar el tema guardado en el navegador.
  const [temaOscuro, setTemaOscuro] = useState(() => {
    return localStorage.getItem('mundoviajes-tema') === 'oscuro';
  });

  // Aplicar el tema y guardar la preferencia.
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      temaOscuro ? 'dark' : 'light'
    );

    localStorage.setItem(
      'mundoviajes-tema',
      temaOscuro ? 'oscuro' : 'claro'
    );
  }, [temaOscuro]);

  // Cambiar entre modo claro y oscuro.
  function cambiarTema() {
    setTemaOscuro((temaAnterior) => !temaAnterior);
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app">
        <header className="header">
          <div className="contenedor header-contenido">
            <NavLink to="/" className="logo">
              🌎 MundoViajes
            </NavLink>

            <div className="header-acciones">
              <nav
                className="navegacion"
                aria-label="Navegación principal"
              >
                <NavLink to="/" end>
                  Inicio
                </NavLink>

                <NavLink to="/destinos">
                  Destinos
                </NavLink>
              </nav>

              <button
                type="button"
                className="boton-tema"
                onClick={cambiarTema}
                aria-label={
                  temaOscuro
                    ? 'Activar modo claro'
                    : 'Activar modo oscuro'
                }
                aria-pressed={temaOscuro}
                title={
                  temaOscuro
                    ? 'Cambiar a modo claro'
                    : 'Cambiar a modo oscuro'
                }
              >
                <span aria-hidden="true">
                  {temaOscuro ? '☀️' : '🌙'}
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="contenedor contenido-principal">
          <Routes>
            <Route path="/" element={<Inicio />} />

            <Route path="/destinos" element={<Destinos />} />

            <Route
              path="/destinos/:id"
              element={<DetalleDestino />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <footer className="footer">
          <p>
            © 2026 MundoViajes - Agencia de viajes
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;