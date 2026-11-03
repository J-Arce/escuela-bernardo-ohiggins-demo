/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, Filter, Calendar, Clock, MapPin, ArrowRight, BookOpen, 
  ChevronLeft, ChevronRight, Bookmark, ArrowUpRight 
} from 'lucide-react';
import { Noticia, Evento } from '../types';

interface NoticiasEventosProps {
  noticias: Noticia[];
  eventos: Evento[];
}

export default function NoticiasEventos({ noticias, eventos }: NoticiasEventosProps) {
  // News Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Académico' | 'Deportes' | 'Institucional' | 'Cultura' | 'Comunidad'>('Todos');
  const [readingNews, setReadingNews] = useState<Noticia | null>(null);

  // Calendar States (July 2026)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(12); // Default to July 12 (has the general parents meeting)

  // Filter News Logic
  const filteredNoticias = noticias.filter((noticia) => {
    const matchesSearch = noticia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          noticia.resumen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || noticia.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calendar Data Helpers (July 2026 starts on a Wednesday)
  const julyDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const startingEmptyCells = 3; // July 2026 1st is Wednesday, so 3 empty slots (Mon, Tue) if starting week on Sunday, or 2 if Monday.
  // Let's assume standard grid starting on Monday. 
  // 1st of July 2026 is a Wednesday, so empty slots for Mon, Tue = 2.
  const emptyCells = Array.from({ length: 2 });

  const getEventsForDay = (day: number) => {
    const dateString = `2026-07-${day < 10 ? '0' + day : day}`;
    return eventos.filter(e => e.fecha === dateString);
  };

  const selectedDayEvents = getEventsForDay(selectedCalendarDay);

  const categories = ['Todos', 'Académico', 'Deportes', 'Institucional', 'Cultura', 'Comunidad'] as const;

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="news-blog-view">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Actualidad</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Noticias y Calendario Académico
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto">
          Mantente al día con los comunicados oficiales, logros deportivos, eventos culturales y el diario vivir de la Escuela Bernardo O'Higgins.
        </p>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* Grid: Left = News Feed, Right = Interactive Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="news-grid-container">
        
        {/* LEFT COLUMN: NEWS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* If Reading a specific article (Single View detail) */}
          {readingNews ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 space-y-6 animate-fade-in" id="article-detail-view">
              <button 
                onClick={() => setReadingNews(null)}
                className="text-xs font-bold text-[#05087E] hover:text-[#FF030D] flex items-center gap-1.5 mb-2 hover:underline cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a todas las noticias</span>
              </button>

              <div className="space-y-3">
                <span className="bg-red-50 text-[#FF030D] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {readingNews.categoria}
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-[#05087E] leading-tight">
                  {readingNews.titulo}
                </h3>
                <span className="text-xs text-gray-500 block">
                  Publicado el {new Date(readingNews.fecha + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="h-[320px] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <img 
                  src={readingNews.imagen} 
                  alt={readingNews.titulo} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm text-gray-700 leading-relaxed font-sans text-justify">
                <p className="font-semibold text-[#05087E] text-base">
                  {readingNews.resumen}
                </p>
                <p>
                  {readingNews.contenido}
                </p>
              </div>

              <hr className="border-gray-100" />

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Escuela Bernardo O'Higgins de Copiapó</span>
                <span className="font-bold text-[#FF030D] uppercase tracking-wider">Ley de Inclusión</span>
              </div>
            </div>
          ) : (
            // News Feed Grid View
            <div className="space-y-6">
              
              {/* Search and Filters Controls */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center" id="search-controls">
                
                {/* Search input */}
                <div className="relative w-full md:max-w-xs">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar noticias..."
                    className="w-full p-2.5 pl-9 rounded-full border border-gray-200 text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none"
                    id="news-search-input"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 w-full md:w-auto justify-start md:justify-end">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#05087E] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      id={`btn-cat-${cat}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Grid */}
              {filteredNoticias.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
                  <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">No se encontraron noticias que coincidan con los filtros.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="news-grid">
                  {filteredNoticias.map((noticia) => (
                    <article
                      key={noticia.id}
                      onClick={() => {
                        setReadingNews(noticia);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group h-full"
                      id={`feed-card-${noticia.id}`}
                    >
                      <div className="relative h-44 overflow-hidden bg-gray-100">
                        <img 
                          src={noticia.imagen} 
                          alt={noticia.titulo} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-[#05087E] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {noticia.categoria}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-gray-500 font-medium block">
                            {new Date(noticia.fecha + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <h4 className="text-sm font-display font-bold text-[#05087E] line-clamp-2 leading-snug group-hover:text-[#FF030D] transition-colors">
                            {noticia.titulo}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                            {noticia.resumen}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-[#FF030D] flex items-center gap-1 pt-3 border-t border-gray-50 group-hover:underline">
                          <span>Leer noticia completa</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CALENDAR (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6" id="interactive-calendar-panel">
            
            {/* Calendar Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#FF030D] uppercase tracking-widest">Calendario</span>
                <h3 className="text-sm font-display font-extrabold text-[#05087E]">
                  Julio 2026
                </h3>
              </div>
              <span className="text-[10px] bg-[#05087E]/10 text-[#05087E] font-bold py-1 px-2.5 rounded-full">
                Copiapó
              </span>
            </div>

            {/* Days of week labels */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400">
              <span>Lu</span>
              <span>Ma</span>
              <span>Mi</span>
              <span>Ju</span>
              <span>Vi</span>
              <span>Sá</span>
              <span>Do</span>
            </div>

            {/* Grid days (July 2026 starting on Wednesday) */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for Monday and Tuesday */}
              {emptyCells.map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {/* July days */}
              {julyDays.map((day) => {
                const dateEvents = getEventsForDay(day);
                const isSelected = selectedCalendarDay === day;
                const hasEvents = dateEvents.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedCalendarDay(day)}
                    className={`h-8 w-8 mx-auto rounded-full text-xs font-bold flex items-center justify-center relative transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF030D] text-white shadow-md shadow-red-100'
                        : hasEvents
                        ? 'bg-blue-50 text-[#05087E] hover:bg-blue-100'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{day}</span>
                    {/* Event Indicator dot */}
                    {hasEvents && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 bg-[#FF030D] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed view of selected day's events */}
            <div className="pt-4 border-t border-gray-100 space-y-3" id="calendar-day-events-panel">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Actividades para el {selectedCalendarDay} de Julio
              </span>

              {selectedDayEvents.length === 0 ? (
                <p className="text-[11px] text-gray-500 italic">No hay actividades registradas para este día.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((evento) => (
                    <div 
                      key={evento.id} 
                      className="bg-[#F8F9FA] p-3.5 rounded-xl border-l-4 border-[#05087E] space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="bg-red-50 text-[#FF030D] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          {evento.categoria}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] text-gray-500">
                          <Clock className="w-3 h-3 text-[#FF030D]" />
                          <span>{evento.hora}</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-display font-bold text-[#05087E] leading-snug">
                        {evento.titulo}
                      </h4>
                      <p className="text-[10px] text-gray-600 font-sans leading-normal">
                        {evento.descripcion}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-gray-500 pt-1 border-t border-gray-100/40">
                        <MapPin className="w-3 h-3 text-[#05087E]" />
                        <span className="line-clamp-1">{evento.lugar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
