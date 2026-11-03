/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, Phone, Mail, MapPin, Award, Shield, Lock } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setIsAdminMode: (mode: boolean) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdminLogin: () => void;
}

export default function Footer({ 
  setActiveTab, 
  setIsAdminMode,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdminLogin
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsAdminMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05087E] text-white pt-12 pb-6 mt-16 border-t-4 border-[#FF030D]" id="global-footer">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
        
        {/* Column 1: School Identity */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#05087E] border border-[#FF030D] overflow-hidden p-0.5">
              <img 
                src="assets/logo-footer.png" 
                alt="Logo Bernardo O'Higgins" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('span');
                    fallback.innerText = '🏫';
                    fallback.className = 'text-xs font-bold text-[#05087E]';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div>
              <h2 className="text-base font-display font-bold leading-tight">
                Escuela Bernardo O'Higgins
              </h2>
              <p className="text-[10px] text-gray-300 tracking-wider">Copiapó, Chile</p>
            </div>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Establecimiento educacional público enfocado en la educación integral y el desarrollo valórico e inclusivo en la Región de Atacama.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-200">
            <Award className="w-4 h-4 text-[#FF030D]" />
            <span>Acreditación de Excelencia Ministerial</span>
          </div>
        </div>

        {/* Column 2: Sitemap Quick Links */}
        <div>
          <h3 className="text-sm font-display font-bold tracking-wide uppercase mb-4 border-b border-blue-800 pb-2">
            Mapa del Sitio
          </h3>
          <ul className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <li>
              <button onClick={() => handleLinkClick('inicio')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                Inicio
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('nosotros')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                Nosotros
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('academica')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                Académico
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('convivencia')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                Convivencia
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('vida-estudiantil')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                Vida Estudiantil
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('admision')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                Admisión
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('noticias')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                Noticias
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('contacto')} className="hover:text-red-400 transition-colors cursor-pointer text-left">
                Contacto
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="flex flex-col gap-3 text-xs text-gray-300">
          <h3 className="text-sm font-display font-bold tracking-wide uppercase mb-1 border-b border-blue-800 pb-2">
            Contacto
          </h3>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#FF030D] shrink-0 mt-0.5" />
            <span>Avenida Copayapu #1230, Copiapó, Región de Atacama</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#FF030D] shrink-0" />
            <span>Central: +56 52 221 0844</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#FF030D] shrink-0" />
            <span>contacto@escuelabernardoohiggins.cl</span>
          </div>
        </div>

        {/* Column 4: Legal & Framework */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-display font-bold tracking-wide uppercase mb-1 border-b border-blue-800 pb-2">
            Ley de Protección de Datos
          </h3>
          <div className="bg-blue-950 p-3 rounded-lg border border-blue-900 flex gap-2">
            <Shield className="w-8 h-8 text-[#FF030D] shrink-0" />
            <div className="text-[10px] text-gray-300 leading-normal">
              <strong className="text-white block mb-0.5">Cumplimiento Ley 19.628</strong>
              Este portal institucional cumple con la normativa de Protección de la Vida Privada de Chile. El tratamiento de datos de pre-inscripciones y consultas escolares es estrictamente confidencial.
            </div>
          </div>
        </div>

      </div>

      {/* Lower Bar: Copyright */}
      <div className="max-w-[1200px] mx-auto px-4 pt-6 border-t border-blue-900 text-center text-[11px] text-gray-400 flex flex-col md:flex-row justify-between items-center gap-2 animate-fade-in">
        <p>© {currentYear} Escuela Bernardo O'Higgins de Copiapó. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenPrivacy} 
            className="hover:underline hover:text-white cursor-pointer transition-colors"
          >
            Políticas de Privacidad
          </button>
          <span>•</span>
          <button 
            onClick={onOpenTerms} 
            className="hover:underline hover:text-white cursor-pointer transition-colors"
          >
            Términos de Uso
          </button>
          <span>•</span>
          <button
            onClick={onOpenAdminLogin}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer p-1 rounded-full"
            title="Ingreso de Administrador"
            id="admin-lock-icon"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
