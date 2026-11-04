/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Noticia, Evento, Persona, Taller, InformacionInstitucional, Postulacion, MensajeContacto } from './types';

export const INITIAL_INFO: InformacionInstitucional = {
  nombreEscuela: "Escuela Bernardo O'Higgins",
  ubicacion: "Av. Copayapu 1230, Copiapó, Región de Atacama, Chile",
  comuna: "Copiapó",
  ciudad: "Copiapó",
  slogan: "Forjando el futuro con valores, inclusión y excelencia académica en Atacama",
  historia: "Fundada a mediados del siglo XX en Copiapó, la Escuela Bernardo O'Higgins ha sido un pilar fundamental en la educación de generaciones de copiapinos. Iniciada bajo el nombre de Escuela de Hombres N°1, se ha consolidado como un establecimiento público mixto y pluralista, comprometido con la movilidad social, la identidad atacameña y los valores de nuestro héroe patrio Bernardo O'Higgins Riquelme.",
  historiaHitos: [
    { ano: "1953", evento: "Fundación oficial en la comuna de Copiapó como escuela pública comunal." },
    { ano: "1981", evento: "Traspaso de la administración al sector municipal y adopción del nombre del prócer Bernardo O'Higgins." },
    { ano: "2010", evento: "Implementación exitosa de la Jornada Escolar Completa (JEC) para todos los niveles de Educación Básica." },
    { ano: "2018", evento: "Acreditación de excelencia por el Ministerio de Educación e inicio del Programa de Integración Escolar (PIE)." },
    { ano: "2024", evento: "Remodelación de laboratorios tecnológicos y biblioteca CRA (Centro de Recursos para el Aprendizaje)." }
  ],
  mision: "Nuestra misión es entregar una educación integral de calidad, inclusiva y equitativa, promoviendo el desarrollo intelectual, afectivo y valórico de niños y niñas de Copiapó, respetando su diversidad y fomentando su compromiso democrático y ecológico con su región.",
  vision: "Ser reconocidos como una comunidad de aprendizaje líder en la Región de Atacama, caracterizada por la calidez de su convivencia, la excelencia de sus prácticas pedagógicas y la formación de ciudadanos autónomos, creativos y con alta responsabilidad cívica.",
  valores: [
    "Respeto y Tolerancia",
    "Responsabilidad y Disciplina",
    "Inclusión y Diversidad",
    "Identidad y Patriotismo",
    "Solidaridad y Trabajo Colaborativo"
  ],
  peiResumen: "El Proyecto Educativo Institucional (PEI) de la Escuela Bernardo O'Higgins se centra en el constructivismo pedagógico, la convivencia escolar positiva y el resguardo de la equidad a través del PIE y la Subvención Escolar Preferencial (SEP). Buscamos formar estudiantes competentes tanto en destrezas cognitivas como emocionales.",
  reglamentoExtracto: "El Reglamento Interno de Convivencia Escolar (RICE) establece los derechos y deberes de todos los miembros de la comunidad educativa, promoviendo la resolución pacífica de conflictos y el diálogo formativo sobre la sanción punitiva.",
  bullyingProtocolo: "Ante sospechas o denuncias de acoso escolar (bullying), se activa inmediatamente el Protocolo RICE que incluye la contención de los involucrados, entrevistas con apoderados en menos de 24 horas, derivación a especialistas del equipo PIE, y un plan de seguimiento mensual para garantizar el bienestar integral.",
  sismosProtocolo: "Por encontrarnos en una zona de alta sismicidad, la escuela cuenta con el Plan Integral de Seguridad Escolar (PISE/Plan Cooper). Se realizan simulacros mensuales. Las zonas de seguridad están debidamente demarcadas en los patios principales, alejadas de ventanales y postes eléctricos."
};

