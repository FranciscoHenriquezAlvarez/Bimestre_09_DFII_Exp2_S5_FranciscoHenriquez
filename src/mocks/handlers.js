import { http, HttpResponse, graphql } from 'msw';

// ========================================
// DATOS SIMULADOS DE DESTINOS TURÍSTICOS
// ========================================

const destinos = [
  {
    id: 'paris',
    nombre: 'París',
    pais: 'Francia',
    descripcion:
      'Descubre la ciudad del amor, sus monumentos históricos y su gastronomía.',
    actividades: [
      'Visitar la Torre Eiffel',
      'Recorrer el Museo del Louvre',
      'Pasear por el río Sena',
    ],
  },
  {
    id: 'roma',
    nombre: 'Roma',
    pais: 'Italia',
    descripcion:
      'Explora la historia, la arquitectura y la gastronomía de la capital italiana.',
    actividades: [
      'Visitar el Coliseo',
      'Conocer el Vaticano',
      'Recorrer la Fontana di Trevi',
    ],
  },
  {
    id: 'tokio',
    nombre: 'Tokio',
    pais: 'Japón',
    descripcion:
      'Una ciudad que combina tradición, tecnología y cultura japonesa.',
    actividades: [
      'Visitar el templo Sensō-ji',
      'Recorrer Shibuya',
      'Conocer los jardines japoneses',
    ],
  },
  {
    id: 'cancun',
    nombre: 'Cancún',
    pais: 'México',
    descripcion:
      'Disfruta de playas paradisíacas y experiencias inolvidables.',
    actividades: [
      'Disfrutar de las playas',
      'Visitar Chichén Itzá',
      'Practicar snorkel',
    ],
  },
];

// ========================================
// DATOS SIMULADOS DE VUELOS
// ========================================

const vuelos = [
  {
    id: 'vuelo-1',
    destinoId: 'paris',
    aerolinea: 'Air France',
    origen: 'Santiago de Chile',
    destino: 'París',
    precio: 950000,
    duracion: '14 horas',
    fechaSalida: '2027-01-15',
    fechaLlegada: '2027-01-16',
    asientosDisponibles: 12,
  },
  {
    id: 'vuelo-2',
    destinoId: 'paris',
    aerolinea: 'LATAM Airlines',
    origen: 'Santiago de Chile',
    destino: 'París',
    precio: 890000,
    duracion: '16 horas',
    fechaSalida: '2027-02-10',
    fechaLlegada: '2027-02-11',
    asientosDisponibles: 8,
  },
  {
    id: 'vuelo-3',
    destinoId: 'roma',
    aerolinea: 'Iberia',
    origen: 'Santiago de Chile',
    destino: 'Roma',
    precio: 870000,
    duracion: '17 horas',
    fechaSalida: '2027-01-20',
    fechaLlegada: '2027-01-21',
    asientosDisponibles: 15,
  },
  {
    id: 'vuelo-4',
    destinoId: 'roma',
    aerolinea: 'Air France',
    origen: 'Santiago de Chile',
    destino: 'Roma',
    precio: 920000,
    duracion: '18 horas',
    fechaSalida: '2027-02-18',
    fechaLlegada: '2027-02-19',
    asientosDisponibles: 6,
  },
  {
    id: 'vuelo-5',
    destinoId: 'tokio',
    aerolinea: 'Japan Airlines',
    origen: 'Santiago de Chile',
    destino: 'Tokio',
    precio: 1350000,
    duracion: '25 horas',
    fechaSalida: '2027-03-05',
    fechaLlegada: '2027-03-07',
    asientosDisponibles: 10,
  },
  {
    id: 'vuelo-6',
    destinoId: 'tokio',
    aerolinea: 'LATAM Airlines',
    origen: 'Santiago de Chile',
    destino: 'Tokio',
    precio: 1280000,
    duracion: '27 horas',
    fechaSalida: '2027-03-15',
    fechaLlegada: '2027-03-17',
    asientosDisponibles: 4,
  },
  {
    id: 'vuelo-7',
    destinoId: 'cancun',
    aerolinea: 'Copa Airlines',
    origen: 'Santiago de Chile',
    destino: 'Cancún',
    precio: 580000,
    duracion: '11 horas',
    fechaSalida: '2027-01-12',
    fechaLlegada: '2027-01-12',
    asientosDisponibles: 20,
  },
  {
    id: 'vuelo-8',
    destinoId: 'cancun',
    aerolinea: 'LATAM Airlines',
    origen: 'Santiago de Chile',
    destino: 'Cancún',
    precio: 620000,
    duracion: '10 horas',
    fechaSalida: '2027-02-22',
    fechaLlegada: '2027-02-22',
    asientosDisponibles: 9,
  },
];

// ========================================
// DATOS SIMULADOS DE HOTELES
// ========================================

