/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, Calendar, Image as ImageIcon, FileText, CheckCircle, 
  MessageSquare, UserPlus, Sparkles, Send, Trash, Check, Eye 
} from 'lucide-react';
import { Noticia, Evento, Postulacion, MensajeContacto } from '../types';

interface AdminPanelProps {
  noticias: Noticia[];
  onAddNoticia: (noticia: Noticia) => void;
  eventos: Evento[];
  onAddEvento: (evento: Evento) => void;
  postulaciones: Postulacion[];
  onChangePostulacionEstado: (id: string, nuevoEstado: 'Pendiente' | 'Revisado' | 'Aceptado') => void;
  mensajes: MensajeContacto[];
  schoolSlogan: string;
  onUpdateSlogan: (slogan: string) => void;
}

type AdminView = 'dashboard' | 'noticia' | 'evento' | 'slogan' | 'postulaciones' | 'mensajes';

export default function AdminPanel({
  noticias,
  onAddNoticia,
  eventos,
  onAddEvento,
  postulaciones,
  onChangePostulacionEstado,
  mensajes,
  schoolSlogan,
  onUpdateSlogan
}: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form states inside Admin
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Académico' | 'Deportes' | 'Institucional' | 'Cultura' | 'Comunidad'>('Académico');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-07-15');
  const [eventTime, setEventTime] = useState('14:30');
  const [eventPlace, setEventPlace] = useState('Sala de Reuniones');
  const [eventDesc, setEventDesc] = useState('');
  const [eventCategory, setEventCategory] = useState<'Actividad' | 'Reunión' | 'Feriado' | 'Evaluación'>('Actividad');

  const [tempSlogan, setTempSlogan] = useState(schoolSlogan);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCreateNoticia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const noticia: Noticia = {
      id: `noticia-${Date.now()}`,
      titulo: newTitle,
      fecha: new Date().toISOString().split('T')[0],
      resumen: newSummary,
      contenido: newContent || newSummary,
      categoria: newCategory,
      imagen: newImage,
      destacado: true
    };

    onAddNoticia(noticia);
    showFeedback('¡Noticia publicada con éxito! Ya se visualiza en la sección pública.');
    
    // reset form
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setCurrentView('dashboard');
  };

  const handleCreateEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      alert('Por favor ingrese el título del evento.');
      return;
    }

    const evento: Evento = {
      id: `evento-${Date.now()}`,
      titulo: eventTitle,
      fecha: eventDate,
      hora: eventTime,
      lugar: eventPlace,
      descripcion: eventDesc,
      categoria: eventCategory
    };

    onAddEvento(evento);
    showFeedback('¡Evento guardado con éxito! Se ha incorporado al calendario interactivo.');
    
    // reset form
    setEventTitle('');
    setEventDesc('');
    setCurrentView('dashboard');
  };

  const handleSaveSlogan = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSlogan(tempSlogan);
    showFeedback('¡Slogan institucional actualizado con éxito!');
    setCurrentView('dashboard');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 space-y-8 animate-fade-in" id="admin-panel-view">
      
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-emerald-600 to-[#05087E] text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dupla Psicosocial & Enlaces</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            ¡Hola, Profesora Judith!
          </h2>
          <p className="text-xs text-gray-200 mt-1">
            Portal de Administración simplificado y CMS para la Escuela Bernardo O'Higgins.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl text-xs backdrop-blur-sm">
          <span className="block font-bold">Rol: Encargada de Comunicaciones</span>
          <span className="block text-emerald-300">● Conectado (Mock Headless API)</span>
        </div>
      </div>

      {/* Floating Status Feedback banner */}
      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* NAVIGATION TABS FOR CMS VIEW */}
      {currentView !== 'dashboard' && (
        <button
          onClick={() => setCurrentView('dashboard')}
          className="text-xs font-bold text-[#05087E] hover:text-[#FF030D] flex items-center gap-1"
        >
          <span>← Volver al Panel de Acciones Directas</span>
        </button>
      )}

      {/* CMS DYNAMIC SCREENS */}

      {/* VIEW 1: MAIN DASHBOARD AND ACTIONS */}
      {currentView === 'dashboard' && (
        <div className="space-y-12">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setCurrentView('postulaciones')}>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Postulaciones</span>
                <span className="text-2xl font-display font-extrabold text-[#05087E]">{postulaciones.length}</span>
              </div>
              <UserPlus className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setCurrentView('mensajes')}>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Mensajes</span>
                <span className="text-2xl font-display font-extrabold text-[#05087E]">{mensajes.length}</span>
              </div>
              <MessageSquare className="w-8 h-8 text-red-500 opacity-60" />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Noticias</span>
                <span className="text-2xl font-display font-extrabold text-[#05087E]">{noticias.length}</span>
              </div>
              <FileText className="w-8 h-8 text-emerald-500 opacity-60" />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Calendario</span>
                <span className="text-2xl font-display font-extrabold text-[#05087E]">{eventos.length}</span>
              </div>
              <Calendar className="w-8 h-8 text-amber-500 opacity-60" />
            </div>
          </div>

          {/* GIANT ACTION BUTTONS (CMS Simple requirements) */}
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-[#05087E] uppercase tracking-wider border-b border-gray-100 pb-2">
              Botones de Acción Directa (Formularios de un solo clic)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Action 1: Subir Nueva Noticia */}
              <button
                onClick={() => setCurrentView('noticia')}
                className="group p-8 rounded-2xl border-2 border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-48 cursor-pointer shadow-sm hover:shadow-md"
                id="admin-action-news"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-emerald-950 mb-1 group-hover:text-emerald-700">
                    📢 Subir Nueva Noticia
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-normal">
                    Publica comunicados, fotos de talleres o actividades en el feed general de inmediato.
                  </p>
                </div>
              </button>

              {/* Action 2: Actualizar Calendario */}
              <button
                onClick={() => setCurrentView('evento')}
                className="group p-8 rounded-2xl border-2 border-amber-100 bg-amber-50/40 hover:bg-amber-50 text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-48 cursor-pointer shadow-sm hover:shadow-md"
                id="admin-action-event"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-amber-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-amber-950 mb-1 group-hover:text-amber-700">
                    🗓️ Actualizar Calendario
                  </h4>
                  <p className="text-[11px] text-amber-800 leading-normal">
                    Agrega reuniones, feriados, simulacros o aniversarios en la agenda de la escuela.
                  </p>
                </div>
              </button>

              {/* Action 3: Cambiar Foto o Mensaje de Inicio */}
              <button
                onClick={() => setCurrentView('slogan')}
                className="group p-8 rounded-2xl border-2 border-blue-100 bg-blue-50/40 hover:bg-blue-50 text-left transition-all hover:scale-[1.02] flex flex-col justify-between h-48 cursor-pointer shadow-sm hover:shadow-md"
                id="admin-action-slogan"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#05087E]">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-blue-950 mb-1 group-hover:text-blue-700">
                    ✨ Cambiar Eslogan Principal
                  </h4>
                  <p className="text-[11px] text-blue-800 leading-normal">
                    Modifica el texto o filosofía que se muestra en el banner principal de la página.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Quick lists sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Postulaciones Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <h4 className="text-xs font-display font-bold text-[#05087E] uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-[#FF030D]" />
                  <span>Últimas Postulaciones Recibidas</span>
                </h4>
                <button onClick={() => setCurrentView('postulaciones')} className="text-[10px] text-blue-800 font-bold hover:underline">Ver todas</button>
              </div>

              <div className="space-y-3">
                {postulaciones.slice(0, 3).map((post) => (
                  <div key={post.id} className="bg-[#F8F9FA] p-3 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block leading-tight">{post.nombreEstudiante}</span>
                      <span className="text-[10px] text-gray-500">{post.nivel} • Apoderado: {post.nombreApoderado}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      post.estado === 'Aceptado'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : post.estado === 'Revisado'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {post.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Messages Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <h4 className="text-xs font-display font-bold text-[#05087E] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#FF030D]" />
                  <span>Mensajes de Contacto Web</span>
                </h4>
                <button onClick={() => setCurrentView('mensajes')} className="text-[10px] text-blue-800 font-bold hover:underline">Ver todos</button>
              </div>

              <div className="space-y-3">
                {mensajes.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="bg-[#F8F9FA] p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#05087E]">{msg.nombre}</span>
                      <span className="text-[9px] text-gray-400">{msg.fecha}</span>
                    </div>
                    <span className="font-semibold text-gray-700 block">{msg.asunto}</span>
                    <p className="text-[10px] text-gray-500 line-clamp-1 italic">"{msg.mensaje}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* FORM VIEW 1: PUBLICAR NOTICIA */}
      {currentView === 'noticia' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-[800px] mx-auto">
          <h3 className="text-lg font-display font-bold text-[#05087E] mb-6">📢 Publicar Nueva Noticia</h3>
          
          <form onSubmit={handleCreateNoticia} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Título de la Noticia*</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej: Gran desfile escolar en honor a las Glorias Navales"
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Categoría de la Noticia</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option>Académico</option>
                  <option>Deportes</option>
                  <option>Institucional</option>
                  <option>Cultura</option>
                  <option>Comunidad</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Imagen de Portada (Enlace)</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Breve Resumen (Se visualiza en la tarjeta)*</label>
              <input
                type="text"
                required
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="Ej: Alumnos representaron a nuestra escuela en la gala provincial..."
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Contenido Extenso de la Noticia</label>
              <textarea
                rows={5}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Escriba aquí los detalles y comentarios del cuerpo de la noticia..."
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Noticia de un Solo Clic</span>
            </button>
          </form>
        </div>
      )}

      {/* FORM VIEW 2: NUEVO EVENTO */}
      {currentView === 'evento' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-[800px] mx-auto">
          <h3 className="text-lg font-display font-bold text-[#05087E] mb-6">🗓️ Programar Nuevo Evento</h3>
          
          <form onSubmit={handleCreateEvento} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Título del Evento*</label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Ej: Simulacro Comunal de Terremoto"
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Fecha*</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Hora*</label>
                <input
                  type="time"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Lugar del Evento</label>
                <input
                  type="text"
                  value={eventPlace}
                  onChange={(e) => setEventPlace(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Categoría</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option>Actividad</option>
                  <option>Reunión</option>
                  <option>Feriado</option>
                  <option>Evaluación</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Descripción del Evento</label>
              <textarea
                rows={3}
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                placeholder="Describa brevemente qué se realizará en esta actividad..."
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Guardar en Calendario de un Solo Clic</span>
            </button>
          </form>
        </div>
      )}

      {/* FORM VIEW 3: ACTUALIZAR SLOGAN */}
      {currentView === 'slogan' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-[800px] mx-auto">
          <h3 className="text-lg font-display font-bold text-[#05087E] mb-6">✨ Actualizar Eslogan de Inicio</h3>
          
          <form onSubmit={handleSaveSlogan} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Eslogan o Mensaje de Filosofía Escolar*</label>
              <textarea
                rows={3}
                required
                value={tempSlogan}
                onChange={(e) => setTempSlogan(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
              <p className="text-[10px] text-gray-400">Este texto se actualiza en tiempo real en la página principal (Hero) de la escuela.</p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#05087E] hover:bg-blue-900 text-white py-3 rounded-full text-xs font-bold shadow-md transition-all"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      )}

      {/* DETAILED MONITORING VIEW: POSTULACIONES */}
      {currentView === 'postulaciones' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-display font-bold text-[#05087E] border-b border-gray-100 pb-2">
            📋 Registro Completo de Postulaciones Recibidas (SAE Interno)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold">
                  <th className="p-3">Estudiante / RUT</th>
                  <th className="p-3">Nivel</th>
                  <th className="p-3">Apoderado / Contacto</th>
                  <th className="p-3">Fecha Registro</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {postulaciones.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50">
                    <td className="p-3">
                      <span className="font-bold text-gray-900 block">{post.nombreEstudiante}</span>
                      <span className="text-[10px] text-gray-500 font-mono">RUT: {post.rutEstudiante} • F.Nac: {post.fechaNacimiento}</span>
                    </td>
                    <td className="p-3 font-semibold text-gray-700">{post.nivel}</td>
                    <td className="p-3">
                      <span className="block font-medium">{post.nombreApoderado}</span>
                      <span className="text-[10px] text-gray-500">{post.telefono} • {post.email}</span>
                    </td>
                    <td className="p-3 text-gray-400">{post.fechaRegistro}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        post.estado === 'Aceptado'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : post.estado === 'Revisado'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {post.estado}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {post.estado !== 'Revisado' && post.estado !== 'Aceptado' && (
                        <button
                          onClick={() => {
                            onChangePostulacionEstado(post.id, 'Revisado');
                            showFeedback(`Estado de ${post.nombreEstudiante} cambiado a Revisado.`);
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold py-1 px-2.5 rounded-full"
                          title="Marcar como Revisado"
                        >
                          Revisar
                        </button>
                      )}
                      {post.estado !== 'Aceptado' && (
                        <button
                          onClick={() => {
                            onChangePostulacionEstado(post.id, 'Aceptado');
                            showFeedback(`¡Postulación de ${post.nombreEstudiante} Aceptada!`);
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold py-1 px-2.5 rounded-full"
                          title="Marcar como Aceptado"
                        >
                          Aceptar
                        </button>
                      )}
                      {post.estado === 'Aceptado' && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 justify-end">
                          <Check className="w-3.5 h-3.5" /> Aprobado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED MONITORING VIEW: MENSAJES */}
      {currentView === 'mensajes' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-display font-bold text-[#05087E] border-b border-gray-100 pb-2">
            ✉️ Consultas del Formulario de Contacto Web
          </h3>

          <div className="space-y-4">
            {mensajes.map((msg) => (
              <div key={msg.id} className="bg-[#F8F9FA] p-5 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200/50 pb-2">
                  <div>
                    <span className="font-extrabold text-sm text-[#05087E]">{msg.nombre}</span>
                    <span className="text-[10px] text-gray-500 block">Email: {msg.email} • Fono: {msg.telefono}</span>
                  </div>
                  <div className="text-right">
                    <span className="bg-red-50 text-[#FF030D] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {msg.asunto}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-1">{msg.fecha}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-sans bg-white p-3 rounded-lg border border-gray-50">
                  "{msg.mensaje}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
