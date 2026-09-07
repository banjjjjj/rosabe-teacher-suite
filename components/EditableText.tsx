'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  inputClassName?: string;
  badgeLabel?: string;
}

export default function EditableText({
  value,
  onChange,
  multiline = false,
  placeholder = 'Click or double click to edit...',
  className = '',
  tag = 'p',
  inputClassName = '',
  badgeLabel,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (currentVal !== value) {
      onChange(currentVal);
    }
  };

  const handleCancel = () => {
    setCurrentVal(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="relative group/edit w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentVal}
            onChange={(e) => setCurrentVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            rows={Math.max(3, currentVal.split('\n').length + 1)}
            className={`w-full p-2 text-sm bg-amber-50/70 border-2 border-emerald-500 rounded-lg shadow-inner focus:outline-none text-slate-800 transition-all ${inputClassName}`}
            placeholder={placeholder}
          />
        ) : (
          <div className="flex items-center gap-1.5 w-full">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={currentVal}
              onChange={(e) => setCurrentVal(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={`w-full p-1.5 text-sm bg-amber-50/70 border-2 border-emerald-500 rounded-lg shadow-inner focus:outline-none text-slate-900 font-medium ${inputClassName}`}
              placeholder={placeholder}
            />
            <button
              onMouseDown={(e) => { e.preventDefault(); handleSave(); }}
              className="p-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 shadow-sm"
              title="Save changes"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onMouseDown={(e) => { e.preventDefault(); handleCancel(); }}
              className="p-1.5 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  const Tag = tag;

  return (
    <div
      onClick={() => setIsEditing(true)}
      title="Click or double-click to edit directly"
      className={`group relative cursor-pointer border border-dashed border-transparent hover:border-emerald-300 hover:bg-emerald-50/40 rounded-lg p-1 transition-all ${className}`}
    >
      <Tag className="inline leading-relaxed text-inherit">
        {value || <span className="text-slate-400 italic">{placeholder}</span>}
      </Tag>
      
      <span className="opacity-0 group-hover:opacity-100 inline-flex items-center ml-1.5 text-emerald-600 align-middle transition-opacity">
        <Pencil className="w-3.5 h-3.5 inline text-emerald-600" />
        {badgeLabel && (
          <span className="text-[10px] uppercase font-bold tracking-wider ml-1 bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
            {badgeLabel}
          </span>
        )}
      </span>
    </div>
  );
}
