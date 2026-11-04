/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // <-- IMPORTACIONES DE STORAGE
import { db, storage } from '../firebase'; // <-- IMPORTAMOS STORAGE
import { 
  Users, Scale, AlertTriangle, Sparkles, PhoneCall, Mail, 
  ChevronRight, ShieldAlert, HeartHandshake, Eye, BookOpen,
  UploadCloud, Plus, Trash2, FileText, CheckCircle, Cloud
} from 'lucide-react';
import { InformacionInstitucional } from '../types';
import InlineEdit from './InlineEdit';

interface ConvivenciaEscolarProps {
  info: InformacionInstitucional;
  isAdminMode: boolean; 
}

export default function ConvivenciaEscolar({ info, isAdminMode }: ConvivenciaEscolarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // <-- ESTADO PARA SUBIDAS

  const [headerDesc, setHeaderDesc] = useState('Promovemos un ambiente seguro, inclusivo y pacífico enfocado en el desarrollo socioafectivo y el resguardo físico de todos nuestros estudiantes.');
  const [introText, setIntroText] = useState("La convivencia escolar en la Escuela Bernardo O'Higgins es entendida como un proceso formativo continuo. Nos enfocamos en el aprendizaje de relaciones de respeto mutuo, diálogo pacífico y equidad.");
  const [contactPhone, setContactPhone] = useState('+56 52 221 0844 (Anexo 4)');
  const [contactEmail, setContactEmail] = useState('convivencia@escuelabernardoohiggins.cl');
  const [contactHours, setContactHours] = useState('Horario de atención a apoderados: Lunes a Jueves de 16:00 a 17:15 hrs, previa citación por libreta de comunicaciones.');
  const [riceExtract, setRiceExtract] = useState(info.reglamentoExtracto + " Nuestro RICE regula el diario vivir y establece medidas de acompañamiento restaurativo antes de sanciones definitivas.");

  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [riceFileUrl, setRiceFileUrl] = useState<string | null>(null);

  const [activeProtocol, setActiveProtocol] = useState<string>('bullying');
  const [isNewProtocolOpen, setIsNewProtocolOpen] = useState(false);
  const [newProtocolTheme, setNewProtocolTheme] = useState<'amber' | 'blue' | 'red'>('amber');
  
  const [protocolos, setProtocolos] = useState([
    {
      id: 'bullying',
      tabLabel: 'Caso de Acoso Escolar (Bullying)',
      titulo: 'Protocolo Frente al Maltrato o Acoso',
      descripcion: info.bullyingProtocolo,
      alertaTitulo: 'Alerta:',
      alertaTexto: 'Cualquier integrante de la comunidad puede estampar su denuncia formal por maltrato directamente con la dupla psicosocial.',
      tema: 'red' as const
    }
  ]);

  const [actividades, setActividades] = useState([
    { title: 'Mes de la Solidaridad', desc: 'Campañas de ayuda comunitaria coordinadas por el Centro de Alumnos para cooperar con hogares de ancianos en Copiapó.' },
    { title: 'Elección de Mediadores Escolares', desc: 'Capacitamos a estudiantes de 5° a 8° básico en técnicas de resolución pacífica de conflictos de patio.' },
    { title: 'Escuela para Padres', desc: 'Talleres mensuales con psicólogos para orientar sobre la crianza respetuosa, límites positivos y prevención del ciberacoso.' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "paginas", "convivencia_escolar");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.headerDesc) setHeaderDesc(data.headerDesc);
          if (data.introText) setIntroText(data.introText);
          if (data.contactPhone) setContactPhone(data.contactPhone);
          if (data.contactEmail) setContactEmail(data.contactEmail);
          if (data.contactHours) setContactHours(data.contactHours);
          if (data.riceExtract) setRiceExtract(data.riceExtract);
          if (data.riceFileUrl) setRiceFileUrl(data.riceFileUrl); // <-- CARGAMOS URL DEL PDF
          if (data.protocolos && data.protocolos.length > 0) setProtocolos(data.protocolos);
          
          if (data.actividades) {
            if (data.actividades.length === 1) {
              const actividadesRestauradas = [
                { title: 'Mes de la Solidaridad', desc: 'Campañas de ayuda comunitaria coordinadas por el Centro de Alumnos para cooperar con hogares de ancianos en Copiapó.' },
                { title: 'Elección de Mediadores Escolares', desc: 'Capacitamos a estudiantes de 5° a 8° básico en técnicas de resolución pacífica de conflictos de patio.' },
                { title: 'Escuela para Padres', desc: 'Talleres mensuales con psicólogos para orientar sobre la crianza respetuosa, límites positivos y prevención del ciberacoso.' }
              ];
              setActividades(actividadesRestauradas);
              await setDoc(docRef, { actividades: actividadesRestauradas }, { merge: true });
            } else {
              setActividades(data.actividades);
            }
          }
        }
      } catch (error) {
        console.error("Error conectando a Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveToFirebase = async (campo: string, valor: any) => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "paginas", "convivencia_escolar");
      await setDoc(docRef, { [campo]: valor }, { merge: true });
    } catch (error) {
      console.error("Error guardando datos:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- FUNCIÓN ACTUALIZADA: SUBIR PDF A FIREBASE STORAGE ---
  const handleUploadRICE = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const storageRef = ref(storage, `documentos/RICE_${Date.now()}.pdf`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        setRiceFileUrl(url); // Actualizamos la vista local
        await saveToFirebase('riceFileUrl', url); // Guardamos la URL permanentemente
        
        alert("Reglamento Interno (PDF) subido exitosamente a la nube.");
      } catch (error) {
        console.error("Error al subir el archivo RICE:", error);
        alert("Hubo un error al subir el documento.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDownloadRICE = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (downloadStatus) e.preventDefault();
    setDownloadStatus('generando');
    setTimeout(() => {
      setDownloadStatus('descargando');
      setTimeout(() => {
        setDownloadStatus('exito');
        setTimeout(() => setDownloadStatus(null), 3000);
      }, 1200);
    }, 800);
  };

  const handleUpdateProtocol = (id: string, field: string, value: string) => {
    const nuevosProtocolos = protocolos.map(p => p.id === id ? { ...p, [field]: value } : p);
    setProtocolos(nuevosProtocolos);
    saveToFirebase('protocolos', nuevosProtocolos);
  };

  const handleDeleteProtocol = (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este protocolo permanentemente de la base de datos?")) {
      const nuevosProtocolos = protocolos.filter(p => p.id !== id);
      setProtocolos(nuevosProtocolos);
      saveToFirebase('protocolos', nuevosProtocolos);
      if (activeProtocol === id && nuevosProtocolos.length > 0) {
        setActiveProtocol(nuevosProtocolos[0].id);
      }
    }
  };

  const handleAddProtocol = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const tabLabel = (form.elements.namedItem('tabLabel') as HTMLInputElement).value;
    const titulo = (form.elements.namedItem('titulo') as HTMLInputElement).value;
    
    const newId = `protocol-${Date.now()}`;
    const nuevoProtocolo = {
      id: newId,
      tabLabel,
      titulo,
      descripcion: 'Escriba aquí los detalles y pasos a seguir del protocolo...',
      alertaTitulo: 'Importante:',
      alertaTexto: 'Detalle aquí las instrucciones críticas o información de emergencia.',
      tema: newProtocolTheme
    };
    
    const nuevosProtocolos = [...protocolos, nuevoProtocolo];
    setProtocolos(nuevosProtocolos);
    saveToFirebase('protocolos', nuevosProtocolos);
    
    setActiveProtocol(newId);
    setIsNewProtocolOpen(false);
  };

  const handleUpdateActividad = (index: number, field: 'title' | 'desc', value: string) => {
    const nuevasActividades = [...actividades];
    nuevasActividades[index] = { ...nuevasActividades[index], [field]: value };
    setActividades(nuevasActividades);
    saveToFirebase('actividades', nuevasActividades);
  };

  const getThemeClasses = (tema: string) => {
    switch(tema) {
      case 'red': return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-800', accent: 'text-red-600', dot: 'bg-red-600' };
      case 'blue': return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-[#05087E]', accent: 'text-[#05087E]', dot: 'bg-[#05087E]' };
      default: return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-800', accent: 'text-amber-600', dot: 'bg-amber-500' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-[#05087E] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-[#05087E]">Conectando a la Base de Datos...</p>
      </div>
    );
  }

  const activeProtocolData = protocolos.find(p => p.id === activeProtocol) || protocolos[0];
  const activeTheme = activeProtocolData ? getThemeClasses(activeProtocolData.tema) : getThemeClasses('amber');

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="convivencia-view">
      
      {isAdminMode && (
        <div className={`fixed bottom-4 right-4 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold shadow-lg z-50 transition-colors ${isSaving || isUploading ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
          {isUploading ? (
            <><UploadCloud className="w-4 h-4 animate-bounce" /> Subiendo archivo a la nube...</>
          ) : isSaving ? (
            <><Cloud className="w-4 h-4 animate-pulse" /> Guardando en la nube...</>
          ) : (
            <><CheckCircle className="w-4 h-4" /> Base de Datos Conectada</>
          )}
        </div>
      )}

      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Comunidad Sana</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Convivencia Escolar y Seguridad
        </h2>
        <div className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto w-full">
          <InlineEdit 
            value={headerDesc}
            onSave={(val) => { setHeaderDesc(val); saveToFirebase('headerDesc', val); }}
            isEditMode={isAdminMode}
            multiline={true}
            className="text-center block"
          />
        </div>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* 1. PRESENTACIÓN DEL EQUIPO Y CONTACTO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="convivencia-team-section">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 text-[#05087E]">
            <HeartHandshake className="w-6 h-6 text-[#FF030D]" />
            <h3 className="text-xl font-display font-bold">Nuestro Enfoque de Convivencia</h3>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed font-sans text-justify">
            <InlineEdit 
              value={introText}
              onSave={(val) => { setIntroText(val); saveToFirebase('introText', val); }}
              isEditMode={isAdminMode}
              multiline={true}
            />
          </div>

          <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-gray-100 space-y-3 shadow-sm">
            <h4 className="text-xs font-display font-bold text-gray-700 uppercase tracking-widest">
              ¿Cómo contactar al Equipo?
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#FF030D] shrink-0" />
                <span className="font-bold shrink-0">Anexo:</span>
                <InlineEdit 
                  value={contactPhone}
                  onSave={(val) => { setContactPhone(val); saveToFirebase('contactPhone', val); }}
                  isEditMode={isAdminMode}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#05087E] shrink-0" />
                <span className="font-bold shrink-0">Email:</span>
                <InlineEdit 
                  value={contactEmail}
                  onSave={(val) => { setContactEmail(val); saveToFirebase('contactEmail', val); }}
                  isEditMode={isAdminMode}
                  className="flex-1"
                />
              </div>
              <div className="text-[10px] text-gray-500 italic mt-2 border-t border-gray-200 pt-2">
                <InlineEdit 
                  value={contactHours}
                  onSave={(val) => { setContactHours(val); saveToFirebase('contactHours', val); }}
                  isEditMode={isAdminMode}
                  multiline={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visual Callout - RICE */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#05087E] text-white p-8 rounded-3xl relative overflow-hidden shadow-lg h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16" />
            <div className="space-y-4 relative z-10">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                RICE Oficial
              </span>
              <h4 className="text-lg font-display font-bold leading-tight">
                Reglamento Interno de Convivencia Escolar
              </h4>
              <div className="text-xs text-gray-200 leading-relaxed font-sans text-justify pb-2">
                <InlineEdit 
                  value={riceExtract}
                  onSave={(val) => { setRiceExtract(val); saveToFirebase('riceExtract', val); }}
                  isEditMode={isAdminMode}
                  multiline={true}
                />
              </div>
              
              <a 
                href={riceFileUrl || "assets/PEI.pdf"}
                download="Reglamento_Interno_Escuela_Bernardo_OHiggins.pdf"
                target="_blank"
                onClick={handleDownloadRICE}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold shadow-md transition-all cursor-pointer ${
                  downloadStatus === 'exito'
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-[#FF030D] text-white hover:bg-[#d8020a] hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {downloadStatus === 'generando' && <span>Generando...</span>}
                {downloadStatus === 'descargando' && <span>Descargando...</span>}
                {downloadStatus === 'exito' && <span>¡Descargado con Éxito!</span>}
                {downloadStatus === null && (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Descargar Reglamento Interno (PDF)</span>
                  </>
                )}
              </a>
            </div>
          </div>

          {isAdminMode && (
            <div className={`bg-white p-3 rounded-xl border border-dashed text-center relative w-full overflow-hidden hover:bg-blue-50 transition-colors cursor-pointer ${isUploading ? 'border-amber-400' : 'border-[#05087E]/30'}`}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleUploadRICE}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex items-center justify-center gap-2 text-[#05087E]">
                {isUploading ? <UploadCloud className="w-4 h-4 animate-bounce text-amber-500" /> : <UploadCloud className="w-4 h-4" />}
                <span className="text-[10px] font-bold">{isUploading ? 'Subiendo archivo...' : 'Subir Nuevo Reglamento (PDF desde PC)'}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. PROTOCOLOS DE ACTUACIÓN */}
      <section className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm" id="protocols-section">
        <div className="text-center space-y-2">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Protocolos de Seguridad</span>
          <h3 className="text-xl font-display font-bold text-[#05087E]">
            Protocolos de Actuación Obligatorios
          </h3>
        </div>

        <div className="flex justify-center flex-wrap gap-2">
          {protocolos.map(proto => (
            <div
              key={proto.id}
              onClick={() => setActiveProtocol(proto.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeProtocol === proto.id
                  ? 'bg-[#FF030D] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isAdminMode && activeProtocol === proto.id ? (
                <InlineEdit 
                  value={proto.tabLabel}
                  onSave={(val) => handleUpdateProtocol(proto.id, 'tabLabel', val)}
                  isEditMode={true}
                  className="text-white"
                />
              ) : (
                <span>{proto.tabLabel}</span>
              )}
            </div>
          ))}

          {isAdminMode && (
            <button
              onClick={() => setIsNewProtocolOpen(true)}
              className="px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border border-dashed border-[#05087E] text-[#05087E] hover:bg-blue-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Protocolo
            </button>
          )}
        </div>

        {activeProtocolData && (
          <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-100 max-w-[800px] mx-auto relative group">
            {isAdminMode && (
              <button 
                onClick={() => handleDeleteProtocol(activeProtocolData.id)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                title="Eliminar Protocolo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="space-y-4 pr-6">
              <div className="flex items-center gap-2 text-[#05087E] font-display font-bold text-sm">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeTheme.dot}`} />
                <InlineEdit 
                  value={activeProtocolData.titulo}
                  onSave={(val) => handleUpdateProtocol(activeProtocolData.id, 'titulo', val)}
                  isEditMode={isAdminMode}
                />
              </div>
              <div className="text-xs text-gray-700 leading-relaxed font-sans text-justify">
                <InlineEdit 
                  value={activeProtocolData.descripcion}
                  onSave={(val) => handleUpdateProtocol(activeProtocolData.id, 'descripcion', val)}
                  isEditMode={isAdminMode}
                  multiline={true}
                />
              </div>
              
              <div className={`${activeTheme.bg} border ${activeTheme.border} p-3.5 rounded-xl text-[11px] ${activeTheme.text} leading-normal flex flex-col sm:flex-row gap-2 items-start`}>
                <span className={`font-extrabold shrink-0 ${activeTheme.accent}`}>
                  <InlineEdit 
                    value={activeProtocolData.alertaTitulo}
                    onSave={(val) => handleUpdateProtocol(activeProtocolData.id, 'alertaTitulo', val)}
                    isEditMode={isAdminMode}
                  />
                </span>
                <span className="flex-1 w-full">
                  <InlineEdit 
                    value={activeProtocolData.alertaTexto}
                    onSave={(val) => handleUpdateProtocol(activeProtocolData.id, 'alertaTexto', val)}
                    isEditMode={isAdminMode}
                    multiline={true}
                  />
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. ACTIVIDADES DE FOMENTO A LOS VALORES */}
      <section className="space-y-6" id="fomento-activities-section">
        <h3 className="text-xl font-display font-bold text-[#05087E] text-center">
          Actividades de Fomento y Ciudadanía
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actividades.map((act, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#05087E] shrink-0">
                  <Sparkles className="w-5 h-5 text-[#05087E]" />
                </div>
                <div className="text-sm font-display font-bold text-[#05087E] w-full">
                  <InlineEdit 
                    value={act.title}
                    onSave={(val) => handleUpdateActividad(index, 'title', val)}
                    isEditMode={isAdminMode}
                  />
                </div>
                <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify w-full">
                  <InlineEdit 
                    value={act.desc}
                    onSave={(val) => handleUpdateActividad(index, 'desc', val)}
                    isEditMode={isAdminMode}
                    multiline={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal para Nuevo Protocolo */}
      {isNewProtocolOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[400px] w-full border border-gray-100 shadow-2xl relative space-y-4">
            <button onClick={() => setIsNewProtocolOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer">✕</button>
            <h3 className="text-xl font-display font-bold text-[#05087E] border-b border-gray-100 pb-3">Crear Nuevo Protocolo</h3>
            <form onSubmit={handleAddProtocol} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Nombre de la Pestaña (Corto)*</label>
                <input name="tabLabel" required type="text" placeholder="Ej: Accidentes Escolares" className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#05087E]"/>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Título Formal del Documento*</label>
                <input name="titulo" required type="text" placeholder="Ej: Protocolo de Acción ante Accidentes" className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#05087E]"/>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Color de Énfasis</label>
                <select value={newProtocolTheme} onChange={(e) => setNewProtocolTheme(e.target.value as any)} className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#05087E] cursor-pointer">
                  <option value="amber">Amarillo (Precaución)</option>
                  <option value="red">Rojo (Urgencia Máxima)</option>
                  <option value="blue">Azul (Informativo)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#05087E] text-white py-3 rounded-full font-bold shadow-md hover:bg-blue-900 transition-colors cursor-pointer mt-2">Añadir Pestaña</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}