import { describe, expect, it } from 'vitest';
import { print } from 'graphql';

import {
  OBTENER_VUELOS,
  OBTENER_HOTELES,
} from '../graphql/queries';

describe('Consultas GraphQL de MundoViajes', () => {
  it('define las operaciones GraphQL con los nombres correctos', () => {
    const consultaVuelos = print(OBTENER_VUELOS);
    const consultaHoteles = print(OBTENER_HOTELES);

    expect(consultaVuelos).toContain('query ObtenerVuelos');
    expect(consultaHoteles).toContain('query ObtenerHoteles');
  });

  it('solicita los campos principales de vuelos y hoteles', () => {
    const consultaVuelos = print(OBTENER_VUELOS);
    const consultaHoteles = print(OBTENER_HOTELES);

    const camposVuelos = [
      'id',
      'aerolinea',
      'origen',
      'destino',
      'precio',
      'duracion',
    ];

    const camposHoteles = [
      'id',
      'nombre',
      'ciudad',
      'estrellas',
      'precioNoche',
    ];

    camposVuelos.forEach((campo) => {
      expect(consultaVuelos).toContain(campo);
    });

    camposHoteles.forEach((campo) => {
      expect(consultaHoteles).toContain(campo);
    });
  });

  it('utiliza el identificador obligatorio del destino', () => {
    const consultaVuelos = print(OBTENER_VUELOS);
    const consultaHoteles = print(OBTENER_HOTELES);

    expect(consultaVuelos).toContain('$destinoId: ID!');
    expect(consultaHoteles).toContain('$destinoId: ID!');

    expect(consultaVuelos).toContain(
      'vuelos(destinoId: $destinoId)',
    );

    expect(consultaHoteles).toContain(
      'hoteles(destinoId: $destinoId)',
    );
  });

  it('solicita las fechas y disponibilidad de los vuelos', () => {
    const consultaVuelos = print(OBTENER_VUELOS);

    expect(consultaVuelos).toContain('fechaSalida');
    expect(consultaVuelos).toContain('fechaLlegada');
    expect(consultaVuelos).toContain('asientosDisponibles');
  });

  it('solicita las fechas y disponibilidad de los hoteles', () => {
    const consultaHoteles = print(OBTENER_HOTELES);

    expect(consultaHoteles).toContain('fechaEntrada');
    expect(consultaHoteles).toContain('fechaSalida');
    expect(consultaHoteles).toContain('habitacionesDisponibles');
  });
});