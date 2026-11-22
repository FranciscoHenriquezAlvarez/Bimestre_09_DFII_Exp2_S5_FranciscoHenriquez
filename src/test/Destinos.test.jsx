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
  fireEvent,
} from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import Destinos from '../pages/Destinos';

import * as destinosService from '../services/destinosService';

// Simular el servicio REST sin realizar solicitudes reales.
vi.mock('../services/destinosService', () => ({
  obtenerDestinos: vi.fn(),
}));

// Simular las tarjetas para probar el comportamiento de la página
// independientemente de los detalles internos de DestinoCard.
vi.mock('../components/DestinoCard', () => ({
  default: ({ destino }) => (
    <article data-testid="destino-card">
      <h2>{destino.nombre}</h2>
      <p>{destino.pais}</p>
    </article>
  ),
}));

const destinosSimulados = [
  {
    id: 'paris',
    nombre: 'París',
    pais: 'Francia',
  },
  {
    id: 'roma',
    nombre: 'Roma',
    pais: 'Italia',
  },
];

// Renderizar el componente dentro de React Router.
function renderizarDestinos() {
  return render(
    <MemoryRouter>
      <Destinos />
    </MemoryRouter>,
  );
}

// Crear una promesa controlada para comprobar el estado de carga.
function crearPromesaControlada() {
  let resolver;

  const promesa = new Promise((resolve) => {
    resolver = resolve;
  });

  return {
    promesa,
    resolver,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Página Destinos', () => {
  it('muestra un mensaje mientras se cargan los destinos', async () => {
    const solicitudControlada = crearPromesaControlada();

    destinosService.obtenerDestinos.mockReturnValue(
      solicitudControlada.promesa,
    );

    renderizarDestinos();

    expect(
      screen.getByRole('status'),
    ).toHaveTextContent('Cargando destinos turísticos...');

    // Finalizar la consulta para completar la prueba.
    solicitudControlada.resolver(destinosSimulados);

    await waitFor(() => {
      expect(
        screen.getAllByTestId('destino-card'),
      ).toHaveLength(2);
    });
  });

  it('muestra los destinos obtenidos correctamente', async () => {
    destinosService.obtenerDestinos.mockResolvedValue(
      destinosSimulados,
    );

    renderizarDestinos();

    expect(
      await screen.findByText('París'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Roma'),
    ).toBeInTheDocument();

    expect(
      screen.getAllByTestId('destino-card'),
    ).toHaveLength(2);

    expect(
      screen.getByRole('region', {
        name: 'Destinos turísticos disponibles',
      }),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje cuando falla la consulta REST', async () => {
    destinosService.obtenerDestinos.mockRejectedValue(
      new Error('No fue posible conectar con el servicio de destinos.'),
    );

    renderizarDestinos();

    const mensajeError = await screen.findByRole('alert');

    expect(mensajeError).toHaveTextContent(
      'No pudimos cargar los destinos',
    );

    expect(mensajeError).toHaveTextContent(
      'No fue posible conectar con el servicio de destinos.',
    );

    expect(
      screen.getByRole('button', {
        name: 'Reintentar consulta',
      }),
    ).toBeInTheDocument();
  });

  it('permite reintentar la consulta después de un error', async () => {
    destinosService.obtenerDestinos
      .mockRejectedValueOnce(
        new Error('Error temporal del servidor.'),
      )
      .mockResolvedValueOnce(destinosSimulados);

    renderizarDestinos();

    // Esperar a que aparezca el mensaje de error.
    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Error temporal del servidor.');

    // Simular que el usuario presiona el botón de reintento.
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Reintentar consulta',
      }),
    );

    // Comprobar que aparecen los destinos después del reintento.
    expect(
      await screen.findByText('París'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Roma'),
    ).toBeInTheDocument();

    expect(
      destinosService.obtenerDestinos,
    ).toHaveBeenCalledTimes(2);
  });

  it('informa cuando no existen destinos disponibles', async () => {
    destinosService.obtenerDestinos.mockResolvedValue([]);

    renderizarDestinos();

    expect(
      await screen.findByText(
        'No hay destinos disponibles actualmente.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId('destino-card'),
    ).not.toBeInTheDocument();
  });
});