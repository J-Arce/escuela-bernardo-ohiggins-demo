/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Users, MessageSquare, CheckCircle2, 
  Trash2, Mail, Phone, HelpCircle, UserCheck, Send, Check,
  Star, Clock, X, CalendarCheck, Calendar
} from 'lucide-react';
import { Noticia, Evento, Postulacion, MensajeContacto } from '../types';

interface AdminPanelProps {
  noticias: Noticia[];
  onAddNoticia: (n: Noticia) => void;
  eventos: Evento[];
  onAddEvento: (e: Evento) => void;
  postulaciones: Postulacion[];
  onChangePostulacionEstado: (id: string, estado: 'Pendiente' | 'Revisado' | 'Aceptado') => void;
  mensajes: MensajeContacto[];
  schoolSlogan: string;
  onUpdateSlogan: (s: string) => void;
  onUpdateMensaje: (id: string, updates: Partial<MensajeContacto>) => void;
  onDeleteMensaje: (id: string) => void;
}

export default function AdminPanel({
  postulaciones,
  onChangePostulacionEstado,
  mensajes,
  onUpdateMensaje,
  onDeleteMensaje
}: AdminPanelProps) {

  // --- ESTADO LOCAL PARA GUARDAR FECHAS DE VISITAS ---
  const [scheduledVisits, setScheduledVisits] = useState<Record<string, { fecha: string, hora: string }>>({});

  // --- FILTROS DE POSTULACIONES ---
  const visitasPendientes = postulaciones.filter(p => p.estado === 'Pendiente' || !p.estado);
  const visitasAgendadas = postulaciones.filter(p => p.estado === 'Aceptado');

  // --- FILTROS DE MENSAJES ---
  const consultas = mensajes.filter(m => m.asunto.includes('[CONSULTA]'));
  const opiniones = mensajes.filter(m => !m.asunto.includes('[CONSULTA]'));

  const nuevasOpiniones = opiniones.filter(m => !(m as any).aprobado).length; 
  const consultasPendientes = consultas.filter(m => !(m as any).aprobado).length;

  // --- ESTADOS DE MODALES Y ALERTAS ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scheduleModal, setScheduleModal] = useState<{ post: Postulacion | null, fecha: string, hora: string }>({ post: null, fecha: '', hora: '10:00' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- MANEJADORES DE VISITAS ---
  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModal.post) return;
    
    const post = scheduleModal.post;
    onChangePostulacionEstado(post.id, 'Aceptado');
    
    setScheduledVisits(prev => ({
      ...prev,
      [post.id]: { fecha: scheduleModal.fecha, hora: scheduleModal.hora }
    }));

    showToast(`Visita agendada. Correo de confirmación simulado enviado a ${post.email}`);
    setScheduleModal({ post: null, fecha: '', hora: '10:00' });
  };

  // Acción 1: Visita Exitosa (Suma al contador)
  const handleVisitaRealizada = async (post: Postulacion) => {
    if(window.confirm('¿Confirmar que la familia asistió a la visita guiada? (Esto sumará al contador público)')) {
      onChangePostulacionEstado(post.id, 'Revisado'); 
      showToast('Visita marcada como realizada. Contador actualizado.');

      try {
        const docRef = doc(db, "paginas", "admision");
        const snap = await getDoc(docRef);
        const currentCount = snap.exists() && snap.data().visitasRealizadas ? snap.data().visitasRealizadas : 0;
        await setDoc(docRef, { visitasRealizadas: currentCount + 1 }, { merge: true });
      } catch (error) { console.error(error); }
    }
  };

  // Acción 2: Eliminar/Cancelar Visita (NO suma al contador)
  const handleCancelarVisita = async (post: Postulacion, esAgendada: boolean = false) => {
    const mensaje = esAgendada 
      ? '¿Seguro que desea cancelar esta visita agendada? (La familia no asistió / Cancelada. NO sumará al contador)' 
      : '¿Archivar esta solicitud pendiente sin agendar?';

    if(window.confirm(mensaje)) {
      // Usamos tu función original para cambiar el estado a 'Revisado' (Archivado).
      // Esto hace que React actualice la pantalla al instante y desaparezca de las listas.
      onChangePostulacionEstado(post.id, 'Revisado'); 
      showToast(esAgendada ? 'Visita agendada cancelada.' : 'Solicitud archivada.');
    }
  };

  // --- MANEJADORES DE OPINIONES ---
  const handleTogglePublicacionOpinion = (id: string, currentStatus: boolean) => {
    onUpdateMensaje(id, { aprobado: !currentStatus } as any);
    if (!currentStatus) showToast('¡Opinión publicada! Ahora tiene una estrella y es visible en Inicio.');
    else showToast('Opinión despublicada. Ya no es visible en Inicio.');
  };

  // --- MANEJADORES DE CONSULTAS ---
  const handleToggleConsulta = (id: string, currentStatus: boolean) => {
    onUpdateMensaje(id, { aprobado: !currentStatus } as any);
    if (!currentStatus) showToast('Consulta marcada como Resuelta.');
    else showToast('Consulta reabierta.');
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto animate-fade-in pb-12">
      
      {/* HEADER PANEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-[#05087E] tracking-tight">Centro de Gestión</h2>
          <p className="text-sm text-gray-500 mt-1">Supervise las solicitudes, consultas y opiniones de la comunidad escolar.</p>
        </div>
        <div className="bg-blue-50 text-[#05087E] px-4 py-2 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Sistema En Línea
        </div>
      </div>

      {/* 1. TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... (Tarjetas se mantienen igual) ... */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Visitas<br/>Pendientes</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="relative z-10">
            <span className="text-2xl font-display font-bold text-[#05087E]">{visitasPendientes.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Visitas<br/>Agendadas</span>
            <CalendarCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <span className="text-2xl font-display font-bold text-[#05087E]">{visitasAgendadas.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Opiniones<br/>Nuevas</span>
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="relative z-10">
            <span className="text-2xl font-display font-bold text-[#05087E]">{nuevasOpiniones}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Consultas<br/>Sin Leer</span>
            <HelpCircle className="w-4 h-4 text-[#FF030D]" />
          </div>
          <div className="relative z-10">
            <span className="text-2xl font-display font-bold text-[#05087E]">{consultasPendientes}</span>
          </div>
        </div>
      </div>

      {/* 2. ZONA DE BUZONES (4 COLUMNAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        
        {/* COLUMNA 1: SOLICITUDES DE VISITA (PENDIENTES) */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="bg-blue-800 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-200" />
              <h3 className="text-sm font-bold tracking-wide uppercase">Visitas Nuevas</h3>
            </div>
            {visitasPendientes.length > 0 && <span className="bg-[#FF030D] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{visitasPendientes.length}</span>}
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50 space-y-4">
            {visitasPendientes.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-10 italic">No hay solicitudes pendientes.</p>
            ) : (
              visitasPendientes.map(post => (
                <div key={post.id} className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm space-y-3 relative">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2 mb-2">
                    <div>
                      <h4 className="font-bold text-[#05087E] text-sm leading-tight">{post.nombreApoderado}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Pupilo(a): {post.nombreEstudiante}</p>
                    </div>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">{post.nivelInteres || post.nivel}</span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {post.telefono}</div>
                    <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {post.email}</div>
                    {post.mensaje && (
                      <div className="mt-2 bg-gray-50 p-2 rounded text-[11px] border border-gray-100 italic">"{post.mensaje}"</div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setScheduleModal({ post, fecha: new Date().toISOString().split('T')[0], hora: '10:00' })} className="flex-1 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 border border-emerald-200 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Agendar
                    </button>
                    <button onClick={() => handleCancelarVisita(post, false)} className="px-2.5 bg-gray-50 hover:bg-red-500 hover:text-white text-gray-400 border border-gray-200 rounded-lg transition-colors flex items-center justify-center" title="Eliminar Solicitud">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA 2: VISITAS AGENDADAS (ACEPTADAS) */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="bg-emerald-700 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-200" />
              <h3 className="text-sm font-bold tracking-wide uppercase">Visitas Agendadas</h3>
            </div>
            {visitasAgendadas.length > 0 && <span className="bg-emerald-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{visitasAgendadas.length}</span>}
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50 space-y-4">
            {visitasAgendadas.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-10 italic">No hay visitas programadas.</p>
            ) : (
              visitasAgendadas.map(post => (
                <div key={post.id} className="bg-white border border-emerald-200 p-4 rounded-xl shadow-sm space-y-3 relative group">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2 mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{post.nombreApoderado}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Pupilo(a): {post.nombreEstudiante}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold">{post.nivelInteres || post.nivel}</span>
                  </div>
                  
                  {scheduledVisits[post.id] && (
                    <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2 rounded-lg font-bold flex items-center gap-2 border border-emerald-100">
                      <Clock className="w-3.5 h-3.5" /> 
                      {scheduledVisits[post.id].fecha.split('-').reverse().join('/')} a las {scheduledVisits[post.id].hora} hrs.
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <button onClick={() => handleVisitaRealizada(post)} className="flex-1 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 border border-emerald-200 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Realizada (+1)
                    </button>
                    <button onClick={() => handleCancelarVisita(post, true)} className="flex-1 bg-gray-50 hover:bg-red-500 hover:text-white text-gray-500 hover:border-red-500 border border-gray-200 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1" title="La familia no asistió">
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA 3: OPINIONES (TODAS) */}
        {/* ... (Se mantiene igual) ... */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="bg-amber-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-200" />
              <h3 className="text-sm font-bold tracking-wide uppercase">Opiniones</h3>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50 space-y-4">
            {opiniones.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-10 italic">El buzón de opiniones está vacío.</p>
            ) : (
              opiniones.map(opinion => {
                const isPublished = (opinion as any).aprobado;
                return (
                  <div key={opinion.id} className={`bg-white border ${isPublished ? 'border-amber-400 shadow-md' : 'border-gray-200 shadow-sm'} p-4 rounded-xl space-y-3 relative`}>
                    
                    <div className="absolute -top-3 -right-2 bg-white rounded-full">
                      {isPublished ? (
                        <Star className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-sm" />
                      ) : (
                        <Star className="w-6 h-6 text-gray-300" />
                      )}
                    </div>

                    <div className="border-b border-gray-100 pb-2 mb-2 pr-6">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{opinion.nombre}</h4>
                      <p className="text-[10px] text-amber-600 uppercase tracking-wider mt-0.5 font-bold">
                        {opinion.asunto.split('- Rol: ')[1] || 'Comunidad'}
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-600 italic">"{opinion.mensaje}"</p>

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => handleTogglePublicacionOpinion(opinion.id, isPublished)} 
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1 border ${
                          isPublished 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' 
                            : 'bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 border-amber-200'
                        }`}
                      >
                        {isPublished ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        {isPublished ? 'Despublicar' : 'Publicar en Inicio'}
                      </button>
                      
                      <button onClick={() => { if(window.confirm('¿Eliminar definitivamente?')) onDeleteMensaje(opinion.id) }} className="px-2.5 bg-gray-50 hover:bg-red-500 hover:text-white text-gray-400 border border-gray-200 rounded-lg transition-colors flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* COLUMNA 4: CONSULTAS PRIVADAS (TODAS) */}
        {/* ... (Se mantiene igual) ... */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="bg-[#FF030D] p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-200" />
              <h3 className="text-sm font-bold tracking-wide uppercase">Consultas</h3>
            </div>
            {consultasPendientes > 0 && <span className="bg-white text-[#FF030D] text-[10px] px-2 py-0.5 rounded-full font-bold">{consultasPendientes}</span>}
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50 space-y-4">
            {consultas.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-10 italic">Bandeja de consultas limpia.</p>
            ) : (
              consultas.map(consulta => {
                const isResolved = (consulta as any).aprobado;
                return (
                  <div key={consulta.id} className={`bg-white border p-4 rounded-xl shadow-sm space-y-3 relative ${isResolved ? 'border-gray-200 opacity-75' : 'border-red-200'}`}>
                    
                    {isResolved && (
                      <div className="absolute top-3 right-3 text-emerald-500" title="Resuelto">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}

                    <div className="border-b border-gray-100 pb-2 mb-2 pr-6">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{consulta.nombre}</h4>
                      <p className="text-[10px] text-red-600 uppercase tracking-wider mt-0.5 font-bold">
                        {consulta.asunto.replace('[CONSULTA] ', '')}
                      </p>
                    </div>
                    
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {consulta.telefono}</div>
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {consulta.email}</div>
                    </div>

                    <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100 mt-2">{consulta.mensaje}</p>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleToggleConsulta(consulta.id, isResolved)} 
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1 border ${
                          isResolved
                            ? 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                            : 'bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isResolved ? 'Reabrir Consulta' : 'Marcar como Resuelto'}
                      </button>
                      <button onClick={() => { if(window.confirm('¿Eliminar consulta?')) onDeleteMensaje(consulta.id) }} className="px-2.5 bg-gray-50 hover:bg-red-500 hover:text-white text-gray-400 border border-gray-200 rounded-lg transition-colors flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

      {/* --- MODAL PARA AGENDAR VISITA --- */}
      {scheduleModal.post && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[400px] w-full shadow-2xl relative">
            <button onClick={() => setScheduleModal({ post: null, fecha: '', hora: '' })} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 text-gray-500"><X className="w-4 h-4"/></button>
            <h3 className="text-lg font-bold text-[#05087E] mb-2 border-b pb-2">Agendar Visita Guiada</h3>
            <p className="text-xs text-gray-500 mb-6">Seleccione el día y la hora para recibir a la familia de <strong>{scheduleModal.post.nombreEstudiante}</strong>.</p>
            
            <form onSubmit={handleConfirmSchedule} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Fecha de la Visita</label>
                <input required type="date" value={scheduleModal.fecha} onChange={e => setScheduleModal({...scheduleModal, fecha: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-emerald-600 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Hora de Citación</label>
                <input required type="time" value={scheduleModal.hora} onChange={e => setScheduleModal({...scheduleModal, hora: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-emerald-600 outline-none" />
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl mt-4">
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  Al confirmar, el sistema simulará el envío automático de un correo electrónico a <strong>{scheduleModal.post.email}</strong> citando al apoderado en la fecha seleccionada.
                </p>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5">
                <Send className="w-4 h-4" /> Confirmar y Enviar Correo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notificador */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#05087E] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border border-blue-400 z-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}