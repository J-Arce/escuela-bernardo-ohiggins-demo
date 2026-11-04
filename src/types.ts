/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Noticia {
  id: string;
  titulo: string;
  fecha: string;
  resumen: string;
  contenido: string;
  categoria: 'Académico' | 'Deportes' | 'Institucional' | 'Cultura' | 'Comunidad';
  imagen: string;
  destacado: boolean;
}

export interface Evento {
  id: string;
  titulo: string;
  fecha: string; // YYYY-MM-DD
  hora: string;
  lugar: string;
  descripcion: string;
  categoria: 'Actividad' | 'Reunión' | 'Feriado' | 'Evaluación';
}

export interface Persona {
  id: string;
  nombre: string;
  cargo: string;
  departamento: 'Dirección' | 'Inspectoría' | 'Docentes' | 'Apoyo';
  foto: string;
  email: string;
  bio?: string;
}

export interface Postulacion {
  id: string;
  rutEstudiante: string;
  nombreEstudiante: string;
  fechaNacimiento: string;
  nivel: string;
  nombreApoderado: string;
  telefono: string;
  email: string;
  fechaRegistro: string;
  estado: 'Pendiente' | 'Revisado' | 'Aceptado' | 'Agendado';
  fechaVisita?: string;
  horaVisita?: string;
}

export interface MensajeContacto {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
  fecha: string;
  calificacion?: number;
}

export interface InformacionInstitucional {
  nombreEscuela: string;
  ubicacion: string;
  comuna: string;
  ciudad: string;
  slogan: string;
  historia: string;
  historiaHitos: { ano: string; evento: string }[];
  mision: string;
  vision: string;
  valores: string[];
  peiResumen: string;
  reglamentoExtracto: string;
  bullyingProtocolo: string;
  sismosProtocolo: string;
}

export interface Taller {
  id: string;
  nombre: string;
  descripcion: string;
  horario: string;
  encargado: string;
  imagen: string;
  categoria: 'Deportivo' | 'Artístico' | 'Científico';
}