export const INITIAL_NOTICIAS: Noticia[] = [
  {
    id: "noticia-1",
    titulo: "Escuela Bernardo O'Higgins celebra exitosa Feria Científica y Tecnológica Atacama",
    fecha: "2026-06-25",
    resumen: "Con más de 30 proyectos estudiantiles sobre el desierto florido y cuidado del agua, se realizó la muestra anual en el patio techado principal.",
    contenido: "Nuestra escuela se vistió de ciencia durante la semana pasada. Estudiantes de 1° a 8° año básico presentaron innovadores prototipos enfocados en soluciones sustentables para la Región de Atacama. Destacaron los proyectos de desalinización de agua a escala doméstica, reciclaje de relaves solares y la clasificación interactiva del fenómeno del desierto florido. El evento contó con la distinguida presencia de académicos de la Universidad de Atacama (UDA). La Directora María Teresa Valenzuela felicitó el entusiasmo de los estudiantes y el respaldo incondicional del equipo docente de Ciencias.",
    categoria: "Académico",
    imagen: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200",
    destacado: true
  },
  {
    id: "noticia-2",
    titulo: "Proceso de Admisión Escolar (SAE) 2027: Requisitos y Fechas Clave para Apoderados",
    fecha: "2026-07-01",
    resumen: "Información importante sobre el calendario de postulación oficial del MINEDUC y las vacantes para Pre-Kinder, Kinder y Educación Básica.",
    contenido: "Informamos a toda la comunidad de Copiapó que ya se encuentran disponibles los lineamientos para el Sistema de Admisión Escolar (SAE) correspondiente al año académico 2027. Las postulaciones en la plataforma oficial del Ministerio de Educación de Chile se abrirán durante el mes de agosto. Nuestra escuela ofrecerá cupos limitados en educación parvularia (Pre-Kinder y Kinder) y de 1° a 8° básico. Les invitamos a revisar nuestra sección de Admisión en la web y a descargar la ficha de pre-inscripción informativa que nos ayuda a coordinar visitas guiadas personalizadas antes del inicio del proceso oficial.",
    categoria: "Institucional",
    imagen: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200",
    destacado: true
  },
  {
    id: "noticia-3",
    titulo: "Gran participación escolar en el Comunal de Atletismo Escolar de Copiapó",
    fecha: "2026-06-18",
    resumen: "Nuestra delegación de deportistas obtuvo 5 medallas de oro y 3 de plata en el Estadio Luis Valenzuela Hermosilla.",
    contenido: "Los atletas de la Escuela Bernardo O'Higgins demostraron su gran nivel de preparación física en el campeonato atlético de la comuna. Con un desempeño sobresaliente en las pruebas de 100 metros planos, salto largo y carrera de relevos, los representantes escolares se colgaron múltiples medallas y aseguraron pasajes para el selectivo provincial. El profesor de Educación Física, Juan Antonio Castro, agradeció el esfuerzo de los niños y el constante apoyo del Centro de Padres y Apoderados.",
    categoria: "Deportes",
    imagen: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200",
    destacado: false
  },
  {
    id: "noticia-4",
    titulo: "Taller de Teatro presenta adaptación de leyendas locales en Centro Cultural",
    fecha: "2026-06-10",
    resumen: "El elenco estudiantil cautivó a los asistentes con representaciones teatrales sobre 'La Lola' y 'El Alicanto' de Atacama.",
    contenido: "Los alumnos pertenecientes al Taller Artístico de Teatro y Folklore deslumbraron a los asistentes reunidos en el Centro Cultural de Copiapó con la obra 'Mitos del Desierto'. Con un colorido vestuario, musicalización en vivo e interpretaciones llenas de carisma, rescataron la mitología propia de la Región de Atacama. Esta presentación forma parte de nuestro plan escolar de Fomento a la Identidad Regional y las Artes.",
    categoria: "Cultura",
    imagen: "https://images.unsplash.com/photo-1503095391755-1414e8c35b57?auto=format&fit=crop&q=80&w=1200",
    destacado: false
  }
];

