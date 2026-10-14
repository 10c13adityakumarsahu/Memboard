import React from 'react';
import { Rect, Circle } from 'react-konva';
import type { CanvasNode } from '../useCanvasStore';
import { useCanvasStore } from '../useCanvasStore';
import Konva from 'konva';

interface ShapeNodeProps {
  node: CanvasNode;
  isSelected: boolean;
}

export default function ShapeNode({ node, isSelected }: ShapeNodeProps) {
  const { selectNode, updateNode } = useCanvasStore();

  const handleDragEnd = (e: any) => {
    updateNode(node.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    const shape = e.target;
    updateNode(node.id, {
      x: shape.x(),
      y: shape.y(),
      scaleX: shape.scaleX(),
      scaleY: shape.scaleY(),
      rotation: shape.rotation()
    });
  };

  const commonProps = {
    id: node.id,
    x: node.x,
    y: node.y,
    scaleX: node.scaleX || 1,
    scaleY: node.scaleY || 1,
    rotation: node.rotation || 0,
    fill: node.fill || '#000000',
    draggable: true,
    onClick: () => selectNode(node.id),
    onTap: () => selectNode(node.id),
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    shadowColor: isSelected ? '#3b82f6' : undefined,
    shadowBlur: isSelected ? 10 : 0,
  };

  return (
    <>
      {node.type === 'shape' ? (
        <Rect
          {...commonProps}
          width={node.width || 100}
          height={node.height || 100}
        />
      ) : (
        <Circle
          {...commonProps}
          radius={50} // Base radius
        />
      )}
    </>
  );
}
