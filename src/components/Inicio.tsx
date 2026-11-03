/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowRight, Calendar, Landmark, Users, Trophy, GraduationCap, Clock, 
  MapPin, CheckCircle, Quote, Star, ArrowUpRight, School 
} from 'lucide-react';
import { Noticia, Evento } from '../types';

interface InicioProps {
  noticias: Noticia[];
  eventos: Evento[];
  onNavigate: (tabId: string) => void;
  heroImage: string;
  onOpenOpinionModal: () => void;
}

export default function Inicio({ noticias, eventos, onNavigate, heroImage, onOpenOpinionModal }: InicioProps) {
  const noticiasDestacadas = noticias.filter(n => n.destacado).slice(0, 2);
  // Filter global calendar events to show those categorized as "Actividad", ordered by date (closest first)
  const proximosEventos = eventos
    .filter(evento => evento.categoria === 'Actividad')
    .sort((a, b) => new Date(a.fecha + 'T00:00:00').getTime() - new Date(b.fecha + 'T00:00:00').getTime());

  const stats = [
    { value: '70+ Años', label: 'Trayectoria Educativa', icon: Landmark, color: 'text-blue-700' },
    { value: '450+', label: 'Matrícula Escolar', icon: Users, color: 'text-red-600' },
    { value: '100%', label: 'Gratuidad (SEP / PIE)', icon: CheckCircle, color: 'text-emerald-600' },
    { value: '15+', label: 'Talleres Extracurriculares', icon: Trophy, color: 'text-amber-500' },
  ];

  const quickAccess = [
    {
      title: 'Admisión 2027',
      desc: 'Requisitos, vacantes y pre-inscripción en línea.',
      tabId: 'admision',
      bgColor: 'bg-[#05087E]',
      textColor: 'text-white',
      badge: 'SAE Chile',
    },
    {
      title: 'Vida Estudiantil',
      desc: 'Talleres deportivos, científicos y artísticos.',
      tabId: 'vida-estudiantil',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      border: 'border border-gray-100 shadow-sm',
    },
    {
      title: 'Convivencia Escolar',
      desc: 'Protocolos de convivencia, apoyo y seguridad.',
      tabId: 'convivencia',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      border: 'border border-gray-100 shadow-sm',
    },
    {
      title: 'Noticias & Calendario',
      desc: 'Últimas novedades y actividades del mes.',
      tabId: 'noticias',
      bgColor: 'bg-[#FF030D]',
      textColor: 'text-white',
    },
  ];

  const testimonios = [
    {
      nombre: 'Sandra Carrizo',
      rol: 'Apoderada 5° Básico',
      texto: 'Elegí la Escuela Bernardo O\'Higgins por su gran calidad de profesores y su Programa de Integración Escolar (PIE). Mi hijo ha crecido enormemente en lo académico y en lo personal. ¡Estamos muy agradecidos!',
      estrellas: 5
    },
    {
      nombre: 'Tomás Araya',
      rol: 'Ex-alumno Generación 2021',
      texto: 'Las academias de robótica y fútbol me enseñaron sobre disciplina y trabajo en equipo. Los recuerdos que tengo de mis profesores y del patio de la escuela me acompañarán siempre en la enseñanza media.',
      estrellas: 5
    }
  ];

  return (
    <div className="space-y-16" id="home-view">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[500px] md:min-h-[560px] flex items-center bg-gray-950 text-white overflow-hidden rounded-3xl mx-auto max-w-[1200px]" id="hero-section">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Escuela Bernardo O'Higgins" 
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05087E]/90 to-[#05087E]/50" />
        </div>

        <div className="relative z-10 w-full max-w-[800px] px-6 py-12 md:py-20 md:pl-12 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-[#FF030D] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
            <School className="w-3.5 h-3.5" />
            <span>Comunidad Educativa Pública</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-tight">
            Bienvenidos a la <br className="hidden md:inline"/>
            <span className="text-white border-b-4 border-[#FF030D]">Escuela Bernardo O'Higgins</span>
          </h2>

          <p className="text-sm md:text-base text-gray-200 font-sans leading-relaxed">
            Formando el futuro de Copiapó con una educación integral de excelencia, inclusiva, democrática y enraizada en los valores fundamentales de la Región de Atacama.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => onNavigate('admision')}
              className="bg-[#FF030D] hover:bg-[#d8020a] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              id="hero-cta-admision"
            >
              <span>Admisión 2027</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('nosotros')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2"
              id="hero-cta-nosotros"
            >
              <span>Conócenos</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. ACCESOS RÁPIDOS */}
      <section className="max-w-[1200px] mx-auto px-4" id="quick-access-section">
        <div className="text-center mb-10">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Enlaces Directos</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#05087E] mt-1">
            Accesos Rápidos
          </h2>
          <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickAccess.map((card, i) => (
            <div
              key={i}
              onClick={() => onNavigate(card.tabId)}
              className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${card.bgColor} ${card.textColor} ${card.border || ''}`}
              id={`quick-card-${card.tabId}`}
            >
              <div className="flex justify-between items-start mb-4">
                {card.badge ? (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {card.badge}
                  </span>
                ) : (
                  <div className="w-1.5 h-1.5 bg-[#FF030D] rounded-full" />
                )}
                <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-display font-bold mb-2">{card.title}</h3>
              <p className="text-xs opacity-80 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NOVEDADES & PRÓXIMOS EVENTOS */}
      <section className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12" id="novedades-section">
        {/* News Feed (Grid) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end border-b border-gray-100 pb-3">
            <div>
              <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Actualidad</span>
              <h2 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
                Novedades de la Escuela
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('noticias')}
              className="text-xs font-bold text-[#05087E] hover:text-[#FF030D] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {noticiasDestacadas.map((noticia) => (
              <article 
                key={noticia.id} 
                onClick={() => onNavigate('noticias')}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
                id={`news-card-${noticia.id}`}
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img 
                    src={noticia.imagen} 
                    alt={noticia.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#05087E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {noticia.categoria}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] text-gray-500 font-medium block">
                      {new Date(noticia.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <h3 className="text-sm font-display font-bold text-[#05087E] line-clamp-2 leading-snug">
                      {noticia.titulo}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {noticia.resumen}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#FF030D] flex items-center gap-1 pt-3 border-t border-gray-50 mt-4 group-hover:underline">
                    <span>Leer noticia completa</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Calendar / Events Sidebar */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Calendario</span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
              Próximos Eventos
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {proximosEventos.map((evento) => (
              <div 
                key={evento.id} 
                onClick={() => onNavigate('noticias')}
                className="bg-[#F8F9FA] p-4 rounded-xl border-l-4 border-[#FF030D] hover:bg-gray-100 transition-colors cursor-pointer flex gap-4"
                id={`event-item-${evento.id}`}
              >
                <div className="bg-white shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-red-600 -mb-1">
                    {new Date(evento.fecha + 'T00:00:00').toLocaleDateString('es-CL', { month: 'short' }).replace('.', '')}
                  </span>
                  <span className="text-lg font-display font-extrabold text-[#05087E]">
                    {new Date(evento.fecha + 'T00:00:00').getDate()}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {evento.categoria}
                  </span>
                  <h4 className="text-xs font-display font-bold text-[#05087E] line-clamp-1">
                    {evento.titulo}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-[#FF030D]" />
                      {evento.hora}
                    </span>
                    <span className="flex items-center gap-0.5 line-clamp-1 max-w-[120px]">
                      <MapPin className="w-3 h-3 text-[#05087E]" />
                      {evento.lugar}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('noticias')}
            className="w-full bg-[#05087E] hover:bg-blue-900 text-white text-xs font-bold py-3 px-4 rounded-full shadow-md text-center block transition-all"
          >
            Ver Calendario Escolar Completo
          </button>
        </div>
      </section>

      {/* 4. CIFRAS INSTITUCIONALES */}
      <section className="bg-[#05087E] text-white py-12 rounded-3xl max-w-[1200px] mx-auto px-6 relative overflow-hidden" id="stats-section">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16" />
        
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="space-y-2 flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-xs text-gray-300 font-sans max-w-[150px] mx-auto">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TESTIMONIOS */}
      <section className="max-w-[1200px] mx-auto px-4" id="testimonials-section">
        <div className="text-center mb-10">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Experiencias</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#05087E] mt-1">
            Nuestra Comunidad Opina
          </h2>
          <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonios.map((test, i) => (
            <div 
              key={i} 
              className="bg-[#F8F9FA] p-8 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between"
              id={`testimonio-card-${i}`}
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-gray-200 shrink-0" />
              
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(test.estrellas)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed relative z-10">
                  "{test.texto}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 bg-[#05087E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {test.nombre[0]}
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold text-[#05087E]">
                    {test.nombre}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {test.rol}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TU OPINIÓN NOS IMPORTA SECTION */}
      <section className="max-w-[1200px] mx-auto px-4" id="opinion-cta-section">
        <div className="bg-red-50 rounded-3xl p-8 border border-red-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-[#FF030D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Participación de la Comunidad
            </span>
            <h3 className="text-xl font-display font-bold text-[#05087E]">
              ¿Tiene sugerencias, reclamos o felicitaciones?
            </h3>
            <p className="text-xs text-gray-600 max-w-[650px] leading-relaxed">
              La voz de nuestra comunidad en Copiapó es el motor de nuestra mejora. Envíenos su opinión de forma segura, garantizando el anonimato si lo desea, bajo las normativas de transparencia y protección Ley 19.628.
            </p>
          </div>
          <button
            onClick={onOpenOpinionModal}
            className="bg-[#05087E] hover:bg-blue-900 text-white font-bold px-6 py-3.5 rounded-full text-xs shrink-0 shadow-md hover:shadow-lg transition-all cursor-pointer font-sans uppercase tracking-wider"
          >
            Tu Opinión Nos Importa
          </button>
        </div>
      </section>
    </div>
  );
}