export const INITIAL_EVENTOS: Evento[] = [
  {
    id: "evento-1",
    titulo: "Reunión General de Padres y Apoderados",
    fecha: "2026-07-12",
    hora: "18:30",
    lugar: "Salas de clases respectivas",
    descripcion: "Entrega del informe pedagógico correspondiente al primer semestre escolar y coordinación de actividades comunitarias del segundo semestre.",
    categoria: "Reunión"
  },
  {
    id: "evento-2",
    titulo: "Simulacro de Seguridad Escolar (Plan Cooper)",
    fecha: "2026-07-22",
    hora: "11:00",
    lugar: "Patios y Zonas de Seguridad demarcadas",
    descripcion: "Ensayo general de evacuación rápida ante sismo de alta intensidad. Actividad coordinada junto a Bomberos de Copiapó y Carabineros.",
    categoria: "Actividad"
  },
  {
    id: "evento-3",
    titulo: "Ceremonia Aniversario Escuela Bernardo O'Higgins",
    fecha: "2026-08-20",
    hora: "10:30",
    lugar: "Gimnasio Techado de la Escuela",
    descripcion: "Acto solemne para conmemorar los años de vida de nuestro querido colegio, con la presencia de autoridades regionales, apoderados e invitados especiales.",
    categoria: "Actividad"
  },
  {
    id: "evento-4",
    titulo: "Feriado Regional: Día de la Minería",
    fecha: "2026-08-10",
    hora: "Todo el día",
    lugar: "Establecimiento cerrado",
    descripcion: "Suspensión legal de actividades escolares por conmemoración del Día de la Minería en la Región de Atacama.",
    categoria: "Feriado"
  }
];

export const INITIAL_PERSONAS: Persona[] = [
  {
    id: "persona-1",
    nombre: "María Teresa Valenzuela",
    cargo: "Directora Académica",
    departamento: "Dirección",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    email: "direccion@escuelabernardoohiggins.cl",
    bio: "Profesora de Estado en Historia y Geografía con más de 20 años de experiencia directiva en el sector municipal de la Región de Atacama. Magíster en Gestión y Liderazgo Educacional."
  },
  {
    id: "persona-2",
    nombre: "Pedro Rojas Jara",
    cargo: "Inspector General",
    departamento: "Inspectoría",
    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    email: "inspectoria@escuelabernardoohiggins.cl",
    bio: "Profesor de Educación General Básica, encargado de resguardar el orden, la puntualidad y la seguridad de los alumnos del establecimiento, liderando el plan PISE escolar."
  },
  {
    id: "persona-3",
    nombre: "Judith Carrizo",
    cargo: "Orientadora y Encargada de Enlaces",
    departamento: "Apoyo",
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    email: "jcarrizo@escuelabernardoohiggins.cl",
    bio: "Psicopedagoga y docente. Lidera el departamento de orientación y convivencia escolar, además de gestionar las salas tecnológicas e informática escolar (Profesora Judith)."
  },
  {
    id: "persona-4",
    nombre: "Juan Antonio Castro",
    cargo: "Docente de Educación Física y Deportes",
    departamento: "Docentes",
    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    email: "jcastro@escuelabernardoohiggins.cl",
    bio: "Profesor de Educación Física con mención en Deporte Escolar. Coordinador de los talleres de fútbol, atletismo y ligas escolares comunales de Copiapó."
  },
  {
    id: "persona-5",
    nombre: "Andrea Soto Vivar",
    cargo: "Docente de Lenguaje y Comunicación",
    departamento: "Docentes",
    foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    email: "asoto@escuelabernardoohiggins.cl",
    bio: "Profesora de Lenguaje comprometida con el desarrollo de la lectoescritura en primer y segundo ciclo básico. Encargada de la Academia de Periodismo y Teatro Escolar."
  },
  {
    id: "persona-6",
    nombre: "Patricia Muñoz",
    cargo: "Educadora de Párvulos",
    departamento: "Docentes",
    foto: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400",
    email: "pmunoz@escuelabernardoohiggins.cl",
    bio: "Educadora encargada del nivel de Transición Mayor (Kinder). Especialista en metodologías de juego lúdico en el aula y fomento de psicomotricidad temprana."
  }
];

