/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Calendar, CheckCircle2, AlertCircle, Info, Landmark, 
  UserPlus, Mail, Phone, ShieldCheck, ClipboardList, HelpCircle, X
} from 'lucide-react';
import { Postulacion } from '../types';

interface AdmisionProps {
  onAddPostulacion: (postulacion: Omit<Postulacion, 'id' | 'fechaRegistro' | 'estado'>) => void;
}

export default function Admision({ onAddPostulacion }: AdmisionProps) {
  // Form State
  const [rut, setRut] = useState('');
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nivel, setNivel] = useState('Pre-Kinder');
  const [nombreApoderado, setNombreApoderado] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  // Status & Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Chilean RUT Validator with DV check (Algoritmo Módulo 11)
  const validateRut = (rutStr: string) => {
    const cleanRut = rutStr.replace(/[^0-9kK]/g, '').toUpperCase();
    if (cleanRut.length < 8 || cleanRut.length > 9) return false;
    
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    
    let sum = 0;
    let mul = 2;
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

  // Chilean RUT Formatter on-the-fly (e.g. 12.345.678-K)
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
    const formatted = formatRut(e.target.value);
    setRut(formatted);
  };

  // Chilean Phone Validator (Starts with +569 or 9 and has 9 digits)
  const validatePhone = (phoneStr: string) => {
    const cleanPhone = phoneStr.replace(/\s+/g, '');
    const phonePattern = /^(\+?56)?9\d{8}$/;
    return phonePattern.test(cleanPhone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Auto prefix +56 9 if they type a 9-digit number without it, or keep it formatted
    setTelefono(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!nombreEstudiante.trim()) newErrors.nombreEstudiante = 'El nombre del estudiante es obligatorio.';
    if (!fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    if (!nombreApoderado.trim()) newErrors.nombreApoderado = 'El nombre del apoderado es obligatorio.';
    
    if (!telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
    } else if (!validatePhone(telefono)) {
      newErrors.telefono = 'Ingrese un teléfono chileno válido (Ej: +56 9 1234 5678 o 912345678).';
    }

    if (!email.trim() || !email.includes('@')) newErrors.email = 'Ingrese un correo electrónico válido.';
    
    if (!rut.trim()) {
      newErrors.rut = 'El RUT del estudiante es obligatorio.';
    } else if (!validateRut(rut)) {
      newErrors.rut = 'Ingrese un RUT válido con dígito verificador (Ej: 12.345.678-K).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(`input-${firstError}`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    
    // Send data to global mock state
    onAddPostulacion({
      rutEstudiante: rut,
      nombreEstudiante,
      fechaNacimiento,
      nivel,
      nombreApoderado,
      telefono,
      email
    });

    setSubmitSuccess(true);
    setShowToast(true);
    
    // Clear inputs
    setRut('');
    setNombreEstudiante('');
    setFechaNacimiento('');
    setNivel('Pre-Kinder');
    setNombreApoderado('');
    setTelefono('');
    setEmail('');

    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const cronogramaAdmision = [
    { paso: '1', titulo: 'Postulación SAE (Ministerio)', desc: <>Durante el período correspondiente, el apoderado debe ingresar al sitio oficial <a href="https://www.sistemadeadmisionescolar.cl" target="_blank" rel="noopener noreferrer" className="text-[#FF030D] hover:underline font-bold">www.sistemadeadmisionescolar.cl</a> y seleccionar la Escuela Bernardo O'Higgins como primera opción.</>, fecha: '02/08/2026 al 30/08/2026' },
    { paso: '2', titulo: 'Resultados y Listas', desc: 'El MINEDUC publicará las listas de estudiantes aceptados según los criterios del algoritmo oficial (hermanos en el establecimiento, prioridad de cercanía, etc.).', fecha: '16/10/2026 al 22/10/2026' },
    { paso: '3', titulo: 'Matrícula Presencial', desc: 'Los apoderados aceptados deben concurrir presencialmente a la Secretaría de nuestra escuela en Copiapó para firmar el registro de matrícula y entregar documentos.', fecha: '11/12/2026 al 22/12/2026' }
  ];

  const requisitosNivel = [
    { nivel: 'Pre-Kinder', edad: '4 años cumplidos al 31 de marzo de 2027.', docs: ['Certificado de nacimiento para matrícula (gratuito en Registro Civil).', 'Fotocopia de Cédula de Identidad del apoderado.', 'Carnet de control de niño sano al día.'] },
    { nivel: 'Kinder', edad: '5 años cumplidos al 31 de marzo de 2027.', docs: ['Certificado de nacimiento para matrícula.', 'Fotocopia de Cédula de Identidad del apoderado.'] },
    { nivel: '1° a 8° Año Básico', edad: '6 años cumplidos al 31 de marzo de 2027 (para 1° básico).', docs: ['Certificado de nacimiento para matrícula.', 'Certificado de promoción del año escolar anterior.', 'Informe de personalidad del colegio anterior (opcional).'] }
  ];

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="admission-view">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Únete a nosotros</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Proceso de Admisión 2027
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto">
          Te acompañamos paso a paso en el proceso de inscripción y matrícula oficial bajo el Sistema de Admisión Escolar (SAE) del Gobierno de Chile.
        </p>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* 1. ARANCELES Y GRATUIDAD (Chile Municipal Context) */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-3xl border border-blue-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="fees-section">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 bg-[#05087E] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
            <Landmark className="w-3.5 h-3.5 text-[#FF030D]" />
            <span>Establecimiento Público Gratuito</span>
          </div>
          <h3 className="text-xl font-display font-bold text-[#05087E]">
            Aranceles, Copago y Becas Especiales
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed font-sans text-justify">
            La Escuela Bernardo O'Higgins es un establecimiento municipalizado dependiente de los nuevos servicios locales, lo que garantiza <strong>100% de gratuidad escolar</strong>. No cobramos derecho de examen, cuota de incorporación, mensualidades ni matrículas.
          </p>
          <p className="text-xs text-gray-700 leading-relaxed font-sans text-justify">
            Todos nuestros alumnos se benefician del financiamiento de la <strong>Subvención Escolar Preferencial (SEP)</strong> y el Programa de Alimentación Escolar (JUNAEB), asegurando desayuno, almuerzo, útiles escolares y computadores (según programas ministeriales).
          </p>
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
            Calendario de Postulaciones 2027
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cronogramaAdmision.map((step) => (
            <div key={step.paso} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
              <span className="absolute -top-3 -left-3 w-8 h-8 bg-[#FF030D] text-white rounded-full flex items-center justify-center font-display font-bold text-xs shadow-md">
                {step.paso}
              </span>
              <div className="space-y-3 pt-2">
                <span className="text-[10px] text-[#05087E] font-bold tracking-wide uppercase block">
                  {step.fecha}
                </span>
                <h4 className="text-sm font-display font-bold text-[#05087E]">
                  {step.titulo}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans text-justify">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. REQUISITOS POR NIVEL */}
      <section className="bg-[#F8F9FA] p-8 rounded-3xl border border-gray-100 space-y-6" id="requirements-section">
        <div className="text-center md:text-left">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Requerimientos</span>
          <h3 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
            Requisitos de Edad y Documentos
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requisitosNivel.map((req, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-display font-bold text-[#05087E] uppercase tracking-wide">
                  Nivel {req.nivel}
                </h4>
                <div className="flex items-start gap-1 text-[11px] text-gray-500 font-medium">
                  <Info className="w-3.5 h-3.5 text-[#FF030D] shrink-0 mt-0.5" />
                  <span>Edad: {req.edad}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-50 pt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Documentos a Presentar:</span>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {req.docs.map((doc, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-1.5 leading-normal">
                      <FileText className="w-3.5 h-3.5 text-[#05087E] shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
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
          <button 
            onClick={() => setShowToast(false)}
            className="text-white hover:text-gray-300 ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. FORMULARIO DE VISITA GUIADA (formerly pre-inscripción online) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="pre-registration-form-section">
        {/* Info Left */}
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
        </div>

        {/* Form Right */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative font-sans" id="admission-form">
          {submitSuccess && (
            <div className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h4 className="text-lg font-display font-bold text-[#05087E]">
                ¡Visita Solicitada con Éxito!
              </h4>
              <p className="text-xs text-gray-600 mt-2 max-w-[400px] leading-relaxed">
                Su solicitud ha sido registrada bajo la Ley de Transparencia escolar. El equipo de secretaría (o la Prof. Judith) se contactará a la brevedad vía telefónica o e-mail para confirmar el horario.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-6 bg-[#05087E] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-900 transition-colors cursor-pointer"
              >
                Solicitar Otra Visita
              </button>
            </div>
          )}

          <h4 className="text-base font-display font-bold text-[#05087E] mb-6">Agendar Visita Guiada Establecimiento</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: Student Name & RUT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">RUT del Estudiante*</label>
                <input
                  type="text"
                  value={rut}
                  onChange={handleRutChange}
                  placeholder="Ej: 12.345.678-K"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                    errors.rut ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="input-rut"
                />
                {errors.rut && <span className="text-[10px] text-red-500 block">{errors.rut}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Nombre Completo Estudiante*</label>
                <input
                  type="text"
                  value={nombreEstudiante}
                  onChange={(e) => setNombreEstudiante(e.target.value)}
                  placeholder="Ej: Ignacio Andrés Tapia Díaz"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                    errors.nombreEstudiante ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="input-nombreEstudiante"
                />
                {errors.nombreEstudiante && <span className="text-[10px] text-red-500 block">{errors.nombreEstudiante}</span>}
              </div>
            </div>

            {/* Row 2: Date Birth & Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Fecha Nacimiento Estudiante*</label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                    errors.fechaNacimiento ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="input-fechaNacimiento"
                />
                {errors.fechaNacimiento && <span className="text-[10px] text-red-500 block">{errors.fechaNacimiento}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Nivel del Estudiante*</label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none cursor-pointer"
                  id="input-nivel"
                >
                  <option>Pre-Kinder</option>
                  <option>Kinder</option>
                  <option>1° Año Básico</option>
                  <option>2° Año Básico</option>
                  <option>3° Año Básico</option>
                  <option>4° Año Básico</option>
                  <option>5° Año Básico</option>
                  <option>6° Año Básico</option>
                  <option>7° Año Básico</option>
                  <option>8° Año Básico</option>
                </select>
              </div>
            </div>

            {/* Row 3: Guardian Details */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Nombre del Apoderado Responsable*</label>
              <input
                type="text"
                value={nombreApoderado}
                onChange={(e) => setNombreApoderado(e.target.value)}
                placeholder="Ej: Carolina Díaz Rojas"
                className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                  errors.nombreApoderado ? 'border-red-500' : 'border-gray-200'
                }`}
                id="input-nombreApoderado"
              />
              {errors.nombreApoderado && <span className="text-[10px] text-red-500 block">{errors.nombreApoderado}</span>}
            </div>

            {/* Row 4: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Teléfono de Contacto (Celular chileno)*</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={handlePhoneChange}
                  placeholder="Ej: +56 9 8765 4321 o 987654321"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                    errors.telefono ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="input-telefono"
                />
                {errors.telefono && <span className="text-[10px] text-red-500 block">{errors.telefono}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Correo Electrónico Apoderado*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: apoderado@correo.cl"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="input-email"
                />
                {errors.email && <span className="text-[10px] text-red-500 block">{errors.email}</span>}
              </div>
            </div>

            <div className="flex gap-2 items-start pt-2">
              <input type="checkbox" required className="mt-0.5 accent-[#05087E]" defaultChecked />
              <p className="text-[10px] text-gray-500 leading-normal">
                Consiento expresamente que mis datos de contacto sean tratados con estricta confidencialidad bajo la <strong>Ley N° 19.628 de Protección de la Vida Privada de Chile</strong>, con el exclusivo fin de coordinar la visita y orientar vacantes.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF030D] hover:bg-[#d8020a] text-white py-3 rounded-full text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all mt-4 cursor-pointer"
              id="submit-pre-inscription-btn"
            >
              Enviar Solicitud de Visita Guiada
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
