import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  obtenerDestinos,
  limpiarCacheDestinos,
} from '../services/destinosService';

// Guardar la implementación original de fetch.
const fetchOriginal = globalThis.fetch;

// Datos simulados reutilizados en las pruebas.
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

// Crear una respuesta REST correcta.
function crearRespuestaCorrecta(datos = destinosSimulados) {
  return {
    ok: true,
    status: 200,
    json: async () => datos,
  };
}

// Crear una promesa cuyo resultado podemos controlar.
function crearPromesaControlada() {
  let resolver;
  let rechazar;

  const promesa = new Promise((resolve, reject) => {
    resolver = resolve;
    rechazar = reject;
  });

  return {
    promesa,
    resolver,
    rechazar,
  };
}

// Preparar un entorno limpio antes de cada prueba.
beforeEach(() => {
  limpiarCacheDestinos();
});

// Restaurar el entorno después de cada prueba.
afterEach(() => {
  limpiarCacheDestinos();

  globalThis.fetch = fetchOriginal;

  vi.restoreAllMocks();
});

describe('Servicio REST de destinos', () => {
  it('obtiene correctamente los destinos turísticos', async () => {
    const fetchSimulado = vi.fn().mockResolvedValue(
      crearRespuestaCorrecta(),
    );

    globalThis.fetch = fetchSimulado;

    const resultado = await obtenerDestinos();

    expect(resultado).toEqual(destinosSimulados);

    expect(resultado).toHaveLength(2);

    expect(fetchSimulado).toHaveBeenCalledTimes(1);

    expect(fetchSimulado).toHaveBeenCalledWith(
      '/api/destinos',
    );
  });

  it('informa un error cuando el servidor responde 404', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(obtenerDestinos()).rejects.toThrow(
      'No fue posible obtener los destinos. Error HTTP: 404',
    );
  });

  it('informa un error cuando el servidor responde 500', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(obtenerDestinos()).rejects.toThrow(
      'No fue posible obtener los destinos. Error HTTP: 500',
    );
  });

  it('informa un error cuando falla la conexión', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(
      new TypeError('Failed to fetch'),
    );

    await expect(obtenerDestinos()).rejects.toThrow(
      'No fue posible conectar con el servicio de destinos.',
    );
  });

  it('respeta la cancelación de solicitudes con AbortController', async () => {
    const controller = new AbortController();

    const solicitudControlada = crearPromesaControlada();

    const fetchSimulado = vi.fn().mockReturnValue(
      solicitudControlada.promesa,
    );

    globalThis.fetch = fetchSimulado;

    // Iniciar la consulta con una señal de cancelación.
    const solicitud = obtenerDestinos(controller.signal);

    // Cancelar la espera del consumidor.
    controller.abort();

    // Verificar que se informa un AbortError.
    await expect(solicitud).rejects.toMatchObject({
      name: 'AbortError',
    });

    // La petición compartida no utiliza la señal individual.
    expect(fetchSimulado).toHaveBeenCalledWith(
      '/api/destinos',
    );

    expect(fetchSimulado).toHaveBeenCalledTimes(1);

    // Finalizar la petición compartida para no dejarla pendiente.
    solicitudControlada.resolver(
      crearRespuestaCorrecta(),
    );

    // Esperar a que termine el procesamiento de la respuesta.
    await obtenerDestinos();
  });

  it('reutiliza los destinos almacenados en caché', async () => {
    const fetchSimulado = vi.fn().mockResolvedValue(
      crearRespuestaCorrecta(),
    );

    globalThis.fetch = fetchSimulado;

    // Primera consulta: obtiene los datos desde la API.
    const primerResultado = await obtenerDestinos();

    // Segunda consulta: debe utilizar la caché.
    const segundoResultado = await obtenerDestinos();

    expect(primerResultado).toEqual(destinosSimulados);

    expect(segundoResultado).toEqual(destinosSimulados);

    // Solo se realizó una petición REST.
    expect(fetchSimulado).toHaveBeenCalledTimes(1);
  });

  it('comparte una solicitud pendiente entre dos consumidores', async () => {
    const solicitudControlada = crearPromesaControlada();

    const fetchSimulado = vi.fn().mockReturnValue(
      solicitudControlada.promesa,
    );

    globalThis.fetch = fetchSimulado;

    // Dos consumidores solicitan los destinos simultáneamente.
    const primeraSolicitud = obtenerDestinos();

    const segundaSolicitud = obtenerDestinos();

    // Ambas consultas deben compartir una sola petición REST.
    expect(fetchSimulado).toHaveBeenCalledTimes(1);

    // El servidor entrega la respuesta.
    solicitudControlada.resolver(
      crearRespuestaCorrecta(),
    );

    const [primerResultado, segundoResultado] = await Promise.all([
      primeraSolicitud,
      segundaSolicitud,
    ]);

    expect(primerResultado).toEqual(destinosSimulados);

    expect(segundoResultado).toEqual(destinosSimulados);

    // Confirmar que no se duplicó la petición.
    expect(fetchSimulado).toHaveBeenCalledTimes(1);
  });

  it('permite cancelar un consumidor sin afectar a otro', async () => {
    const primerController = new AbortController();

    const segundoController = new AbortController();

    const solicitudControlada = crearPromesaControlada();

    const fetchSimulado = vi.fn().mockReturnValue(
      solicitudControlada.promesa,
    );

    globalThis.fetch = fetchSimulado;

    // Dos consumidores esperan la misma petición.
    const primeraSolicitud = obtenerDestinos(
      primerController.signal,
    );

    const segundaSolicitud = obtenerDestinos(
      segundoController.signal,
    );

    // Solo existe una petición REST compartida.
    expect(fetchSimulado).toHaveBeenCalledTimes(1);

    // El primer consumidor cancela su espera.
    primerController.abort();

    // El primer consumidor recibe AbortError.
    await expect(primeraSolicitud).rejects.toMatchObject({
      name: 'AbortError',
    });

    // La petición REST continúa para el segundo consumidor.
    solicitudControlada.resolver(
      crearRespuestaCorrecta(),
    );

    // El segundo consumidor recibe correctamente los datos.
    const resultado = await segundaSolicitud;

    expect(resultado).toEqual(destinosSimulados);

    expect(segundoController.signal.aborted).toBe(false);

    // No fue necesario iniciar una segunda petición REST.
    expect(fetchSimulado).toHaveBeenCalledTimes(1);
  });
});