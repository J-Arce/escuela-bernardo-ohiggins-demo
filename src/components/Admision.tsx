/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  FileText, Calendar, CheckCircle2, AlertCircle, Info, Landmark, 
  UserPlus, Mail, Phone, ShieldCheck, ClipboardList, HelpCircle, X,
  Cloud, Sparkles, BookOpen, GraduationCap, Users
} from 'lucide-react';
import { Postulacion } from '../types';
import InlineEdit from './InlineEdit';

interface AdmisionProps {
  onAddPostulacion: (postulacion: Omit<Postulacion, 'id' | 'fechaRegistro' | 'estado'>) => void;
  isAdminMode?: boolean;
}

// Generador inicial de cursos para poblar la base de datos
const generarCursosPorDefecto = () => {
  const cursos = [];
  ['Pre-Kinder', 'Kinder'].forEach(nivel => {
    ['A', 'B', 'C'].forEach(letra => cursos.push({ id: `${nivel}-${letra}`, ciclo: 'Parvularia', nivel, letra, profe: 'Por asignar', alumnos: '0', cupos: '0' }));
  });
  ['1° Básico', '2° Básico', '3° Básico', '4° Básico'].forEach(nivel => {
    ['A', 'B', 'C'].forEach(letra => cursos.push({ id: `${nivel}-${letra}`, ciclo: 'Basica1', nivel, letra, profe: 'Por asignar', alumnos: '0', cupos: '0' }));
  });
  ['5° Básico', '6° Básico', '7° Básico', '8° Básico'].forEach(nivel => {
    ['A', 'B'].forEach(letra => cursos.push({ id: `${nivel}-${letra}`, ciclo: 'Basica2', nivel, letra, profe: 'Por asignar', alumnos: '0', cupos: '0' }));
  });
  return cursos;
};

