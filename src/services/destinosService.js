// URL de la API REST compatible con desarrollo y GitHub Pages.
const API_URL = `${import.meta.env.BASE_URL}api/destinos`;

// Caché en memoria para reutilizar respuestas correctas.
const cache = new Map();

// Registro de solicitudes pendientes para evitar consultas duplicadas.
const solicitudesPendientes = new Map();

/**
 * Obtiene los destinos desde la API REST.
 *
 * - Reutiliza los datos almacenados en caché.
 * - Comparte solicitudes que todavía están pendientes.
 * - Permite cancelar la espera de cada consumidor mediante AbortController.
 * - No almacena respuestas fallidas en caché.
 */
export async function obtenerDestinos(signal) {
  // Respetar las solicitudes que ya fueron canceladas.
  if (signal?.aborted) {
    throw new DOMException(
      'La solicitud fue cancelada.',
      'AbortError'
    );
  }

  // 1. Reutilizar datos disponibles en caché.
  if (cache.has(API_URL)) {
    return cache.get(API_URL);
  }

  // 2. Comprobar si ya existe una solicitud en curso.
  let solicitud = solicitudesPendientes.get(API_URL);

  if (!solicitud) {
    // La solicitud compartida no depende del AbortController
    // de un componente individual.
    solicitud = (async () => {
      let respuesta;

      try {
        respuesta = await fetch(API_URL);
      } catch {
        throw new Error(
          'No fue posible conectar con el servicio de destinos.'
        );
      }

      if (!respuesta.ok) {
        throw new Error(
          `No fue posible obtener los destinos. Error HTTP: ${respuesta.status}`
        );
      }

      let datos;

      try {
        datos = await respuesta.json();
      } catch {
        throw new Error(
          'La respuesta del servicio de destinos no es válida.'
        );
      }

      if (!Array.isArray(datos)) {
        throw new Error(
          'El servicio devolvió un formato de destinos inesperado.'
        );
      }

      // Guardar únicamente las respuestas correctas.
      cache.set(API_URL, datos);

      return datos;
    })();

    solicitudesPendientes.set(API_URL, solicitud);

    // Eliminar el registro cuando termine, con éxito o error.
    // Usamos then con ambos manejadores para evitar crear
    // una promesa rechazada sin gestionar.
    solicitud.then(
      () => {
        if (solicitudesPendientes.get(API_URL) === solicitud) {
          solicitudesPendientes.delete(API_URL);
        }
      },
      () => {
        if (solicitudesPendientes.get(API_URL) === solicitud) {
          solicitudesPendientes.delete(API_URL);
        }
      }
    );
  }

  // 3. Si no se proporciona señal, compartir la promesa directamente.
  if (!signal) {
    return solicitud;
  }

  // 4. Permitir que cada componente cancele su propia espera,
  // sin interrumpir la solicitud compartida de otros componentes.
  return new Promise((resolve, reject) => {
    let finalizado = false;

    function limpiar() {
      signal.removeEventListener('abort', cancelar);
    }

    function cancelar() {
      if (finalizado) {
        return;
      }

      finalizado = true;
      limpiar();

      reject(
        new DOMException(
          'La solicitud fue cancelada.',
          'AbortError'
        )
      );
    }

    signal.addEventListener('abort', cancelar, {
      once: true,
    });

    // Cubrir una cancelación ocurrida durante la suscripción.
    if (signal.aborted) {
      cancelar();
      return;
    }

    solicitud.then(
      (datos) => {
        if (finalizado) {
          return;
        }

        finalizado = true;
        limpiar();
        resolve(datos);
      },
      (error) => {
        if (finalizado) {
          return;
        }

        finalizado = true;
        limpiar();
        reject(error);
      }
    );
  });
}

/**
 * Limpia la caché para permitir una consulta REST nueva.
 *
 * Se utilizará cuando el usuario solicite reintentar
 * o actualizar los datos.
 */
export function limpiarCacheDestinos() {
  cache.delete(API_URL);
}