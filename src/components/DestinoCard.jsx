import { Link } from 'react-router-dom';

function DestinoCard({ destino }) {
  const estilosDisponibles = [
    'paris',
    'roma',
    'tokio',
    'cancun',
  ];

  const estiloDestino = estilosDisponibles.includes(destino.id)
    ? destino.id
    : 'general';

  return (
    <article
      className={`destino-card destino-${estiloDestino}`}
    >
      <div className="destino-card-encabezado">
        <span className="destino-etiqueta">
          Destino turístico
        </span>

        <h2>{destino.nombre}</h2>

        <p className="destino-pais">
          📍 {destino.pais}
        </p>
      </div>

      <div className="destino-card-contenido">
        <p className="destino-descripcion">
          {destino.descripcion}
        </p>

        <h3>Actividades populares</h3>

        <ul>
          {destino.actividades.map((actividad) => (
            <li key={actividad}>
              {actividad}
            </li>
          ))}
        </ul>

        <Link
          to={`/destinos/${destino.id}`}
          className="destino-boton"
        >
          Ver vuelos y hoteles
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </article>
  );
}

export default DestinoCard;