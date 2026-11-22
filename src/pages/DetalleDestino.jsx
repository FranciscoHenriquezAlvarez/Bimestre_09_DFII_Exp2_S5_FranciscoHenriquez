import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';

import {
  OBTENER_VUELOS,
  OBTENER_HOTELES,
} from '../graphql/queries';

import {
  obtenerDestinos,
  limpiarCacheDestinos,
} from '../services/destinosService';

// Formatear los precios en pesos chilenos.
const formatoPrecio = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

// Formatear fechas sin problemas de zona horaria.
function formatearFecha(fecha) {
  if (!fecha) {
    return 'No informada';
  }

  const [anio, mes, dia] = fecha.split('-').map(Number);

  const fechaLocal = new Date(anio, mes - 1, dia);

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(fechaLocal);
}

function DetalleDestino() {
  const { id } = useParams();

  // Estados para consultar el destino mediante REST.
  const [destino, setDestino] = useState(null);
  const [cargandoDestino, setCargandoDestino] = useState(true);
  const [errorDestino, setErrorDestino] = useState(null);
  const [intento, setIntento] = useState(0);

  // Obtener la información del destino desde la API REST.
  useEffect(() => {
    const controller = new AbortController();

    async function cargarDestino() {
      setCargandoDestino(true);
      setErrorDestino(null);
      setDestino(null);

      try {
        const destinos = await obtenerDestinos(controller.signal);

        if (!controller.signal.aborted) {
          const destinoEncontrado = destinos.find(
            (elemento) => elemento.id === id
          );

          setDestino(destinoEncontrado ?? null);
        }
      } catch (errorConsulta) {
        if (!controller.signal.aborted) {
          setErrorDestino(errorConsulta.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargandoDestino(false);
        }
      }
    }

    cargarDestino();

    return () => {
      controller.abort();
    };
  }, [id, intento]);

  // Consultar vuelos mediante GraphQL.
  const {
    data: datosVuelos,
    loading: cargandoVuelos,
    error: errorVuelos,
    refetch: recargarVuelos,
  } = useQuery(OBTENER_VUELOS, {
    variables: {
      destinoId: id,
    },
    skip: !destino || cargandoDestino || Boolean(errorDestino),
  });

  // Consultar hoteles mediante GraphQL.
  const {
    data: datosHoteles,
    loading: cargandoHoteles,
    error: errorHoteles,
    refetch: recargarHoteles,
  } = useQuery(OBTENER_HOTELES, {
    variables: {
      destinoId: id,
    },
    skip: !destino || cargandoDestino || Boolean(errorDestino),
  });

  // Reintentar la consulta REST.
  function reintentarDestino() {
    limpiarCacheDestinos();
    setIntento((valorAnterior) => valorAnterior + 1);
  }

  // Estado de carga del destino.
  if (cargandoDestino) {
    return (
      <main className="detalle-destino">
        <div className="estado-mensaje" role="status">
          <p>Consultando información del destino...</p>
        </div>
      </main>
    );
  }

  // Error al consultar la API REST.
  if (errorDestino) {
    return (
      <main className="detalle-destino">
        <div
          className="estado-mensaje estado-error"
          role="alert"
        >
          <h1>No fue posible cargar el destino</h1>

          <p>{errorDestino}</p>

          <button
            type="button"
            onClick={reintentarDestino}
          >
            Reintentar consulta
          </button>
        </div>

        <div className="detalle-navegacion">
          <Link to="/destinos">
            ← Volver a destinos
          </Link>
        </div>
      </main>
    );
  }

  // Comprobar que el destino existe en la API REST.
  if (!destino) {
    return (
      <main className="detalle-destino">
        <div className="estado-mensaje">
          <h1>Destino no encontrado</h1>

          <p>
            El destino solicitado no está disponible.
          </p>
        </div>

        <div className="detalle-navegacion">
          <Link to="/destinos">
            ← Volver a destinos
          </Link>
        </div>
      </main>
    );
  }

  const vuelos = datosVuelos?.vuelos ?? [];
  const hoteles = datosHoteles?.hoteles ?? [];

  return (
    <main className="detalle-destino">
      <header className="detalle-encabezado">
        <h1>
          ✈️ Vuelos y hoteles en {destino.nombre}
        </h1>

        <p>
          Explora las alternativas disponibles para
          organizar tu próximo viaje.
        </p>
      </header>

      {/* =====================================
          SECCIÓN DE VUELOS
      ===================================== */}

      <section
        className="detalle-seccion"
        aria-labelledby="titulo-vuelos"
      >
        <h2 id="titulo-vuelos">
          ✈️ Vuelos disponibles
        </h2>

        {cargandoVuelos && (
          <div className="estado-mensaje" role="status">
            <p>Consultando vuelos disponibles...</p>
          </div>
        )}

        {errorVuelos && !cargandoVuelos && (
          <div
            className="estado-mensaje estado-error"
            role="alert"
          >
            <h3>No fue posible cargar los vuelos</h3>

            <p>{errorVuelos.message}</p>

            <button
              type="button"
              onClick={() => recargarVuelos()}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargandoVuelos && !errorVuelos && vuelos.length === 0 && (
          <div className="estado-mensaje">
            <p>
              No hay vuelos disponibles para este destino.
            </p>
          </div>
        )}

        {!cargandoVuelos && !errorVuelos && vuelos.length > 0 && (
          <div className="detalle-grid">
            {vuelos.map((vuelo) => (
              <article
                key={vuelo.id}
                className="detalle-card"
              >
                <h3>{vuelo.aerolinea}</h3>

                <p>
                  <strong>Origen:</strong> {vuelo.origen}
                </p>

                <p>
                  <strong>Destino:</strong> {vuelo.destino}
                </p>

                <p>
                  <strong>Duración:</strong> {vuelo.duracion}
                </p>

                <p>
                  <strong>Fecha de salida:</strong>{' '}
                  {formatearFecha(vuelo.fechaSalida)}
                </p>

                <p>
                  <strong>Fecha de llegada:</strong>{' '}
                  {formatearFecha(vuelo.fechaLlegada)}
                </p>

                <p>
                  <strong>Disponibilidad:</strong>{' '}
                  {vuelo.asientosDisponibles ?? 0}{' '}
                  asientos disponibles
                </p>

                <p className="detalle-precio">
                  {formatoPrecio.format(vuelo.precio)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =====================================
          SECCIÓN DE HOTELES
      ===================================== */}

      <section
        className="detalle-seccion"
        aria-labelledby="titulo-hoteles"
      >
        <h2 id="titulo-hoteles">
          🏨 Hoteles disponibles
        </h2>

        {cargandoHoteles && (
          <div className="estado-mensaje" role="status">
            <p>Consultando hoteles disponibles...</p>
          </div>
        )}

        {errorHoteles && !cargandoHoteles && (
          <div
            className="estado-mensaje estado-error"
            role="alert"
          >
            <h3>No fue posible cargar los hoteles</h3>

            <p>{errorHoteles.message}</p>

            <button
              type="button"
              onClick={() => recargarHoteles()}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargandoHoteles && !errorHoteles && hoteles.length === 0 && (
          <div className="estado-mensaje">
            <p>
              No hay hoteles disponibles para este destino.
            </p>
          </div>
        )}

        {!cargandoHoteles && !errorHoteles && hoteles.length > 0 && (
          <div className="detalle-grid">
            {hoteles.map((hotel) => (
              <article
                key={hotel.id}
                className="detalle-card"
              >
                <h3>{hotel.nombre}</h3>

                <p>
                  <strong>Ciudad:</strong> {hotel.ciudad}
                </p>

                <p>
                  <strong>Categoría:</strong>{' '}
                  {hotel.estrellas} estrellas
                </p>

                <p
                  className="detalle-estrellas"
                  aria-label={`${hotel.estrellas} estrellas`}
                >
                  {'⭐'.repeat(hotel.estrellas)}
                </p>

                <p>
                  <strong>Fecha de entrada:</strong>{' '}
                  {formatearFecha(hotel.fechaEntrada)}
                </p>

                <p>
                  <strong>Fecha de salida:</strong>{' '}
                  {formatearFecha(hotel.fechaSalida)}
                </p>

                <p>
                  <strong>Disponibilidad:</strong>{' '}
                  {hotel.habitacionesDisponibles ?? 0}{' '}
                  habitaciones disponibles
                </p>

                <p className="detalle-precio">
                  {formatoPrecio.format(hotel.precioNoche)}
                  <span> / noche</span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =====================================
          NAVEGACIÓN
      ===================================== */}

      <div className="detalle-navegacion">
        <Link to="/destinos">
          ← Volver a destinos
        </Link>
      </div>
    </main>
  );
}

export default DetalleDestino;