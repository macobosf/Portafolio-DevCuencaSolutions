export interface Programmer {
  id: string;
  nombre: string;
  email: string;
  especialidad: string;
  descripcionBreve?: string;
  descripcion: string;
  foto: string;
  github: string;
  linkedin: string;
  activo: boolean;
  slug: string;
  tecnologias: string[];
}

export interface Project {
  id: string;
  nombre: string;
  slug: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  tipo: 'academico' | 'personal' | 'laboral' | 'simulado';
  tecnologias: string[];
  repoUrl: string;
  demoUrl: string;
  destacado: boolean;
  programadorIds: string[];
}

export interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface ContactRequest {
  id: string;
  uid: string;
  nombreSolicitante: string;
  correo: string;
  descripcion: string;
  programadorId: string;
  programadorEmail: string;
  fechaCreacion: string;
  estado: 'Pendiente' | 'Atendida';
  observacion: string;
}

export const PROGRAMADORES: Programmer[] = [
  {
    id: '1',
    nombre: 'Marco Antonio Cobos Farfán',
    email: 'marcocobos15@gmail.com',
    especialidad: 'Redes Mikrotik/Cisco & Desarrollo Web',
    descripcion:
      'Especialista en infraestructura de redes con experiencia en Mikrotik y Cisco, y desarrollador web full-stack con Angular y TypeScript. Combino el mundo de las redes con el desarrollo para ofrecer soluciones tecnológicas integrales a empresas y proyectos personales.',
    foto: 'https://ui-avatars.com/api/?name=Marco+Cobos&background=1d4ed8&color=fff&size=200',
    github: 'https://github.com/macobosf',
    linkedin: 'https://linkedin.com/in/marcocobos',
    activo: true,
    slug: 'marco-cobos',
    tecnologias: ['Mikrotik', 'Cisco', 'Angular', 'Node.js', 'TypeScript', 'PostgreSQL', 'Linux', 'VLAN/VPN', 'OSPF/BGP', 'Firewall'],
  },
  {
    id: '2',
    nombre: 'Christian Ismael Astudillo Vásquez',
    email: 'christian.astudillo@gmail.com',
    especialidad: 'Sistemas, Desarrollo Web y Java',
    descripcionBreve: 'Desarrollador especializado en sistemas, desarrollo web y Java',
    descripcion:
      'Profesional con experiencia en desarrollo de sistemas empresariales, aplicaciones web y desarrollo backend con Java. Apasionado por crear soluciones robustas y escalables.',
    foto: 'https://ui-avatars.com/api/?name=Christian+Astudillo&background=1d4ed8&color=fff&size=200',
    github: 'https://github.com/chris-astu',
    linkedin: 'https://linkedin.com/in/chris-astu',
    activo: true,
    slug: 'christian-astudillo',
    tecnologias: ['Java', 'Spring Boot', 'HTML', 'CSS', 'JavaScript', 'MySQL', 'Git', 'Bootstrap', 'JPA', 'Maven'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    nombre: 'Proyectos Angular',
    slug: 'proyectos-angular',
    descripcionBreve:
      'Colección de proyectos web desarrollados con Angular, incluyendo aplicaciones con Angular 21.',
    descripcionCompleta:
      'Repositorio con múltiples proyectos Angular: una aplicación generada con PPW y una aplicación con Angular 21 que explora las últimas características del framework como signals, componentes standalone, control flow nativo y lazy loading de rutas.',
    tipo: 'personal',
    tecnologias: ['Angular', 'Angular 21', 'TypeScript', 'HTML', 'CSS'],
    repoUrl: 'https://github.com/macobosf/Angular',
    demoUrl: '',
    destacado: true,
    programadorIds: ['1'],
  },
  {
    id: '2',
    nombre: 'React Store',
    slug: 'react-store',
    descripcionBreve:
      'Tienda en línea desarrollada con React y TypeScript como práctica de desarrollo frontend.',
    descripcionCompleta:
      'Aplicación de e-commerce construida con React y TypeScript. Implementa manejo de estado, listado de productos, carrito de compras y navegación entre vistas. Proyecto orientado a consolidar el uso de hooks, componentes funcionales y buenas prácticas de React moderno.',
    tipo: 'personal',
    tecnologias: ['React', 'TypeScript', 'HTML', 'CSS'],
    repoUrl: 'https://github.com/macobosf/React',
    demoUrl: '',
    destacado: true,
    programadorIds: ['1'],
  },
  {
    id: '3',
    nombre: 'Astro Campus',
    slug: 'astro-campus',
    descripcionBreve:
      'Sitio web educativo tipo campus virtual construido con el framework Astro.',
    descripcionCompleta:
      'Proyecto de sitio web estático con arquitectura de islas construido con Astro. Diseñado como plataforma tipo campus educativo, aprovecha la generación estática de Astro para lograr excelente rendimiento y SEO. Explora el modelo de componentes de Astro y su integración con otros frameworks.',
    tipo: 'personal',
    tecnologias: ['Astro', 'HTML', 'CSS', 'JavaScript'],
    repoUrl: 'https://github.com/macobosf/Astro',
    demoUrl: '',
    destacado: true,
    programadorIds: ['1'],
  },
  {
    id: '4',
    nombre: 'Fundamentos de JavaScript',
    slug: 'fundamentos-javascript',
    descripcionBreve:
      'Prácticas progresivas de JavaScript: sintaxis, DOM, eventos, asincronía y más.',
    descripcionCompleta:
      'Repositorio de prácticas organizadas por tema para aprender JavaScript desde sus fundamentos. Cubre sintaxis básica, manipulación del DOM, manejo de eventos, programación asíncrona con Promises y async/await, y ejercicios avanzados. Estructura pensada para el aprendizaje incremental.',
    tipo: 'academico',
    tecnologias: ['JavaScript', 'HTML', 'CSS', 'DOM API'],
    repoUrl: 'https://github.com/macobosf/JavaScript',
    demoUrl: '',
    destacado: false,
    programadorIds: ['1'],
  },
  {
    id: '5',
    nombre: 'Sistema de Biblioteca',
    slug: 'sistema-biblioteca',
    descripcionBreve:
      'Sistema web para gestión de biblioteca: registro de libros, préstamos y devoluciones en PHP.',
    descripcionCompleta:
      'Proyecto final académico: sistema completo de gestión de biblioteca desarrollado en PHP con MySQL. Incluye módulos para registro de libros, control de préstamos, renovaciones, historial de usuarios y motor de búsqueda. Arquitectura MVC básica con separación de conexiones y vistas.',
    tipo: 'academico',
    tecnologias: ['PHP', 'MySQL', 'HTML', 'CSS'],
    repoUrl: 'https://github.com/macobosf/Proyecto_Final',
    demoUrl: '',
    destacado: false,
    programadorIds: ['1'],
  },
  {
    id: '6',
    nombre: 'Sistema de Parqueadero',
    slug: 'sistema-parqueadero',
    descripcionBreve:
      'Aplicación Java EE para gestión de parqueadero con JakartaEE, JPA y despliegue en WildFly.',
    descripcionCompleta:
      'Sistema de gestión de parqueadero desarrollado con Jakarta EE sobre servidor WildFly. Utiliza JPA para la persistencia de datos con una unidad de persistencia propia. Construido con Maven e incluye configuración de datasource para entornos de producción. Proyecto académico de arquitectura empresarial Java.',
    tipo: 'academico',
    tecnologias: ['Java EE', 'JakartaEE', 'JPA', 'WildFly', 'Maven'],
    repoUrl: 'https://github.com/macobosf/Parqueadero',
    demoUrl: '',
    destacado: false,
    programadorIds: ['1'],
  },
  {
    id: '7',
    nombre: 'Consumo de APIs en la Nube',
    slug: 'consumo-apis-nube',
    descripcionBreve:
      'Práctica de integración con servicios cloud mediante consumo de APIs REST con JavaScript.',
    descripcionCompleta:
      'Proyecto académico enfocado en el consumo de APIs alojadas en la nube utilizando JavaScript. Explora peticiones HTTP, manejo de respuestas JSON, autenticación con tokens y visualización de datos provenientes de servicios externos. Introducción práctica a la integración con plataformas cloud.',
    tipo: 'academico',
    tecnologias: ['JavaScript', 'REST API', 'JSON', 'Cloud'],
    repoUrl: 'https://github.com/macobosf/Practica01-Consumo-de-APIs-en-la-nube',
    demoUrl: '',
    destacado: false,
    programadorIds: ['1'],
  },
  {
    id: '8',
    nombre: 'QoS Network Dashboard',
    slug: 'qos-network-dashboard',
    descripcionBreve:
      'Dashboard web para visualización de métricas de calidad de servicio (QoS) en redes.',
    descripcionCompleta:
      'Proyecto web que implementa un dashboard interactivo para monitorear y visualizar métricas de calidad de servicio en infraestructuras de red. Permite representar datos de latencia, ancho de banda y priorización de tráfico mediante una interfaz construida con HTML, CSS y JavaScript.',
    tipo: 'academico',
    tecnologias: ['HTML', 'CSS', 'JavaScript'],
    repoUrl: 'https://github.com/christianastudillo/qos-network-dashboard',
    demoUrl: '',
    destacado: true,
    programadorIds: ['2'],
  },
  {
    id: '9',
    nombre: 'Angular App — ICC PPW',
    slug: 'icc-ppw-angular',
    descripcionBreve:
      'Aplicación web desarrollada con Angular y TypeScript en el curso de Programación Web.',
    descripcionCompleta:
      'Proyecto académico del curso ICC de Programación para la Web. Desarrollado con Angular y TypeScript, explora componentes standalone, routing, servicios e integración con APIs. Demuestra el dominio del ecosistema Angular moderno.',
    tipo: 'academico',
    tecnologias: ['Angular', 'TypeScript', 'HTML', 'CSS'],
    repoUrl: 'https://github.com/christianastudillo/icc-ppw-angular',
    demoUrl: '',
    destacado: true,
    programadorIds: ['2'],
  },
  {
    id: '10',
    nombre: 'React App — ICC PPW',
    slug: 'icc-ppw-react',
    descripcionBreve:
      'Aplicación web con React y TypeScript del curso de Programación Web.',
    descripcionCompleta:
      'Proyecto académico del curso ICC PPW construido con React y TypeScript. Implementa componentes funcionales, hooks y manejo de estado para una aplicación web interactiva. Parte de una serie que cubre múltiples frameworks modernos.',
    tipo: 'academico',
    tecnologias: ['React', 'TypeScript', 'HTML', 'CSS'],
    repoUrl: 'https://github.com/christianastudillo/icc-ppw-react',
    demoUrl: '',
    destacado: false,
    programadorIds: ['2'],
  },
  {
    id: '11',
    nombre: 'Astro Web Site — ICC PPW',
    slug: 'icc-ppw-astro',
    descripcionBreve:
      'Sitio web estático de alto rendimiento construido con el framework Astro.',
    descripcionCompleta:
      'Proyecto académico del curso ICC PPW que explora el framework Astro para sitios web estáticos. Aprovecha la arquitectura de islas y la generación estática para conseguir excelente rendimiento y SEO, integrando múltiples tecnologías web.',
    tipo: 'academico',
    tecnologias: ['Astro', 'HTML', 'CSS', 'JavaScript'],
    repoUrl: 'https://github.com/christianastudillo/icc-ppw-astro',
    demoUrl: '',
    destacado: false,
    programadorIds: ['2'],
  },
  {
    id: '12',
    nombre: 'Estructuras de Datos No Lineales',
    slug: 'estructuras-datos-no-lineales',
    descripcionBreve:
      'Implementación de estructuras no lineales en Java: árboles, grafos y mapas.',
    descripcionCompleta:
      'Proyecto académico del curso ICC de Estructuras de Datos que implementa y analiza estructuras no lineales en Java. Cubre árboles binarios de búsqueda, grafos dirigidos, mapas y sus aplicaciones en algoritmos de recorrido y búsqueda eficiente.',
    tipo: 'academico',
    tecnologias: ['Java'],
    repoUrl: 'https://github.com/christianastudillo/icc-est-u2-estructurasNoLineales',
    demoUrl: '',
    destacado: false,
    programadorIds: ['2'],
  },
];

export const SERVICES: Service[] = [
  {
    id: '1',
    nombre: 'Redes Mikrotik & Cisco',
    descripcion:
      'Configuración, administración y soporte de infraestructura de red. Instalación de routers Mikrotik, switches Cisco, VLANs, VPNs, firewall y monitoreo de red empresarial.',
    icono: 'network',
  },
  {
    id: '2',
    nombre: 'Desarrollo Frontend',
    descripcion:
      'Creación de interfaces web modernas y responsive con Angular, TypeScript y TailwindCSS. Aplicaciones rápidas, accesibles y con excelente experiencia de usuario.',
    icono: 'code',
  },
  {
    id: '3',
    nombre: 'Desarrollo Backend',
    descripcion:
      'Diseño e implementación de APIs REST robustas con Node.js, Express y bases de datos relacionales. Autenticación segura y arquitectura escalable.',
    icono: 'server',
  },
];

export const CONTACT_REQUESTS: ContactRequest[] = [
  {
    id: '1',
    uid: 'demo-uid-1',
    nombreSolicitante: 'Carlos Mendoza',
    correo: 'carlos@empresa.com',
    descripcion:
      'Necesito configurar una red Mikrotik para mi empresa de 20 empleados con acceso seguro a internet y VPN para trabajo remoto.',
    programadorId: '1',
    programadorEmail: 'marcocobos15@gmail.com',
    fechaCreacion: '2026-05-15',
    estado: 'Atendida',
    observacion:
      'Agendamos reunión para el martes a las 10am para revisar los requerimientos técnicos.',
  },
  {
    id: '2',
    uid: 'demo-uid-2',
    nombreSolicitante: 'Ana García',
    correo: 'ana@startup.io',
    descripcion:
      'Busco desarrollador para crear el frontend de nuestra plataforma SaaS. Necesitamos una interfaz moderna con Angular y integración con nuestra API.',
    programadorId: '1',
    programadorEmail: 'marcocobos15@gmail.com',
    fechaCreacion: '2026-05-20',
    estado: 'Pendiente',
    observacion: '',
  },
];
