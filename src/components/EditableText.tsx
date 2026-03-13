import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

export default function EditableText({
  value,
  onChange,
  multiline = false,
  className = '',
  placeholder = '',
  as: Component = 'span',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to the end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const commonClasses = `w-full bg-yellow-50 border border-yellow-400 rounded px-1 outline-none text-gray-900 ${className}`;
    
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${commonClasses} resize-none overflow-hidden`}
          rows={Math.max(3, tempValue.split('\n').length)}
          dir="auto"
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={commonClasses}
        dir="auto"
      />
    );
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-yellow-50 hover:outline hover:outline-1 hover:outline-yellow-400 rounded px-1 transition-all duration-200 ${
        !value ? 'text-gray-400 italic' : ''
      } ${className}`}
      title="Click to edit"
      dir="auto"
    >
      {value || placeholder || 'Click to edit'}
    </Component>
  );
}
