import { Link } from 'react-router-dom';

function Inicio() {
  return (
    <main>
      <h1>Bienvenidos a MundoViajes 🌎</h1>

      <p>
        Descubre destinos increíbles y encuentra opciones
        de vuelos y hoteles para tu próximo viaje.
      </p>

      <Link to="/destinos">
        Explorar destinos
      </Link>
    </main>
  );
}

export default Inicio;