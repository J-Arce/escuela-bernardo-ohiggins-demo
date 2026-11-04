/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Key, LogOut } from 'lucide-react';
import InlineEdit from './InlineEdit';

interface HeaderProps {
  isAdminMode: boolean;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ isAdminMode, onLogout, activeTab, setActiveTab }: HeaderProps) {
  const navItems = ['Inicio', 'Nosotros', 'Área Académica', 'Convivencia Escolar', 'Vida Estudiantil', 'Admisión', 'Noticias', 'Contacto'];

  // Estados Editables
  const [topBarPhone, setTopBarPhone] = useState("Tel: +56 52 221 0844");
  const [topBarBadge, setTopBarBadge] = useState("Admisión 2027 Abierta");

  // Cargar de Firebase
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const docRef = doc(db, "paginas", "header");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.topBarPhone) setTopBarPhone(data.topBarPhone);
          if (data.topBarBadge) setTopBarBadge(data.topBarBadge);
        }
      } catch (error) {
        console.error("Error cargando header:", error);
      }
    };
    fetchHeaderData();
  }, []);

  // Guardar en Firebase
  const saveToFirebase = async (campo: string, valor: string) => {
    try {
      await setDoc(doc(db, "paginas", "header"), { [campo]: valor }, { merge: true });
    } catch (error) {
      console.error("Error guardando header:", error);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* BARRA SUPERIOR EDITABLE */}
      <div className="bg-[#05087E] text-white text-[10px] sm:text-xs py-1.5 px-4 flex justify-between items-center">
        <span className="opacity-90">Escuela Bernardo O'Higgins • Copiapó, Región de Atacama</span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">
            <InlineEdit 
              value={topBarPhone} 
              onSave={(v) => { setTopBarPhone(v); saveToFirebase('topBarPhone', v); }} 
              isEditMode={isAdminMode} 
            />
          </span>
          <span className="bg-[#FF030D] px-2 py-0.5 rounded-full font-bold">
            <InlineEdit 
              value={topBarBadge} 
              onSave={(v) => { setTopBarBadge(v); saveToFirebase('topBarBadge', v); }} 
              isEditMode={isAdminMode} 
            />
          </span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('Inicio')}>
          <img src="/insignia.png" alt="Insignia Escuela Bernardo O'Higgins" className="w-24 h-24 object-contain" />
          <div className="flex flex-col">
            <h1 className="font-display font-extrabold text-[#05087E] text-sm md:text-lg leading-tight">
              Tradición y Excelencia Académica 
            </h1>
            <span className="text-[#FF030D] text-[9px] font-bold tracking-widest">Desde 1876</span>
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-5">
          {navItems.map(item => (
            <button 
              key={item}
              onClick={() => setActiveTab(item)}
              className={`text-sm font-bold transition-colors ${activeTab === item ? 'text-[#FF030D]' : 'text-gray-600 hover:text-[#05087E]'}`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab('Portal Apoderados')} className="bg-[#FF030D] hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer">
            <Key className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Portal Apoderados</span>
          </button>
          
          {isAdminMode && (
            <button onClick={onLogout} className="bg-gray-100 hover:bg-gray-200 text-[#05087E] px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          )}
        </div>
      </div>
    </header>
  );
}