/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  History, Eye, Target, Award, Download, Users, Mail, 
  CheckCircle, Briefcase, ChevronRight, FileText, DownloadCloud 
} from 'lucide-react';
import { InformacionInstitucional, Persona } from '../types';
import InlineEdit from './InlineEdit';

interface NosotrosProps {
  info: InformacionInstitucional;
  personas: Persona[];
  isAdminMode: boolean;
  onUpdateInfo: (key: keyof InformacionInstitucional, value: any) => void;
  onUpdatePersona: (id: string, updatedFields: Partial<Persona>) => void;
}

export default function Nosotros({ 
  info, 
  personas,
  isAdminMode,
  onUpdateInfo,
  onUpdatePersona
}: NosotrosProps) {
  const [selectedDept, setSelectedDept] = useState<'Todos' | 'Dirección' | 'Inspectoría' | 'Docentes' | 'Apoyo'>('Todos');
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const filteredPersonas = selectedDept === 'Todos' 
    ? personas 
    : personas.filter(p => p.departamento === selectedDept);

  const handleDownloadPEI = () => {
    setDownloadStatus('generando');
    setTimeout(() => {
      setDownloadStatus('descargando');
      setTimeout(() => {
        setDownloadStatus('exito');
        setTimeout(() => setDownloadStatus(null), 3000);
      }, 1200);
    }, 800);
  };

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="nosotros-view">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Identidad</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Nuestra Institución
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto">
          Conoce la historia, propósitos educativos y equipo humano detrás de la Escuela Bernardo O'Higgins.
        </p>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* 1. HISTORIA & TIMELINE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="history-section">
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-[#05087E]">
            <History className="w-5 h-5 text-[#FF030D]" />
            <h3 className="text-xl font-display font-bold">Nuestra Historia</h3>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed font-sans text-justify">
            <InlineEdit 
              value={info.historia}
              onSave={(val) => onUpdateInfo('historia', val)}
              isEditMode={isAdminMode}
              multiline={true}
              className="text-sm text-gray-700 leading-relaxed"
            />
          </div>
          <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-gray-100 flex items-start gap-3">
            <Award className="w-8 h-8 text-[#FF030D] shrink-0" />
            <div>
              <h4 className="text-xs font-display font-bold text-[#05087E] mb-1">Patrimonio de Copiapó</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Nuestra escuela no es solo un aula; es un espacio histórico donde se han formado líderes comunales, profesionales comprometidos y familias enteras que guardan su amor por el pabellón nacional.
              </p>
            </div>
          </div>
        </div>

        {/* Vertical/Horizontal Styled Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-display font-bold text-gray-500 uppercase tracking-widest mb-2">Hitos Clave</h4>
          <div className="relative border-l-2 border-blue-100 ml-4 pl-6 space-y-6">
            {info.historiaHitos.map((hito, idx) => (
              <div key={idx} className="relative" id={`timeline-item-${hito.ano}`}>
                {/* Dot indicator */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#FF030D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#05087E]" />
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-display font-extrabold text-sm text-[#FF030D]">
                    Año {hito.ano}
                  </span>
                  <div className="text-xs text-gray-700 font-sans mt-1 leading-relaxed">
                    <InlineEdit 
                      value={hito.evento}
                      onSave={(val) => {
                        const newHitos = [...info.historiaHitos];
                        newHitos[idx] = { ...newHitos[idx], evento: val };
                        onUpdateInfo('historiaHitos', newHitos);
                      }}
                      isEditMode={isAdminMode}
                      multiline={true}
                      className="text-xs text-gray-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MISIÓN, VISIÓN Y VALORES */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="mission-vision-section">
        {/* Misión Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-[#05087E] rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-[#05087E]" />
          </div>
          <h3 className="text-lg font-display font-bold text-[#05087E]">Misión</h3>
          <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
            <InlineEdit 
              value={info.mision}
              onSave={(val) => onUpdateInfo('mision', val)}
              isEditMode={isAdminMode}
              multiline={true}
              className="text-xs text-gray-600"
            />
          </div>
        </div>

        {/* Visión Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-red-50 text-[#FF030D] rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6 text-[#FF030D]" />
          </div>
          <h3 className="text-lg font-display font-bold text-[#05087E]">Visión</h3>
          <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
            <InlineEdit 
              value={info.vision}
              onSave={(val) => onUpdateInfo('vision', val)}
              isEditMode={isAdminMode}
              multiline={true}
              className="text-xs text-gray-600"
            />
          </div>
        </div>

        {/* Valores Card */}
        <div className="bg-[#05087E] text-white p-8 rounded-2xl flex flex-col gap-4 shadow-md md:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-[#FF030D]" />
          </div>
          <h3 className="text-lg font-display font-bold">Valores Institucionales</h3>
          <ul className="space-y-2 text-xs">
            {info.valores.map((val, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-200">
                <CheckCircle className="w-4 h-4 text-[#FF030D] shrink-0" />
                <InlineEdit 
                  value={val}
                  onSave={(newVal) => {
                    const newValores = [...info.valores];
                    newValores[i] = newVal;
                    onUpdateInfo('valores', newValores);
                  }}
                  isEditMode={isAdminMode}
                  className="text-xs text-gray-200"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. PROYECTO EDUCATIVO INSTITUCIONAL (PEI) */}
      <section className="bg-gradient-to-r from-blue-50 to-red-50 p-8 rounded-3xl border border-blue-100 flex flex-col lg:flex-row justify-between items-center gap-6" id="pei-section">
        <div className="space-y-3 max-w-[700px]">
          <div className="inline-flex items-center gap-1.5 bg-white text-[#05087E] px-3 py-1 rounded-full text-xs font-bold border border-blue-100 shadow-sm">
            <FileText className="w-3.5 h-3.5 text-[#FF030D]" />
            <span>Documento de Gestión Educativa</span>
          </div>
          <h3 className="text-xl font-display font-bold text-[#05087E]">
            Proyecto Educativo Institucional (PEI)
          </h3>
          <div className="text-xs text-gray-600 leading-relaxed font-sans">
            <InlineEdit 
              value={info.peiResumen}
              onSave={(val) => onUpdateInfo('peiResumen', val)}
              isEditMode={isAdminMode}
              multiline={true}
              className="text-xs text-gray-600 inline"
            />
            <span className="text-xs text-gray-600 font-sans"> El documento completo detalla nuestro enfoque curricular cognitivo-constructivista, lineamientos de convivencia escolar y el funcionamiento del Programa de Integración Escolar (PIE) en Copiapó.</span>
          </div>
        </div>

        <div className="shrink-0">
          <a
            href="assets/PEI.pdf"
            download="PEI_Escuela_Bernardo_OHiggins.pdf"
            onClick={handleDownloadPEI}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold shadow-md transition-all cursor-pointer ${
              downloadStatus === 'exito'
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-[#FF030D] text-white hover:bg-[#d8020a] hover:shadow-lg hover:-translate-y-0.5'
            }`}
            id="pei-download-button"
          >
            {downloadStatus === 'generando' && (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generando PDF...</span>
              </>
            )}
            {downloadStatus === 'descargando' && (
              <>
                <DownloadCloud className="w-4 h-4 animate-bounce" />
                <span>Descargando...</span>
              </>
            )}
            {downloadStatus === 'exito' && (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>¡Descargado con Éxito!</span>
              </>
            )}
            {downloadStatus === null && (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar PEI Oficial (PDF)</span>
              </>
            )}
          </a>
        </div>
      </section>

      {/* 4. EQUIPO DIRECTIVO Y DOCENTE */}
      <section className="space-y-6" id="team-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Nuestro Equipo</span>
            <h3 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
              Organigrama y Funcionarios
            </h3>
          </div>

          {/* Dept Filters */}
          <div className="flex flex-wrap gap-1.5">
            {(['Todos', 'Dirección', 'Inspectoría', 'Docentes', 'Apoyo'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-[#05087E] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                id={`filter-dept-${dept}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="staff-grid">
          {filteredPersonas.map((persona) => (
            <div
              key={persona.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              id={`staff-card-${persona.id}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={persona.foto}
                    alt={persona.nombre}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <InlineEdit 
                      value={persona.nombre}
                      onSave={(val) => onUpdatePersona(persona.id, { nombre: val })}
                      isEditMode={isAdminMode}
                      className="text-sm font-display font-bold text-[#05087E] leading-tight block"
                    />
                    <div className="mt-1">
                      <InlineEdit 
                        value={persona.cargo}
                        onSave={(val) => onUpdatePersona(persona.id, { cargo: val })}
                        isEditMode={isAdminMode}
                        className="bg-red-50 text-[#FF030D] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
                      />
                    </div>
                  </div>
                </div>

                {persona.bio && (
                  <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify italic">
                    <InlineEdit 
                      value={persona.bio}
                      onSave={(val) => onUpdatePersona(persona.id, { bio: val })}
                      isEditMode={isAdminMode}
                      multiline={true}
                      className="text-xs text-gray-600 font-sans italic"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-[#05087E]" />
                  {persona.departamento}
                </span>
                <a
                  href={`mailto:${persona.email}`}
                  className="text-[#05087E] hover:text-[#FF030D] flex items-center gap-1 font-semibold hover:underline cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contactar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
