import React from 'react';
import { useCanvasStore } from '../../canvas/useCanvasStore';

interface BackgroundPickerModalProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BackgroundPickerModal({ pageId, isOpen, onClose }: BackgroundPickerModalProps) {
  const { pages, updatePageBackground } = useCanvasStore();

  if (!isOpen) return null;

  const page = pages.find((p) => p.id === pageId);
  if (!page) return null;

  const handleThemeSelect = (themeId: string) => {
    updatePageBackground(pageId, themeId, page.pageColor);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePageBackground(pageId, page.themeId, e.target.value);
  };

  const themes = [
    { id: 'default', name: 'Solid Color' },
    { id: 'floral', name: 'Vintage Floral' },
    { id: 'kraft', name: 'Kraft Paper' },
    { id: 'ruled', name: 'Ruled Paper' },
    { id: 'grid', name: 'Grid Paper' },
    { id: 'dot-grid', name: 'Dot Grid' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 w-96 flex flex-col gap-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-gray-800">Page Background</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Base Color</label>
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <input 
              type="color" 
              value={page.pageColor} 
              onChange={handleColorChange}
              className="w-10 h-10 rounded cursor-pointer border border-gray-200"
            />
            <span className="text-sm text-gray-600 font-mono uppercase">{page.pageColor}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Overlay Pattern</label>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col gap-1
                  ${page.themeId === theme.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
                `}
              >
                <span className={`text-sm font-medium ${page.themeId === theme.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
