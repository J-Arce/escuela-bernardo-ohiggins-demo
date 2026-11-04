/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // <-- IMPORTACIONES DE STORAGE
import { db, storage } from '../firebase'; // <-- IMPORTAMOS STORAGE
import { 
  Palette, Trophy, FlaskConical, Users, Image as ImageIcon, 
  Plus, Trash2, Edit2, UploadCloud, Clock, UserCheck, X, CheckCircle, Cloud, AlertCircle
} from 'lucide-react';
import InlineEdit from './InlineEdit';

interface VidaEstudiantilProps {
  isAdminMode: boolean;
}

export default function VidaEstudiantil({ isAdminMode }: VidaEstudiantilProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // <-- ESTADO PARA SUBIDAS A STORAGE

  // Estados de Talleres
  const [talleres, setTalleres] = useState<any[]>([]);
  const [filterTaller, setFilterTaller] = useState<string>('Todos');
  const [selectedTaller, setSelectedTaller] = useState<any | null>(null);
  const [isNewTallerOpen, setIsNewTallerOpen] = useState(false);
  const [newTaller, setNewTaller] = useState({ titulo: '', categoria: 'Artístico', descripcion: '', horario: '', coordinador: '', imagenUrl: '' });

  // Estados de Tablón de Anuncios
  const [anuncios, setAnuncios] = useState<any[]>([
    { id: 'anuncio-1', titulo: 'Uso de Uniforme de Invierno', detalle: 'A partir del 15 de Mayo se autoriza el uso de parka azul marino escolar.' }
  ]);

  // Estados de Galería
  const [fotos, setFotos] = useState<any[]>([]);
  const [filterGaleria, setFilterGaleria] = useState<string>('Todas');
  const [isUploadFotoOpen, setIsUploadFotoOpen] = useState(false);
  const [newFoto, setNewFoto] = useState({ url: '', coleccion: '', nuevaColeccion: '' });
  const [modoColeccion, setModoColeccion] = useState<'existente' | 'nueva'>('existente');
  const [selectedFoto, setSelectedFoto] = useState<any | null>(null);

  // Cargar datos de Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "paginas", "vida_estudiantil");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.talleres) setTalleres(data.talleres);
          if (data.anuncios) setAnuncios(data.anuncios);
          if (data.fotos) setFotos(data.fotos);
        } else {
          // Datos iniciales de prueba si Firebase está vacío
          setTalleres([
            { id: 't1', titulo: 'Taller de Robótica Atacama', categoria: 'Científico', descripcion: 'Programación en Arduino y ensamblaje de robots autónomos. Fomenta lógica matemática y trabajo en equipo.', horario: 'Martes y Jueves 16:00 - 17:30 hrs', coordinador: 'Prof. Judith Carrizo', imagenUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800' }
          ]);
        }
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const saveToFirebase = async (campo: string, valor: any) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "paginas", "vida_estudiantil"), { [campo]: valor }, { merge: true });
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  // --- LÓGICA DE TALLERES ---
  const handleUpdateTaller = (id: string, campo: string, valor: string) => {
    const actualizados = talleres.map(t => t.id === id ? { ...t, [campo]: valor } : t);
    setTalleres(actualizados);
    saveToFirebase('talleres', actualizados);
    if (selectedTaller && selectedTaller.id === id) {
      setSelectedTaller({ ...selectedTaller, [campo]: valor });
    }
  };

  const handleDeleteTaller = (id: string) => {
    if (window.confirm("¿Eliminar este taller?")) {
      const actualizados = talleres.filter(t => t.id !== id);
      setTalleres(actualizados);
      saveToFirebase('talleres', actualizados);
      setSelectedTaller(null);
    }
  };

  const handleCreateTaller = (e: React.FormEvent) => {
    e.preventDefault();
    const imagenFinal = newTaller.imagenUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800';
    const tallerNuevo = { ...newTaller, imagenUrl: imagenFinal, id: `taller-${Date.now()}` };
    const actualizados = [tallerNuevo, ...talleres];
    setTalleres(actualizados);
    saveToFirebase('talleres', actualizados);
    setIsNewTallerOpen(false);
    setNewTaller({ titulo: '', categoria: 'Artístico', descripcion: '', horario: '', coordinador: '', imagenUrl: '' });
  };

  // --- LÓGICA DE ANUNCIOS ---
  const handleUpdateAnuncio = (id: string, campo: string, valor: string) => {
    const actualizados = anuncios.map(a => a.id === id ? { ...a, [campo]: valor } : a);
    setAnuncios(actualizados);
    saveToFirebase('anuncios', actualizados);
  };

  const handleDeleteAnuncio = (id: string) => {
    const actualizados = anuncios.filter(a => a.id !== id);
    setAnuncios(actualizados);
    saveToFirebase('anuncios', actualizados);
  };

  const handleAddAnuncio = () => {
    const actualizados = [{ id: `anuncio-${Date.now()}`, titulo: 'Nuevo Anuncio', detalle: 'Detalles del anuncio...' }, ...anuncios];
    setAnuncios(actualizados);
    saveToFirebase('anuncios', actualizados);
  };

  // --- LÓGICA DE GALERÍA Y COLECCIONES ---
  const coleccionesUnicas = Array.from(new Set(fotos.map(f => f.coleccion)));
  
  const handleCreateFoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoto.url) { alert("Debe subir una imagen"); return; }
    
    const coleccionFinal = modoColeccion === 'nueva' ? newFoto.nuevaColeccion : newFoto.coleccion;
    if (!coleccionFinal) { alert("Debe seleccionar o crear una colección"); return; }

    const fotoNueva = { id: `foto-${Date.now()}`, url: newFoto.url, coleccion: coleccionFinal };
    const actualizados = [fotoNueva, ...fotos];
    setFotos(actualizados);
    saveToFirebase('fotos', actualizados);
    setIsUploadFotoOpen(false);
    setNewFoto({ url: '', coleccion: coleccionesUnicas[0] || '', nuevaColeccion: '' });
  };

  const handleDeleteFoto = (id: string) => {
    if (window.confirm("¿Eliminar esta foto permanentemente?")) {
      const actualizados = fotos.filter(f => f.id !== id);
      setFotos(actualizados);
      saveToFirebase('fotos', actualizados);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Artístico': return <Palette className="w-4 h-4" />;
      case 'Deportivo': return <Trophy className="w-4 h-4" />;
      case 'Científico': return <FlaskConical className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Artístico': return 'bg-purple-100 text-purple-800';
      case 'Deportivo': return 'bg-orange-100 text-orange-800';
      case 'Científico': return 'bg-[#05087E] text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="text-center py-20 font-bold text-[#05087E]">Cargando Vida Estudiantil...</div>;

  const displayedTalleres = talleres.filter(t => filterTaller === 'Todos' || t.categoria === filterTaller);

  return (
    <div className="space-y-16 max-w-[1200px] mx-auto px-4" id="vida-estudiantil-view">
      
      {isAdminMode && (
        <div className={`fixed bottom-4 right-4 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold shadow-lg z-50 ${isSaving || isUploading ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {isUploading ? <><UploadCloud className="w-4 h-4 animate-bounce" /> Subiendo imagen...</> :
           isSaving ? <><Cloud className="w-4 h-4 animate-pulse" /> Guardando...</> : 
           <><CheckCircle className="w-4 h-4" /> Base de Datos Conectada</>}
        </div>
      )}

      <div className="text-center">
        <span className="text-[#FF030D] text-xs font-bold uppercase tracking-wider">Desarrollo Integral</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#05087E] mt-1">Formación y Comunidad</h2>
        <div className="w-16 h-1.5 bg-[#FF030D] mx-auto mt-4 rounded-full" />
      </div>

      {/* 1. TALLERES ACLE */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-2xl font-bold text-[#05087E]">Talleres y Academias (ACLE)</h3>
          <div className="flex flex-wrap gap-2">
            {['Todos', 'Deportivo', 'Artístico', 'Científico'].map(c => (
              <button key={c} onClick={() => setFilterTaller(c)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filterTaller === c ? 'bg-[#05087E] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isAdminMode && (
            <button onClick={() => setIsNewTallerOpen(true)} className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl flex flex-col items-center justify-center gap-2 p-8 hover:bg-emerald-100 min-h-[300px] cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm"><Plus className="w-6 h-6" /></div>
              <span className="text-emerald-700 font-bold text-xs">Añadir Nuevo Taller</span>
            </button>
          )}
          
          {/* Empty State */}
          {displayedTalleres.length === 0 && !isAdminMode && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#05087E] mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#05087E] mb-2">Talleres en Preparación</h4>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                Por el momento no se está realizando ningún taller en esta categoría. ¡Agradecemos tu interés y te invitamos a mantenerte atento a nuestras próximas actualizaciones!
              </p>
            </div>
          )}

          {displayedTalleres.length === 0 && isAdminMode && (
            <div className="col-span-full md:col-span-2 py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center">
              <p className="text-gray-400 font-bold text-sm">No hay talleres creados en esta categoría.</p>
            </div>
          )}

          {displayedTalleres.map((taller) => (
            <div key={taller.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative cursor-pointer" onClick={() => setSelectedTaller(taller)}>
              {isAdminMode && (
                <button onClick={(e) => { e.stopPropagation(); handleDeleteTaller(taller.id); }} className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 z-10 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="h-48 overflow-hidden relative">
                <img src={taller.imagenUrl} alt={taller.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm ${getCategoryColor(taller.categoria)}`}>
                  {getCategoryIcon(taller.categoria)} {taller.categoria}
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg text-[#05087E] mb-2">{taller.titulo}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{taller.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL FICHA DE TALLER (Edición Admin) */}
      {selectedTaller && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedTaller(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-[600px] overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedTaller(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative h-64 w-full group">
              <img src={selectedTaller.imagenUrl} alt={selectedTaller.titulo} className="w-full h-full object-cover" />
              <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm ${getCategoryColor(selectedTaller.categoria)}`}>
                {getCategoryIcon(selectedTaller.categoria)}
                {isAdminMode ? (
                  <select value={selectedTaller.categoria} onChange={e => handleUpdateTaller(selectedTaller.id, 'categoria', e.target.value)} className="bg-transparent outline-none cursor-pointer">
                    <option value="Deportivo" className="text-black">Deportivo</option>
                    <option value="Artístico" className="text-black">Artístico</option>
                    <option value="Científico" className="text-black">Científico</option>
                  </select>
                ) : (
                  <span>{selectedTaller.categoria}</span>
                )}
              </div>
              
              {isAdminMode && (
                <label className="absolute bottom-4 right-4 bg-white text-[#05087E] px-4 py-2 rounded-full text-xs font-bold shadow-lg cursor-pointer hover:bg-gray-50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? <UploadCloud className="w-4 h-4 animate-bounce" /> : <Edit2 className="w-4 h-4" />}
                  {isUploading ? 'Subiendo...' : 'Cambiar Portada'}
                  <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setIsUploading(true);
                      try {
                        const storageRef = ref(storage, `talleres/${selectedTaller.id}_${Date.now()}`);
                        await uploadBytes(storageRef, file);
                        const url = await getDownloadURL(storageRef);
                        handleUpdateTaller(selectedTaller.id, 'imagenUrl', url);
                      } catch (error) {
                        alert("Error al subir la imagen.");
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }}/>
                </label>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[#05087E] leading-tight">
                  <InlineEdit value={selectedTaller.titulo} onSave={(v) => handleUpdateTaller(selectedTaller.id, 'titulo', v)} isEditMode={isAdminMode} />
                </h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Escuela Bernardo O'Higgins • Academias ACLE</p>
              </div>

              <div className="text-sm text-gray-600 leading-relaxed text-justify">
                <InlineEdit value={selectedTaller.descripcion} onSave={(v) => handleUpdateTaller(selectedTaller.id, 'descripcion', v)} isEditMode={isAdminMode} multiline={true} />
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 border border-gray-100">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Horario Semanal</span>
                  <div className="flex items-center gap-2 text-sm text-[#05087E] font-medium">
                    <Clock className="w-4 h-4 text-[#FF030D]" />
                    <InlineEdit value={selectedTaller.horario} onSave={(v) => handleUpdateTaller(selectedTaller.id, 'horario', v)} isEditMode={isAdminMode} />
                  </div>
                </div>
                <div className="w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Docente Coordinador</span>
                  <div className="flex items-center gap-2 text-sm text-[#05087E] font-medium">
                    <UserCheck className="w-4 h-4 text-[#FF030D]" />
                    <InlineEdit value={selectedTaller.coordinador} onSave={(v) => handleUpdateTaller(selectedTaller.id, 'coordinador', v)} isEditMode={isAdminMode} />
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedTaller(null)} className="w-full bg-[#05087E] hover:bg-blue-900 text-white font-bold py-4 rounded-full transition-colors text-sm shadow-md cursor-pointer">
                Entendido, Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TABLÓN DE ANUNCIOS */}
      <section className="bg-[#05087E] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF030D] rounded-full filter blur-3xl opacity-20 -mr-16 -mt-16" />
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-white text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Información Continua</span>
            </div>
            <h3 className="text-3xl font-display font-bold text-white">Tablón de Anuncios</h3>
            <p className="text-sm text-blue-200 leading-relaxed">
              Normativas, rutinas y avisos permanentes para nuestra comunidad escolar. Para fechas específicas, consulte el calendario en la sección de Noticias.
            </p>
            {isAdminMode && (
              <button onClick={handleAddAnuncio} className="bg-white text-[#05087E] px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 mt-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Agregar Aviso
              </button>
            )}
          </div>

          <div className="lg:w-2/3 grid gap-4 w-full">
            {anuncios.map((anuncio) => (
              <div key={anuncio.id} className="bg-white p-5 rounded-2xl relative group shadow-sm flex items-start gap-4">
                {isAdminMode && (
                  <button onClick={() => handleDeleteAnuncio(anuncio.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="w-2 h-full bg-amber-400 rounded-full absolute left-0 top-0 bottom-0" />
                <div className="pl-2 w-full">
                  <h4 className="font-bold text-[#05087E] text-sm md:text-base">
                    <InlineEdit value={anuncio.titulo} onSave={(v) => handleUpdateAnuncio(anuncio.id, 'titulo', v)} isEditMode={isAdminMode} />
                  </h4>
                  <div className="text-xs text-gray-600 mt-1">
                    <InlineEdit value={anuncio.detalle} onSave={(v) => handleUpdateAnuncio(anuncio.id, 'detalle', v)} isEditMode={isAdminMode} multiline={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. GALERÍA CON COLECCIONES */}
      <section className="space-y-6 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-[#FF030D]"/></div>
            <h3 className="text-2xl font-bold text-[#05087E]">Galería Fotográfica</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => setFilterGaleria('Todas')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${filterGaleria === 'Todas' ? 'bg-[#05087E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Todas</button>
            {coleccionesUnicas.map(col => (
               <button key={col} onClick={() => setFilterGaleria(col)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${filterGaleria === col ? 'bg-[#05087E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{col}</button>
            ))}
            {isAdminMode && (
              <button onClick={() => setIsUploadFotoOpen(true)} className="ml-2 bg-[#FF030D] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-red-700 cursor-pointer">
                <UploadCloud className="w-4 h-4"/> Subir Fotos
              </button>
            )}
          </div>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {fotos.filter(f => filterGaleria === 'Todas' || f.coleccion === filterGaleria).map(foto => (
            <div 
              key={foto.id} 
              className="relative group break-inside-avoid rounded-2xl overflow-hidden shadow-sm cursor-pointer"
              onClick={() => setSelectedFoto(foto)}
            >
              {isAdminMode && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteFoto(foto.id); }} 
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 z-10 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <img src={foto.url} alt="Galería" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold bg-[#FF030D] px-2 py-0.5 rounded-full">{foto.coleccion}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL ZOOM DE FOTO GALERÍA */}
      {selectedFoto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedFoto(null)}>
          <div className="relative w-full max-w-5xl flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedFoto(null)} className="absolute -top-12 right-0 md:-right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors cursor-pointer">
              <X className="w-6 h-6" />
            </button>
            <img src={selectedFoto.url} alt="Vista ampliada" className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            <div className="mt-4 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-white text-xs font-bold tracking-wide">{selectedFoto.coleccion}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUBIR FOTO A GALERÍA */}
      {isUploadFotoOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[400px] shadow-2xl relative">
            <button onClick={() => setIsUploadFotoOpen(false)} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full text-gray-500 hover:text-black cursor-pointer">✕</button>
            <h3 className="text-lg font-bold text-[#05087E] mb-4 border-b pb-2">Añadir a Galería</h3>
            
            <form onSubmit={handleCreateFoto} className="space-y-4 text-xs">
              <div className={`border-2 border-dashed rounded-xl p-6 text-center relative transition-colors ${isUploading ? 'border-amber-300 bg-amber-50' : 'border-gray-300 hover:bg-gray-50 cursor-pointer'}`}>
                <input type="file" accept="image/*" disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" onChange={async e => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    setIsUploading(true);
                    try {
                      const storageRef = ref(storage, `galeria/foto_${Date.now()}`);
                      await uploadBytes(storageRef, file);
                      const url = await getDownloadURL(storageRef);
                      setNewFoto({...newFoto, url});
                    } catch (error) {
                      alert("Error al subir imagen.");
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }}/>
                {isUploading ? <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-bounce" /> : <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />}
                <p className="text-gray-500 font-bold">{isUploading ? 'Subiendo archivo a la nube...' : 'Haz clic para buscar imagen'}</p>
                {newFoto.url && !isUploading && <p className="text-emerald-600 font-bold mt-2">✅ Imagen lista en la nube</p>}
              </div>

              <div className="space-y-2 pt-2">
                <label className="font-bold text-gray-700 block">¿A qué colección pertenece?</label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="modo" checked={modoColeccion === 'existente'} onChange={() => setModoColeccion('existente')} /> Existente</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="modo" checked={modoColeccion === 'nueva'} onChange={() => setModoColeccion('nueva')} /> Nueva</label>
                </div>

                {modoColeccion === 'existente' ? (
                  <select value={newFoto.coleccion} onChange={e => setNewFoto({...newFoto, coleccion: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-[#05087E] cursor-pointer">
                    <option value="" disabled>Seleccione una colección...</option>
                    {coleccionesUnicas.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Ej: Aniversario 2026" value={newFoto.nuevaColeccion} onChange={e => setNewFoto({...newFoto, nuevaColeccion: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-[#05087E]" />
                )}
              </div>

              <button type="submit" disabled={isUploading || !newFoto.url} className="w-full bg-[#05087E] text-white font-bold py-3 rounded-full mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Guardar en Galería</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVO TALLER */}
      {isNewTallerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[500px] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsNewTallerOpen(false)} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full text-gray-500 hover:text-black cursor-pointer">✕</button>
            <h3 className="text-lg font-bold text-[#05087E] mb-4 border-b pb-2">Crear Nuevo Taller ACLE</h3>
            <form onSubmit={handleCreateTaller} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Nombre del Taller*</label>
                <input required type="text" placeholder="Ej: Taller de Robótica Atacama" value={newTaller.titulo} onChange={e => setNewTaller({...newTaller, titulo: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-[#05087E]" />
              </div>
              
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Categoría*</label>
                <select value={newTaller.categoria} onChange={e => setNewTaller({...newTaller, categoria: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-[#05087E] cursor-pointer">
                  <option value="Deportivo">Deportivo</option><option value="Artístico">Artístico</option><option value="Científico">Científico</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Horario Semanal*</label>
                  <input required type="text" placeholder="Ej: Martes y Jueves 16:00 - 17:30 hrs" value={newTaller.horario} onChange={e => setNewTaller({...newTaller, horario: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-[#05087E]" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Prof. Coordinador*</label>
                  <input required type="text" placeholder="Ej: Prof. Judith Carrizo" value={newTaller.coordinador} onChange={e => setNewTaller({...newTaller, coordinador: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-[#05087E]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Descripción del Taller*</label>
                <textarea required rows={3} placeholder="Detalle los objetivos y actividades del taller..." value={newTaller.descripcion} onChange={e => setNewTaller({...newTaller, descripcion: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-[#05087E]" />
              </div>
              
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Foto de Portada (Opcional)</label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center relative transition-colors ${isUploading ? 'border-amber-300 bg-amber-50' : 'border-gray-300 hover:bg-gray-50 cursor-pointer'}`}>
                  <input type="file" accept="image/*" disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" onChange={async e => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setIsUploading(true);
                      try {
                        const storageRef = ref(storage, `talleres/nuevo_${Date.now()}`);
                        await uploadBytes(storageRef, file);
                        const url = await getDownloadURL(storageRef);
                        setNewTaller({...newTaller, imagenUrl: url});
                      } catch (error) {
                        alert("Error al subir imagen.");
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }}/>
                  <p className="text-gray-500 font-bold">{isUploading ? 'Subiendo imagen a la nube...' : 'Haz clic para buscar imagen'}</p>
                  {newTaller.imagenUrl && !isUploading && <p className="text-emerald-600 font-bold mt-1">✅ Imagen lista</p>}
                </div>
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-[#05087E] text-white font-bold py-3 rounded-full mt-2 hover:bg-blue-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Guardar Taller</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}