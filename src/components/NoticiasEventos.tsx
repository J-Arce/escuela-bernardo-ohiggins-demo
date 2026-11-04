/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { 
  Search, Calendar, Clock, MapPin, ArrowRight, ChevronLeft, ChevronDown,
  Bookmark, Plus, Trash2, Edit2, UploadCloud, X, Cloud, Image as ImageIcon, CheckCircle
} from 'lucide-react';

interface NoticiasEventosProps {
  isAdminMode?: boolean;
}

export default function NoticiasEventos({ isAdminMode = false }: NoticiasEventosProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Bases de Datos Locales
  const [noticias, setNoticias] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);

  // News Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Académico' | 'Deportes' | 'Institucional' | 'Cultura' | 'Comunidad'>('Todos');
  const [readingNews, setReadingNews] = useState<any | null>(null);

  // Calendar States Interactivos
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); 
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 6, 12)); 

  // Modal States
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [newsForm, setNewsForm] = useState({ titulo: '', resumen: '', contenido: '', categoria: 'Institucional', imagen: '', fecha: new Date().toISOString().split('T')[0] });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventForm, setEventForm] = useState({ titulo: '', categoria: 'ACTIVIDAD', descripcion: '', hora: '11:00', lugar: 'Escuela Bernardo O\'Higgins', fecha: '', esTodoElDia: false });

  const categories = ['Todos', 'Académico', 'Deportes', 'Institucional', 'Cultura', 'Comunidad'] as const;

  // 1. CARGA DESDE FIREBASE (Ultra Defensiva)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "paginas", "noticias_eventos");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Filtramos cualquier null que pueda venir de Firebase
          if (data.noticias && Array.isArray(data.noticias)) {
            setNoticias(data.noticias.filter(n => n !== null && n !== undefined));
          }
          if (data.eventos && Array.isArray(data.eventos)) {
            setEventos(data.eventos.filter(e => e !== null && e !== undefined));
          }
        } else {
          setNoticias([{
            id: 'n1', titulo: 'Nuevos Laboratorios', resumen: 'Nuestra escuela inaugura equipos.', contenido: 'Gracias a los fondos SEP...', categoria: 'Institucional', fecha: '2026-07-10', imagen: 'https://images.unsplash.com/photo-1571260899304-42507011ec7a?auto=format&fit=crop&q=80&w=800'
          }]);
        }
      } catch (error) { 
        console.error("Error crítico cargando Firebase:", error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchData();
  }, []);

  const saveToFirebase = async (campo: string, valor: any) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "paginas", "noticias_eventos"), { [campo]: valor }, { merge: true });
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  // --- LÓGICA DE NOTICIAS ---
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    const imagenFinal = newsForm.imagen || 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80&w=800';
    let nuevos;
    if (editingNews) {
      nuevos = noticias.map(n => n?.id === editingNews.id ? { ...n, ...newsForm, imagen: imagenFinal } : n);
      setReadingNews({ ...editingNews, ...newsForm, imagen: imagenFinal });
    } else {
      nuevos = [{ ...newsForm, imagen: imagenFinal, id: `noticia-${Date.now()}` }, ...noticias];
    }
    setNoticias(nuevos); saveToFirebase('noticias', nuevos);
    setIsNewsModalOpen(false); setEditingNews(null);
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm('¿Seguro que desea eliminar esta noticia?')) {
      const nuevos = noticias.filter(n => n?.id !== id);
      setNoticias(nuevos); saveToFirebase('noticias', nuevos);
      if (readingNews?.id === id) setReadingNews(null);
    }
  };

  // --- LÓGICA DE EVENTOS ---
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    let nuevos;
    if (editingEvent) {
      nuevos = eventos.map(ev => ev?.id === editingEvent.id ? { ...ev, ...eventForm } : ev);
    } else {
      nuevos = [...eventos, { ...eventForm, id: `evento-${Date.now()}` }];
    }
    setEventos(nuevos); saveToFirebase('eventos', nuevos);
    setIsEventModalOpen(false); setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('¿Seguro que desea eliminar este evento?')) {
      const nuevos = eventos.filter(e => e?.id !== id);
      setEventos(nuevos); saveToFirebase('eventos', nuevos);
    }
  };

  // --- FORMATEO SEGURO DE FECHAS ---
  const formatearFechaSegura = (fechaStr: string) => {
    if (!fechaStr) return 'Fecha sin especificar';
    try {
      const date = new Date(fechaStr + 'T00:00:00');
      if (isNaN(date.getTime())) return fechaStr; 
      return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return fechaStr;
    }
  };

  // --- LÓGICA DE CALENDARIO ---
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => {
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i);

  const formatEventDate = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isSelectedDate = (day: number) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
  };

  const hasEvent = (day: number) => {
    const dateStr = formatEventDate(day);
    return (eventos || []).some(e => e?.fecha === dateStr);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = formatEventDate(day);
    return (eventos || [])
      .filter(e => e?.fecha === dateStr)
      .sort((a, b) => (a?.hora || '').localeCompare(b?.hora || '')); 
  };

  const selectedDayEvents = getEventsForDay(selectedDate.getDate());

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));

  // --- FILTRO SEGURO DE NOTICIAS ---
  const filteredNoticias = (noticias || []).filter((noticia) => {
    if (!noticia) return false;
    const titulo = noticia.titulo || '';
    const resumen = noticia.resumen || '';
    const busqueda = searchQuery || '';

    const matchesSearch = titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                          resumen.toLowerCase().includes(busqueda.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || noticia.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const anios = Array.from({ length: 5 }, (_, i) => 2025 + i); 

  if (isLoading) return <div className="text-center py-20 font-bold text-[#05087E]">Cargando Noticias y Eventos...</div>;

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="news-blog-view">
      
      {isAdminMode && (
        <div className={`fixed bottom-4 right-4 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold shadow-lg z-50 ${isSaving || isUploading ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {isUploading ? <><UploadCloud className="w-4 h-4 animate-bounce" /> Subiendo imagen...</> :
           isSaving ? <><Cloud className="w-4 h-4 animate-pulse" /> Guardando...</> : 
           <><CheckCircle className="w-4 h-4" /> Base de Datos Conectada</>}
        </div>
      )}

      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Actualidad</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Noticias y Calendario Académico
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto">
          Mantente al día con los comunicados oficiales y el diario vivir de la Escuela.
        </p>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: NEWS */}
        <div className="lg:col-span-8 space-y-6">
          
          {readingNews ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 space-y-6 animate-fade-in relative">
              {isAdminMode && (
                <div className="absolute top-6 right-6 flex gap-2 z-10">
                  <button onClick={() => { setEditingNews(readingNews); setNewsForm({ ...readingNews, fecha: readingNews.fecha || '' }); setIsNewsModalOpen(true); }} className="bg-blue-50 text-blue-500 p-2 rounded-full hover:bg-blue-100 cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteNews(readingNews.id)} className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}

              <button onClick={() => setReadingNews(null)} className="text-xs font-bold text-[#05087E] hover:text-[#FF030D] flex items-center gap-1.5 mb-2 hover:underline cursor-pointer">
                <ChevronLeft className="w-4 h-4" /> <span>Volver a todas las noticias</span>
              </button>

              <div className="space-y-3 pr-20">
                <span className="bg-red-50 text-[#FF030D] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {readingNews?.categoria || 'Sin Categoría'}
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-[#05087E] leading-tight">
                  {readingNews?.titulo}
                </h3>
                <span className="text-xs text-gray-500 block">
                  Publicado el {formatearFechaSegura(readingNews?.fecha)}
                </span>
              </div>

              <div className="h-[320px] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <img src={readingNews?.imagen || 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80'} alt="Portada" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 text-sm text-gray-700 leading-relaxed font-sans text-justify">
                <p className="font-semibold text-[#05087E] text-base">{readingNews?.resumen}</p>
                <p className="whitespace-pre-wrap">{readingNews?.contenido}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:max-w-xs">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar noticias..." className="w-full p-2.5 pl-9 rounded-full border border-gray-200 text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none" />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>

                <div className="flex flex-wrap gap-1 w-full md:w-auto justify-start md:justify-end items-center">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${selectedCategory === cat ? 'bg-[#05087E] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {cat}
                    </button>
                  ))}
                  {isAdminMode && (
                    <button onClick={() => { setEditingNews(null); setNewsForm({ titulo: '', resumen: '', contenido: '', categoria: 'Institucional', imagen: '', fecha: new Date().toISOString().split('T')[0] }); setIsNewsModalOpen(true); }} className="ml-2 bg-[#FF030D] text-white px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-red-700 cursor-pointer">
                      <Plus className="w-3.5 h-3.5" /> Publicar Noticia
                    </button>
                  )}
                </div>
              </div>

              {filteredNoticias.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
                  <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">No se encontraron noticias publicadas.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredNoticias.map((noticia) => {
                    if (!noticia) return null; // DOBLE SEGURIDAD
                    return (
                      <article key={noticia.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group h-full relative">
                        {isAdminMode && (
                          <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setEditingNews(noticia); setNewsForm({...noticia, fecha: noticia.fecha || ''}); setIsNewsModalOpen(true); }} className="bg-white text-blue-500 p-1.5 rounded-md shadow cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteNews(noticia.id); }} className="bg-white text-red-500 p-1.5 rounded-md shadow cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        )}
                        
                        <div className="relative h-44 overflow-hidden bg-gray-100 cursor-pointer" onClick={() => { setReadingNews(noticia); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                          <img src={noticia.imagen || 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&q=80'} alt="Miniatura" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-3 left-3 bg-[#05087E] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                            {noticia.categoria || 'Actualidad'}
                          </span>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 cursor-pointer" onClick={() => { setReadingNews(noticia); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                          <div className="space-y-2">
                            <span className="text-[10px] text-gray-500 font-medium block">
                              {formatearFechaSegura(noticia.fecha)}
                            </span>
                            <h4 className="text-sm font-display font-bold text-[#05087E] line-clamp-2 leading-snug group-hover:text-[#FF030D] transition-colors">
                              {noticia.titulo || 'Sin título'}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                              {noticia.resumen || '...'}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-[#FF030D] flex items-center gap-1 pt-3 border-t border-gray-50 group-hover:underline">
                            <span>Leer noticia</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CALENDARIO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#FF030D] uppercase tracking-widest">Calendario</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="relative flex items-center bg-gray-50 hover:bg-gray-100 rounded px-2 py-0.5 transition-colors cursor-pointer">
                    <select value={currentDate.getMonth()} onChange={handleMonthChange} className="text-sm font-display font-extrabold text-[#05087E] bg-transparent outline-none cursor-pointer appearance-none pr-4 relative z-10">
                      {meses.map((mes, idx) => <option key={mes} value={idx}>{mes}</option>)}
                    </select>
                    <ChevronDown className="w-3 h-3 text-[#05087E] absolute right-1 z-0" />
                  </div>
                  <div className="relative flex items-center bg-gray-50 hover:bg-gray-100 rounded px-2 py-0.5 transition-colors cursor-pointer">
                    <select value={currentDate.getFullYear()} onChange={handleYearChange} className="text-sm font-display font-extrabold text-[#05087E] bg-transparent outline-none cursor-pointer appearance-none pr-4 relative z-10">
                      {anios.map(anio => <option key={anio} value={anio}>{anio}</option>)}
                    </select>
                    <ChevronDown className="w-3 h-3 text-[#05087E] absolute right-1 z-0" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400">
              <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {emptyCells.map((_, i) => <div key={`empty-${i}`} className="h-8" />)}
              {monthDays.map((day) => {
                const isSelected = isSelectedDate(day);
                const isEventDay = hasEvent(day);
                return (
                  <button key={day} onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))} className={`h-8 w-8 mx-auto rounded-full text-xs font-bold flex items-center justify-center relative transition-all cursor-pointer ${isSelected ? 'bg-[#FF030D] text-white shadow-md shadow-red-100' : isEventDay ? 'bg-blue-50 text-[#05087E] hover:bg-blue-100' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <span>{day}</span>
                    {isEventDay && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-[#FF030D] rounded-full" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Actividades para el {selectedDate.getDate()} de {meses[selectedDate.getMonth()]}
              </span>

              {selectedDayEvents.length === 0 ? (
                <p className="text-[11px] text-gray-500 italic">No hay actividades registradas.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((evento) => {
                    if (!evento) return null; // DOBLE SEGURIDAD
                    return (
                      <div key={evento.id} className="bg-[#F8F9FA] p-3.5 rounded-xl border-l-4 border-[#05087E] space-y-2 relative group">
                        {isAdminMode && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => { setEditingEvent(evento); setEventForm({...evento, fecha: evento.fecha || ''}); setIsEventModalOpen(true); }} className="text-blue-500 hover:bg-blue-100 p-1 rounded cursor-pointer"><Edit2 className="w-3.5 h-3.5"/></button>
                             <button onClick={() => handleDeleteEvent(evento.id)} className="text-red-500 hover:bg-red-100 p-1 rounded cursor-pointer"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        )}
                        <div className="flex justify-between items-start gap-2 pr-12">
                          <span className="bg-red-50 text-[#FF030D] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">{evento.categoria || 'Evento'}</span>
                          <div className="flex items-center gap-1 text-[9px] text-gray-500">
                            <Clock className="w-3 h-3 text-[#FF030D]" />
                            <span>{evento.esTodoElDia ? 'Todo el día' : (evento.hora || 'Sin hora')}</span>
                          </div>
                        </div>
                        <h4 className="text-xs font-display font-bold text-[#05087E] leading-snug">{evento.titulo || 'Evento'}</h4>
                        <p className="text-[10px] text-gray-600 font-sans leading-normal whitespace-pre-wrap">{evento.descripcion || ''}</p>
                        <div className="flex items-center gap-1 text-[9px] text-gray-500 pt-1 border-t border-gray-100/40">
                          <MapPin className="w-3 h-3 text-[#05087E]" />
                          <span className="line-clamp-1">{evento.lugar || 'Lugar sin definir'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {isAdminMode && (
                <button onClick={() => { setEditingEvent(null); setEventForm({ titulo: '', categoria: 'ACTIVIDAD', descripcion: '', hora: '08:00', lugar: 'Escuela Bernardo O\'Higgins', fecha: formatEventDate(selectedDate.getDate()), esTodoElDia: false }); setIsEventModalOpen(true); }} className="w-full mt-2 bg-emerald-50 border border-dashed border-emerald-300 text-emerald-700 py-2 rounded-xl text-[10px] font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <Plus className="w-3 h-3" /> Añadir Evento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALES OMITIDOS PARA AHORRAR ESPACIO, PERO ESTÁN INCLUIDOS EN EL CÓDIGO --- */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[600px] w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsNewsModalOpen(false)} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 text-gray-500 cursor-pointer"><X className="w-4 h-4"/></button>
            <h3 className="text-lg font-bold text-[#05087E] mb-6 border-b pb-2">{editingNews ? 'Editar Noticia' : 'Publicar Noticia'}</h3>
            
            <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Titular de la Noticia*</label>
                <input required type="text" value={newsForm.titulo} onChange={e => setNewsForm({...newsForm, titulo: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Categoría*</label>
                  <select value={newsForm.categoria} onChange={e => setNewsForm({...newsForm, categoria: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none cursor-pointer">
                    {categories.filter(c => c !== 'Todos').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Fecha de Publicación*</label>
                  <input required type="date" value={newsForm.fecha} onChange={e => setNewsForm({...newsForm, fecha: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Extracto (Resumen corto)*</label>
                <textarea required rows={2} maxLength={150} value={newsForm.resumen} onChange={e => setNewsForm({...newsForm, resumen: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none resize-none" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Contenido Completo*</label>
                <textarea required rows={6} value={newsForm.contenido} onChange={e => setNewsForm({...newsForm, contenido: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Foto de Portada</label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center relative transition-colors ${isUploading ? 'border-amber-300 bg-amber-50' : 'border-gray-300 hover:bg-gray-50 cursor-pointer'}`}>
                  <input type="file" accept="image/*" disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" onChange={async e => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setIsUploading(true);
                      try {
                        const storageRef = ref(storage, `noticias/portada_${Date.now()}`);
                        await uploadBytes(storageRef, file);
                        const url = await getDownloadURL(storageRef);
                        setNewsForm({...newsForm, imagen: url});
                      } catch (error) {
                        alert("Hubo un error al subir la imagen.");
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }}/>
                  {isUploading ? <UploadCloud className="w-6 h-6 text-amber-500 mx-auto mb-1 animate-bounce" /> : <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />}
                  <p className="text-gray-500 font-bold">{isUploading ? 'Subiendo imagen...' : 'Buscar imagen en tu PC'}</p>
                </div>
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-[#05087E] text-white font-bold py-3 rounded-full mt-2 hover:bg-blue-900 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {editingNews ? 'Guardar Cambios' : 'Publicar Noticia Oficial'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: FORMULARIO DE EVENTO --- */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[500px] w-full shadow-2xl relative">
            <button onClick={() => setIsEventModalOpen(false)} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 text-gray-500 cursor-pointer"><X className="w-4 h-4"/></button>
            <h3 className="text-lg font-bold text-[#05087E] mb-6 border-b pb-2">{editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}</h3>
            
            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Título del Evento*</label>
                <input required type="text" value={eventForm.titulo} onChange={e => setEventForm({...eventForm, titulo: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Etiqueta/Tipo*</label>
                  <select value={eventForm.categoria} onChange={e => setEventForm({...eventForm, categoria: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none cursor-pointer">
                    <option>ACTIVIDAD</option><option>EVALUACIÓN</option><option>REUNIÓN</option><option>FERIADO</option><option>CEREMONIA</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-end mb-1">
                    <label className="font-bold text-gray-700">Hora de Inicio*</label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-600 font-medium">
                      <input type="checkbox" checked={eventForm.esTodoElDia} onChange={e => setEventForm({...eventForm, esTodoElDia: e.target.checked, hora: e.target.checked ? 'Todo el día' : '08:00'})} className="accent-[#05087E]" />
                      Todo el día
                    </label>
                  </div>
                  {!eventForm.esTodoElDia ? (
                    <input required type="time" value={eventForm.hora} onChange={e => setEventForm({...eventForm, hora: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none" />
                  ) : (
                    <div className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 text-center font-bold">Día Completo</div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Lugar exacto*</label>
                <input required type="text" value={eventForm.lugar} onChange={e => setEventForm({...eventForm, lugar: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Descripción Breve*</label>
                <textarea required rows={3} value={eventForm.descripcion} onChange={e => setEventForm({...eventForm, descripcion: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#05087E] outline-none resize-none" />
              </div>
              
              <button type="submit" className="w-full bg-[#05087E] text-white font-bold py-3 rounded-full mt-2 hover:bg-blue-900 transition-colors shadow-md cursor-pointer">
                Guardar en Calendario
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}