export const INITIAL_TALLERES: Taller[] = [
  {
    id: "taller-1",
    nombre: "Taller de Robótica Atacama",
    descripcion: "Programación en Arduino y ensamblaje de robots autónomos. Los estudiantes aprenden lógica matemática, trabajo en equipo y ciencias de la computación aplicada.",
    horario: "Martes y Jueves 16:00 - 17:30 hrs",
    encargado: "Prof. Judith Carrizo",
    imagen: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400",
    categoria: "Científico"
  },
  {
    id: "taller-2",
    nombre: "Academia de Fútbol y Vida Sana",
    descripcion: "Práctica de fútbol formativo en canchas municipales aliadas. Fomenta el acondicionamiento físico, disciplina deportiva, compañerismo y respeto en el campo.",
    horario: "Lunes y Miércoles 16:15 - 17:45 hrs",
    encargado: "Prof. Juan Antonio Castro",
    imagen: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400",
    categoria: "Deportivo"
  },
  {
    id: "taller-3",
    nombre: "Folclore, Danza y Expresión Corporal",
    descripcion: "Rescate de los bailes típicos de la Región de Atacama (como la danza minera) e identidad nacional chilena. Preparación para eventos y galas regionales.",
    horario: "Miércoles y Viernes 15:30 - 17:00 hrs",
    encargado: "Prof. Andrea Soto",
    imagen: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400",
    categoria: "Artístico"
  },
  {
    id: "taller-4",
    nombre: "Taller de Ecología, Huerto y Reciclaje",
    descripcion: "Creación y mantención del huerto hidropónico escolar adaptado a climas áridos. Educación sobre cambio climático, compostaje y cuidado ambiental en Atacama.",
    horario: "Viernes 14:30 - 16:30 hrs",
    encargado: "Prof. Carlos Díaz",
    imagen: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=400",
    categoria: "Científico"
  }
];

export const INITIAL_POSTULACIONES: Postulacion[] = [
  {
    id: "post-1",
    rutEstudiante: "23.456.789-K",
    nombreEstudiante: "Ignacio Andrés Tapia Díaz",
    fechaNacimiento: "2020-04-12",
    nivel: "1° Año Básico",
    nombreApoderado: "Carolina Díaz Rojas",
    telefono: "+56 9 8765 4321",
    email: "caro.diaz@gmail.com",
    fechaRegistro: "2026-07-02",
    estado: "Pendiente"
  },
  {
    id: "post-2",
    rutEstudiante: "24.123.456-7",
    nombreEstudiante: "Sofía Valentina Castro Soto",
    fechaNacimiento: "2022-09-25",
    nivel: "Pre-Kinder",
    nombreApoderado: "Claudio Castro Valdés",
    telefono: "+56 9 9988 7766",
    email: "claudio.castro@outlook.com",
    fechaRegistro: "2026-07-03",
    estado: "Revisado"
  }
];

export const INITIAL_MENSAJES: MensajeContacto[] = [
  {
    id: "msg-1",
    nombre: "Alejandra Morales",
    email: "alejandra.m@gmail.com",
    telefono: "+56 9 5554 4433",
    asunto: "Consulta por certificado de notas",
    mensaje: "Estimados, quisiera saber cómo solicitar un certificado de matrícula y el informe de notas del primer semestre de mi hijo de 4° básico. Muchas gracias.",
    fecha: "2026-07-03 15:42"
  },
  {
    id: "msg-2",
    nombre: "Roberto Araya",
    email: "roberto.araya@live.cl",
    telefono: "+56 9 3344 5566",
    asunto: "Contacto para Taller de Ajedrez",
    mensaje: "Hola, represento a un club de ajedrez local y nos encantaría ofrecer una charla gratuita para incentivar el deporte ciencia en su establecimiento escolar.",
    fecha: "2026-07-04 10:15"
  }
];