/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, addDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { 
  INITIAL_INFO, INITIAL_NOTICIAS, INITIAL_EVENTOS, INITIAL_PERSONAS, 
  INITIAL_TALLERES, INITIAL_POSTULACIONES, INITIAL_MENSAJES 
} from './data';
import { Noticia, Evento, Postulacion, MensajeContacto, Taller } from './types';

// Componentes
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './components/Inicio';
import Nosotros from './components/Nosotros';
import AreaAcademica from './components/AreaAcademica';
import ConvivenciaEscolar from './components/ConvivenciaEscolar';
import VidaEstudiantil from './components/VidaEstudiantil';
import Admision from './components/Admision';
import NoticiasEventos from './components/NoticiasEventos';
import Contacto from './components/Contacto';
import AdminPanel from './components/AdminPanel';
import InlineEdit from './components/InlineEdit';

import { Key, AlertCircle, HelpCircle, CheckCircle2, ShieldCheck, Eye, Lock, Link as LinkIcon } from 'lucide-react';
import { InformacionInstitucional, Persona } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // Estados de Modales
  const [isPortalModalOpen, setIsPortalModalOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isOpinionOpen, setIsOpinionOpen] = useState<boolean>(false);

  // Estados de Textos Editables
  const [politicasText, setPoliticasText] = useState("La Escuela Bernardo O'Higgins protege sus datos personales...");
  const [terminosText, setTerminosText] = useState("Al acceder y navegar por este sitio web oficial...");
  
  // Estados Portal Apoderados
  const [portalDesc, setPortalDesc] = useState("Nuestra escuela utiliza la plataforma externa NAPSIS...");
  const [portalInstrucciones, setPortalInstrucciones] = useState("Usuario es el RUT del Apoderado...");
  const [portalBotonTexto, setPortalBotonTexto] = useState("Ir a NAPSIS ↗");
  const [portalUrl, setPortalUrl] = useState("https://napsis.cl");

  // Login States
  const [loginUser, setLoginUser] = useState<string>('');
  const [loginPass, setLoginPass] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Opinion Form States
  const [opinionNombre, setOpinionNombre] = useState<string>('');
  const [opinionTipo, setOpinionTipo] = useState<string>('Sugerencia');
  const [opinionRol, setOpinionRol] = useState<string>('Apoderado');
  const [opinionEmail, setOpinionEmail] = useState<string>('');
  const [opinionTelefono, setOpinionTelefono] = useState<string>('');
  const [opinionDetalle, setOpinionDetalle] = useState<string>('');
  const [opinionSuccess, setOpinionSuccess] = useState<boolean>(false);
  const [opinionError, setOpinionError] = useState<string>('');

  // Bases de Datos (Empiezan vacías o con los initial, pero Firebase las sobreescribirá)
  const [info, setInfo] = useState<InformacionInstitucional>(INITIAL_INFO);
  const [noticias, setNoticias] = useState<Noticia[]>(INITIAL_NOTICIAS);
  const [eventos, setEventos] = useState<Evento[]>(INITIAL_EVENTOS);
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [talleres, setTalleres] = useState<Taller[]>(INITIAL_TALLERES);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);

  const [evaluaciones, setEvaluaciones] = useState([
    { id: 'simce-lectura', label: 'SIMCE Lectura 4° Básico', score: '286 pts', trend: '+14 pts vs promedio regional' },
    { id: 'simce-matematica', label: 'SIMCE Matemática 4° Básico', score: '290 pts', trend: '+18 pts vs nacional' },
    { id: 'desarrollo-personal', label: 'Índice de Desarrollo Personal', score: '94%', trend: 'Estándar Sobresaliente Agencia' }
  ]);
  
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200');

  // CARGA INICIAL DE DATOS DESDE FIREBASE
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const docSnapFooter = await getDoc(doc(db, "paginas", "footer"));
        if (docSnapFooter.exists()) {
          const data = docSnapFooter.data();
          if (data.politicas) setPoliticasText(data.politicas);
          if (data.terminos) setTerminosText(data.terminos);
        }

        const docSnapPortal = await getDoc(doc(db, "paginas", "portal"));
        if (docSnapPortal.exists()) {
          const pData = docSnapPortal.data();
          if (pData.desc) setPortalDesc(pData.desc);
          if (pData.instrucciones) setPortalInstrucciones(pData.instrucciones);
          if (pData.botonTexto) setPortalBotonTexto(pData.botonTexto);
          if (pData.url) setPortalUrl(pData.url);
        }

        // Cargar Área Académica
        const docSnapAcademica = await getDoc(doc(db, "paginas", "areaAcademica"));
        if (docSnapAcademica.exists() && docSnapAcademica.data().evaluaciones) {
          setEvaluaciones(docSnapAcademica.data().evaluaciones);
        }
      } catch (error) { console.error(error); }
    };
    fetchGlobalData();

    // SUSCRIPCIONES EN TIEMPO REAL (Formularios)
    const unsubMensajes = onSnapshot(collection(db, 'mensajes'), (snapshot) => {
      const msgsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MensajeContacto[];
      // Ordenamos para que los más nuevos salgan arriba
      setMensajes(msgsData.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
    });

    const unsubPostulaciones = onSnapshot(collection(db, 'postulaciones'), (snapshot) => {
      const postData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Postulacion[];
      setPostulaciones(postData.sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()));
    });

    return () => {
      unsubMensajes();
      unsubPostulaciones();
    };
  }, []);

  const saveGlobalToFirebase = async (coleccion: string, campo: string, valor: string) => {
    try {
      await setDoc(doc(db, "paginas", coleccion), { [campo]: valor }, { merge: true });
    } catch (error) { console.error(error); }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'Portal Apoderados') {
      setIsPortalModalOpen(true);
      return;
    }
    const routeMap: Record<string, string> = {
      'Inicio': 'inicio', 'Nosotros': 'nosotros', 'Área Académica': 'area-academica',
      'Convivencia Escolar': 'convivencia-escolar', 'Vida Estudiantil': 'vida-estudiantil',
      'Admisión': 'admision', 'Noticias': 'noticias', 'Contacto': 'contacto',
      'academica': 'area-academica', 'convivencia': 'convivencia-escolar'
    };
    setActiveTab(routeMap[tab] || tab.toLowerCase());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // MANEJO DE EVALUACIONES (Área Académica a Firebase)
  const handleUpdateEvaluacion = async (id: string, score: string, trend?: string) => {
    const updatedEvals = evaluaciones.map(item => item.id === id ? { ...item, score, trend: trend ?? item.trend } : item);
    setEvaluaciones(updatedEvals); // Actualización visual rápida
    try {
      await setDoc(doc(db, "paginas", "areaAcademica"), { evaluaciones: updatedEvals }, { merge: true });
    } catch (error) { console.error("Error guardando evaluaciones", error); }
  };

  // MANEJO DE FORMULARIOS A FIREBASE
  const handleAddPostulacion = async (post: Omit<Postulacion, 'id' | 'fechaRegistro' | 'estado'>) => {
    try {
      await addDoc(collection(db, "postulaciones"), {
        ...post,
        fechaRegistro: new Date().toISOString(),
        estado: 'Pendiente'
      });
    } catch (error) { console.error("Error al postular", error); }
  };

  const handleChangePostulacionEstado = async (id: string, nuevoEstado: 'Pendiente' | 'Revisado' | 'Aceptado') => {
    try {
      await updateDoc(doc(db, "postulaciones", id), { estado: nuevoEstado });
    } catch (error) { console.error("Error actualizando estado", error); }
  };

  const handleOpinionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinionDetalle.trim()) { setOpinionError('Por favor ingrese el detalle de su opinión.'); return; }
    setOpinionSuccess(true); setOpinionError('');
    
    try {
      await addDoc(collection(db, "mensajes"), {
        nombre: opinionNombre.trim() || 'Comunidad (Anónimo)',
        email: opinionEmail.trim() || 'anonimo@escuelabernardoohiggins.cl',
        telefono: opinionTelefono.trim() || 'S/R',
        asunto: `Opinión [${opinionTipo}] - Rol: ${opinionRol}`,
        mensaje: opinionDetalle,
        fecha: new Date().toISOString(), // Usamos ISO para ordenar mejor
        aprobado: false 
      });

      setTimeout(() => {
        setOpinionSuccess(false); setIsOpinionOpen(false);
        setOpinionNombre(''); setOpinionTelefono(''); setOpinionEmail(''); setOpinionDetalle('');
      }, 3000);
    } catch (error) {
      console.error("Error enviando opinión", error);
      setOpinionError('Hubo un error al enviar. Intente nuevamente.');
    }
  };

  const handleAddMessage = async (msg: Omit<MensajeContacto, 'id' | 'fecha'>) => {
    try {
      await addDoc(collection(db, "mensajes"), {
        ...msg,
        fecha: new Date().toISOString(),
        aprobado: false
      });
    } catch (error) { console.error("Error enviando mensaje", error); }
  };

  const handleUpdateMensaje = async (id: string, updates: Partial<MensajeContacto>) => {
    try { await updateDoc(doc(db, "mensajes", id), updates); } 
    catch (error) { console.error("Error actualizando mensaje", error); }
  };

  const handleDeleteMensaje = async (id: string) => {
    try { await deleteDoc(doc(db, "mensajes", id)); } 
    catch (error) { console.error("Error eliminando mensaje", error); }
  };

  // AUTENTICACIÓN SEGURA
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, loginUser, loginPass);
      setIsAdminMode(true); setIsLoginOpen(false); setActiveTab('admin'); 
      setLoginUser(''); setLoginPass('');
    } catch (error: any) {
      setLoginError('Credenciales incorrectas. Verifique el correo institucional y la contraseña.');
    }
  };

  const handleOpinionDetalleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    const getWordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    if (getWordCount(inputText) <= 100 || inputText.length < opinionDetalle.length) setOpinionDetalle(inputText);
  };

  const handleAddNoticia = (nuevaNoticia: Noticia) => setNoticias([nuevaNoticia, ...noticias]);
  const handleAddEvento = (nuevoEvento: Evento) => {
    const updated = [...eventos, nuevoEvento].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    setEventos(updated);
  };
  const handleUpdateSlogan = (nuevoSlogan: string) => setInfo(prev => ({ ...prev, slogan: nuevoSlogan }));
  const handleUpdateTaller = (id: string, updatedFields: Partial<Taller>) => setTalleres(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  const handleUpdateInfo = (key: keyof InformacionInstitucional, value: any) => setInfo(prev => ({ ...prev, [key]: value }));
  const handleUpdatePersona = (id: string, updatedFields: Partial<Persona>) => setPersonas(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  const handleAddPersona = (persona: Persona) => setPersonas([...personas, persona]);
  const handleDeletePersona = (id: string) => setPersonas(personas.filter(p => p.id !== id));

  const opinionesAprobadas = mensajes.filter(m => (m as any).aprobado === true && m.asunto.startsWith('Opinión')).map(m => ({ id: m.id, nombre: m.nombre, rol: m.asunto.split('- Rol: ')[1] || 'Comunidad', mensaje: m.mensaje }));

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans" id="app-root">
      
      <Header isAdminMode={isAdminMode} onLogout={() => { setIsAdminMode(false); setActiveTab('inicio'); }} activeTab={activeTab === 'inicio' ? 'Inicio' : activeTab} setActiveTab={handleTabChange} />

      {isAdminMode && (
        <div className="bg-[#FF030D] text-white py-2 text-center text-xs font-bold tracking-wide shadow-inner flex items-center justify-center gap-4 flex-wrap px-4 z-40 relative">
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /><span className="hidden md:inline">MODO EDITOR ACTIVO: Navegue por la página para editar contenidos directamente.</span><span className="md:hidden">MODO EDITOR ACTIVO</span></div>
          <div className="flex gap-2"><button onClick={() => setActiveTab('admin')} className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer uppercase border border-white/30 ${activeTab === 'admin' ? 'bg-white text-[#FF030D]' : 'bg-[#05087E] text-white hover:bg-blue-900'}`}>Panel de Control</button></div>
        </div>
      )}

      <main className="flex-grow py-8 px-4" id="main-content-layout">
        {isAdminMode && activeTab === 'admin' ? (
          <AdminPanel noticias={noticias} onAddNoticia={handleAddNoticia} eventos={eventos} onAddEvento={handleAddEvento} postulaciones={postulaciones} onChangePostulacionEstado={handleChangePostulacionEstado} mensajes={mensajes} schoolSlogan={info.slogan} onUpdateSlogan={handleUpdateSlogan} onUpdateMensaje={handleUpdateMensaje} onDeleteMensaje={handleDeleteMensaje} />
        ) : (
          <div className="animate-fade-in">
            {(activeTab === 'inicio' || activeTab === 'Inicio') && <Inicio noticias={noticias} eventos={eventos} onNavigate={handleTabChange} heroImage={heroImage} onOpenOpinionModal={() => setIsOpinionOpen(true)} opinionesAprobadas={opinionesAprobadas} isAdminMode={isAdminMode}/>}
            {activeTab === 'nosotros' && <Nosotros info={info} personas={personas} isAdminMode={isAdminMode} onUpdateInfo={handleUpdateInfo} onUpdatePersona={handleUpdatePersona} onAddPersona={handleAddPersona} onDeletePersona={handleDeletePersona} />}
            {activeTab === 'area-academica' && <AreaAcademica evaluaciones={evaluaciones} onUpdateEvaluacion={handleUpdateEvaluacion} isAdminMode={isAdminMode} />}
            {activeTab === 'convivencia-escolar' && <ConvivenciaEscolar info={info} isAdminMode={isAdminMode} />}
            {activeTab === 'vida-estudiantil' && <VidaEstudiantil isAdminMode={isAdminMode} />}
            {activeTab === 'admision' && <Admision onAddPostulacion={handleAddPostulacion} isAdminMode={isAdminMode} />}
            {activeTab === 'noticias' && <NoticiasEventos isAdminMode={isAdminMode} />}
            {activeTab === 'contacto' && <Contacto onAddMessage={handleAddMessage} isAdminMode={isAdminMode} />}
          </div>
        )}
      </main>

      <Footer isAdminMode={isAdminMode} setActiveTab={handleTabChange} setIsAdminMode={setIsAdminMode} onOpenPrivacy={() => setIsPrivacyOpen(true)} onOpenTerms={() => setIsTermsOpen(true)} onOpenAdminLogin={() => setIsLoginOpen(true)} />

      {/* MODAL DIALOG: PORTAL APODERADOS */}
      {isPortalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsPortalModalOpen(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[500px] w-full border border-gray-100 shadow-2xl relative space-y-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsPortalModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-[#FF030D]"><Key className="w-6 h-6" /></div>
              <div>
                <h3 className="text-lg font-display font-bold text-[#05087E]">Acceso a Portal Apoderados</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Servicio Web Externo</span>
              </div>
            </div>
            
            <div className="space-y-4 text-xs text-gray-700 font-sans">
              <div className="leading-relaxed text-justify"><InlineEdit value={portalDesc} onSave={(v) => { setPortalDesc(v); saveGlobalToFirebase('portal', 'desc', v); }} isEditMode={isAdminMode} multiline /></div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#05087E] shrink-0 mt-0.5" />
                <div className="w-full">
                  <strong className="font-bold text-[#05087E] block mb-1">Instrucciones de Entrada:</strong>
                  <div className="text-[11px] text-gray-600 w-full"><InlineEdit value={portalInstrucciones} onSave={(v) => { setPortalInstrucciones(v); saveGlobalToFirebase('portal', 'instrucciones', v); }} isEditMode={isAdminMode} multiline /></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex gap-3">
                <button onClick={() => setIsPortalModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 font-bold py-3 rounded-full text-xs transition-all text-gray-700">Cerrar</button>
                <a href={isAdminMode ? undefined : portalUrl} target={isAdminMode ? undefined : "_blank"} rel="noopener noreferrer" className={`flex-1 bg-[#05087E] text-white font-bold py-3 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all ${isAdminMode ? 'cursor-text' : 'hover:bg-blue-900 cursor-pointer'}`}>
                  <InlineEdit value={portalBotonTexto} onSave={(v) => { setPortalBotonTexto(v); saveGlobalToFirebase('portal', 'botonTexto', v); }} isEditMode={isAdminMode} />
                </a>
              </div>
              
              {isAdminMode && (
                <div className="bg-gray-50 border border-dashed border-gray-300 p-3 rounded-xl flex items-center gap-2 mt-2 shadow-inner">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <div className="w-full">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Link destino del botón azul:</label>
                    <input type="url" value={portalUrl} onChange={(e) => { setPortalUrl(e.target.value); saveGlobalToFirebase('portal', 'url', e.target.value); }} placeholder="Ej: https://napsis.cl" className="w-full text-xs p-1.5 rounded bg-white border border-gray-200 outline-none focus:ring-1 focus:ring-[#05087E]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: POLITICAS DE PRIVACIDAD */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsPrivacyOpen(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[600px] w-full border border-gray-100 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsPrivacyOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-[#05087E]">
              <ShieldCheck className="w-6 h-6 text-[#FF030D]" />
              <h3 className="text-base font-display font-bold">Políticas de Privacidad y Protección de Datos</h3>
            </div>
            <div className="text-xs text-gray-700 space-y-3 font-sans leading-relaxed text-justify relative group">
              <InlineEdit value={politicasText} onSave={(val) => { setPoliticasText(val); saveGlobalToFirebase('footer', 'politicas', val); }} isEditMode={isAdminMode} multiline={true} />
            </div>
            <div className="pt-2"><button onClick={() => setIsPrivacyOpen(false)} className="w-full bg-[#05087E] text-white py-2.5 rounded-full text-xs font-bold hover:bg-blue-950 transition-all">Entendido y Aceptar</button></div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: TERMINOS DE USO */}
      {isTermsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsTermsOpen(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[600px] w-full border border-gray-100 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsTermsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-[#05087E]"><HelpCircle className="w-6 h-6 text-[#FF030D]" /><h3 className="text-base font-display font-bold">Términos de Uso del Sitio Web</h3></div>
            <div className="text-xs text-gray-700 space-y-3 font-sans leading-relaxed text-justify relative group">
               <InlineEdit value={terminosText} onSave={(val) => { setTerminosText(val); saveGlobalToFirebase('footer', 'terminos', val); }} isEditMode={isAdminMode} multiline={true} />
            </div>
            <div className="pt-2"><button onClick={() => setIsTermsOpen(false)} className="w-full bg-[#05087E] text-white py-2.5 rounded-full text-xs font-bold hover:bg-blue-950 transition-all">Cerrar Ventana</button></div>
          </div>
        </div>
      )}

      {/* MODAL: LOGIN CMS SEGURO */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsLoginOpen(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[400px] w-full border-2 border-[#FF030D] shadow-2xl relative space-y-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            <div className="text-center space-y-2"><div className="w-12 h-12 bg-blue-50 text-[#05087E] rounded-full flex items-center justify-center mx-auto"><Lock className="w-5 h-5" /></div><h3 className="text-base font-display font-bold text-[#05087E]">Ingreso al Panel CMS Escolar</h3></div>
            {loginError && (<div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 flex items-start gap-2 text-xs"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" /><span>{loginError}</span></div>)}
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Usuario o Email</label><input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#05087E]" /></div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 block">Contraseña de Red</label><div className="relative"><input type={showPassword ? "text" : "password"} required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full p-2.5 pr-10 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#05087E]" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"><Eye className="w-4 h-4" /></button></div></div>
              <button type="submit" className="w-full bg-[#05087E] hover:bg-blue-900 text-white py-3 rounded-full text-xs font-bold shadow-md transition-all mt-2">Autenticar Administrador</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TU OPINIÓN NOS IMPORTA */}
      {isOpinionOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsOpinionOpen(false)}>
           <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[500px] w-full border border-gray-100 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsOpinionOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
            {opinionSuccess ? (
              <div className="py-8 text-center space-y-3 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" /></div>
                <h4 className="text-base font-bold text-[#05087E]">¡Muchas Gracias por su Opinión!</h4>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-[#05087E]">Buzón Escolar de Opinión</h3>
                  <p className="text-[10px] text-gray-500 mt-1">Si deja el nombre en blanco, se enviará como Anónimo.</p>
                </div>
                <form onSubmit={handleOpinionSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1"><label className="font-bold">Perfil / Rol*</label><select required value={opinionRol} onChange={e => setOpinionRol(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-[#05087E] cursor-pointer"><option>Apoderado</option><option>Estudiante</option><option>Ex-alumno</option><option>Vecino de Copiapó</option><option>Otro</option></select></div>
                  <div className="space-y-1"><label className="font-bold">Nombre (Opcional)</label><input type="text" placeholder="Ej: Camila Rojas" value={opinionNombre} onChange={e => setOpinionNombre(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-[#05087E]" /></div>
                  <div className="space-y-1"><label className="font-bold">Su Mensaje/Opinión*</label><textarea required rows={4} value={opinionDetalle} onChange={handleOpinionDetalleChange} className="w-full p-2 border rounded-lg focus:ring-[#05087E] resize-none" placeholder="Escriba aquí..." /></div>
                  <button type="submit" className="w-full bg-[#FF030D] text-white py-2.5 rounded-full font-bold cursor-pointer hover:bg-red-700 transition-colors">Enviar Opinión</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}