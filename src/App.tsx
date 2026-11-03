/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_INFO, INITIAL_NOTICIAS, INITIAL_EVENTOS, INITIAL_PERSONAS, 
  INITIAL_TALLERES, INITIAL_POSTULACIONES, INITIAL_MENSAJES 
} from './data';
import { Noticia, Evento, Postulacion, MensajeContacto, Taller } from './types';

// Import Modular Components
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

import { Key, AlertCircle, HelpCircle, Phone, Mail, X, CheckCircle2, ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react';
import { InformacionInstitucional, Persona } from './types';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState<boolean>(false);

  // Modal States for Privacy, Terms, Login and Feedback (Opinion)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isOpinionOpen, setIsOpinionOpen] = useState<boolean>(false);

  // Login Form States
  const [loginUser, setLoginUser] = useState<string>('');
  const [loginPass, setLoginPass] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Opinion Form States
  const [opinionNombre, setOpinionNombre] = useState<string>('');
  const [opinionTipo, setOpinionTipo] = useState<string>('Sugerencia');
  const [opinionRol, setOpinionRol] = useState<string>('Apoderado');
  const [opinionEmail, setOpinionEmail] = useState<string>('');
  const [opinionRut, setOpinionRut] = useState<string>('');
  const [opinionDetalle, setOpinionDetalle] = useState<string>('');
  const [opinionSuccess, setOpinionSuccess] = useState<boolean>(false);
  const [opinionError, setOpinionError] = useState<string>('');

  // Central Mock Database State (Dynamic content updates)
  const [info, setInfo] = useState<InformacionInstitucional>(INITIAL_INFO);
  const [noticias, setNoticias] = useState<Noticia[]>(INITIAL_NOTICIAS);
  const [eventos, setEventos] = useState<Evento[]>(INITIAL_EVENTOS);
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [talleres, setTalleres] = useState<Taller[]>(INITIAL_TALLERES);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>(INITIAL_POSTULACIONES);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>(INITIAL_MENSAJES);

  // Evaluations and SIMCE State
  const [evaluaciones, setEvaluaciones] = useState([
    { id: 'simce-lectura', label: 'SIMCE Lectura 4° Básico', score: '286 pts', trend: '+14 pts vs promedio regional' },
    { id: 'simce-matematica', label: 'SIMCE Matemática 4° Básico', score: '290 pts', trend: '+18 pts vs nacional' },
    { id: 'desarrollo-personal', label: 'Índice de Desarrollo Personal', score: '94%', trend: 'Estándar Sobresaliente Agencia' }
  ]);
  
  // Customizable Hero banner image state
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200');

  // CMS/Admin Handlers
  const handleAddNoticia = (nuevaNoticia: Noticia) => {
    setNoticias([nuevaNoticia, ...noticias]);
  };

  const handleAddEvento = (nuevoEvento: Evento) => {
    const updated = [...eventos, nuevoEvento].sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
    setEventos(updated);
  };

  const handleUpdateSlogan = (nuevoSlogan: string) => {
    setInfo(prev => ({
      ...prev,
      slogan: nuevoSlogan
    }));
  };

  const handleChangePostulacionEstado = (id: string, nuevoEstado: 'Pendiente' | 'Revisado' | 'Aceptado') => {
    setPostulaciones(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  const handleUpdateEvaluacion = (id: string, score: string, trend?: string) => {
    setEvaluaciones(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, score, trend: trend ?? item.trend };
      }
      return item;
    }));
  };

  const handleUpdateTaller = (id: string, updatedFields: Partial<Taller>) => {
    setTalleres(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const handleUpdateInfo = (key: keyof InformacionInstitucional, value: any) => {
    setInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdatePersona = (id: string, updatedFields: Partial<Persona>) => {
    setPersonas(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === 'admin' && loginPass === 'copiapo_ohiggins') {
      setIsAdminMode(true);
      setIsLoginOpen(false);
      setLoginUser('');
      setLoginPass('');
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas de administración. Intente nuevamente.');
    }
  };

  const handleOpinionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinionDetalle.trim()) {
      setOpinionError('Por favor ingrese el detalle de su opinión.');
      return;
    }
    setOpinionSuccess(true);
    setOpinionError('');
    
    // Add to messages central database so administrator can view it
    const formattedDateTime = new Date().toLocaleString('es-CL', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    const nuevoMensaje: MensajeContacto = {
      id: `opinion-${Date.now()}`,
      nombre: opinionNombre.trim() || 'Comunidad (Anónimo)',
      email: opinionEmail.trim() || 'anonimo@escuelabernardoohiggins.cl',
      telefono: opinionRut.trim() || 'S/R',
      asunto: `Opinión [${opinionTipo}] - Rol: ${opinionRol}`,
      mensaje: opinionDetalle,
      fecha: formattedDateTime
    };
    setMensajes([nuevoMensaje, ...mensajes]);

    setTimeout(() => {
      setOpinionSuccess(false);
      setIsOpinionOpen(false);
      setOpinionNombre('');
      setOpinionRut('');
      setOpinionEmail('');
      setOpinionDetalle('');
    }, 3000);
  };

  // Public Form Handlers
  const handleAddPostulacion = (post: Omit<Postulacion, 'id' | 'fechaRegistro' | 'estado'>) => {
    const formattedDate = new Date().toISOString().split('T')[0];
    const nuevaPostulacion: Postulacion = {
      ...post,
      id: `post-${Date.now()}`,
      fechaRegistro: formattedDate,
      estado: 'Pendiente'
    };
    setPostulaciones([nuevaPostulacion, ...postulaciones]);
  };

  const handleAddMessage = (msg: Omit<MensajeContacto, 'id' | 'fecha'>) => {
    const formattedDateTime = new Date().toLocaleString('es-CL', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    const nuevoMensaje: MensajeContacto = {
      ...msg,
      id: `msg-${Date.now()}`,
      fecha: formattedDateTime
    };
    setMensajes([nuevoMensaje, ...mensajes]);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans" id="app-root">
      
      {/* 1. GLOBAL HEADER */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onOpenPortalModal={() => setIsPortalModalOpen(true)}
      />

      {/* Admin Mode active banner */}
      {isAdminMode && (
        <div className="bg-[#FF030D] text-white py-2 text-center text-xs font-bold tracking-wide shadow-inner flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>MODO EDITOR ACTIVO: Los textos con contornos grises son editables directamente haciendo clic sobre ellos.</span>
          <button 
            onClick={() => setIsAdminMode(false)}
            className="bg-white text-[#FF030D] px-3 py-0.5 rounded-full text-[10px] font-extrabold hover:bg-gray-100 transition-colors ml-4 cursor-pointer uppercase"
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* 2. MAIN CONTENT SPACE (With layout boundaries of max-w-1200px) */}
      <main className="flex-grow py-8 px-4" id="main-content-layout">
        
        {isAdminMode ? (
          /* Render Admin CMS Dashboard Panel */
          <AdminPanel
            noticias={noticias}
            onAddNoticia={handleAddNoticia}
            eventos={eventos}
            onAddEvento={handleAddEvento}
            postulaciones={postulaciones}
            onChangePostulacionEstado={handleChangePostulacionEstado}
            mensajes={mensajes}
            schoolSlogan={info.slogan}
            onUpdateSlogan={handleUpdateSlogan}
          />
        ) : (
          /* Render Public school website based on navigation tab selection */
          <div className="animate-fade-in">
            {activeTab === 'inicio' && (
              <Inicio
                noticias={noticias}
                eventos={eventos}
                onNavigate={(tabId) => {
                  setActiveTab(tabId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                heroImage={heroImage}
                onOpenOpinionModal={() => setIsOpinionOpen(true)}
              />
            )}
            {activeTab === 'nosotros' && (
              <Nosotros
                info={info}
                personas={personas}
                isAdminMode={isAdminMode}
                onUpdateInfo={handleUpdateInfo}
                onUpdatePersona={handleUpdatePersona}
              />
            )}
            {activeTab === 'academica' && (
              <AreaAcademica 
                evaluaciones={evaluaciones}
                onUpdateEvaluacion={handleUpdateEvaluacion}
                isAdminMode={isAdminMode}
              />
            )}
            {activeTab === 'convivencia' && <ConvivenciaEscolar info={info} />}
            {activeTab === 'vida-estudiantil' && (
              <VidaEstudiantil 
                talleres={talleres} 
                isAdminMode={isAdminMode}
                onUpdateTaller={handleUpdateTaller}
              />
            )}
            {activeTab === 'admision' && (
              <Admision onAddPostulacion={handleAddPostulacion} />
            )}
            {activeTab === 'noticias' && (
              <NoticiasEventos noticias={noticias} eventos={eventos} />
            )}
            {activeTab === 'contacto' && (
              <Contacto onAddMessage={handleAddMessage} />
            )}
          </div>
        )}
      </main>

      {/* 3. GLOBAL FOOTER */}
      <Footer 
        setActiveTab={setActiveTab}
        setIsAdminMode={setIsAdminMode}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenAdminLogin={() => setIsLoginOpen(true)}
      />

      {/* 4. MODAL DIALOG: SIMULATOR PORTAL APODERADOS (NAPSIS) */}
      {isPortalModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsPortalModalOpen(false)}
          id="portal-modal-overlay"
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-[500px] w-full border border-gray-100 shadow-2xl relative space-y-6"
            onClick={(e) => e.stopPropagation()}
            id="portal-modal-body"
          >
            <button 
              onClick={() => setIsPortalModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
              aria-label="Cerrar Modal"
            >
              ✕
            </button>

            {/* Portal Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-[#FF030D]">
                <Key className="w-6 h-6 text-[#FF030D]" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-[#05087E] leading-tight">
                  Acceso a Portal Apoderados
                </h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Servicio de NAPSIS Chile</span>
              </div>
            </div>

            {/* Simulated Guidance */}
            <div className="space-y-4 text-xs text-gray-700 font-sans">
              <p className="leading-relaxed text-justify">
                Nuestra escuela utiliza la plataforma externa <strong>NAPSIS</strong> para la entrega en tiempo real de calificaciones, informes de personalidad, asistencia diaria y circulares firmadas electrónicamente.
              </p>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#05087E] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-[#05087E]">Instrucciones de Entrada:</strong>
                  <p className="text-[11px] text-gray-600 leading-normal">
                    El usuario inicial corresponde al <strong>RUT del Apoderado</strong> (sin puntos y con guion) y la contraseña inicial provista por secretaría durante la matrícula presencial.
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4 text-gray-500">
                <p className="font-bold text-gray-700">¿Problemas con sus accesos?</p>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-[#FF030D]" />
                  <span>Soporte Técnico Enlaces: +56 52 221 0844 (Anexo 4)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-blue-800" />
                  <span>Correo: soporte@escuelabernardoohiggins.cl</span>
                </div>
              </div>
            </div>

            {/* External Links Simulator Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsPortalModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-full text-xs text-center transition-all cursor-pointer"
              >
                Cerrar Ventana
              </button>
              <a
                href="https://napsis.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#05087E] hover:bg-blue-900 text-white font-bold py-3 rounded-full text-xs text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Ir a NAPSIS</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DIALOG: POLITICAS DE PRIVACIDAD */}
      {isPrivacyOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsPrivacyOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-[600px] w-full border border-gray-100 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-[#05087E]">
              <ShieldCheck className="w-6 h-6 text-[#FF030D]" />
              <h3 className="text-base font-display font-bold">Políticas de Privacidad y Protección de Datos</h3>
            </div>

            <div className="text-xs text-gray-700 space-y-3 font-sans leading-relaxed text-justify">
              <p>
                La <strong>Escuela Bernardo O'Higgins de Copiapó</strong> está firmemente comprometida con el resguardo de la privacidad de nuestros estudiantes, apoderados y personal de la comunidad. 
              </p>
              <p>
                De acuerdo con la <strong>Ley N° 19.628 sobre Protección de la Vida Privada de Chile</strong>, le informamos las siguientes directrices básicas:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Uso Confidencial:</strong> Toda información recopilada mediante formularios web (tales como pre-inscripción, contacto u opiniones) será tratada confidencialmente y se utilizará de forma exclusiva para fines de información escolar, orientación, visitas guiadas y respuestas personalizadas.
                </li>
                <li>
                  <strong>No Divulgación:</strong> Los datos recolectados no serán compartidos, cedidos ni comercializados a terceras partes bajo ninguna circunstancia externa al establecimiento, exceptuando requerimientos oficiales del Ministerio de Educación (MINEDUC) o de tribunales competentes.
                </li>
                <li>
                  <strong>Seguridad Tecnológica:</strong> Implementamos medidas administrativas y lógicas para evitar el robo, pérdida, manipulación o acceso no autorizado a los datos ingresados.
                </li>
                <li>
                  <strong>Derechos ARCO:</strong> En cualquier momento, los titulares de los datos (apoderados y tutores legales) podrán solicitar el acceso, rectificación, cancelación u oposición al tratamiento de sus datos escribiendo al correo <em>contacto@escuelabernardoohiggins.cl</em>.
                </li>
              </ul>
              <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-100 font-mono">
                Actualizado en Julio de 2026 • Dirección de Enlaces y Transparencia Escolar • Copiapó, Chile.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="w-full bg-[#05087E] text-white py-2.5 rounded-full text-xs font-bold hover:bg-blue-950 transition-all cursor-pointer"
              >
                Entendido y Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL DIALOG: TERMINOS DE USO */}
      {isTermsOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsTermsOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-[600px] w-full border border-gray-100 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsTermsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 text-[#05087E]">
              <HelpCircle className="w-6 h-6 text-[#FF030D]" />
              <h3 className="text-base font-display font-bold">Términos de Uso del Sitio Web</h3>
            </div>

            <div className="text-xs text-gray-700 space-y-3 font-sans leading-relaxed text-justify">
              <p>
                Al acceder y navegar por este sitio web oficial, usted acepta íntegramente las siguientes condiciones de uso responsable:
              </p>
              <ul className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Propiedad del Contenido:</strong> Los logos, insignias, hitos históricos, circulares, imágenes del establecimiento y descripciones son propiedad exclusiva de la <em>Escuela Bernardo O'Higgins</em> o han sido debidamente licenciados. Queda estrictamente prohibido su uso comercial o copia no autorizada.
                </li>
                <li>
                  <strong>Uso Adecuado del Formulario:</strong> Los usuarios se obligan a no proveer identidades falsas, ni RUTs adulterados, y a usar un lenguaje correcto y formal en sus consultas o postulaciones informativas de visitas.
                </li>
                <li>
                  <strong>Simulación y Enlaces:</strong> Los portales externos simulados (como NAPSIS y SAE) buscan guiar a los padres de familia y no eximen de las responsabilidades directas en los portales oficiales de dichos proveedores.
                </li>
                <li>
                  <strong>Límites de Responsabilidad:</strong> La escuela realiza el mayor esfuerzo por mantener la información curricular y noticias al día, pero no asume responsabilidad directa por cambios repentinos de fechas ministeriales fuera de nuestro control cívico.
                </li>
              </ul>
              <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-100 font-mono">
                Copiapó • Región de Atacama • República de Chile • Julio de 2026.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsTermsOpen(false)}
                className="w-full bg-[#05087E] text-white py-2.5 rounded-full text-xs font-bold hover:bg-blue-950 transition-all cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL DIALOG: ACCESO ADMINISTRADOR (LOGIN CMS) */}
      {isLoginOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsLoginOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-[400px] w-full border-2 border-[#FF030D] shadow-2xl relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Login Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 text-[#05087E] rounded-full flex items-center justify-center mx-auto border border-blue-100">
                <Lock className="w-5 h-5 text-[#05087E]" />
              </div>
              <h3 className="text-base font-display font-bold text-[#05087E]">
                Ingreso al Panel CMS Escolar
              </h3>
              <p className="text-[10px] text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                Ingrese las credenciales autorizadas del establecimiento para activar la edición en línea de contenidos.
              </p>
            </div>

            {/* Error Feedback */}
            {loginError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Credentials Info Note */}
            <div className="bg-slate-50 p-3 rounded-xl text-[10px] text-slate-600 space-y-1 border border-slate-200">
              <span className="font-bold text-slate-800">Credenciales de Acceso:</span>
              <p>• Usuario: <code className="bg-white px-1 border rounded text-[#05087E]">admin</code></p>
              <p>• Contraseña: <code className="bg-white px-1 border rounded text-[#FF030D]">copiapo_ohiggins</code></p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Usuario o Email</label>
                <input 
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Ej: admin"
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#05087E] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Contraseña de Red</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Contraseña del sistema"
                    className="w-full p-2.5 pr-10 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#05087E] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#05087E] hover:bg-blue-900 text-white py-3 rounded-full text-xs font-bold tracking-wide shadow-md transition-all cursor-pointer"
              >
                Autenticar Administrador
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL DIALOG: TU OPINIÓN NOS IMPORTA (FORMULARIO) */}
      {isOpinionOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in font-sans"
          onClick={() => setIsOpinionOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-[500px] w-full border border-gray-100 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpinionOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            {opinionSuccess ? (
              <div className="py-8 text-center space-y-3 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
                </div>
                <h4 className="text-base font-display font-bold text-[#05087E]">
                  ¡Muchas Gracias por su Opinión!
                </h4>
                <p className="text-xs text-gray-600 max-w-[340px] mx-auto leading-relaxed">
                  Su retroalimentación ha sido enviada al buzón institucional de la directiva escolar. Nos ayuda enormemente a mejorar continuamente la calidad de vida y convivencia en nuestra Escuela Bernardo O'Higgins.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="border-b border-gray-100 pb-3">
                  <span className="bg-[#FF030D] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Buzón Escolar de Opinión
                  </span>
                  <h3 className="text-base font-display font-bold text-[#05087E] mt-1.5">
                    Formulario "Tu Opinión Nos Importa"
                  </h3>
                  <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                    Escríbanos sus felicitaciones, sugerencias, reclamos o consultas. Puede hacerlo de forma totalmente anónima.
                  </p>
                </div>

                {/* Form Error */}
                {opinionError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 flex items-start gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{opinionError}</span>
                  </div>
                )}

                {/* Form body */}
                <form onSubmit={handleOpinionSubmit} className="space-y-3 text-xs">
                  
                  {/* Row 1: Nombre */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Nombre Completo (Opcional - Dejar vacío para anónimo)</label>
                    <input 
                      type="text"
                      value={opinionNombre}
                      onChange={(e) => setOpinionNombre(e.target.value)}
                      placeholder="Ej: Juan Francisco Tapia"
                      className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#05087E]"
                    />
                  </div>

                  {/* Row 2: Tipo de Opinión & Rol */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">Tipo de Opinión*</label>
                      <select
                        value={opinionTipo}
                        onChange={(e) => setOpinionTipo(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#05087E] cursor-pointer"
                      >
                        <option>Sugerencia</option>
                        <option>Felicitación</option>
                        <option>Reclamo</option>
                        <option>Consulta Directiva</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">Su Rol / Relación*</label>
                      <select
                        value={opinionRol}
                        onChange={(e) => setOpinionRol(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#05087E] cursor-pointer"
                      >
                        <option>Apoderado</option>
                        <option>Estudiante</option>
                        <option>Docente / Funcionario</option>
                        <option>Vecino de Copiapó</option>
                        <option>Otro</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: RUT & Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">RUT (Opcional para contacto)</label>
                      <input 
                        type="text"
                        value={opinionRut}
                        onChange={(e) => setOpinionRut(e.target.value)}
                        placeholder="Ej: 12.345.678-K"
                        className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#05087E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">Email de Contacto (Opcional)</label>
                      <input 
                        type="email"
                        value={opinionEmail}
                        onChange={(e) => setOpinionEmail(e.target.value)}
                        placeholder="Ej: micorreo@correo.cl"
                        className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#05087E]"
                      />
                    </div>
                  </div>

                  {/* Row 4: Detalle */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 font-sans">Escriba su sugerencia, reclamo o felicitación*</label>
                    <textarea 
                      required
                      rows={4}
                      value={opinionDetalle}
                      onChange={(e) => setOpinionDetalle(e.target.value)}
                      placeholder="Detalle de forma constructiva su opinión sobre las dependencias, talleres o el quehacer pedagógico de la escuela..."
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#05087E] text-xs"
                    />
                  </div>

                  {/* Consent checkbox */}
                  <div className="flex gap-2 items-start pt-1.5">
                    <input type="checkbox" required className="mt-0.5 accent-[#05087E]" defaultChecked />
                    <p className="text-[10px] text-gray-500 leading-normal">
                      Acepto que mis datos de opinión sean tratados confidencialmente bajo el resguardo de la <strong>Ley 19.628 de Protección de la Vida Privada de Chile</strong>.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsOpinionOpen(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-full text-xs font-bold text-center transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#FF030D] hover:bg-[#d8020a] text-white py-2.5 rounded-full text-xs font-bold text-center transition-all cursor-pointer"
                    >
                      Enviar Opinión
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

