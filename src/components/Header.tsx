/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Landmark, ShieldCheck, Key } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  onOpenPortalModal: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  onOpenPortalModal,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'academica', label: 'Área Académica' },
    { id: 'convivencia', label: 'Convivencia Escolar' },
    { id: 'vida-estudiantil', label: 'Vida Estudiantil' },
    { id: 'admision', label: 'Admisión' },
    { id: 'noticias', label: 'Noticias' },
    { id: 'contacto', label: 'Contacto' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm" id="global-header">
      {/* Upper Bar: Slogan & Contact Quick Info */}
      <div className="bg-[#05087E] text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="tracking-wide text-center sm:text-left">
            🇨🇱 Escuela Bernardo O'Higgins • Copiapó, Región de Atacama
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Tel: +56 52 221 0844</span>
            <span className="bg-[#FF030D] px-2.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
              Admisión 2027 Abierta
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className={`max-w-[1200px] mx-auto px-4 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-1.5 md:py-2' : 'py-3 md:py-4'}`}>
        {/* Brand/Logo Section */}
        <div 
          onClick={() => handleTabClick('inicio')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="logo-button"
        >
          <div className={`bg-[#05087E] rounded-full flex items-center justify-center text-white border-2 border-[#FF030D] shadow-md transition-all duration-300 group-hover:scale-105 overflow-hidden p-0.5 ${isScrolled ? 'w-9 h-9' : 'w-11 h-11'}`}>
            <img 
              src="assets/insignia.png" 
              alt="Insignia Bernardo O'Higgins" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.innerText = '🏫';
                  fallback.className = 'text-xs font-bold';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <div>
            <h1 className={`font-display font-bold text-[#05087E] leading-tight tracking-tight transition-all duration-300 ${isScrolled ? 'text-base' : 'text-lg md:text-xl'}`}>
              Escuela Bernardo O'Higgins
            </h1>
            <p className="text-[10px] font-semibold text-[#FF030D] tracking-widest uppercase">
              Copiapó • Chile
            </p>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1.5" id="desktop-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`px-3 py-1.5 text-xs md:text-sm font-semibold transition-all duration-200 rounded-full ${
                activeTab === item.id && !isAdminMode
                  ? 'bg-gray-100 text-[#05087E] border-b-2 border-[#FF030D]'
                  : 'text-gray-600 hover:text-[#05087E] hover:bg-gray-50'
              }`}
              id={`nav-tab-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Call to Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Portal Apoderados Button */}
          <button
            onClick={onOpenPortalModal}
            className="flex items-center gap-1.5 bg-[#FF030D] hover:bg-[#d8020a] text-white px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            id="portal-apoderados-btn"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Portal Apoderados</span>
          </button>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#05087E] hover:bg-gray-100 rounded-full cursor-pointer"
          id="mobile-menu-toggle"
          aria-label="Abrir Menú"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-inner" id="mobile-menu">
          <div className="flex flex-col gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === item.id && !isAdminMode
                    ? 'bg-blue-50 text-[#05087E] font-bold border-l-4 border-[#FF030D]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                id={`mobile-nav-tab-${item.id}`}
              >
                {item.label}
              </button>
            ))}

            <hr className="my-2 border-gray-100" />

            <div className="flex flex-col gap-2 pt-2">
              {/* Mobile Portal Apoderados Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPortalModal();
                }}
                className="flex items-center justify-center gap-2 bg-[#FF030D] text-white py-3 rounded-full text-xs font-bold tracking-wide shadow-md cursor-pointer"
                id="mobile-portal-apoderados-btn"
              >
                <Key className="w-4 h-4" />
                <span>Portal Apoderados (NAPSIS)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
