import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';
import { Html } from 'react-konva-utils';
import { useCanvasStore } from './useCanvasStore';
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import ShapeNode from './nodes/ShapeNode';
import PolaroidNode from './nodes/PolaroidNode';
import ScribbleNode from './nodes/ScribbleNode';
import TransformerNode from './nodes/TransformerNode';
import BackgroundPickerModal from '../components/editor/BackgroundPickerModal';
import Konva from 'konva';
import useImage from 'use-image';

export default function CanvasStage() {
  const { nodes, selectedId, selectNode, stageConfig, setStageConfig, pages, activeTool, drawTension, addNode, updateNode, undo, redo, pageSize, pageOrientation, showBorder } = useCanvasStore();
  const stageRef = useRef<Konva.Stage>(null);
  const isDrawing = useRef(false);
  const currentLineId = useRef<string | null>(null);
  const [editingBackgroundPageId, setEditingBackgroundPageId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const [floralPattern] = useImage('https://www.transparenttextures.com/patterns/floral-motif.png', 'anonymous');
  const [kraftPattern] = useImage('https://www.transparenttextures.com/patterns/cream-paper.png', 'anonymous');
  const [ruledPattern] = useImage('https://www.transparenttextures.com/patterns/notebook.png', 'anonymous');
  const [gridPattern] = useImage('https://www.transparenttextures.com/patterns/graphy.png', 'anonymous');
  const [dotGridPattern] = useImage('https://www.transparenttextures.com/patterns/dot-grid.png', 'anonymous');

  const getPatternImage = (themeId: string) => {
    switch (themeId) {
      case 'floral':
        return floralPattern;
      case 'kraft':
        return kraftPattern;
      case 'ruled':
        return ruledPattern;
      case 'grid':
        return gridPattern;
      case 'dot-grid':
        return dotGridPattern;
      default:
        return null;
    }
  };

  const getPageDimensions = () => {
    let w = 794;
    let h = 1123;
    if (pageSize === 'Letter') {
      w = 816;
      h = 1056;
    } else if (pageSize === 'Square') {
      w = 1000;
      h = 1000;
    }
    
    if (pageOrientation === 'Landscape') {
      return { width: h, height: w };
    }
    return { width: w, height: h };
  };
  const { width: artboardWidth, height: artboardHeight } = getPageDimensions();

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Deselect logic
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name().startsWith('artboard') || e.target.name() === 'canvas-background';
    if (clickedOnEmpty && activeTool === 'select') {
      selectNode(null);
    }

    // Drawing logic
    if (activeTool === 'draw' || activeTool === 'erase') {
      isDrawing.current = true;
      const pos = e.target.getStage()?.getRelativePointerPosition();
      if (!pos) return;

      const id = Date.now().toString(); // temporary unique id
      currentLineId.current = id;
      
      addNode({
        id: id, 
        type: 'scribble',
        x: 0,
        y: 0,
        points: [pos.x, pos.y],
        tension: drawTension,
        fill: activeTool === 'erase' ? '#ffffff' : '#000000', // Basic erase by drawing white (could also use destination-out)
        fontSize: activeTool === 'erase' ? 20 : 5, // Stroke width
        globalCompositeOperation: activeTool === 'erase' ? 'destination-out' : 'source-over'
      });
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing.current || (activeTool !== 'draw' && activeTool !== 'erase')) return;

    const stage = e.target.getStage();
    const point = stage?.getRelativePointerPosition();
    if (!point) return;

    // Find the last node (which should be our current line)
    const lastNode = nodes[nodes.length - 1];
    if (lastNode && lastNode.type === 'scribble') {
      updateNode(lastNode.id, {
        points: lastNode.points?.concat([point.x, point.y])
      });
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    currentLineId.current = null;
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    if (!e.evt.ctrlKey) {
      // PANNING
      setStageConfig({
        ...stageConfig,
        x: stageConfig.x - e.evt.deltaX,
        y: stageConfig.y - e.evt.deltaY,
      });
      return;
    }

    // ZOOMING
    const scaleBy = 1.1;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stageConfig.x) / oldScale,
      y: (pointer.y - stageConfig.y) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    if (newScale < 0.1 || newScale > 10) return;

    setStageConfig({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // If the stage itself is being dragged, don't auto-pan
    if (e.target === stageRef.current) return;

    const pointer = stageRef.current?.getPointerPosition();
    if (!pointer) return;

    const edgeThreshold = 50;
    const panSpeed = 10;
    
    let dx = 0;
    let dy = 0;

    if (pointer.x < edgeThreshold) dx = panSpeed;
    if (pointer.x > window.innerWidth - edgeThreshold) dx = -panSpeed;
    if (pointer.y < edgeThreshold) dy = panSpeed;
    if (pointer.y > window.innerHeight - edgeThreshold) dy = -panSpeed;

    if (dx !== 0 || dy !== 0) {
      setStageConfig({
        ...stageConfig,
        x: stageConfig.x + dx,
        y: stageConfig.y + dy,
      });
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 overflow-hidden" id="canvas-container">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        scaleX={stageConfig.scale}
        scaleY={stageConfig.scale}
        x={stageConfig.x}
        y={stageConfig.y}
        draggable={activeTool === 'select'}
        ref={stageRef}
        onDragMove={handleDragMove}
        onDragEnd={(e) => {
          // If stage was dragged
          if (e.target === stageRef.current) {
            setStageConfig({
              scale: stageConfig.scale,
              x: e.target.x(),
              y: e.target.y()
            });
          }
        }}
      >
        <Layer>
          {/* Infinite Background */}
          <Rect
            x={-10000}
            y={-10000}
            width={20000}
            height={20000}
            fill="#e5e7eb" // Tailwind gray-200
            name="canvas-background"
            listening={true}
          />

          {pages.map((page, index) => {
            const patternImage = getPatternImage(page.themeId);
            const yOffset = window.innerHeight / 2 - (artboardHeight / 2) + (index * (artboardHeight + 100));
            const xOffset = window.innerWidth / 2 - (artboardWidth / 2);
            
            return (
              <Group key={`artboard-${page.id}`}>
                {/* Base Color Background */}
                <Rect
                  x={xOffset}
                  y={yOffset}
                  width={artboardWidth}
                  height={artboardHeight}
                  fill={page.pageColor}
                  shadowColor="rgba(0,0,0,0.1)"
                  shadowBlur={20}
                  shadowOffset={{ x: 0, y: 10 }}
                  stroke={showBorder ? '#d1d5db' : undefined}
                  strokeWidth={showBorder ? 2 : 0}
                  name={`artboard-${index}`}
                  listening={true}
                />
                {/* Pattern Overlay */}
                {patternImage && (
                  <Rect
                    x={xOffset}
                    y={yOffset}
                    width={artboardWidth}
                    height={artboardHeight}
                    fillPatternImage={patternImage}
                    fillPatternRepeat="repeat"
                    listening={false}
                  />
                )}
                
                {/* HTML Overlay for Edit Button */}
                <Html
                  divProps={{
                    style: {
                      position: 'absolute',
                      top: `${yOffset + 10}px`,
                      left: `${xOffset + artboardWidth - 110}px`,
                    },
                  }}
                >
                  <button
                    onClick={() => setEditingBackgroundPageId(page.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white/80 hover:bg-white backdrop-blur-md rounded-lg shadow-sm border border-gray-200 transition-colors pointer-events-auto"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                </Html>
              </Group>
            );
          })}

          {/* Add Page Button */}
          <Html
            divProps={{
              style: {
                position: 'absolute',
                top: `${(window.innerHeight / 2 - (artboardHeight / 2)) + (pages.length * (artboardHeight + 100)) - 50}px`,
                left: `${(window.innerWidth / 2) - 60}px`,
              },
            }}
          >
            <button
              onClick={() => useCanvasStore.getState().addPage()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-white hover:bg-indigo-50 hover:text-indigo-700 rounded-xl shadow-md border border-indigo-100 transition-colors pointer-events-auto"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Page
            </button>
          </Html>
          
          {nodes.map((node) => {
            const isSelected = node.id === selectedId;
            if (node.type === 'text') {
              return <TextNode key={node.id} node={node} isSelected={isSelected} />;
            } else if (node.type === 'image') {
              return <ImageNode key={node.id} node={node} isSelected={isSelected} />;
            } else if (node.type === 'shape' || node.type === 'circle') {
              return <ShapeNode key={node.id} node={node} isSelected={isSelected} />;
            } else if (node.type === 'polaroid') {
              return <PolaroidNode key={node.id} node={node} isSelected={isSelected} />;
            } else if (node.type === 'scribble') {
              return <ScribbleNode key={node.id} node={node} isSelected={isSelected} />;
            }
            return null;
          })}
          
          <TransformerNode />
        </Layer>
      </Stage>
      {editingBackgroundPageId && (
        <BackgroundPickerModal
          pageId={editingBackgroundPageId}
          isOpen={true}
          onClose={() => setEditingBackgroundPageId(null)}
        />
      )}
    </div>
  );
}
