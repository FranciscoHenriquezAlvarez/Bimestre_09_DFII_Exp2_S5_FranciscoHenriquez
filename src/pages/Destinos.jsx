import { useEffect, useState } from 'react';

import DestinoCard from '../components/DestinoCard';
import { obtenerDestinos } from '../services/destinosService';

function Destinos() {
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function cargarDestinos() {
      setCargando(true);
      setError(null);

      try {
        const datos = await obtenerDestinos(controller.signal);

        if (!controller.signal.aborted) {
          setDestinos(datos);
        }
      } catch (errorConsulta) {
        if (!controller.signal.aborted) {
          setError(errorConsulta.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarDestinos();

    return () => {
      controller.abort();
    };
  }, [intento]);

  function reintentarConsulta() {
    setIntento((valorAnterior) => valorAnterior + 1);
  }

  return (
    <main className="pagina-destinos">
      <div className="destinos-encabezado">
        <h1>Explora nuestros destinos 🌎</h1>

        <p>
          Descubre lugares increíbles, conoce sus principales
          atractivos y encuentra tu próximo destino de viaje.
        </p>
      </div>

      {cargando && (
        <div className="estado-mensaje" role="status">
          <p>Cargando destinos turísticos...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="estado-mensaje estado-error" role="alert">
          <h2>No pudimos cargar los destinos</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={reintentarConsulta}
          >
            Reintentar consulta
          </button>
        </div>
      )}

      {!cargando && !error && destinos.length === 0 && (
        <div className="estado-mensaje">
          <p>No hay destinos disponibles actualmente.</p>
        </div>
      )}

      {!cargando && !error && destinos.length > 0 && (
        <section
          className="destinos-grid"
          aria-label="Destinos turísticos disponibles"
        >
          {destinos.map((destino) => (
            <DestinoCard
              key={destino.id}
              destino={destino}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default Destinos;