export default function Admision({ onAddPostulacion, isAdminMode = false }: AdmisionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- ESTADOS DE TÍTULOS EDITABLES (Para cambiar los años) ---
  const [tituloAdmision, setTituloAdmision] = useState("Proceso de Admisión 2026");
  const [tituloCalendario, setTituloCalendario] = useState("Calendario de Postulaciones 2026");
  const [tituloCursos, setTituloCursos] = useState("Niveles y Vacantes 2026");

  // Estados de Textos Editables Firebase
  const [headerDesc, setHeaderDesc] = useState("Te acompañamos paso a paso en el proceso de inscripción y matrícula oficial bajo el Sistema de Admisión Escolar (SAE) del Gobierno de Chile.");
  const [arancelesDesc1, setArancelesDesc1] = useState("La Escuela Bernardo O'Higgins es un establecimiento municipalizado dependiente de los nuevos servicios locales, lo que garantiza 100% de gratuidad escolar. No cobramos derecho de examen, cuota de incorporación, mensualidades ni matrículas.");
  const [arancelesDesc2, setArancelesDesc2] = useState("Todos nuestros alumnos se benefician del financiamiento de la Subvención Escolar Preferencial (SEP) y el Programa de Alimentación Escolar (JUNAEB), asegurando desayuno, almuerzo, útiles escolares y computadores (según programas ministeriales).");
  
  const [cronograma, setCronograma] = useState([
    { id: 'paso-1', paso: '1', titulo: 'Postulación SAE (Ministerio)', desc: 'Durante el período correspondiente, el apoderado debe ingresar al sitio oficial www.sistemadeadmisionescolar.cl y seleccionar la Escuela Bernardo O\'Higgins como primera opción.', fecha: '02/08/2026 al 30/08/2026' },
    { id: 'paso-2', paso: '2', titulo: 'Resultados y Listas', desc: 'El MINEDUC publicará las listas de estudiantes aceptados según los criterios del algoritmo oficial (hermanos en el establecimiento, prioridad de cercanía, etc.).', fecha: '16/10/2026 al 22/10/2026' },
    { id: 'paso-3', paso: '3', titulo: 'Matrícula Presencial', desc: 'Los apoderados aceptados deben concurrir presencialmente a la Secretaría de nuestra escuela en Copiapó para firmar el registro de matrícula y entregar documentos.', fecha: '11/12/2026 al 22/12/2026' }
  ]);

  const [requisitosNivel, setRequisitosNivel] = useState([
    { id: 'req-1', nivel: 'Pre-Kinder', edad: '4 años cumplidos al 31 de marzo de 2026.', docs: ['Certificado de nacimiento para matrícula (gratuito en Registro Civil).', 'Fotocopia de Cédula de Identidad del apoderado.', 'Carnet de control de niño sano al día.'] },
    { id: 'req-2', nivel: 'Kinder', edad: '5 años cumplidos al 31 de marzo de 2026.', docs: ['Certificado de nacimiento para matrícula.', 'Fotocopia de Cédula de Identidad del apoderado.'] },
    { id: 'req-3', nivel: '1° a 8° Año Básico', edad: '6 años cumplidos al 31 de marzo de 2026 (para 1° básico).', docs: ['Certificado de nacimiento para matrícula.', 'Certificado de promoción del año escolar anterior.', 'Informe de personalidad del colegio anterior (opcional).'] }
  ]);

  const [cursos, setCursos] = useState<any[]>([]);

  // Contador de visitas
  const [visitasRealizadas, setVisitasRealizadas] = useState(0);

  // Form State
  const [rut, setRut] = useState('');
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nivel, setNivel] = useState('Pre-Kinder');
  const [nombreApoderado, setNombreApoderado] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Conexión a Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "paginas", "admision");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.tituloAdmision) setTituloAdmision(data.tituloAdmision);
          if (data.tituloCalendario) setTituloCalendario(data.tituloCalendario);
          if (data.tituloCursos) setTituloCursos(data.tituloCursos);

          if (data.headerDesc) setHeaderDesc(data.headerDesc);
          if (data.arancelesDesc1) setArancelesDesc1(data.arancelesDesc1);
          if (data.arancelesDesc2) setArancelesDesc2(data.arancelesDesc2);
          if (data.cronograma) setCronograma(data.cronograma);
          if (data.requisitosNivel) setRequisitosNivel(data.requisitosNivel);
          if (data.visitasRealizadas !== undefined) setVisitasRealizadas(data.visitasRealizadas);
          
          if (data.cursos && data.cursos.length > 0) {
            setCursos(data.cursos);
          } else {
            const defaults = generarCursosPorDefecto();
            setCursos(defaults);
            saveToFirebase('cursos', defaults);
          }
        } else {
          const defaults = generarCursosPorDefecto();
          setCursos(defaults);
          saveToFirebase('cursos', defaults);
        }
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const saveToFirebase = async (campo: string, valor: any) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "paginas", "admision"), { [campo]: valor }, { merge: true });
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  const handleUpdateCurso = (id: string, campo: string, valor: string) => {
    const nuevos = cursos.map(c => c.id === id ? { ...c, [campo]: valor } : c);
    setCursos(nuevos); saveToFirebase('cursos', nuevos);
  };

  const handleUpdateCronograma = (id: string, campo: string, valor: string) => {
    const nuevos = cronograma.map(c => c.id === id ? { ...c, [campo]: valor } : c);
    setCronograma(nuevos); saveToFirebase('cronograma', nuevos);
  };

  const handleUpdateRequisito = (id: string, campo: string, valor: string, docIndex?: number) => {
    const nuevos = requisitosNivel.map(r => {
      if (r.id === id) {
        if (campo === 'docs' && typeof docIndex === 'number') {
          const newDocs = [...r.docs];
          newDocs[docIndex] = valor;
          return { ...r, docs: newDocs };
        }
        return { ...r, [campo]: valor };
      }
      return r;
    });
    setRequisitosNivel(nuevos); saveToFirebase('requisitosNivel', nuevos);
  };

  // Validaciones y Submit
  const validateRut = (rutStr: string) => {
    const cleanRut = rutStr.replace(/[^0-9kK]/g, '').toUpperCase();
    if (cleanRut.length < 8 || cleanRut.length > 9) return false;
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    let sum = 0; let mul = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    const dvr = 11 - (sum % 11);
    let expectedDv = '';
    if (dvr === 11) expectedDv = '0';
    else if (dvr === 10) expectedDv = 'K';
    else expectedDv = String(dvr);
    return expectedDv === dv;
  };

  const formatRut = (value: string) => {
    const clean = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (!clean) return '';
    if (clean.length === 1) return clean;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedBody}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRut(formatRut(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefono(e.target.value);
  };

  const validatePhone = (phoneStr: string) => {
    const cleanPhone = phoneStr.replace(/\s+/g, '');
    const phonePattern = /^(\+?56)?9\d{8}$/;
    return phonePattern.test(cleanPhone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!nombreEstudiante.trim()) newErrors.nombreEstudiante = 'El nombre del estudiante es obligatorio.';
    if (!fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    if (!nombreApoderado.trim()) newErrors.nombreApoderado = 'El nombre del apoderado es obligatorio.';
    
    if (!telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio.';
    else if (!validatePhone(telefono)) newErrors.telefono = 'Ingrese un teléfono chileno válido.';

    if (!email.trim() || !email.includes('@')) newErrors.email = 'Ingrese un correo electrónico válido.';
    
    if (!rut.trim()) newErrors.rut = 'El RUT del estudiante es obligatorio.';
    else if (!validateRut(rut)) newErrors.rut = 'Ingrese un RUT válido.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(`input-${firstError}`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    
    onAddPostulacion({
      rutEstudiante: rut, nombreEstudiante, fechaNacimiento, nivel, nombreApoderado, telefono, email
    });

    setSubmitSuccess(true); setShowToast(true);
    
    setRut(''); setNombreEstudiante(''); setFechaNacimiento(''); setNivel('Pre-Kinder');
    setNombreApoderado(''); setTelefono(''); setEmail('');

    setTimeout(() => { setShowToast(false); }, 5000);
  };

  if (isLoading) return <div className="text-center py-20 font-bold text-[#05087E]">Cargando Admisión...</div>;

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="admission-view">
      
      {isAdminMode && (
        <div className={`fixed bottom-4 right-4 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold shadow-lg z-50 ${isSaving ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
          <Cloud className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Base de Datos Conectada'}
        </div>
      )}

      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Únete a nosotros</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          <InlineEdit value={tituloAdmision} onSave={(v) => { setTituloAdmision(v); saveToFirebase('tituloAdmision', v); }} isEditMode={isAdminMode} />
        </h2>
        <div className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto leading-relaxed">
          <InlineEdit value={headerDesc} onSave={(v) => { setHeaderDesc(v); saveToFirebase('headerDesc', v); }} isEditMode={isAdminMode} multiline={true} />
        </div>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* 1. ARANCELES Y GRATUIDAD */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-3xl border border-blue-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="fees-section">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 bg-[#05087E] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
            <Landmark className="w-3.5 h-3.5 text-[#FF030D]" />
            <span>Establecimiento Público Gratuito</span>
          </div>
          <h3 className="text-xl font-display font-bold text-[#05087E]">Aranceles, Copago y Becas Especiales</h3>
          <div className="text-xs text-gray-700 leading-relaxed font-sans text-justify space-y-3">
            <InlineEdit value={arancelesDesc1} onSave={(v) => { setArancelesDesc1(v); saveToFirebase('arancelesDesc1', v); }} isEditMode={isAdminMode} multiline={true} />
            <br />
            <InlineEdit value={arancelesDesc2} onSave={(v) => { setArancelesDesc2(v); saveToFirebase('arancelesDesc2', v); }} isEditMode={isAdminMode} multiline={true} />
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-blue-200 text-center space-y-3 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="text-xs font-display font-bold text-gray-900 uppercase">Matrícula & Mensualidad</h4>
          <span className="text-3xl font-display font-extrabold text-emerald-600 block">$0</span>
          <p className="text-[10px] text-gray-500 font-medium">Establecimiento Gratuito Adherido a la Ley de Inclusión Escolar</p>
        </div>
      </section>

      {/* 2. CRONOGRAMA OFICIAL SAE */}
      <section className="space-y-6" id="sae-timeline-section">
        <div className="text-center md:text-left">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Cronograma</span>
          <h3 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
            <InlineEdit value={tituloCalendario} onSave={(v) => { setTituloCalendario(v); saveToFirebase('tituloCalendario', v); }} isEditMode={isAdminMode} />
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cronograma.map((step) => (
            <div key={step.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative mt-3 md:mt-0">
              <span className="absolute -top-3 -left-3 w-8 h-8 bg-[#FF030D] text-white rounded-full flex items-center justify-center font-display font-bold text-xs shadow-md">
                {step.paso}
              </span>
              <div className="space-y-3 pt-2">
                <span className="text-[10px] text-[#05087E] font-bold tracking-wide uppercase block">
                  <InlineEdit value={step.fecha} onSave={(v) => handleUpdateCronograma(step.id, 'fecha', v)} isEditMode={isAdminMode} />
                </span>
                <h4 className="text-sm font-display font-bold text-[#05087E]">
                  <InlineEdit value={step.titulo} onSave={(v) => handleUpdateCronograma(step.id, 'titulo', v)} isEditMode={isAdminMode} />
                </h4>
                <div className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
                  <InlineEdit value={step.desc} onSave={(v) => handleUpdateCronograma(step.id, 'desc', v)} isEditMode={isAdminMode} multiline={true} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. REQUISITOS POR NIVEL */}
      <section className="bg-[#F8F9FA] p-8 rounded-3xl border border-gray-100 space-y-6" id="requirements-section">
        <div className="text-center md:text-left">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Requerimientos</span>
          <h3 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">Requisitos de Edad y Documentos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requisitosNivel.map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-xl border border-gray-100 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-display font-bold text-[#05087E] uppercase tracking-wide">
                  <InlineEdit value={req.nivel} onSave={(v) => handleUpdateRequisito(req.id, 'nivel', v)} isEditMode={isAdminMode} />
                </h4>
                <div className="flex items-start gap-1 text-[11px] text-gray-500 font-medium">
                  <Info className="w-3.5 h-3.5 text-[#FF030D] shrink-0 mt-0.5" />
                  <span className="flex-1">
                    <InlineEdit value={req.edad} onSave={(v) => handleUpdateRequisito(req.id, 'edad', v)} isEditMode={isAdminMode} multiline={true} />
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-50 pt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Documentos a Presentar:</span>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {req.docs.map((doc, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-1.5 leading-normal">
                      <FileText className="w-3.5 h-3.5 text-[#05087E] shrink-0 mt-0.5" />
                      <span className="flex-1">
                        <InlineEdit value={doc} onSave={(v) => handleUpdateRequisito(req.id, 'docs', v, dIdx)} isEditMode={isAdminMode} multiline={true} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN NUEVA: NIVELES Y VACANTES */}
      <section className="space-y-8 pt-4">
        <div className="text-center md:text-left">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Disponibilidad</span>
          <h3 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
             <InlineEdit value={tituloCursos} onSave={(v) => { setTituloCursos(v); saveToFirebase('tituloCursos', v); }} isEditMode={isAdminMode} />
          </h3>
        </div>

        {/* Parvulario (Diseño Entretenido pero ahora en Bloques cómodos) */}
        <div className="bg-gradient-to-br from-amber-50 to-pink-50 p-6 md:p-8 rounded-3xl border border-amber-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-amber-600">
            <Sparkles className="w-6 h-6" />
            <h4 className="text-xl font-display font-extrabold text-amber-900">Educación Parvularia</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cursos.filter(c => c.ciclo === 'Parvularia' || c.ciclo === 'Educación Parvularia').map(curso => (
              <div key={curso.id} className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border-2 border-amber-200 hover:border-pink-300 transition-colors shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-amber-100 opacity-50 pointer-events-none"><Sparkles className="w-16 h-16" /></div>
                
                <h5 className="font-extrabold text-base text-amber-900 mb-3 border-b border-amber-100 pb-2 relative z-10">
                  {curso.nivel} {curso.letra}
                </h5>
                
                <div className="space-y-2 text-[11px] font-medium text-gray-700 relative z-10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400">Profesor(a):</span>
                    <InlineEdit value={curso.profe} onSave={(v) => handleUpdateCurso(curso.id, 'profe', v)} isEditMode={isAdminMode} className="text-gray-800" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-50">
                    <div className="bg-white border border-amber-100 p-2 rounded-lg text-center">
                      <span className="block text-[9px] text-gray-400 uppercase">Alumnos</span>
                      <InlineEdit value={curso.alumnos} onSave={(v) => handleUpdateCurso(curso.id, 'alumnos', v)} isEditMode={isAdminMode} className="font-bold text-sm text-gray-800" />
                    </div>
                    <div className="bg-amber-100 p-2 rounded-lg text-center text-amber-900">
                      <span className="block text-[9px] uppercase">Cupos Libres</span>
                      <InlineEdit value={curso.cupos} onSave={(v) => handleUpdateCurso(curso.id, 'cupos', v)} isEditMode={isAdminMode} className="font-bold text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1° a 4° Básico (Diseño Fresco) */}
        <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 md:p-8 rounded-3xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-emerald-600">
            <BookOpen className="w-6 h-6" />
            <h4 className="text-xl font-display font-extrabold text-emerald-900">Primer Ciclo (1° a 4° Básico)</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cursos.filter(c => c.ciclo === 'Basica1' || c.ciclo === '1° a 4° Básico').map(curso => (
              <div key={curso.id} className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm">
                <h5 className="font-extrabold text-base text-emerald-900 mb-3 border-b border-emerald-100 pb-2">{curso.nivel} {curso.letra}</h5>
                <div className="space-y-2 text-[11px] font-medium text-gray-700">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400">Profesor Jefe:</span>
                    <InlineEdit value={curso.profe} onSave={(v) => handleUpdateCurso(curso.id, 'profe', v)} isEditMode={isAdminMode} className="text-gray-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                    <div className="bg-gray-50 p-2 rounded-lg text-center">
                      <span className="block text-[9px] text-gray-400 uppercase">Alumnos</span>
                      <InlineEdit value={curso.alumnos} onSave={(v) => handleUpdateCurso(curso.id, 'alumnos', v)} isEditMode={isAdminMode} className="font-bold text-sm" />
                    </div>
                    <div className="bg-emerald-100 p-2 rounded-lg text-center text-emerald-800">
                      <span className="block text-[9px] uppercase">Cupos</span>
                      <InlineEdit value={curso.cupos} onSave={(v) => handleUpdateCurso(curso.id, 'cupos', v)} isEditMode={isAdminMode} className="font-bold text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5° a 8° Básico (Diseño Formal) */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-3xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-[#05087E]">
            <GraduationCap className="w-6 h-6" />
            <h4 className="text-xl font-display font-extrabold text-[#05087E]">Segundo Ciclo (5° a 8° Básico)</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cursos.filter(c => c.ciclo === 'Basica2' || c.ciclo === '5° a 8° Básico').map(curso => (
              <div key={curso.id} className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
                <h5 className="font-extrabold text-base text-[#05087E] mb-3 border-b border-blue-100 pb-2">{curso.nivel} {curso.letra}</h5>
                <div className="space-y-2 text-[11px] font-medium text-gray-700">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400">Profesor Jefe:</span>
                    <InlineEdit value={curso.profe} onSave={(v) => handleUpdateCurso(curso.id, 'profe', v)} isEditMode={isAdminMode} className="text-gray-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                    <div className="bg-gray-50 p-2 rounded-lg text-center">
                      <span className="block text-[9px] text-gray-400 uppercase">Alumnos</span>
                      <InlineEdit value={curso.alumnos} onSave={(v) => handleUpdateCurso(curso.id, 'alumnos', v)} isEditMode={isAdminMode} className="font-bold text-sm" />
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg text-center text-blue-900">
                      <span className="block text-[9px] uppercase">Cupos</span>
                      <InlineEdit value={curso.cupos} onSave={(v) => handleUpdateCurso(curso.id, 'cupos', v)} isEditMode={isAdminMode} className="font-bold text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-[#05087E] text-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-blue-400 animate-fade-in font-sans">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">¡Solicitud de Visita Enviada!</p>
            <p className="text-gray-300 text-[10px]">Nos contactaremos a la brevedad.</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-white hover:text-gray-300 ml-2 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. FORMULARIO DE VISITA GUIADA Y CONTADOR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="pre-registration-form-section">
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2.5 text-[#05087E]">
            <UserPlus className="w-6 h-6 text-[#FF030D]" />
            <h3 className="text-xl font-display font-bold">Formulario de Visita Guiada</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed font-sans text-justify">
            ¿Le gustaría conocer nuestras dependencias tecnológicas, salas recreativas, el casino JUNAEB o la biblioteca CRA? Rellene este formulario para coordinar una visita guiada acompañada por nuestro equipo docente.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-3">
            <Info className="w-7 h-7 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 space-y-1 leading-relaxed">
              <strong className="font-bold">Información Importante:</strong>
              <p>Este formulario coordina una visita y pre-inscripción de carácter meramente informativo para la familia. La matrícula oficial se realiza exclusivamente a través del Sistema de Admisión Escolar (SAE) del MINEDUC.</p>
            </div>
          </div>

          {/* CONTADOR DE VISITAS REALIZADAS */}
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl font-display font-extrabold text-emerald-700 leading-none">{visitasRealizadas}</span>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mt-1">Familias ya han visitado nuestra escuela</p>
              </div>
            </div>
          </div>

        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative font-sans" id="admission-form">
          {submitSuccess && (
            <div className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h4 className="text-lg font-display font-bold text-[#05087E]">¡Visita Solicitada con Éxito!</h4>
              <p className="text-xs text-gray-600 mt-2 max-w-[400px] leading-relaxed">
                Su solicitud ha sido registrada bajo la Ley de Transparencia escolar. El equipo de secretaría se contactará a la brevedad vía telefónica o e-mail para confirmar el horario.
              </p>
              <button onClick={() => setSubmitSuccess(false)} className="mt-6 bg-[#05087E] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-900 transition-colors cursor-pointer">
                Solicitar Otra Visita
              </button>
            </div>
          )}

          <h4 className="text-base font-display font-bold text-[#05087E] mb-6">Agendar Visita Guiada Establecimiento</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">RUT del Estudiante*</label>
                <input type="text" value={rut} onChange={handleRutChange} placeholder="Ej: 12.345.678-K" className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${errors.rut ? 'border-red-500' : 'border-gray-200'}`} id="input-rut" />
                {errors.rut && <span className="text-[10px] text-red-500 block">{errors.rut}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Nombre Completo Estudiante*</label>
                <input type="text" value={nombreEstudiante} onChange={(e) => setNombreEstudiante(e.target.value)} placeholder="Ej: Ignacio Andrés Tapia Díaz" className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${errors.nombreEstudiante ? 'border-red-500' : 'border-gray-200'}`} id="input-nombreEstudiante" />
                {errors.nombreEstudiante && <span className="text-[10px] text-red-500 block">{errors.nombreEstudiante}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Fecha Nacimiento Estudiante*</label>
                <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${errors.fechaNacimiento ? 'border-red-500' : 'border-gray-200'}`} id="input-fechaNacimiento" />
                {errors.fechaNacimiento && <span className="text-[10px] text-red-500 block">{errors.fechaNacimiento}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Nivel del Estudiante*</label>
                <select value={nivel} onChange={(e) => setNivel(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none cursor-pointer" id="input-nivel">
                  <option>Pre-Kinder</option><option>Kinder</option><option>1° Año Básico</option><option>2° Año Básico</option><option>3° Año Básico</option><option>4° Año Básico</option><option>5° Año Básico</option><option>6° Año Básico</option><option>7° Año Básico</option><option>8° Año Básico</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Nombre del Apoderado Responsable*</label>
              <input type="text" value={nombreApoderado} onChange={(e) => setNombreApoderado(e.target.value)} placeholder="Ej: Carolina Díaz Rojas" className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${errors.nombreApoderado ? 'border-red-500' : 'border-gray-200'}`} id="input-nombreApoderado" />
              {errors.nombreApoderado && <span className="text-[10px] text-red-500 block">{errors.nombreApoderado}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Teléfono de Contacto*</label>
                <input type="tel" value={telefono} onChange={handlePhoneChange} placeholder="Ej: +56 9 8765 4321" className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${errors.telefono ? 'border-red-500' : 'border-gray-200'}`} id="input-telefono" />
                {errors.telefono && <span className="text-[10px] text-red-500 block">{errors.telefono}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Correo Electrónico Apoderado*</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ej: apoderado@correo.cl" className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`} id="input-email" />
                {errors.email && <span className="text-[10px] text-red-500 block">{errors.email}</span>}
              </div>
            </div>

            <div className="flex gap-2 items-start pt-2">
              <input type="checkbox" required className="mt-0.5 accent-[#05087E]" defaultChecked />
              <p className="text-[10px] text-gray-500 leading-normal">
                Consiento expresamente que mis datos de contacto sean tratados con estricta confidencialidad bajo la <strong>Ley N° 19.628 de Protección de la Vida Privada de Chile</strong>, con el exclusivo fin de coordinar la visita y orientar vacantes.
              </p>
            </div>

            <button type="submit" className="w-full bg-[#FF030D] hover:bg-[#d8020a] text-white py-3 rounded-full text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all mt-4 cursor-pointer" id="submit-pre-inscription-btn">
              Enviar Solicitud de Visita Guiada
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}