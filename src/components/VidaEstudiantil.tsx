/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, Flame, Calendar, Clock, Image as ImageIcon, Users, 
  MapPin, Heart, ArrowRight, Eye, CheckCircle2 
} from 'lucide-react';
import { Taller } from '../types';
import InlineEdit from './InlineEdit';

interface VidaEstudiantilProps {
  talleres: Taller[];
  isAdminMode: boolean;
  onUpdateTaller: (id: string, updatedFields: Partial<Taller>) => void;
}

export default function VidaEstudiantil({ 
  talleres,
  isAdminMode,
  onUpdateTaller
}: VidaEstudiantilProps) {
  const [selectedCat, setSelectedCat] = useState<'Todos' | 'Deportivo' | 'Artístico' | 'Científico'>('Todos');
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string } | null>(null);
  const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);

  const filteredTalleres = selectedCat === 'Todos'
    ? talleres
    : talleres.filter(t => t.categoria === selectedCat);

  const galleryPhotos = [
    { url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600', title: 'Feria Científica y Reciclaje' },
    { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600', title: 'Talleres en Sala de Computación' },
    { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600', title: 'Campeonato de Atletismo Escolar' },
    { url: 'https://images.unsplash.com/photo-1503095391755-1414e8c35b57?auto=format&fit=crop&q=80&w=600', title: 'Muestra de Teatro Escolar' },
    { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600', title: 'Gala de Danza Folclórica Atacameña' },
    { url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600', title: 'Cuidado Ambiental y Huerto Escolar' }
  ];

  const agendaEstudiantil = [
    { dia: 'Cada Miércoles', actividad: 'Reunión de Convivencia y Mediación de Patio', desc: 'Estudiantes dialogando sobre valores y respeto con la Prof. Judith.' },
    { dia: 'Julio 18', actividad: 'Final del Torneo Comunal de Fútbol Escolar', desc: 'Nuestra escuadra se medirá contra la Escuela de Copiapó en el estadio comunal.' },
    { dia: 'Agosto 14', actividad: 'Gala Folclórica Escolar Día de la Minería', desc: 'Presentación artística en homenaje al esfuerzo de la familia minera de Copiapó.' }
  ];

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="student-life-view">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Identidad</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Vida Estudiantil
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto">
          Descubre los talleres extracurriculares, la agenda de actividades y los momentos significativos de nuestra querida comunidad escolar.
        </p>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* 1. TALLERES EXTRACURRICULARES */}
      <section className="space-y-6" id="talleres-subview">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Formación Integral</span>
            <h3 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
              Talleres y Academias de Libre Elección (ACLE)
            </h3>
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap gap-1.5">
            {(['Todos', 'Deportivo', 'Artístico', 'Científico'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-[#05087E] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                id={`filter-taller-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans" id="talleres-grid">
          {filteredTalleres.map((taller) => (
            <div
              key={taller.id}
              onClick={() => {
                if (!isAdminMode) {
                  setSelectedTaller(taller);
                }
              }}
              className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all duration-300 group ${!isAdminMode ? 'cursor-pointer hover:-translate-y-1' : ''}`}
              id={`taller-card-${taller.id}`}
            >
              <div>
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={taller.imagen}
                    alt={taller.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#05087E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {taller.categoria}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div onClick={(e) => e.stopPropagation()}>
                    <InlineEdit 
                      value={taller.nombre}
                      onSave={(val) => onUpdateTaller(taller.id, { nombre: val })}
                      isEditMode={isAdminMode}
                      className="text-sm font-display font-bold text-[#05087E] leading-snug line-clamp-1"
                    />
                  </div>
                  <div onClick={(e) => e.stopPropagation()} className="text-xs text-gray-600 leading-relaxed">
                    <InlineEdit 
                      value={taller.descripcion}
                      onSave={(val) => onUpdateTaller(taller.id, { descripcion: val })}
                      isEditMode={isAdminMode}
                      multiline={true}
                      className="text-xs text-gray-600 line-clamp-3 text-justify leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 mt-4 border-t border-gray-50 text-[10px] text-gray-500 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF030D] shrink-0" />
                  <InlineEdit 
                    value={taller.horario}
                    onSave={(val) => onUpdateTaller(taller.id, { horario: val })}
                    isEditMode={isAdminMode}
                    className="text-[10px] text-gray-500"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#05087E] shrink-0" />
                  <span>Profesor:&nbsp;
                    <InlineEdit 
                      value={taller.encargado}
                      onSave={(val) => onUpdateTaller(taller.id, { encargado: val })}
                      isEditMode={isAdminMode}
                      className="text-gray-700 font-semibold"
                    />
                  </span>
                </div>
                {!isAdminMode && (
                  <div className="pt-2 text-right">
                    <span className="text-[9px] text-[#05087E] font-bold group-hover:text-[#FF030D] transition-colors inline-flex items-center gap-0.5">
                      Ver Ficha <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. AGENDA DE EVENTOS ESTUDIANTILES */}
      <section className="bg-[#05087E] text-white p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="student-agenda-section">
        <div className="lg:col-span-4 space-y-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#FF030D]" />
          </div>
          <h3 className="text-lg font-display font-bold">Agenda de la Comunidad</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Fechas relevantes en la formación, convivencia y celebraciones representativas planificadas directamente para el Centro de Alumnos y el bienestar social de la comunidad.
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          {agendaEstudiantil.map((agenda, index) => (
            <div key={index} className="bg-white/10 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <span className="bg-[#FF030D] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase inline-block mb-1.5">
                  {agenda.dia}
                </span>
                <h4 className="text-xs font-display font-bold text-white leading-snug">
                  {agenda.actividad}
                </h4>
                <p className="text-[10px] text-gray-300 leading-relaxed font-sans mt-0.5">
                  {agenda.desc}
                </p>
              </div>
              <span className="text-[10px] font-bold text-gray-100 flex items-center gap-0.5 whitespace-nowrap bg-white/5 py-1 px-2.5 rounded-full shrink-0">
                <span>Actividad Libre</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. GALERÍA DE FOTOS INTERACTIVA */}
      <section className="space-y-6" id="gallery-subview">
        <div className="text-center md:text-left">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Registros</span>
          <h3 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
            Galería del Establecimiento
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="gallery-grid">
          {galleryPhotos.map((photo, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedPhoto(photo)}
              className="group relative h-48 rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer bg-gray-100"
              id={`gallery-item-${i}`}
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4" />
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-white space-y-1 z-10">
                <p className="text-xs font-display font-bold leading-snug">
                  {photo.title}
                </p>
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5">
                  <Eye className="w-3 h-3 text-red-400" />
                  <span>Ver Detalle</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Photo Zoom */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
          id="gallery-zoom-modal"
        >
          <div 
            className="bg-white rounded-2xl overflow-hidden max-w-[700px] w-full relative border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 cursor-pointer"
            >
              ✕
            </button>
            <div className="h-[400px] bg-gray-100">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 bg-white flex justify-between items-center border-t border-gray-100 font-sans">
              <h4 className="text-sm font-display font-bold text-[#05087E]">
                {selectedPhoto.title}
              </h4>
              <span className="text-[10px] text-gray-500">Escuela Bernardo O'Higgins</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Taller Details */}
      {selectedTaller && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedTaller(null)}
          id="taller-detail-modal"
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-[550px] w-full relative border border-gray-100 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedTaller(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 cursor-pointer"
              title="Cerrar Ficha"
            >
              ✕
            </button>
            <div className="h-[250px] bg-gray-100 relative">
              <img 
                src={selectedTaller.imagen} 
                alt={selectedTaller.nombre} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#05087E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-md">
                Taller {selectedTaller.categoria}
              </div>
            </div>
            <div className="p-6 space-y-4 font-sans">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-[#05087E] leading-tight">
                  {selectedTaller.nombre}
                </h3>
                <p className="text-xs text-gray-400 font-medium">Escuela Bernardo O'Higgins • Academias ACLE</p>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed text-justify">
                {selectedTaller.descripcion} El taller fomenta valores de disciplina, compañerismo y superación personal. Se realiza semanalmente en nuestras dependencias y cuenta con el equipamiento completo entregado por el establecimiento.
              </p>

              <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px] block">Horario Semanal</span>
                  <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                    <Clock className="w-4 h-4 text-[#FF030D] shrink-0" />
                    <span>{selectedTaller.horario}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px] block">Docente Coordinador</span>
                  <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                    <Users className="w-4 h-4 text-[#05087E] shrink-0" />
                    <span>{selectedTaller.encargado}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedTaller(null)}
                  className="w-full bg-[#05087E] hover:bg-blue-900 text-white font-bold text-xs py-3 rounded-full transition-all cursor-pointer shadow-md"
                >
                  Entendido, Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
