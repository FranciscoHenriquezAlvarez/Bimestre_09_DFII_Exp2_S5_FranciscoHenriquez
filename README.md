# ✈️ MundoViajes — Agencia de Viajes

Aplicación web desarrollada con **React y Vite** que permite explorar destinos turísticos y consultar información de vuelos y hoteles mediante una interfaz intuitiva, moderna y adaptable a diferentes dispositivos.

El proyecto integra una **API REST simulada mediante Mock Service Worker (MSW)** para consultar destinos turísticos y un **servicio GraphQL simulado**, utilizando **Apollo Client**, para obtener información detallada de vuelos y hoteles.

## 🌐 Aplicación publicada

**MundoViajes está disponible en GitHub Pages:**

https://franciscohenriquezalvarez.github.io/Bimestre_09_DFII_Exp2_S5_FranciscoHenriquez/

**Repositorio GitHub:**

https://github.com/FranciscoHenriquezAlvarez/Bimestre_09_DFII_Exp2_S5_FranciscoHenriquez

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
- Cambio entre modo claro y oscuro, conservando la preferencia del usuario.
- Diseño adaptable a dispositivos móviles, tabletas y computadores.
- Pruebas automatizadas de servicios, consultas GraphQL y componentes React.
- Publicación en GitHub Pages mediante `gh-pages`.

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
- **gh-pages:** publicación de la aplicación en GitHub Pages.

## Requisitos previos

Para ejecutar el proyecto es necesario contar con:

- Node.js compatible con Vite 8.
- npm.
- Un navegador web moderno.

## Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/FranciscoHenriquezAlvarez/Bimestre_09_DFII_Exp2_S5_FranciscoHenriquez.git
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

### Vista previa de producción

Para generar los archivos de producción:

```bash
npm run build
```

Para ejecutar una vista previa:

```bash
npm run preview
```

Se debe abrir la dirección completa indicada por Vite, incluyendo la ruta base del repositorio.

### Publicación en GitHub Pages

Para publicar la aplicación:

```bash
npm run deploy
```

Este comando ejecuta automáticamente:

1. `predeploy`, que genera los archivos de producción mediante `npm run build`.
2. `deploy`, que publica la carpeta `dist` utilizando `gh-pages`.

La publicación utiliza la rama `gh-pages` y la carpeta raíz `/(root)`.

## Estructura del proyecto

```text
public/
├── 404.html
├── favicon.svg
├── icons.svg
└── mockServiceWorker.js

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
│   ├── setup.js
│   ├── destinosService.test.js
│   ├── Destinos.test.jsx
│   ├── graphqlQueries.test.js
│   └── DetalleDestino.test.jsx
├── App.jsx
├── index.css
└── main.jsx

index.html
package.json
vite.config.js
README.md
```

### Organización

- **public:** archivos estáticos, iconos y recursos para GitHub Pages y MSW.
- **components:** componentes reutilizables de la interfaz.
- **graphql:** configuración de Apollo Client y consultas GraphQL.
- **mocks:** configuración y controladores de los servicios simulados.
- **pages:** componentes correspondientes a las distintas páginas.
- **services:** funciones de comunicación con la API REST.
- **test:** configuración y pruebas automatizadas de servicios, consultas y componentes.
- **App.jsx:** configuración general de la aplicación y sus rutas.
- **index.css:** estilos globales.
- **main.jsx:** punto de entrada de React.
- **vite.config.js:** configuración de Vite, Vitest y la ruta base de publicación.

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

Los destinos disponibles son **París, Roma, Tokio y Cancún**.

La información se obtiene dinámicamente mediante la API REST simulada.

En GitHub Pages, el endpoint utiliza la ruta base del repositorio para mantener la compatibilidad con el alojamiento.

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

Además, el servicio REST utiliza una caché en memoria para reutilizar información previamente consultada y `AbortController` para gestionar la cancelación de solicitudes.

Apollo Client administra las consultas GraphQL y su caché de resultados.

## Interfaz y navegación

La aplicación dispone de las siguientes secciones:

- **Inicio:** presentación de MundoViajes y acceso a los destinos turísticos