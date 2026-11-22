import { gql } from '@apollo/client';

export const OBTENER_VUELOS = gql`
  query ObtenerVuelos($destinoId: ID!) {
    vuelos(destinoId: $destinoId) {
      id
      aerolinea
      origen
      destino
      precio
      duracion
      fechaSalida
      fechaLlegada
      asientosDisponibles
    }
  }
`;

export const OBTENER_HOTELES = gql`
  query ObtenerHoteles($destinoId: ID!) {
    hoteles(destinoId: $destinoId) {
      id
      nombre
      ciudad
      estrellas
      precioNoche
      fechaEntrada
      fechaSalida
      habitacionesDisponibles
    }
  }
`;