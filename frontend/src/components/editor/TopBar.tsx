import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export default function TopBar() {
  const navigate = useNavigate();
  const { stageConfig, setStageConfig, pageSize, setPageSize, pageOrientation, setPageOrientation, showBorder, setShowBorder, addNode } = useCanvasStore();
  const [title, setTitle] = useState('Untitled Book');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Unknown Location');
  const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
  const [isShapesOpen, setIsShapesOpen] = useState(false);

  const getCenter = () => {
    const cx = (window.innerWidth / 2 - stageConfig.x) / stageConfig.scale;
    const cy = (window.innerHeight / 2 - stageConfig.y) / stageConfig.scale;
    return { cx, cy };
  };

  const zoomTo = (newScale: number) => {
    if (newScale < 0.1 || newScale > 10) return;
    
    // Zoom relative to the center of the screen
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    const mousePointTo = {
      x: (cx - stageConfig.x) / stageConfig.scale,
      y: (cy - stageConfig.y) / stageConfig.scale,
    };
    
    setStageConfig({
      scale: newScale,
      x: cx - mousePointTo.x * newScale,
      y: cy - mousePointTo.y * newScale,
    });
  };

  const handleZoomIn = () => zoomTo(stageConfig.scale * 1.2);
  const handleZoomOut = () => zoomTo(stageConfig.scale / 1.2);

  const zoomPercent = Math.round(stageConfig.scale * 100);

  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-6 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="h-6 w-px bg-gray-300" />
        <div className="flex flex-col">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 m-0 w-48 hover:bg-gray-50 rounded truncate"
            title={title}
            placeholder="Book Title"
          />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none outline-none p-0 m-0 w-24 hover:bg-gray-50 rounded cursor-pointer"
            />
            <span>•</span>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-none outline-none p-0 m-0 w-32 hover:bg-gray-50 rounded"
              placeholder="Add Location"
            />
          </div>
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-medium ml-2">Draft</span>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />

        <div className="relative">
          <button 
            onClick={() => setIsPageSetupOpen(!isPageSetupOpen)}
            className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none hover:bg-gray-100 transition-colors ml-2"
          >
            Page Setup
          </button>
          
          {isPageSetupOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-4 w-64 z-50">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Page Dimensions</h3>
              
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-gray-700 block mb-1">Size</label>
                  <select 
                    value={pageSize} 
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="w-full text-sm border-gray-200 rounded bg-gray-50 p-1"
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">US Letter</option>
                    <option value="Square">Square</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-700 block mb-1">Orientation</label>
                  <select 
                    value={pageOrientation} 
                    onChange={(e) => setPageOrientation(e.target.value as any)}
                    className="w-full text-sm border-gray-200 rounded bg-gray-50 p-1"
                  >
                    <option value="Portrait">Portrait</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                  <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                  Show Page Border
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-200">
        <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-gray-600 shadow-sm transition-colors">-</button>
        <span className="text-sm font-medium w-12 text-center text-gray-700">{zoomPercent}%</span>
        <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-gray-600 shadow-sm transition-colors">+</button>
      </div>

      <div className="flex items-center gap-3">
        {/* Placeholder for collaborators */}
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 border-2 border-white shadow-sm" />
        </div>
        <div className="h-4 w-px bg-gray-300" />
        
        <div className="relative">
          <button 
            onClick={() => setIsShapesOpen(!isShapesOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Shapes
          </button>
          
          {isShapesOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-2 w-32 z-50 flex flex-col gap-1">
              <button 
                onClick={() => {
                  const { cx, cy } = getCenter();
                  addNode({ type: 'shape', x: cx - 50, y: cy - 50, width: 100, height: 100, fill: '#ef4444' });
                  setIsShapesOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-3 h-3 bg-red-500 rounded-sm" /> Square
              </button>
              <button 
                onClick={() => {
                  const { cx, cy } = getCenter();
                  addNode({ type: 'circle', x: cx, y: cy, fill: '#3b82f6' });
                  setIsShapesOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full" /> Circle
              </button>
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">
          Share
        </button>
      </div>
    </div>
  );
}
