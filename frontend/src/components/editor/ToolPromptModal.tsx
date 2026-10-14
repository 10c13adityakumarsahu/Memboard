import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToolPromptType = 'date' | 'location' | 'tag' | null;

interface ToolPromptModalProps {
  type: ToolPromptType;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export default function ToolPromptModal({ type, onClose, onSubmit }: ToolPromptModalProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(''); // Reset on open
    if (type === 'date') {
      setValue(new Date().toISOString().split('T')[0]);
    }
  }, [type]);

  if (!type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    if (type === 'date') {
      // Format the date nicely before submitting
      const formatted = new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      onSubmit(formatted.toUpperCase());
    } else {
      onSubmit(value);
    }
    onClose();
  };

  const config = {
    date: { title: 'Add Date Stamp', type: 'date', placeholder: '' },
    location: { title: 'Add Location Pin', type: 'text', placeholder: 'e.g., Central Park' },
    tag: { title: 'Tag a Person', type: 'text', placeholder: 'e.g., Jane Doe' },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-6 w-96 pointer-events-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">{config[type].title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type={config[type].type}
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={config[type].placeholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Add to Canvas
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
