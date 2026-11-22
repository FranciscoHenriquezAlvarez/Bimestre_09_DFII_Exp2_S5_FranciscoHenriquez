import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
} from '@apollo/client';

import {
  ApolloProvider,
} from '@apollo/client/react';

import DetalleDestino from '../pages/DetalleDestino';

import * as destinosService from '../services/destinosService';

// Simular únicamente el servicio REST.
// Apollo Client procesa las consultas GraphQL.
vi.mock('../services/destinosService', () => ({
  obtenerDestinos: vi.fn(),
  limpiarCacheDestinos: vi.fn(),
}));

const destinosSimulados = [
  {
    id: 'paris',
    nombre: 'París',
    pais: 'Francia',
  },
];

const vuelosSimulados = [
  {
    __typename: 'Vuelo',
    id: 'vuelo-1',
    aerolinea: 'Aerolínea de Prueba',
    origen: 'Santiago',
    destino: 'París',
    precio: 850000,
    duracion: '14 horas',
    fechaSalida: '2027-01-15',
    fechaLlegada: '2027-01-16',
    asientosDisponibles: 12,
  },
];

const hotelesSimulados = [
  {
    __typename: 'Hotel',
    id: 'hotel-1',
    nombre: 'Hotel de Prueba',
    ciudad: 'París',
    estrellas: 4,
    precioNoche: 120000,
    fechaEntrada: '2027-01-16',
    fechaSalida: '2027-01-22',
    habitacionesDisponibles: 5,
  },
];

// Crear un enlace Apollo con respuestas simuladas.
function crearEnlaceSimulado({
  vuelos = vuelosSimulados,
  hoteles = hotelesSimulados,
  errorVuelos = null,
  errorHoteles = null,
  operaciones = [],
} = {}) {
  return new ApolloLink((operacion) => {
    operaciones.push({
      nombre: operacion.operationName,
      variables: operacion.variables,
    });

    return new Observable((observador) => {
      const temporizador = setTimeout(() => {
        if (operacion.operationName === 'ObtenerVuelos') {
          if (errorVuelos) {
            observador.error(new Error(errorVuelos));
            return;
          }

          observador.next({
            data: {
              vuelos,
            },
          });

          observador.complete();
          return;
        }

        if (operacion.operationName === 'ObtenerHoteles') {
          if (errorHoteles) {
            observador.error(new Error(errorHoteles));
            return;
          }

          observador.next({
            data: {
              hoteles,
            },
          });

          observador.complete();
          return;
        }

        observador.error(
          new Error('Operación GraphQL no reconocida.'),
        );
      }, 0);

      return () => {
        clearTimeout(temporizador);
      };
    });
  });
}

// Crear una instancia independiente de Apollo Client.
function crearClienteApollo(configuracion = {}) {
  return new ApolloClient({
    link: crearEnlaceSimulado(configuracion),
    cache: new InMemoryCache(),
  });
}

// Renderizar la página con React Router y Apollo Client.
function renderizarDetalle({
  id = 'paris',
  configuracionApollo = {},
} = {}) {
  const cliente = crearClienteApollo(configuracionApollo);

  return render(
    <ApolloProvider client={cliente}>
      <MemoryRouter initialEntries={[`/destinos/${id}`]}>
        <Routes>
          <Route
            path="/destinos/:id"
            element={<DetalleDestino />}
          />
        </Routes>
      </MemoryRouter>
    </ApolloProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();

  destinosService.obtenerDestinos.mockResolvedValue(
    destinosSimulados,
  );
});

describe('Página DetalleDestino con Apollo Client', () => {
  it('muestra correctamente los vuelos y hoteles del destino', async () => {
    renderizarDetalle();

    expect(
      await screen.findByText('Aerolínea de Prueba'),
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Hotel de Prueba'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Vuelos y hoteles en París/,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/14 horas/),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('4 estrellas'),
    ).toBeInTheDocument();
  });

  it('envía el identificador correcto en las consultas GraphQL', async () => {
    const operaciones = [];

    renderizarDetalle({
      configuracionApollo: {
        operaciones,
      },
    });

    await waitFor(() => {
      expect(operaciones).toHaveLength(2);
    });

    expect(operaciones).toEqual(
      expect.arrayContaining([
        {
          nombre: 'ObtenerVuelos',
          variables: {
            destinoId: 'paris',
          },
        },
        {
          nombre: 'ObtenerHoteles',
          variables: {
            destinoId: 'paris',
          },
        },
      ]),
    );
  });

  it('informa cuando el destino solicitado no existe', async () => {
    const operaciones = [];

    renderizarDetalle({
      id: 'destino-inexistente',
      configuracionApollo: {
        operaciones,
      },
    });

    expect(
      await screen.findByRole('heading', {
        name: 'Destino no encontrado',
      }),
    ).toBeInTheDocument();

    expect(operaciones).toHaveLength(0);

    expect(
      screen.getByRole('link', {
        name: /Volver a destinos/,
      }),
    ).toHaveAttribute('href', '/destinos');
  });

  it('informa cuando no existen vuelos ni hoteles disponibles', async () => {
    renderizarDetalle({
      configuracionApollo: {
        vuelos: [],
        hoteles: [],
      },
    });

    expect(
      await screen.findByText(
        'No hay vuelos disponibles para este destino.',
      ),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(
        'No hay hoteles disponibles para este destino.',
      ),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje cuando falla una consulta GraphQL', async () => {
    renderizarDetalle({
      configuracionApollo: {
        errorVuelos: 'Error simulado del servicio de vuelos.',
      },
    });

    const mensajeError = await screen.findByRole('alert');

    expect(mensajeError).toHaveTextContent(
      'No fue posible cargar los vuelos',
    );

    expect(mensajeError).toHaveTextContent(
      'Error simulado del servicio de vuelos.',
    );

    expect(
      screen.getByRole('button', {
        name: 'Reintentar',
      }),
    ).toBeInTheDocument();

    // El error de vuelos no debe impedir mostrar hoteles.
    expect(
      await screen.findByText('Hotel de Prueba'),
    ).toBeInTheDocument();
  });

  it('muestra las fechas y disponibilidad de los vuelos', async () => {
    renderizarDetalle();

    expect(
      await screen.findByText('Aerolínea de Prueba'),
    ).toBeInTheDocument();

    const seccionVuelos = screen.getByRole('region', {
      name: /Vuelos disponibles/,
    });

    expect(seccionVuelos).toHaveTextContent(
      '15 de enero de 2027',
    );

    expect(seccionVuelos).toHaveTextContent(
      '16 de enero de 2027',
    );

    expect(seccionVuelos).toHaveTextContent(
      '12 asientos disponibles',
    );
  });

  it('muestra las fechas y disponibilidad de los hoteles', async () => {
    renderizarDetalle();

    expect(
      await screen.findByText('Hotel de Prueba'),
    ).toBeInTheDocument();

    const seccionHoteles = screen.getByRole('region', {
      name: /Hoteles disponibles/,
    });

    expect(seccionHoteles).toHaveTextContent(
      '16 de enero de 2027',
    );

    expect(seccionHoteles).toHaveTextContent(
      '22 de enero de 2027',
    );

    expect(seccionHoteles).toHaveTextContent(
      '5 habitaciones disponibles',
    );
  });
});