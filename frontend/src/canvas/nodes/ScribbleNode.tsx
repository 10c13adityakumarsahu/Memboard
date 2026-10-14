import React from 'react';
import { Line } from 'react-konva';
import { getStroke } from 'perfect-freehand';
import type { CanvasNode } from '../useCanvasStore';
import { useCanvasStore } from '../useCanvasStore';

interface ScribbleNodeProps {
  node: CanvasNode;
  isSelected: boolean;
}

export default function ScribbleNode({ node, isSelected }: ScribbleNodeProps) {
  const selectNode = useCanvasStore((state) => state.selectNode);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const updateNode = useCanvasStore((state) => state.updateNode);

  const handleDragEnd = (e: any) => {
    updateNode(node.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  // Convert flat [x1,y1, x2,y2] to [[x,y], [x,y]] for perfect-freehand
  const ptPairs = [];
  if (node.points) {
    for (let i = 0; i < node.points.length; i += 2) {
      ptPairs.push([node.points[i], node.points[i + 1]]);
    }
  }

  // Generate smooth stroke path
  const strokeData = getStroke(ptPairs, {
    size: node.fontSize || 5,
    thinning: node.tension || 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });
  
  // Flatten for Konva Line
  const flatStrokePoints = strokeData.reduce((acc: number[], pt: number[]) => {
    acc.push(pt[0], pt[1]);
    return acc;
  }, []);

  return (
    <Line
      x={node.x}
      y={node.y}
      points={flatStrokePoints}
      fill={node.fill || '#000000'}
      closed={true}
      draggable={activeTool === 'select'}
      onClick={() => {
        if (activeTool === 'select') selectNode(node.id);
      }}
      onTap={() => {
        if (activeTool === 'select') selectNode(node.id);
      }}
      onDragEnd={handleDragEnd}
      shadowColor={isSelected ? '#3b82f6' : undefined}
      shadowBlur={isSelected ? 10 : 0}
      globalCompositeOperation={
        node.globalCompositeOperation === 'destination-out' ? 'destination-out' : 'source-over'
      }
    />
  );
}
