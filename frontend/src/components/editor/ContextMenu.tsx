import React from 'react';
import { useCanvasStore } from '../../canvas/useCanvasStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContextMenu() {
  const { nodes, selectedId, updateNode, deleteNode, bringForward, sendBackward } = useCanvasStore();

  const selectedNode = nodes.find((n) => n.id === selectedId);

  if (!selectedNode) return null;

  const handleColorChange = (color: string) => {
    updateNode(selectedNode.id, { fill: color });
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNode(selectedNode.id, { fontFamily: e.target.value });
  };

  const colors = ['#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Raleway', 'Oswald', 
    'Playfair Display', 'Caveat', 'Pacifico', 'Comic Neue'
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute right-6 top-24 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-4 w-64 z-20 flex flex-col gap-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Properties</h3>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => sendBackward(selectedNode.id)}
              className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              title="Send Backward"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <button 
              onClick={() => bringForward(selectedNode.id)}
              className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              title="Bring Forward"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
            <button 
              onClick={() => deleteNode(selectedNode.id)}
              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors ml-1"
              title="Delete Item (Backspace)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Font Picker (Only for text) */}
        {selectedNode.type === 'text' && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Font Family</label>
            <select 
              value={selectedNode.fontFamily || 'Inter'}
              onChange={handleFontChange}
              className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-50"
            >
              {fonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
              ))}
            </select>
          </div>
        )}

        {/* Color Picker (Only for text or shape) */}
        {(selectedNode.type === 'text' || selectedNode.type === 'shape') && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border shadow-sm hover:scale-110 transition-transform ${
                    selectedNode.fill === color ? 'ring-2 ring-black ring-offset-2' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
