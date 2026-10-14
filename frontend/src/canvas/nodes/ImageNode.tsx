import React, { useState, useEffect } from 'react';
import { Image as KonvaImage } from 'react-konva';
import type { CanvasNode } from '../useCanvasStore';
import { useCanvasStore } from '../useCanvasStore';

interface ImageNodeProps {
  node: CanvasNode;
  isSelected: boolean;
}

export default function ImageNode({ node, isSelected }: ImageNodeProps) {
  const { selectNode, updateNode } = useCanvasStore();
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (node.src) {
      const img = new window.Image();
      img.src = node.src;
      img.onload = () => {
        setImageObj(img);
      };
    }
  }, [node.src]);

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

  if (!imageObj) return null;

  return (
    <KonvaImage
      id={node.id}
      image={imageObj}
      x={node.x}
      y={node.y}
      scaleX={node.scaleX || 1}
      scaleY={node.scaleY || 1}
      rotation={node.rotation || 0}
      draggable
      onClick={() => selectNode(node.id)}
      onTap={() => selectNode(node.id)}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      shadowColor={isSelected ? '#3b82f6' : undefined}
      shadowBlur={isSelected ? 10 : 0}
    />
  );
}
