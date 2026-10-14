import React from 'react';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export default function PropertiesPanel() {
  const { selectedId, nodes, updateNode, deleteNode } = useCanvasStore();

  if (!selectedId) return null;

  const node = nodes.find((n) => n.id === selectedId);
  if (!node) return null;

  const handleChange = (field: string, value: any) => {
    updateNode(node.id, { [field]: value });
  };

  return (
    <div className="absolute right-6 top-24 w-72 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 z-40 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold text-gray-800 capitalize">{node.type} Properties</h3>
        <button 
          onClick={() => deleteNode(node.id)}
          className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition-colors"
        >
          Delete
        </button>
      </div>

      {node.type === 'polaroid' && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Caption</label>
            <textarea 
              value={node.text || ''} 
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Add a caption..."
              className="text-sm p-2 bg-gray-50 border border-gray-200 rounded outline-none focus:border-indigo-400 focus:bg-white transition-colors resize-none h-20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
            <input 
              type="date"
              value={node.date || ''} 
              onChange={(e) => handleChange('date', e.target.value)}
              className="text-sm p-2 bg-gray-50 border border-gray-200 rounded outline-none focus:border-indigo-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
            <input 
              type="text"
              value={node.location || ''} 
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Paris, France"
              className="text-sm p-2 bg-gray-50 border border-gray-200 rounded outline-none focus:border-indigo-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</label>
            <input 
              type="text"
              value={node.author || ''} 
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Your Name"
              className="text-sm p-2 bg-gray-50 border border-gray-200 rounded outline-none focus:border-indigo-400 focus:bg-white transition-colors"
            />
          </div>
        </>
      )}

      {(node.type === 'shape' || node.type === 'circle' || node.type === 'text' || node.type === 'scribble') && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Color Fill</label>
          <div className="flex items-center gap-2">
            <input 
              type="color"
              value={node.fill || '#000000'} 
              onChange={(e) => handleChange('fill', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            />
            <span className="text-xs text-gray-500 uppercase font-mono">{node.fill || '#000000'}</span>
          </div>
        </div>
      )}

      {node.type === 'text' && (
        <div className="flex flex-col gap-1 mt-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Text Content</label>
          <textarea 
            value={node.text || ''} 
            onChange={(e) => handleChange('text', e.target.value)}
            className="text-sm p-2 bg-gray-50 border border-gray-200 rounded outline-none focus:border-indigo-400 focus:bg-white transition-colors resize-none h-24"
          />
        </div>
      )}
    </div>
  );
}
