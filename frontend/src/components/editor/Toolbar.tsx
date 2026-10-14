import React, { useRef, useState } from 'react';
import { useCanvasStore } from '../../canvas/useCanvasStore';
import ToolPromptModal from './ToolPromptModal';
import StickerPickerModal from './StickerPickerModal';

export default function Toolbar() {
  const { addNode, stageConfig, activeTool, setActiveTool, drawTension, setDrawTension } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [promptType, setPromptType] = useState<'date' | 'location' | 'tag' | null>(null);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);

  const getCenter = () => {
    return {
      cx: (window.innerWidth / 2 - stageConfig.x) / stageConfig.scale,
      cy: (window.innerHeight / 2 - stageConfig.y) / stageConfig.scale,
    };
  };

  const handleAddText = () => {
    const { cx, cy } = getCenter();
    addNode({
      type: 'text',
      x: cx - 50,
      y: cy - 20,
      text: 'Double click to edit',
      fontSize: 24,
      fontFamily: 'Inter',
      fill: '#000000',
    });
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const { cx, cy } = getCenter();
        addNode({
          type: 'image',
          x: cx - 150,
          y: cy - 100,
          src: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddRect = () => {
    const { cx, cy } = getCenter();
    addNode({
      type: 'shape',
      x: cx - 50,
      y: cy - 50,
      width: 100,
      height: 100,
      fill: '#3b82f6',
    });
  };

  const handleAddPolaroid = () => {
    const { cx, cy } = getCenter();
    addNode({
      type: 'polaroid',
      x: cx - 150, // groupWidth / 2
      y: cy - 180, // groupHeight / 2
      text: 'Add a caption...', // placeholder
    });
  };

  const handleApplyLayout = (layoutType: string) => {
    const { cx, cy } = getCenter();
    if (layoutType === 'grid-3') {
      // 3 Polaroids in a row
      addNode({ type: 'polaroid', x: cx - 500, y: cy - 180, text: 'Photo 1' });
      addNode({ type: 'polaroid', x: cx - 150, y: cy - 180, text: 'Photo 2' });
      addNode({ type: 'polaroid', x: cx + 200, y: cy - 180, text: 'Photo 3' });
    } else if (layoutType === 'staggered') {
      // 2 Polaroids staggered
      addNode({ type: 'polaroid', x: cx - 350, y: cy - 250, text: 'Top Left' });
      addNode({ type: 'polaroid', x: cx + 50, y: cy - 50, text: 'Bottom Right' });
    }
    setIsLayoutOpen(false);
  };

  const handlePromptSubmit = (value: string) => {
    const { cx, cy } = getCenter();

    if (promptType === 'date') {
      addNode({
        type: 'text',
        x: cx - 70,
        y: cy - 20,
        text: value,
        fontSize: 28,
        fontFamily: 'Oswald',
        fill: '#ef4444', 
      });
    } else if (promptType === 'location') {
      addNode({
        type: 'text',
        x: cx - 50,
        y: cy - 20,
        text: `📍 ${value}`,
        fontSize: 24,
        fontFamily: 'Inter',
        fill: '#000000',
      });
    } else if (promptType === 'tag') {
      addNode({
        type: 'text',
        x: cx - 50,
        y: cy - 20,
        text: `@${value}`,
        fontSize: 24,
        fontFamily: 'Caveat',
        fill: '#8b5cf6', 
      });
    }
  };

  return (
    <>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-3 flex flex-col gap-4 z-10">
        <button 
          onClick={handleAddText}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-900 hover:text-white transition-all group"
          title="Add Text"
        >
          <span className="text-xl font-bold font-serif group-hover:scale-110 transition-transform">T</span>
        </button>
        
        <button 
          onClick={handleAddImageClick}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-900 hover:text-white transition-all group relative overflow-hidden"
          title="Add Image or SVG"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input 
          type="file" 
          accept="image/*, .svg" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          className="hidden" 
        />

        <button 
          onClick={handleAddPolaroid}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-pink-500 hover:text-white transition-all group relative"
          title="Add Polaroid Frame"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white rounded-xl opacity-30" />
        </button>

        <div className="w-12 h-px bg-gray-200 my-1" />

        <button 
          onClick={() => setPromptType('date')}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-red-500 hover:text-white transition-all group"
          title="Add Date Stamp"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <button 
          onClick={() => setPromptType('location')}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-blue-500 hover:text-white transition-all group"
          title="Add Location Pin"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button 
          onClick={() => setPromptType('tag')}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-purple-500 hover:text-white transition-all group"
          title="Tag Person"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>

        <button 
          onClick={() => setIsStickerPickerOpen(true)}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-yellow-500 hover:text-white transition-all group"
          title="Add SVG Sticker"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>

        <div className="w-12 h-px bg-gray-200 my-1" />

        <button 
          onClick={() => setActiveTool(activeTool === 'select' ? 'draw' : 'select')}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all group ${activeTool === 'draw' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-indigo-500 hover:text-white'}`}
          title="Pen Tool"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        <button 
          onClick={() => setActiveTool(activeTool === 'erase' ? 'select' : 'erase')}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all group ${activeTool === 'erase' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white'}`}
          title="Eraser"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div className="w-12 h-px bg-gray-200 my-1" />

        <button 
          onClick={() => setIsLayoutOpen(!isLayoutOpen)}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all group ${isLayoutOpen ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-green-500 hover:text-white'}`}
          title="Layout Templates"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>

      {isLayoutOpen && (
        <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl rounded-xl p-4 flex flex-col gap-3 z-10 w-48">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Layout Templates</h3>
          <button 
            onClick={() => handleApplyLayout('grid-3')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            3-Photo Grid
          </button>
          <button 
            onClick={() => handleApplyLayout('staggered')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            Staggered Pair
          </button>
        </div>
      )}

      {activeTool === 'draw' && (
        <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl rounded-xl p-4 flex flex-col gap-2 z-10 w-48">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Smoothing (Tension)</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={drawTension} 
            onChange={(e) => setDrawTension(parseFloat(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
            <span>Rigid</span>
            <span>Smooth</span>
          </div>
        </div>
      )}

      {promptType && (
        <ToolPromptModal 
          type={promptType} 
          onClose={() => setPromptType(null)} 
          onSubmit={handlePromptSubmit} 
        />
      )}

      <StickerPickerModal 
        isOpen={isStickerPickerOpen} 
        onClose={() => setIsStickerPickerOpen(false)} 
        onSelect={(svgBase64) => {
          const { cx, cy } = getCenter();
          addNode({
            type: 'image',
            x: cx - 50,
            y: cy - 50,
            src: svgBase64,
          });
        }} 
      />
    </>
  );
}
