/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditMode: boolean;
  multiline?: boolean;
  className?: string;
  type?: 'text' | 'number';
}

export default function InlineEdit({ 
  value, 
  onSave, 
  isEditMode, 
  multiline = false, 
  className = "",
  type = 'text'
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  if (!isEditMode) {
    // Vista Normal: Respetamos los espacios naturales sin romper palabras a la mitad
    return <span className={`break-words ${className}`}>{value}</span>;
  }

  if (isEditing) {
    return (
      <span className="inline-flex items-start gap-1.5 bg-amber-50 p-1.5 rounded-lg border border-amber-300 shadow-sm z-10 max-w-full w-full relative">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs text-gray-800 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white min-w-[240px] w-full max-w-full leading-relaxed"
            rows={4}
          />
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-sans max-w-full w-full"
          />
        )}
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={() => {
              if (editValue.trim() !== "") {
                onSave(editValue);
                setIsEditing(false);
              }
            }}
            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center justify-center cursor-pointer"
            title="Guardar"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditValue(value);
              setIsEditing(false);
            }}
            className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center cursor-pointer"
            title="Cancelar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </span>
    );
  }

  return (
    // Estructura Relativa: El lápiz ahora flota de forma absoluta para no dejarse empujar por textos extremadamente largos
    <span className={`relative group inline-block max-w-full w-full ${className}`}>
      <span className="break-words whitespace-pre-wrap min-w-0 inline-block w-full">{value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-white bg-[#05087E] hover:bg-[#FF030D] rounded-bl-xl rounded-tr-sm transition-all cursor-pointer shadow-md z-[100]"
        title="Editar este dato directamente"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </span>
  );
}