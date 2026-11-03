/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Scale, AlertTriangle, Sparkles, PhoneCall, Mail, 
  ChevronRight, ShieldAlert, HeartHandshake, Eye, BookOpen 
} from 'lucide-react';
import { InformacionInstitucional } from '../types';

interface ConvivenciaEscolarProps {
  info: InformacionInstitucional;
}

export default function ConvivenciaEscolar({ info }: ConvivenciaEscolarProps) {
  const [activeProtocol, setActiveProtocol] = useState<'bullying' | 'sismo'>('bullying');

  const actividadesFomento = [
    { title: 'Mes de la Solidaridad', desc: 'Campañas de ayuda comunitaria coordinadas por el Centro de Alumnos para cooperar con hogares de ancianos en Copiapó.' },
    { title: 'Elección de Mediadores Escolares', desc: 'Capacitamos a estudiantes de 5° a 8° básico en técnicas de resolución pacífica de conflictos de patio.' },
    { title: 'Escuela para Padres', desc: 'Talleres mensuales con psicólogos para orientar sobre la crianza respetuosa, límites positivos y prevención del ciberacoso.' }
  ];

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="convivencia-view">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Comunidad Sana</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Convivencia Escolar y Seguridad
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto">
          Promovemos un ambiente seguro, inclusivo y pacífico enfocado en el desarrollo socioafectivo y el resguardo físico de todos nuestros estudiantes.
        </p>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* 1. PRESENTACIÓN DEL EQUIPO Y CONTACTO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="convivencia-team-section">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 text-[#05087E]">
            <HeartHandshake className="w-6 h-6 text-[#FF030D]" />
            <h3 className="text-xl font-display font-bold">Nuestro Enfoque de Convivencia</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed font-sans text-justify">
            La convivencia escolar en la Escuela Bernardo O'Higgins es entendida como un proceso formativo continuo. Nos enfocamos en el aprendizaje de relaciones de respeto mutuo, diálogo pacífico y equidad. Contamos con una dupla psicosocial permanente enfocada en atender, contener y mediar situaciones de vulnerabilidad o conflicto escolar en todos los ciclos.
          </p>

          <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-gray-100 space-y-3">
            <h4 className="text-xs font-display font-bold text-gray-700 uppercase tracking-widest">
              ¿Cómo contactar al Equipo?
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#FF030D]" />
                <span>Anexo de Convivencia: +56 52 221 0844 (Anexo 4)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#05087E]" />
                <span>Email: convivencia@escuelabernardoohiggins.cl</span>
              </div>
              <p className="text-[10px] text-gray-500 italic mt-2">
                Horario de atención a apoderados: Lunes a Jueves de 16:00 a 17:15 hrs, previa citación por libreta de comunicaciones.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Callout */}
        <div className="bg-[#05087E] text-white p-8 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF030D] rounded-full filter blur-3xl opacity-20 -mr-12 -mt-12" />
          <div className="space-y-4 relative z-10">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              RICE Oficial
            </span>
            <h4 className="text-lg font-display font-bold leading-snug">
              Reglamento Interno de Convivencia Escolar
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed font-sans">
              {info.reglamentoExtracto} Nuestro RICE regula el diario vivir y establece medidas de acompañamiento restaurativo antes de sanciones definitivas, asegurando una comunidad democrática y participativa.
            </p>
            <a 
              href="assets/RICE.pdf"
              download="RICE_Escuela_Bernardo_OHiggins.pdf"
              onClick={(e) => {
                // Premium simulated feedback in parallel with native download
                const target = e.currentTarget;
                const origText = target.innerHTML;
                target.style.pointerEvents = 'none';
                target.innerHTML = `
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                  <span>Preparando RICE...</span>
                `;
                setTimeout(() => {
                  target.innerHTML = `
                    <svg class="w-4 h-4 animate-bounce shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg>
                    <span>Descargando...</span>
                  `;
                  setTimeout(() => {
                    target.innerHTML = `
                      <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      <span>¡Descargado con éxito!</span>
                    `;
                    setTimeout(() => {
                      target.innerHTML = origText;
                      target.style.pointerEvents = 'auto';
                    }, 3000);
                  }, 1200);
                }, 800);
              }}
              className="bg-[#FF030D] hover:bg-[#d8020a] text-white text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1.5 transition-all hover:shadow-lg hover:-translate-y-0.5 w-fit cursor-pointer transform"
              id="rice-download-link"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Ver Extracto RICE (PDF)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. PROTOCOLOS DE ACTUACIÓN (Bullying, Emergencias, Sismos) */}
      <section className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm" id="protocols-section">
        <div className="text-center space-y-2">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Protocolos de Seguridad</span>
          <h3 className="text-xl font-display font-bold text-[#05087E]">
            Protocolos de Actuación Obligatorios
          </h3>
          <p className="text-xs text-gray-500 max-w-[500px] mx-auto">
            Haga clic en los botones para revisar los instructivos de emergencia oficiales exigidos por la Superintendencia de Educación de Chile.
          </p>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setActiveProtocol('bullying')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeProtocol === 'bullying'
                ? 'bg-[#FF030D] text-white shadow-md shadow-red-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            id="protocol-bullying-tab"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Caso de Acoso Escolar (Bullying)</span>
          </button>
          <button
            onClick={() => setActiveProtocol('sismo')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeProtocol === 'sismo'
                ? 'bg-[#FF030D] text-white shadow-md shadow-red-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            id="protocol-sismo-tab"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Plan de Seguridad y Sismos (PISE)</span>
          </button>
        </div>

        {/* Protocol Display Area */}
        <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-100 max-w-[800px] mx-auto" id="protocol-display">
          {activeProtocol === 'bullying' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#05087E] font-display font-bold text-sm">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full shrink-0" />
                <span>Protocolo Frente al Maltrato o Acoso</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-sans text-justify">
                {info.bullyingProtocolo}
              </p>
              <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-[11px] text-red-800 leading-normal flex gap-2">
                <span className="font-extrabold text-red-600">Alerta:</span>
                <span>Cualquier integrante de la comunidad (estudiante, apoderado, docente) puede estampar su denuncia formal por maltrato directamente con la dupla psicosocial, mediante carta en secretaría o formulario de contacto web.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#05087E] font-display font-bold text-sm">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full shrink-0" />
                <span>Plan Integral de Seguridad Escolar (PISE / Plan Cooper)</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-sans text-justify">
                {info.sismosProtocolo}
              </p>
              <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl text-[11px] text-[#05087E] leading-normal flex gap-2">
                <span className="font-extrabold text-[#05087E]">Evacuación:</span>
                <span>Las vías de evacuación conducen al patio techado central y la multicancha trasera, designados como zonas libres de riesgos. Todos los salones evacuan de forma ordenada bajo la guía de sus profesores de aula.</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. ACTIVIDADES DE FOMENTO A LOS VALORES */}
      <section className="space-y-6" id="fomento-activities-section">
        <h3 className="text-xl font-display font-bold text-[#05087E] text-center">
          Actividades de Fomento y Ciudadanía
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actividadesFomento.map((act, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#05087E]">
                  <Sparkles className="w-5 h-5 text-[#05087E]" />
                </div>
                <h4 className="text-sm font-display font-bold text-[#05087E]">{act.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans text-justify">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
