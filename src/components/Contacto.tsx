/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Info, 
  Map, ZoomIn, ZoomOut, Navigation, Star, ShieldCheck, Clock 
} from 'lucide-react';
import { MensajeContacto } from '../types';

interface ContactoProps {
  onAddMessage: (mensaje: Omit<MensajeContacto, 'id' | 'fecha'>) => void;
}

export default function Contacto({ onAddMessage }: ContactoProps) {
  // Form State
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [asunto, setAsunto] = useState('Consulta General');
  const [mensaje, setMensaje] = useState('');

  // Status State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [mapZoom, setMapZoom] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Ingrese un correo electrónico válido.';
    if (!telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio.';
    if (!mensaje.trim()) newErrors.mensaje = 'Por favor, escriba su mensaje.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Send to parent mock state
    onAddMessage({
      nombre,
      email,
      telefono,
      asunto,
      mensaje
    });

    setSuccess(true);
    setNombre('');
    setEmail('');
    setTelefono('');
    setAsunto('Consulta General');
    setMensaje('');

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  const directorios = [
    { depto: 'Secretaría & Recepción', tel: '+56 52 221 0844', email: 'contacto@escuelabernardoohiggins.cl' },
    { depto: 'Admisión SAE (Encargada)', tel: '+56 52 221 0845', email: 'admision@escuelabernardoohiggins.cl' },
    { depto: 'Inspectoría General', tel: '+56 52 221 0846', email: 'inspectoria@escuelabernardoohiggins.cl' },
    { depto: 'Convivencia Escolar', tel: '+56 52 221 0847', email: 'convivencia@escuelabernardoohiggins.cl' }
  ];

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="contact-view">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Comunícate</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">
          Canales de Atención y Contacto
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-[600px] mx-auto">
          ¿Tienes dudas o necesitas programar una entrevista? Utiliza nuestro formulario de contacto o llámanos directamente. Estamos para servirte.
        </p>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-grid">
        
        {/* LEFT COLUMN: DIRECTORY & INFO (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Ubicación Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-sm font-display font-bold text-[#05087E] uppercase tracking-wider border-b border-gray-100 pb-2">
              Dirección y Ubicación
            </h3>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <MapPin className="w-4 h-4 text-[#FF030D] shrink-0 mt-0.5" />
              <span>Avenida Copayapu #1230, Copiapó, Región de Atacama, Chile. (Frente a Mall Plaza Copiapó).</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <Clock className="w-4 h-4 text-[#05087E] shrink-0 mt-0.5" />
              <span>Horarios de atención: Lunes a Jueves de 08:30 a 13:00 hrs y de 14:30 a 17:30 hrs. Viernes de 08:30 a 13:30 hrs.</span>
            </div>
          </div>

          {/* Directorios Telefonos/Emails */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-display font-bold text-[#05087E] uppercase tracking-wider border-b border-gray-100 pb-2">
              Directorio de Departamentos
            </h3>
            
            <div className="flex flex-col gap-4">
              {directorios.map((dir, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <h4 className="font-bold text-[#05087E]">{dir.depto}</h4>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-[#FF030D] shrink-0" />
                    <span>{dir.tel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Mail className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                    <a href={`mailto:${dir.email}`} className="hover:underline hover:text-red-600">{dir.email}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONTACT FORM (7 cols) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative" id="contact-form-panel">
          {success && (
            <div className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h4 className="text-lg font-display font-bold text-[#05087E]">
                ¡Mensaje Recibido!
              </h4>
              <p className="text-xs text-gray-600 mt-2 max-w-[400px]">
                Su consulta ha sido enviada con éxito. Un encargado de nuestro establecimiento le responderá a la brevedad posible. Recuerde revisar su bandeja de correo electrónico.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 bg-[#05087E] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-900 transition-colors"
              >
                Enviar Otro Mensaje
              </button>
            </div>
          )}

          <h3 className="text-base font-display font-bold text-[#05087E] mb-6">Enviar Mensaje de Consulta</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Nombre Completo*</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Carolina Díaz"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                    errors.nombre ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="input-nombre"
                />
                {errors.nombre && <span className="text-[10px] text-red-500 block">{errors.nombre}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Correo Electrónico*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: carola@correo.cl"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="input-email"
                />
                {errors.email && <span className="text-[10px] text-red-500 block">{errors.email}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Teléfono de Contacto*</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: +56 9 8765 4321"
                  className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                    errors.telefono ? 'border-red-500' : 'border-gray-200'
                  }`}
                  id="input-telefono"
                />
                {errors.telefono && <span className="text-[10px] text-red-500 block">{errors.telefono}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Asunto del Mensaje*</label>
                <select
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none"
                  id="input-asunto"
                >
                  <option>Consulta General</option>
                  <option>Matrícula / Cupos</option>
                  <option>Convivencia Escolar</option>
                  <option>Reunión con Directora</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Mensaje / Consulta*</label>
              <textarea
                rows={4}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escriba aquí los detalles de su requerimiento escolar..."
                className={`w-full p-2.5 rounded-lg border text-xs focus:ring-1 focus:ring-[#05087E] focus:outline-none ${
                  errors.mensaje ? 'border-red-500' : 'border-gray-200'
                }`}
                id="input-mensaje"
              />
              {errors.mensaje && <span className="text-[10px] text-red-500 block">{errors.mensaje}</span>}
            </div>

            <div className="flex gap-2 items-start pt-1">
              <input type="checkbox" required className="mt-0.5 accent-[#05087E]" />
              <p className="text-[10px] text-gray-500 leading-normal">
                Comprendo que el envío de este formulario está amparado por la <strong>Ley de Datos Personales 19.628 de Chile</strong> para uso escolar interno únicamente.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF030D] hover:bg-[#d8020a] text-white py-3 rounded-full text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all mt-2 flex items-center justify-center gap-2"
              id="submit-contact-btn"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Formulario</span>
            </button>
          </form>
        </div>
      </div>

      {/* MAPA DE UBICACIÓN INTEGRADO */}
      <section className="space-y-4" id="google-map-section">
        <div className="text-center md:text-left">
          <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Ubicación Real</span>
          <h3 className="text-xl md:text-2xl font-display font-bold text-[#05087E] mt-0.5">
            Mapa Interactivo de la Escuela
          </h3>
        </div>

        {/* Real Google Maps interactive iframe */}
        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-md">
          <iframe
            src="https://maps.google.com/maps?q=Escuela%20Bernardo%20O'Higgins,%20Avenida%20Copayapu,%20Copiapo,%20Chile&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Ubicación de la Escuela Bernardo O'Higgins"
          />
        </div>
      </section>

    </div>
  );
}
