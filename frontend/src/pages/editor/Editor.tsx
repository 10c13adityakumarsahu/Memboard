import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CanvasStage from '../../canvas/CanvasStage';
import TopBar from '../../components/editor/TopBar';
import Toolbar from '../../components/editor/Toolbar';
import PropertiesPanel from '../../components/editor/PropertiesPanel';
import ContextMenu from '../../components/editor/ContextMenu';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export default function Editor() {
  const { bookId } = useParams();
  const { selectedId, deleteNode, pageCount, setPageCount, stageConfig, setStageConfig } = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId) {
        // Prevent deleting if user is typing in an input/textarea
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          return;
        }
        deleteNode(selectedId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, deleteNode]);

  // In a real app, we would use the bookId to fetch the initial book data,
  // set up the Yjs room, and load the canvas state.

  const handleAddPage = () => {
    setPageCount(pageCount + 1);
    // Pan the camera down to the new page perfectly
    // The new page is at Y offset (pageCount * 1200)
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const targetY = window.innerHeight / 2 - 561 + (pageCount * 1200) + 561; // center of new page

    setStageConfig({
      ...stageConfig,
      y: cy - targetY * stageConfig.scale
    });
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-gray-100">
      <TopBar />
      <Toolbar />
      <PropertiesPanel />
      <ContextMenu />
      <CanvasStage />
      
      {/* Add Page Button */}
      <button
        onClick={handleAddPage}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 hover:text-black hover:scale-105 transition-all flex items-center gap-2 z-20"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Page
      </button>
    </div>
  );
}
