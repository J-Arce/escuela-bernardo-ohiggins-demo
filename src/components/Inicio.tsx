/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  ArrowRight, Landmark, Users, Trophy, Clock, 
  MapPin, CheckCircle, Quote, ArrowUpRight, School, Cloud, Image as ImageIcon 
} from 'lucide-react';
import { Noticia, Evento } from '../types';
import InlineEdit from './InlineEdit';

interface InicioProps {
  noticias: Noticia[];
  eventos: Evento[];
  onNavigate: (tabId: string) => void;
  heroImage: string;
  onOpenOpinionModal: () => void;
  opinionesAprobadas?: { id: string; nombre: string; rol?: string; mensaje: string }[];
  isAdminMode?: boolean;
}

export default function Inicio({ noticias, eventos, onNavigate, onOpenOpinionModal, opinionesAprobadas, isAdminMode = false }: InicioProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- ESTADOS EDITABLES FIREBASE ---
  const [heroBg, setHeroBg] = useState("https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200");
  const [heroTitle1, setHeroTitle1] = useState("Bienvenidos a la");
  const [heroTitle2, setHeroTitle2] = useState("Escuela Bernardo O'Higgins");
  const [heroDesc, setHeroDesc] = useState("Formando el futuro de Copiapó con una educación integral de excelencia, inclusiva, democrática y enraizada en los valores fundamentales de la Región de Atacama.");
  const [btnAdmisionText, setBtnAdmisionText] = useState("Admisión 2027");
  const [btnNosotrosText, setBtnNosotrosText] = useState("Conócenos");

  const [stats, setStats] = useState([
    { id: 's1', value: '70+ Años', label: 'Trayectoria Educativa', iconName: 'Landmark', color: 'text-blue-700' },
    { id: 's2', value: '450+', label: 'Matrícula Escolar', iconName: 'Users', color: 'text-red-600' },
    { id: 's3', value: '100%', label: 'Gratuidad (SEP / PIE)', iconName: 'CheckCircle', color: 'text-emerald-600' },
    { id: 's4', value: '15+', label: 'Talleres Extracurriculares', iconName: 'Trophy', color: 'text-amber-500' }
  ]);

  const [quickAccess, setQuickAccess] = useState([
    { id: 'q1', title: 'Admisión 2027', desc: 'Requisitos, vacantes y pre-inscripción en línea.', tabId: 'admision', bgColor: 'bg-[#05087E]', textColor: 'text-white', badge: 'SAE Chile' },
    { id: 'q2', title: 'Vida Estudiantil', desc: 'Talleres deportivos, científicos y artísticos.', tabId: 'vida-estudiantil', bgColor: 'bg-white', textColor: 'text-gray-900', border: 'border border-gray-100 shadow-sm', badge: '' },
    { id: 'q3', title: 'Convivencia Escolar', desc: 'Protocolos de convivencia, apoyo y seguridad.', tabId: 'convivencia-escolar', bgColor: 'bg-white', textColor: 'text-gray-900', border: 'border border-gray-100 shadow-sm', badge: '' },
    { id: 'q4', title: 'Noticias & Calendario', desc: 'Últimas novedades y actividades del mes.', tabId: 'noticias', bgColor: 'bg-[#FF030D]', textColor: 'text-white', badge: '' }
  ]);

  // --- ESTADOS DINÁMICOS DE NOTICIAS Y EVENTOS ---
  const [ultimasNoticias, setUltimasNoticias] = useState<any[]>([]);
  const [proximosEventos, setProximosEventos] = useState<any[]>([]);

  // Cargar de Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Cargar textos e imagen editable de Inicio
        const docRef = doc(db, "paginas", "inicio");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroBg) setHeroBg(data.heroBg);
          if (data.heroTitle1) setHeroTitle1(data.heroTitle1);
          if (data.heroTitle2) setHeroTitle2(data.heroTitle2);
          if (data.heroDesc) setHeroDesc(data.heroDesc);
          if (data.btnAdmisionText) setBtnAdmisionText(data.btnAdmisionText);
          if (data.btnNosotrosText) setBtnNosotrosText(data.btnNosotrosText);
          if (data.stats) setStats(data.stats);
          if (data.quickAccess) setQuickAccess(data.quickAccess);
        }

        // 2. Cargar Noticias y Eventos DIRECTO de la base de datos
        const neRef = doc(db, "paginas", "noticias_eventos");
        const neSnap = await getDoc(neRef);
        if (neSnap.exists()) {
          const neData = neSnap.data();
          if (neData.noticias) {
            const ultimas = [...neData.noticias]
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .slice(0, 2);
            setUltimasNoticias(ultimas);
          }
          if (neData.eventos) {
            const hoy = new Date().toISOString().split('T')[0];
            const proximos = [...neData.eventos]
              .filter(e => e.fecha >= hoy)
              .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
              .slice(0, 2);
            setProximosEventos(proximos);
          }
        }
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const saveToFirebase = async (campo: string, valor: any) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "paginas", "inicio"), { [campo]: valor }, { merge: true });
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  const handleUpdateStat = (id: string, campo: string, valor: string) => {
    const nuevos = stats.map(s => s.id === id ? { ...s, [campo]: valor } : s);
    setStats(nuevos); saveToFirebase('stats', nuevos);
  };

  const handleUpdateQuick = (id: string, campo: string, valor: string) => {
    const nuevos = quickAccess.map(q => q.id === id ? { ...q, [campo]: valor } : q);
    setQuickAccess(nuevos); saveToFirebase('quickAccess', nuevos);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Landmark': return Landmark;
      case 'Users': return Users;
      case 'CheckCircle': return CheckCircle;
      case 'Trophy': return Trophy;
      default: return CheckCircle;
    }
  };

  // --- TESTIMONIOS ---
  const testimoniosMostrar = opinionesAprobadas && opinionesAprobadas.length > 0 
    ? opinionesAprobadas 
    : [
        { id: 'test-1', nombre: 'Sandra Carrizo', rol: 'Apoderado', mensaje: 'Elegí la Escuela Bernardo O\'Higgins por su gran calidad de profesores y su Programa de Integración Escolar (PIE). Mi hijo ha crecido enormemente en lo académico y en lo personal. ¡Estamos muy agradecidos!' },
        { id: 'test-2', nombre: 'Tomás Araya', rol: 'Ex-alumno', mensaje: 'Las academias me enseñaron sobre disciplina y trabajo en equipo. Los recuerdos que tengo de mis profesores y del patio de la escuela me acompañarán siempre.' }
      ];

  if (isLoading) return <div className="text-center py-20 font-bold text-[#05087E]">Cargando Inicio...</div>;

  return (
    <div className="space-y-16" id="home-view">
      
      {isAdminMode && (
        <div className={`fixed bottom-4 right-4 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold shadow-lg z-50 ${isSaving ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
          <Cloud className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Base de Datos Conectada'}
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[500px] md:min-h-[560px] flex items-center bg-gray-950 text-white overflow-hidden rounded-3xl mx-auto max-w-[1200px]" id="hero-section">
        
        {/* Editor de Imagen de Fondo (Solo Admin) */}
        {isAdminMode && (
          <div className="absolute top-4 left-4 z-30 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-xl flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#05087E]" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cambiar Fondo (URL Imagen)</span>
              <input 
                type="text" 
                value={heroBg}
                onChange={(e) => {
                  setHeroBg(e.target.value);
                  saveToFirebase('heroBg', e.target.value);
                }}
                className="text-xs bg-transparent border-b border-gray-300 focus:border-[#05087E] outline-none w-48 md:w-72 text-gray-800 py-1"
                placeholder="Pegar link de imagen aquí..."
              />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-[#05087E]">
          <img 
            src={heroBg} 
            alt="Fondo Escuela" 
            className="w-full h-full object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-[#05087E]/60 mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full max-w-[800px] px-6 py-12 md:py-20 md:pl-12 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-[#FF030D] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
            <School className="w-3.5 h-3.5" /> <span>Comunidad Educativa Pública</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-tight">
            <InlineEdit value={heroTitle1} onSave={(v) => { setHeroTitle1(v); saveToFirebase('heroTitle1', v); }} isEditMode={isAdminMode} /><br className="hidden md:inline"/>
            <span className="text-white border-b-4 border-[#FF030D] mt-2 inline-block">
              <InlineEdit value={heroTitle2} onSave={(v) => { setHeroTitle2(v); saveToFirebase('heroTitle2', v); }} isEditMode={isAdminMode} />
            </span>
          </h2>

          <div className="text-sm md:text-base text-gray-200 font-sans leading-relaxed">
            <InlineEdit value={heroDesc} onSave={(v) => { setHeroDesc(v); saveToFirebase('heroDesc', v); }} isEditMode={isAdminMode} multiline />
          </div>

          {/* Botones seguros (No redirigen en modo admin para poder editarlos) */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => !isAdminMode && onNavigate('admision')} 
              className="bg-[#FF030D] hover:bg-[#d8020a] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <InlineEdit value={btnAdmisionText} onSave={(v) => { setBtnAdmisionText(v); saveToFirebase('btnAdmisionText', v); }} isEditMode={isAdminMode} />
              {!isAdminMode && <ArrowRight className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => !isAdminMode && onNavigate('nosotros')} 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2"
            >
              <InlineEdit value={btnNosotrosText} onSave={(v) => { setBtnNosotrosText(v); saveToFirebase('btnNosotrosText', v); }} isEditMode={isAdminMode} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. ACCESOS RÁPIDOS */}
      <section className="max-w-[1200px] mx-auto px-4" id="quick-access-section">
        <div className="text-center mb-10">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Enlaces Directos</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#05087E] mt-1">Accesos Rápidos</h2>
          <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickAccess.map((card) => (
            <div 
              key={card.id} 
              onClick={() => !isAdminMode && onNavigate(card.tabId)} 
              className={`group p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${card.bgColor} ${card.textColor} ${card.border || ''} ${isAdminMode ? 'cursor-text' : 'cursor-pointer'}`}
            >
              <div className="flex justify-between items-start mb-4">
                {card.badge ? (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    <InlineEdit value={card.badge} onSave={(v) => handleUpdateQuick(card.id, 'badge', v)} isEditMode={isAdminMode} />
                  </span>
                ) : (
                  <div className="w-1.5 h-1.5 bg-[#FF030D] rounded-full" />
                )}
                <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-display font-bold mb-2">
                <InlineEdit value={card.title} onSave={(v) => handleUpdateQuick(card.id, 'title', v)} isEditMode={isAdminMode} />
              </h3>
              <p className="text-xs opacity-80 leading-relaxed">
                <InlineEdit value={card.desc} onSave={(v) => handleUpdateQuick(card.id, 'desc', v)} isEditMode={isAdminMode} multiline />
              </p>
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
              <h2 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">Novedades de la Escuela</h2>
            </div>
            <button onClick={() => onNavigate('noticias')} className="text-xs font-bold text-[#05087E] hover:text-[#FF030D] flex items-center gap-1 hover:underline cursor-pointer">
              <span>Ver todas</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ultimasNoticias.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 text-sm">No hay noticias publicadas recientemente.</div>
            ) : (
              ultimasNoticias.map((noticia) => (
                <article 
                  key={noticia.id} 
                  onClick={() => onNavigate('noticias')} 
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group h-full"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img src={noticia.imagenUrl || noticia.imagen} alt={noticia.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-[#05087E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-sm">
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
                        {noticia.resumen || noticia.extracto}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF030D] flex items-center gap-1 pt-3 border-t border-gray-50 group-hover:underline">
                      <span>Leer noticia completa</span> <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Calendar / Events Sidebar */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Calendario</span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">Próximos Eventos</h2>
          </div>

          <div className="flex flex-col gap-4">
            {proximosEventos.length === 0 ? (
               <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 text-sm">No hay eventos próximos programados.</div>
            ) : (
              proximosEventos.map((evento) => (
                <div 
                  key={evento.id} 
                  onClick={() => onNavigate('noticias')} 
                  className="bg-[#F8F9FA] p-4 rounded-xl border-l-4 border-[#FF030D] hover:bg-gray-100 transition-colors cursor-pointer flex gap-4"
                >
                  <div className="bg-white shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-red-600 -mb-1">
                      {new Date(evento.fecha + 'T00:00:00').toLocaleDateString('es-CL', { month: 'short' }).replace('.', '')}
                    </span>
                    <span className="text-lg font-display font-extrabold text-[#05087E]">
                      {new Date(evento.fecha + 'T00:00:00').getDate()}
                    </span>
                  </div>
                  <div className="space-y-1 w-full">
                    <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      {evento.categoria}
                    </span>
                    <h4 className="text-xs font-display font-bold text-[#05087E] line-clamp-1">{evento.titulo}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-[#FF030D]" /> {evento.esTodoElDia ? 'Todo el día' : evento.hora}</span>
                      <span className="flex items-center gap-0.5 line-clamp-1 max-w-[120px]"><MapPin className="w-3 h-3 text-[#05087E]" /> {evento.lugar || evento.ubicacion}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button 
            onClick={() => onNavigate('noticias')} 
            className="w-full bg-[#05087E] hover:bg-blue-900 text-white text-xs font-bold py-3 px-4 rounded-full shadow-md text-center block transition-all cursor-pointer"
          >
            Ver Calendario Escolar Completo
          </button>
        </div>
      </section>

      {/* 4. CIFRAS INSTITUCIONALES (EDITABLES) */}
      <section className="bg-[#05087E] text-white py-12 rounded-3xl max-w-[1200px] mx-auto px-6 relative overflow-hidden" id="stats-section">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16" />
        
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => {
            const Icon = getIconComponent(stat.iconName);
            return (
              <div key={stat.id} className="space-y-2 flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
                  <InlineEdit value={stat.value} onSave={(v) => handleUpdateStat(stat.id, 'value', v)} isEditMode={isAdminMode} />
                </h3>
                <div className="text-xs text-gray-300 font-sans max-w-[150px] mx-auto">
                  <InlineEdit value={stat.label} onSave={(v) => handleUpdateStat(stat.id, 'label', v)} isEditMode={isAdminMode} multiline />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TESTIMONIOS */}
      <section className="max-w-[1200px] mx-auto px-4" id="testimonials-section">
        <div className="text-center mb-10">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Experiencias</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#05087E] mt-1">Nuestra Comunidad Opina</h2>
          <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimoniosMostrar.map((test, i) => {
            const nombreMostrar = test.nombre && test.nombre.trim() !== '' ? test.nombre : 'Anónimo';
            const inicial = nombreMostrar !== 'Anónimo' ? nombreMostrar[0].toUpperCase() : 'A';
            
            return (
              <div key={test.id || i} className="bg-[#F8F9FA] p-8 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between">
                <Quote className="absolute top-4 right-4 w-10 h-10 text-gray-200 shrink-0" />
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 italic leading-relaxed relative z-10 pt-2">"{test.mensaje}"</p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                  <div className="w-10 h-10 bg-[#05087E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {inicial}
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-[#05087E]">{nombreMostrar}</h4>
                    <p className="text-xs text-gray-500 font-medium">{test.rol || 'Miembro de la Comunidad'}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
          <button onClick={onOpenOpinionModal} className="bg-[#05087E] hover:bg-blue-900 text-white font-bold px-6 py-3.5 rounded-full text-xs shrink-0 shadow-md hover:shadow-lg transition-all cursor-pointer font-sans uppercase tracking-wider">
            Tu Opinión Nos Importa
          </button>
        </div>
      </section>
    </div>
  );
}