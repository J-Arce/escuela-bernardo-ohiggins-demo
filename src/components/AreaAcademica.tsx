/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // <-- Importamos la conexión a la base de datos
import { 
  GraduationCap, Calendar, Compass, ShieldCheck, Heart, Award, 
  Activity, BookOpen, Clock, BarChart4, CheckCircle2 
} from 'lucide-react';
import InlineEdit from './InlineEdit';

interface AreaAcademicaProps {
  evaluaciones: { id: string; label: string; score: string; trend: string }[];
  onUpdateEvaluacion: (id: string, score: string, trend?: string) => void;
  isAdminMode: boolean;
}

export default function AreaAcademica({
  evaluaciones,
  onUpdateEvaluacion,
  isAdminMode
}: AreaAcademicaProps) {
  const [activeLevel, setActiveLevel] = useState<'parvulo' | 'basica'>('parvulo');

  // Estados locales (Servirán como valores por defecto si Firebase está vacío)
  const [headerDesc, setHeaderDesc] = useState('Ofrecemos un currículum dinámico, innovador e inclusivo bajo los estándares oficiales del Ministerio de Educación de Chile.');

  const [levelsInfo, setLevelsInfo] = useState({
    parvulo: {
      titulo: 'Educación Parvularia (Pre-Kinder y Kinder)',
      desc: 'Formación inicial enfocada en el desarrollo psicosocial, motricidad fina/gruesa, pensamiento lúdico y socialización de niños de 4 a 5 años de edad.',
      edades: '4 a 5 años',
      jornada: 'Media jornada alterna (Mañana: 08:30 a 12:45 / Tarde: 13:45 a 18:00)',
      foco: 'Estimulación temprana, aprestamiento lector, psicomotricidad y fomento socioafectivo.',
      puntos: [
        'Educadoras de Párvulos con especializaciones lúdicas.',
        'Asistentes de aula dedicadas por sala.',
        'Infraestructura de patio infantil exclusiva y segura.',
        'Actividades de articulación fluida hacia 1° básico.'
      ]
    },
    basica: {
      titulo: 'Enseñanza Básica (1° a 8° Año Básico)',
      desc: 'Formación general obligatoria que capacita a niños y niñas en el desarrollo intelectual, cívico, deportivo y tecnológico según los programas nacionales del MINEDUC.',
      edades: '6 a 14 años',
      jornada: 'Jornada Escolar Completa (JEC) (Lunes a Jueves: 08:15 a 15:45 / Viernes: 08:15 a 13:30)',
      foco: 'Matemática, Lenguaje, Ciencias Naturales, Historia, Tecnología, Artes Visuales y Educación Física.',
      puntos: [
        'Laboratorio de Ciencias Naturales y Biblioteca CRA totalmente equipados.',
        'Docentes de asignaturas con menciones pedagógicas.',
        'Acompañamiento y adaptaciones curriculares mediante el PIE.',
        'Inglés desde 1° básico (anticipando el currículum regular).'
      ]
    }
  });

  const [planesEstudio, setPlanesEstudio] = useState([
    { title: 'Enfoque Cognitivo-Constructivista', text: 'Nuestra metodología fomenta que el estudiante sea el protagonista de su aprendizaje, descubriendo el conocimiento a través del análisis, experimentos prácticos y debates.' },
    { title: 'Tecnología y Sala de Enlaces', text: 'Acceso semanal a computación interactiva. Enseña alfabetización digital y seguridad en internet.' },
    { title: 'Biblioteca Escolar CRA', text: 'Centro de Recursos para el Aprendizaje provisto de catálogos impresos y digitales, fomentando planes semanales de lectura domiciliaria guiada.' }
  ]);

  const [pieInfo, setPieInfo] = useState({
    title: 'Apoyo Psicopedagógico y Multidisciplinario',
    desc: "La Escuela Bernardo O'Higgins se compromete con la inclusión efectiva. Nuestro equipo de profesionales PIE incluye educadores diferenciales, psicólogo, fonoaudiólogo y terapeuta ocupacional. Diseñamos planes de adecuación curricular específicos para estudiantes con necesidades educativas especiales (tanto de carácter permanente como transitorio), asegurando que ningún alumno se quede atrás."
  });

  // --- CARGAR DATOS DESDE FIREBASE ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "paginas", "areaAcademica");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.headerDesc) setHeaderDesc(data.headerDesc);
          if (data.levelsInfo) setLevelsInfo(data.levelsInfo);
          if (data.planesEstudio) setPlanesEstudio(data.planesEstudio);
          if (data.pieInfo) setPieInfo(data.pieInfo);
        }
      } catch (error) {
        console.error("Error al cargar datos del Área Académica:", error);
      }
    };
    fetchData();
  }, []);

  // --- GUARDAR DATOS EN FIREBASE ---
  const saveToFirebase = async (campo: string, valor: any) => {
    try {
      // Usamos merge: true para no borrar las "evaluaciones" (SIMCE) que se guardan desde App.tsx
      await setDoc(doc(db, "paginas", "areaAcademica"), { [campo]: valor }, { merge: true });
    } catch (error) {
      console.error("Error guardando en Firebase:", error);
    }
  };

  const currentLevel = levelsInfo[activeLevel];

  // Funciones de actualización de estado y Firebase
  const handleUpdateHeaderDesc = (val: string) => {
    setHeaderDesc(val);
    saveToFirebase('headerDesc', val);
  };

  const handleUpdateLevelField = (field: string, value: string) => {
    setLevelsInfo(prev => {
      const updated = {
        ...prev,
        [activeLevel]: {
          ...prev[activeLevel],
          [field]: value
        }
      };
      saveToFirebase('levelsInfo', updated);
      return updated;
    });
  };

  const handleUpdateLevelPoint = (index: number, value: string) => {
    setLevelsInfo(prev => {
      const newPuntos = [...prev[activeLevel].puntos];
      newPuntos[index] = value;
      const updated = {
        ...prev,
        [activeLevel]: {
          ...prev[activeLevel],
          puntos: newPuntos
        }
      };
      saveToFirebase('levelsInfo', updated);
      return updated;
    });
  };

  const handleUpdatePlan = (index: number, field: 'title' | 'text', value: string) => {
    const newPlanes = [...planesEstudio];
    newPlanes[index] = { ...newPlanes[index], [field]: value };
    setPlanesEstudio(newPlanes);
    saveToFirebase('planesEstudio', newPlanes);
  };

  const handleUpdatePie = (field: 'title' | 'desc', value: string) => {
    setPieInfo(prev => {
      const updated = { ...prev, [field]: value };
      saveToFirebase('pieInfo', updated);
      return updated;
    });
  };

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="academic-view">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Metodología</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Área Académica
        </h2>
        <div className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto">
          <InlineEdit 
            value={headerDesc}
            onSave={handleUpdateHeaderDesc}
            isEditMode={isAdminMode}
            multiline={true}
            className="text-sm text-gray-500 text-center"
          />
        </div>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* 1. NIVELES EDUCATIVOS */}
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8" id="levels-section">
        <div className="flex flex-col sm:flex-row justify-center gap-2 border-b border-gray-100 pb-4">
          <button
            onClick={() => setActiveLevel('parvulo')}
            className={`px-6 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeLevel === 'parvulo'
                ? 'bg-[#05087E] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            id="btn-level-parvulo"
          >
            <Compass className="w-4 h-4" />
            <span>Parvulario (Pre-Kinder y Kinder)</span>
          </button>
          <button
            onClick={() => setActiveLevel('basica')}
            className={`px-6 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeLevel === 'basica'
                ? 'bg-[#05087E] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            id="btn-level-basica"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Enseñanza Básica (1° a 8°)</span>
          </button>
        </div>

        {/* Level Details Render */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" id="level-details-display">
          <div className="space-y-5">
            <div className="text-xl font-display font-bold text-[#05087E]">
              <InlineEdit 
                value={currentLevel.titulo}
                onSave={(val) => handleUpdateLevelField('titulo', val)}
                isEditMode={isAdminMode}
                className="inline-block"
              />
            </div>
            <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
              <InlineEdit 
                value={currentLevel.desc}
                onSave={(val) => handleUpdateLevelField('desc', val)}
                isEditMode={isAdminMode}
                multiline={true}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="font-bold text-[#05087E] shrink-0">Rango Edades:</span>
                <span className="text-gray-600">
                  <InlineEdit 
                    value={currentLevel.edades}
                    onSave={(val) => handleUpdateLevelField('edades', val)}
                    isEditMode={isAdminMode}
                  />
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#05087E] shrink-0">Tipo de Jornada:</span>
                <span className="text-gray-600 flex-1">
                  <InlineEdit 
                    value={currentLevel.jornada}
                    onSave={(val) => handleUpdateLevelField('jornada', val)}
                    isEditMode={isAdminMode}
                  />
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-[#05087E] shrink-0">Foco Educativo:</span>
                <span className="text-gray-600 flex-1">
                  <InlineEdit 
                    value={currentLevel.foco}
                    onSave={(val) => handleUpdateLevelField('foco', val)}
                    isEditMode={isAdminMode}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-100 space-y-3">
            <h4 className="text-xs font-display font-bold text-gray-700 uppercase tracking-widest">
              Características Clave
            </h4>
            <ul className="space-y-3 text-xs">
              {currentLevel.puntos.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#FF030D] shrink-0 mt-0.5" />
                  <span className="flex-1">
                    <InlineEdit 
                      value={point}
                      onSave={(val) => handleUpdateLevelPoint(index, val)}
                      isEditMode={isAdminMode}
                      multiline={true}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. PLANES DE ESTUDIO / CURRICULUM */}
      <section className="space-y-6" id="curriculum-section">
        <h3 className="text-xl font-display font-bold text-[#05087E] text-center">
          Planes y Currículum Complementario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planesEstudio.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#FF030D]">
                  <BookOpen className="w-5 h-5 text-[#FF030D]" />
                </div>
                <div className="text-sm font-display font-bold text-[#05087E]">
                  <InlineEdit 
                    value={item.title}
                    onSave={(val) => handleUpdatePlan(index, 'title', val)}
                    isEditMode={isAdminMode}
                  />
                </div>
                <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
                  <InlineEdit 
                    value={item.text}
                    onSave={(val) => handleUpdatePlan(index, 'text', val)}
                    isEditMode={isAdminMode}
                    multiline={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EVALUACIONES Y RESULTADOS SIMCE */}
      <section className="bg-[#05087E] text-white p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center" id="simce-section">
        <div className="lg:col-span-1 space-y-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <BarChart4 className="w-5 h-5 text-[#FF030D]" />
          </div>
          <h3 className="text-lg font-display font-bold">Resultados y Evaluación</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Medimos anualmente nuestro avance pedagógico mediante el sistema de evaluación nacional SIMCE e indicadores personales del Ministerio de Educación de Chile, ratificando nuestra mejora continua.
          </p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {evaluaciones.map((item) => (
            <div key={item.id} className="bg-white/10 border border-white/10 p-5 rounded-2xl flex flex-col justify-center">
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wide leading-tight block mb-2">{item.label}</span>
              <div className="text-2xl font-display font-extrabold text-white block mb-1">
                <InlineEdit 
                  value={item.score}
                  onSave={(newScore) => onUpdateEvaluacion(item.id, newScore, item.trend)}
                  isEditMode={isAdminMode}
                  className="text-white font-extrabold text-2xl"
                />
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold mt-1">
                <InlineEdit 
                  value={item.trend}
                  onSave={(newTrend) => onUpdateEvaluacion(item.id, item.score, newTrend)}
                  isEditMode={isAdminMode}
                  className="text-emerald-300 font-semibold"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DEPARTAMENTO DE APOYO (PIE) */}
      <section className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center" id="pie-support-section">
        <div className="w-14 h-14 bg-white text-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
          <Heart className="w-7 h-7 text-emerald-600" />
        </div>
        <div className="space-y-2 flex-1">
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase w-fit inline-block">
            Programa de Integración Escolar (PIE)
          </span>
          <div className="text-lg font-display font-bold text-emerald-950 block">
            <InlineEdit 
              value={pieInfo.title}
              onSave={(val) => handleUpdatePie('title', val)}
              isEditMode={isAdminMode}
            />
          </div>
          <div className="text-xs text-emerald-800 leading-relaxed font-sans text-justify">
            <InlineEdit 
              value={pieInfo.desc}
              onSave={(val) => handleUpdatePie('desc', val)}
              isEditMode={isAdminMode}
              multiline={true}
            />
          </div>
        </div>
      </section>

    </div>
  );
}