const hoteles = [
  {
    id: 'hotel-1',
    destinoId: 'paris',
    nombre: 'Hotel Eiffel Seine',
    ciudad: 'París',
    estrellas: 3,
    precioNoche: 120000,
    fechaEntrada: '2027-01-16',
    fechaSalida: '2027-01-22',
    habitacionesDisponibles: 5,
  },
  {
    id: 'hotel-2',
    destinoId: 'paris',
    nombre: 'Paris Marriott Champs Elysees',
    ciudad: 'París',
    estrellas: 5,
    precioNoche: 280000,
    fechaEntrada: '2027-02-11',
    fechaSalida: '2027-02-17',
    habitacionesDisponibles: 3,
  },
  {
    id: 'hotel-3',
    destinoId: 'roma',
    nombre: 'Hotel Artemide',
    ciudad: 'Roma',
    estrellas: 4,
    precioNoche: 145000,
    fechaEntrada: '2027-01-21',
    fechaSalida: '2027-01-27',
    habitacionesDisponibles: 7,
  },
  {
    id: 'hotel-4',
    destinoId: 'roma',
    nombre: 'Rome Cavalieri',
    ciudad: 'Roma',
    estrellas: 5,
    precioNoche: 310000,
    fechaEntrada: '2027-02-19',
    fechaSalida: '2027-02-25',
    habitacionesDisponibles: 2,
  },
  {
    id: 'hotel-5',
    destinoId: 'tokio',
    nombre: 'Shinjuku Granbell Hotel',
    ciudad: 'Tokio',
    estrellas: 4,
    precioNoche: 135000,
    fechaEntrada: '2027-03-07',
    fechaSalida: '2027-03-14',
    habitacionesDisponibles: 8,
  },
  {
    id: 'hotel-6',
    destinoId: 'tokio',
    nombre: 'Park Hyatt Tokyo',
    ciudad: 'Tokio',
    estrellas: 5,
    precioNoche: 350000,
    fechaEntrada: '2027-03-17',
    fechaSalida: '2027-03-24',
    habitacionesDisponibles: 2,
  },
  {
    id: 'hotel-7',
    destinoId: 'cancun',
    nombre: 'Hotel Riu Cancun',
    ciudad: 'Cancún',
    estrellas: 4,
    precioNoche: 160000,
    fechaEntrada: '2027-01-12',
    fechaSalida: '2027-01-19',
    habitacionesDisponibles: 12,
  },
  {
    id: 'hotel-8',
    destinoId: 'cancun',
    nombre: 'Hyatt Ziva Cancun',
    ciudad: 'Cancún',
    estrellas: 5,
    precioNoche: 320000,
    fechaEntrada: '2027-02-22',
    fechaSalida: '2027-03-01',
    habitacionesDisponibles: 4,
  },
];

// ========================================
// ENDPOINTS REST Y GRAPHQL
// ========================================

export const handlers = [
  // ----------------------------------------
  // REST: Obtener todos los destinos
  // ----------------------------------------

  http.get('/api/destinos', () => {
    return HttpResponse.json(destinos);
  }),

  // ----------------------------------------
  // GRAPHQL: Obtener vuelos por destino
  // ----------------------------------------

  graphql.query('ObtenerVuelos', ({ variables }) => {
    const { destinoId } = variables;

    const vuelosFiltrados = vuelos
      .filter((vuelo) => vuelo.destinoId === destinoId)
      .map((vuelo) => ({
        id: vuelo.id,
        aerolinea: vuelo.aerolinea,
        origen: vuelo.origen,
        destino: vuelo.destino,
        precio: vuelo.precio,
        duracion: vuelo.duracion,
        fechaSalida: vuelo.fechaSalida,
        fechaLlegada: vuelo.fechaLlegada,
        asientosDisponibles: vuelo.asientosDisponibles,
      }));

    return HttpResponse.json({
      data: {
        vuelos: vuelosFiltrados,
      },
    });
  }),

  // ----------------------------------------
  // GRAPHQL: Obtener hoteles por destino
  // ----------------------------------------

  graphql.query('ObtenerHoteles', ({ variables }) => {
    const { destinoId } = variables;

    const hotelesFiltrados = hoteles
      .filter((hotel) => hotel.destinoId === destinoId)
      .map((hotel) => ({
        id: hotel.id,
        nombre: hotel.nombre,
        ciudad: hotel.ciudad,
        estrellas: hotel.estrellas,
        precioNoche: hotel.precioNoche,
        fechaEntrada: hotel.fechaEntrada,
        fechaSalida: hotel.fechaSalida,
        habitacionesDisponibles: hotel.habitacionesDisponibles,
      }));

    return HttpResponse.json({
      data: {
        hoteles: hotelesFiltrados,
      },
    });
  }),
];