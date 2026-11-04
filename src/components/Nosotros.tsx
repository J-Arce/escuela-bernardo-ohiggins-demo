/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // <-- IMPORTACIONES DE STORAGE
import { db, storage } from '../firebase'; // <-- IMPORTAMOS STORAGE DE TU ARCHIVO
import { 
  History, Eye, Target, Award, Download, Users, Mail, 
  CheckCircle, Briefcase, ChevronRight, FileText, DownloadCloud,
  Plus, Trash2, Edit2, UploadCloud, Image as ImageIcon, Cloud
} from 'lucide-react';
import { InformacionInstitucional, Persona } from '../types';
import InlineEdit from './InlineEdit';

interface NosotrosProps {
  info: InformacionInstitucional;
  personas: Persona[];
  isAdminMode: boolean;
}

export default function Nosotros({ info: propsInfo, personas: propsPersonas, isAdminMode }: NosotrosProps) {
  // Estados Locales
  const [selectedDept, setSelectedDept] = useState<'Todos' | 'Dirección' | 'Inspectoría' | 'Docentes' | 'Apoyo'>('Todos');
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [isNewPersonaOpen, setIsNewPersonaOpen] = useState(false);
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({
    nombre: '', cargo: '', departamento: 'Docentes', email: 'contacto@escuela.cl', 
    foto: '', bio: ''
  });

  // Estados de Firebase
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // <-- NUEVO ESTADO PARA SUBIDAS
  const [info, setInfo] = useState<InformacionInstitucional>(propsInfo);
  const [personas, setPersonas] = useState<Persona[]>(propsPersonas);

  // 1. CARGAR DATOS DESDE FIREBASE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "paginas", "nosotros");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.info) {
          setInfo({ 
            ...propsInfo, 
            ...data.info,
            historiaHitos: data.info.historiaHitos || propsInfo?.historiaHitos || [] 
          });
        }
          if (data.equipo) setPersonas(data.equipo);
        }
      } catch (error) {
        console.error("Error cargando Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. GUARDAR DATOS EN FIREBASE (Info General)
  const handleUpdateInfo = async (key: keyof InformacionInstitucional, value: any) => {
    const newInfo = { ...info, [key]: value };
    setInfo(newInfo);
    setIsSaving(true);
    try {
      await setDoc(doc(db, "paginas", "nosotros"), { info: newInfo }, { merge: true });
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  // 3. GUARDAR DATOS EN FIREBASE (Equipo)
  const saveEquipoToFirebase = async (nuevoEquipo: Persona[]) => {
    setPersonas(nuevoEquipo);
    setIsSaving(true);
    try {
      await setDoc(doc(db, "paginas", "nosotros"), { equipo: nuevoEquipo }, { merge: true });
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  const handleUpdatePersona = (id: string, updatedFields: Partial<Persona>) => {
    const nuevoEquipo = personas.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    saveEquipoToFirebase(nuevoEquipo);
  };

  const handleDeletePersona = (id: string) => {
    const nuevoEquipo = personas.filter(p => p.id !== id);
    saveEquipoToFirebase(nuevoEquipo);
  };

  const handleAddPersonaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersona.nombre && newPersona.cargo) {
      const fotoFinal = newPersona.foto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150&h=150';
      const personaAgregada: Persona = {
        ...newPersona,
        foto: fotoFinal,
        id: `persona-${Date.now()}`
      } as Persona;
      
      saveEquipoToFirebase([...personas, personaAgregada]);
      setIsNewPersonaOpen(false);
      setNewPersona({ nombre: '', cargo: '', departamento: 'Docentes', email: 'contacto@escuela.cl', foto: '', bio: '' });
    } else {
      alert("Por favor ingrese al menos el nombre y cargo.");
    }
  };

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

  // --- NUEVA FUNCIÓN: SUBIR PEI A FIREBASE STORAGE ---
  const handleUploadPEI = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const storageRef = ref(storage, `documentos/PEI_${Date.now()}.pdf`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await handleUpdateInfo('archivoPei' as any, url);
        alert("Archivo PDF subido exitosamente a la nube. Ahora es permanente.");
      } catch (error) {
        console.error("Error al subir el archivo PEI:", error);
        alert("Hubo un error al subir el documento.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const filteredPersonas = selectedDept === 'Todos' 
    ? personas 
    : personas.filter(p => p.departamento === selectedDept);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-[#05087E] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-[#05087E]">Conectando a la Base de Datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="nosotros-view">
      
      {/* HUD Guardado */}
      {isAdminMode && (
        <div className={`fixed bottom-4 right-4 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold shadow-lg z-50 transition-colors ${isSaving || isUploading ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
          {isUploading ? <><UploadCloud className="w-4 h-4 animate-bounce" /> Subiendo archivo a la nube...</> :
           isSaving ? <><Cloud className="w-4 h-4 animate-pulse" /> Guardando en la nube...</> : 
           <><CheckCircle className="w-4 h-4" /> Base de Datos Conectada</>}
        </div>
      )}

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
            <InlineEdit value={info.historia} onSave={(val) => handleUpdateInfo('historia', val)} isEditMode={isAdminMode} multiline={true} className="text-sm text-gray-700 leading-relaxed" />
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

        {/* Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-display font-bold text-gray-500 uppercase tracking-widest mb-2">Hitos Clave</h4>
          <div className="relative border-l-2 border-blue-100 ml-4 pl-6 space-y-6">
            {info?.historiaHitos?.map((hito, idx) => (
              <div key={idx} className="relative group" id={`timeline-item-${hito.ano}`}>
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#FF030D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#05087E]" />
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-display font-extrabold text-sm text-[#FF030D]">
                    <InlineEdit 
                      value={`Año ${hito.ano}`}
                      onSave={(val) => {
                        const newAno = val.replace('Año ', '').trim();
                        const newHitos = [...info.historiaHitos];
                        newHitos[idx] = { ...newHitos[idx], ano: newAno };
                        handleUpdateInfo('historiaHitos', newHitos);
                      }}
                      isEditMode={isAdminMode} className="inline"
                    />
                  </span>
                  <div className="text-xs text-gray-700 font-sans mt-1 leading-relaxed">
                    <InlineEdit 
                      value={hito.evento}
                      onSave={(val) => {
                        const newHitos = [...info.historiaHitos];
                        newHitos[idx] = { ...newHitos[idx], evento: val };
                        handleUpdateInfo('historiaHitos', newHitos);
                      }}
                      isEditMode={isAdminMode} multiline={true} className="text-xs text-gray-700"
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
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-[#05087E] rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-[#05087E]" />
          </div>
          <h3 className="text-lg font-display font-bold text-[#05087E]">Misión</h3>
          <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
            <InlineEdit value={info.mision} onSave={(val) => handleUpdateInfo('mision', val)} isEditMode={isAdminMode} multiline={true} className="text-xs text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-red-50 text-[#FF030D] rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6 text-[#FF030D]" />
          </div>
          <h3 className="text-lg font-display font-bold text-[#05087E]">Visión</h3>
          <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
            <InlineEdit value={info.vision} onSave={(val) => handleUpdateInfo('vision', val)} isEditMode={isAdminMode} multiline={true} className="text-xs text-gray-600" />
          </div>
        </div>

        <div className="bg-[#05087E] text-white p-8 rounded-2xl flex flex-col gap-4 shadow-md md:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-[#FF030D]" />
          </div>
          <h3 className="text-lg font-display font-bold">Valores Institucionales</h3>
          <ul className="space-y-2 text-xs">
            {info?.valores?.map((val, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-200">
                <CheckCircle className="w-4 h-4 text-[#FF030D] shrink-0" />
                <InlineEdit 
                  value={val}
                  onSave={(newVal) => {
                    const newValores = [...info.valores];
                    newValores[i] = newVal;
                    handleUpdateInfo('valores', newValores);
                  }}
                  isEditMode={isAdminMode} className="text-xs text-gray-200"
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
            <InlineEdit value={info.peiResumen} onSave={(val) => handleUpdateInfo('peiResumen', val)} isEditMode={isAdminMode} multiline={true} className="text-xs text-gray-600 inline" />
            <span className="text-xs text-gray-600 font-sans"> El documento completo detalla nuestro enfoque curricular cognitivo-constructivista, lineamientos de convivencia escolar y el funcionamiento del Programa de Integración Escolar (PIE) en Copiapó.</span>
          </div>
        </div>

        <div className="shrink-0 space-y-3 flex flex-col items-end">
          <a
            href={(info as any).archivoPei || "assets/PEI.pdf"}
            download="PEI_Escuela_Bernardo_OHiggins.pdf"
            target="_blank"
            onClick={handleDownloadPEI}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold shadow-md transition-all cursor-pointer ${
              downloadStatus === 'exito' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-[#FF030D] text-white hover:bg-[#d8020a] hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {downloadStatus === 'generando' && <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Generando PDF...</span></>}
            {downloadStatus === 'descargando' && <><DownloadCloud className="w-4 h-4 animate-bounce" /><span>Descargando...</span></>}
            {downloadStatus === 'exito' && <><CheckCircle className="w-4 h-4" /><span>¡Descargado con Éxito!</span></>}
            {downloadStatus === null && <><Download className="w-4 h-4" /><span>Descargar PEI Oficial (PDF)</span></>}
          </a>

          {isAdminMode && (
            <div className={`bg-white p-3 rounded-xl border border-dashed text-center relative w-full overflow-hidden hover:bg-blue-50 transition-colors cursor-pointer ${isUploading ? 'border-amber-400' : 'border-[#05087E]/30'}`}>
              <input type="file" accept=".pdf" onChange={handleUploadPEI} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
              <div className="flex items-center justify-center gap-2 text-[#05087E]">
                {isUploading ? <UploadCloud className="w-4 h-4 animate-bounce text-amber-500" /> : <UploadCloud className="w-4 h-4" />}
                <span className="text-[10px] font-bold">{isUploading ? 'Subiendo archivo...' : 'Subir Nuevo PEI (PDF desde PC)'}</span>
              </div>
            </div>
          )}
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

          <div className="flex flex-wrap items-center gap-1.5">
            {(['Todos', 'Dirección', 'Inspectoría', 'Docentes', 'Apoyo'] as const).map((dept) => (
              <button
                key={dept} onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedDept === dept ? 'bg-[#05087E] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="staff-grid">
          {isAdminMode && (
            <button 
              onClick={() => setIsNewPersonaOpen(true)}
              className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-2 p-8 hover:bg-emerald-100 transition-colors cursor-pointer min-h-[220px]"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm"><Plus className="w-6 h-6" /></div>
              <span className="text-emerald-700 font-bold text-xs">Añadir Funcionario</span>
            </button>
          )}

          {filteredPersonas.map((persona) => (
            <div key={persona.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow relative group h-full">
              {isAdminMode && (
                <button 
                  onClick={() => {
                    if (window.confirm(`¿Está seguro de eliminar a ${persona.nombre}?`)) handleDeletePersona(persona.id);
                  }}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10" title="Eliminar Funcionario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={persona.foto} alt={persona.nombre} className="w-14 h-14 rounded-full object-cover border-2 border-blue-50 shrink-0" />
                    {isAdminMode && (
                      <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow border border-gray-100 text-[#05087E] hover:text-[#FF030D] cursor-pointer" title="Subir Nueva Foto">
                        <Edit2 className="w-2.5 h-2.5" />
                        <input 
                          type="file" accept="image/*" className="hidden" disabled={isUploading}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              setIsUploading(true);
                              try {
                                const storageRef = ref(storage, `funcionarios/${persona.id}_${Date.now()}`);
                                await uploadBytes(storageRef, file);
                                const url = await getDownloadURL(storageRef);
                                handleUpdatePersona(persona.id, { foto: url });
                              } catch (error) {
                                console.error("Error al subir la foto:", error);
                                alert("Hubo un error al subir la foto.");
                              } finally {
                                setIsUploading(false);
                              }
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <InlineEdit value={persona.nombre} onSave={(val) => handleUpdatePersona(persona.id, { nombre: val })} isEditMode={isAdminMode} className="text-sm font-display font-bold text-[#05087E] leading-tight block" />
                    <div className="mt-1">
                      <InlineEdit value={persona.cargo} onSave={(val) => handleUpdatePersona(persona.id, { cargo: val })} isEditMode={isAdminMode} className="bg-red-50 text-[#FF030D] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block" />
                    </div>
                  </div>
                </div>

                {persona.bio && (
                  <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify italic">
                    <InlineEdit value={persona.bio} onSave={(val) => handleUpdatePersona(persona.id, { bio: val })} isEditMode={isAdminMode} multiline={true} className="text-xs text-gray-600 font-sans italic" />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-[#05087E]" />
                  {isAdminMode ? (
                    <select 
                      value={persona.departamento}
                      onChange={(e) => handleUpdatePersona(persona.id, { departamento: e.target.value as any })}
                      className="bg-transparent border-b border-dashed border-gray-400 focus:outline-none focus:border-[#05087E] text-[11px] font-bold text-gray-700 cursor-pointer w-full max-w-[120px]"
                    >
                      <option value="Dirección">Dirección</option>
                      <option value="Inspectoría">Inspectoría</option>
                      <option value="Docentes">Docentes</option>
                      <option value="Apoyo">Apoyo</option>
                    </select>
                  ) : (
                    <span className="font-medium text-gray-700">{persona.departamento}</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL EMERGENTE: NUEVO FUNCIONARIO */}
      {isNewPersonaOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[500px] w-full border border-gray-100 shadow-2xl relative space-y-4">
            <button onClick={() => setIsNewPersonaOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer">✕</button>
            <h3 className="text-xl font-display font-bold text-[#05087E] border-b border-gray-100 pb-3">Agregar Funcionario</h3>
            
            <form onSubmit={handleAddPersonaSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Nombre Completo*</label>
                <input required type="text" value={newPersona.nombre} onChange={e => setNewPersona({...newPersona, nombre: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#05087E]"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Cargo*</label>
                  <input required type="text" value={newPersona.cargo} onChange={e => setNewPersona({...newPersona, cargo: e.target.value})} placeholder="Ej: Docente Matemáticas" className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#05087E]"/>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Departamento</label>
                  <select value={newPersona.departamento} onChange={e => setNewPersona({...newPersona, departamento: e.target.value as any})} className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#05087E] cursor-pointer">
                    <option>Dirección</option><option>Inspectoría</option><option>Docentes</option><option>Apoyo</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Breve Descripción (Biografía)</label>
                <textarea rows={3} value={newPersona.bio} onChange={e => setNewPersona({...newPersona, bio: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#05087E]"/>
              </div>
              
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Fotografía desde el PC (Opcional)</label>
                <div className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${isUploading ? 'border-amber-300 bg-amber-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <input type="file" accept="image/*" disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onChange={async e => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        setIsUploading(true);
                        try {
                          const storageRef = ref(storage, `funcionarios/nuevo_${Date.now()}`);
                          await uploadBytes(storageRef, file);
                          const url = await getDownloadURL(storageRef);
                          setNewPersona({...newPersona, foto: url});
                        } catch (error) {
                          console.error("Error subiendo foto:", error);
                          alert("Error al subir la imagen.");
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                  />
                  <div className="flex flex-col items-center justify-center gap-1 text-gray-500">
                    {isUploading ? <UploadCloud className="w-5 h-5 animate-bounce text-amber-500" /> : <UploadCloud className="w-5 h-5" />}
                    <span className="text-[10px]">{isUploading ? 'Subiendo imagen...' : 'Haga clic para subir imagen'}</span>
                    {newPersona.foto && !isUploading && <span className="text-emerald-600 font-bold mt-1">¡Imagen subida con éxito!</span>}
                  </div>
                </div>
              </div>
              <button type="submit" disabled={isUploading} className="w-full bg-[#05087E] text-white py-3 rounded-full font-bold shadow-md hover:bg-blue-900 transition-colors cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Guardar Funcionario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}