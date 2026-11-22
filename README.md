# ✈️ MundoViajes — Agencia de Viajes

Aplicación web desarrollada con **React y Vite** que permite explorar destinos turísticos y consultar información de vuelos y hoteles mediante una interfaz intuitiva y adaptable a diferentes dispositivos.

El proyecto integra una **API REST simulada mediante Mock Service Worker (MSW)** para consultar destinos turísticos y un **servicio GraphQL simulado**, utilizando **Apollo Client**, para obtener información detallada de vuelos y hoteles.

## Características principales

- Exploración de destinos turísticos internacionales.
- Visualización de información y actividades de cada destino.
- Navegación entre páginas mediante React Router.
- Consultas HTTP utilizando la API Fetch.
- Simulación de servicios REST mediante Mock Service Worker.
- Consultas GraphQL mediante Apollo Client.
- Visualización de vuelos y hoteles asociados a cada destino.
- Presentación de precios, fechas y disponibilidad.
- Gestión de estados de carga, error y ausencia de resultados.
- Manejo de errores y posibilidad de reintentar consultas.
- Optimización de solicitudes REST mediante caché en memoria.
- Cancelación de solicitudes mediante AbortController.
- Diseño adaptable a dispositivos móviles, tabletas y computadores.
- Pruebas automatizadas de servicios, consultas GraphQL y componentes React.

## Tecnologías utilizadas

- **React 19:** desarrollo de componentes e interfaces de usuario.
- **Vite 8:** entorno de desarrollo y compilación.
- **JavaScript:** lógica y funcionalidades de la aplicación.
- **React Router:** navegación y gestión de rutas.
- **CSS3:** estilos y diseño adaptable.
- **Mock Service Worker (MSW):** simulación de servicios REST y GraphQL.
- **Fetch API:** realización de solicitudes HTTP.
- **GraphQL:** consultas estructuradas de vuelos y hoteles.
- **Apollo Client 4:** ejecución de consultas GraphQL y gestión de resultados.
- **Vitest:** ejecución de pruebas automatizadas.
- **React Testing Library:** pruebas de componentes e interacciones.
- **ESLint:** análisis estático y verificación del código.

## Requisitos previos

Para ejecutar el proyecto es necesario contar con:

- Node.js compatible con Vite 8.
- npm.

## Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone URL_DEL_REPOSITORIO
```

**2. Acceder al directorio del proyecto**

```bash
cd Bimestre_09_DFII_Exp2_S5_FranciscoHenriquez
```

**3. Instalar las dependencias**

```bash
npm install
```

**4. Iniciar el entorno de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en la dirección local indicada por Vite.

El proyecto incluye el archivo `public/mockServiceWorker.js`, necesario para el funcionamiento de Mock Service Worker.

## Estructura del proyecto

```text
src/
├── components/
│   └── DestinoCard.jsx
├── graphql/
│   ├── client.js
│   └── queries.js
├── mocks/
│   ├── browser.js
│   └── handlers.js
├── pages/
│   ├── Inicio.jsx
│   ├── Destinos.jsx
│   ├── DetalleDestino.jsx
│   └── NotFound.jsx
├── services/
│   └── destinosService.js
├── test/
│   ├── destinosService.test.js
│   ├── Destinos.test.jsx
│   ├── graphqlQueries.test.js
│   └── DetalleDestino.test.jsx
├── App.jsx
├── index.css
└── main.jsx
```

### Organización

- **components:** componentes reutilizables de la interfaz.
- **graphql:** configuración de Apollo Client y consultas GraphQL.
- **mocks:** configuración y controladores de los servicios simulados.
- **pages:** componentes correspondientes a las distintas páginas.
- **services:** funciones de comunicación con la API REST.
- **test:** pruebas automatizadas de servicios, consultas y componentes.
- **App.jsx:** configuración general de la aplicación y sus rutas.
- **index.css:** estilos globales.
- **main.jsx:** punto de entrada de React.

## API REST simulada

La aplicación utiliza Mock Service Worker para interceptar solicitudes HTTP y proporcionar respuestas basadas en datos ficticios.

### Consultar destinos turísticos

```http
GET /api/destinos
```

Obtiene el listado de destinos turísticos disponibles.

Cada destino incluye:

- Identificador.
- Nombre.
- País.
- Descripción.
- Actividades turísticas.

Los destinos disponibles son París, Roma, Tokio y Cancún.

La información se obtiene dinámicamente mediante la API REST simulada.

## Servicio GraphQL simulado

La aplicación utiliza Apollo Client para ejecutar consultas GraphQL y obtener información relacionada con los destinos turísticos.

Mock Service Worker intercepta las consultas y proporciona respuestas simuladas.

### Consultar vuelos por destino

**Operación:** `ObtenerVuelos`

```graphql
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
```

Obtiene los vuelos asociados al destino seleccionado, incluyendo precios, duración, fechas y disponibilidad de asientos.

### Consultar hoteles por destino

**Operación:** `ObtenerHoteles`

```graphql
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
```

Obtiene los hoteles asociados al destino seleccionado, incluyendo categoría, precio por noche, fechas y disponibilidad de habitaciones.

Ambas consultas utilizan el identificador del destino para recuperar la información correspondiente.

## Gestión de solicitudes

La comunicación con los servicios REST y GraphQL contempla diferentes situaciones:

- **Carga:** se informa al usuario mientras se procesa una solicitud.
- **Consulta exitosa:** se presentan los datos obtenidos.
- **Error:** se muestra un mensaje y una opción para reintentar.
- **Sin resultados:** se informa cuando no existen datos disponibles.
- **Destino inexistente:** se presenta un mensaje cuando el destino solicitado no existe.

Además, el servicio REST utiliza una caché en memoria para reutilizar información previamente consultada y AbortController para gestionar la cancelación de solicitudes.

Apollo Client administra las consultas GraphQL y su caché de resultados.

## Interfaz y navegación

La aplicación dispone de las siguientes secciones:

- **Inicio:** presentación de MundoViajes y acceso a los destinos turísticos.
- **Destinos:** exploración de destinos internacionales y sus actividades.
- **Detalle del destino:** visualización de vuelos y hoteles relacionados con el destino seleccionado.
- **Página no encontrada:** mensaje para rutas inexistentes.

### Rutas disponibles

| Ruta | Descripción |
| --- | --- |
| `/` | Página de inicio. |
| `/destinos` | Listado de destinos turísticos. |
| `/destinos/:id` | Vuelos y hoteles del destino seleccionado. |
| Otras rutas | Página no encontrada. |

La navegación se realiza mediante React Router, sin necesidad de recargar completamente la aplicación.

## Pruebas y verificaciones

El proyecto dispone de comandos para comprobar su funcionamiento y calidad de código.

**Análisis estático:**

```bash
npm run lint
```

**Ejecución de pruebas:**

```bash
npm run test
```

**Compilación de producción:**

```bash
npm run build
```

### Pruebas automatizadas

Se implementaron pruebas utilizando Vitest y React Testing Library.

| Archivo | Pruebas |
| --- | ---: |
| `destinosService.test.js` | 8 |
| `Destinos.test.jsx` | 5 |
| `graphqlQueries.test.js` | 5 |
| `DetalleDestino.test.jsx` | 7 |
| **Total** | **25** |

Las pruebas comprueban:

- Obtención de información mediante REST.
- Manejo de errores y respuestas del servicio.
- Visualización de destinos turísticos.
- Estructura de las consultas GraphQL.
- Utilización del identificador del destino.
- Presentación de vuelos y hoteles.
- Visualización de fechas y disponibilidad.
- Manejo de errores y ausencia de resultados.

Las **25 pruebas automatizadas fueron ejecutadas satisfactoriamente**.

### Comprobación de respuestas y navegación

Para verificar el funcionamiento de la aplicación, es posible:

- Acceder a `/destinos` para consultar los destinos disponibles.
- Seleccionar un destino para visualizar sus vuelos y hoteles.
- Acceder a `/destinos/no-existe` para comprobar el tratamiento de destinos inexistentes.
- Revisar las solicitudes REST y GraphQL desde las herramientas de desarrollo del navegador.
- Comprobar la navegación entre las distintas páginas.

## Diseño adaptable

La interfaz está diseñada para ajustarse a diferentes resoluciones de pantalla, facilitando la navegación y consulta de información desde computadores, tabletas y dispositivos móviles.

Se verificó el funcionamiento de la aplicación en distintos tamaños de pantalla, comprobando la distribución de las tarjetas, la legibilidad de los contenidos y la navegación.

---

**MundoViajes | Desarrollo Frontend II**