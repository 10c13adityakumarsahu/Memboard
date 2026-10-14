import React, { useState, useEffect } from 'react';
import { Group, Rect, Image as KonvaImage, Text } from 'react-konva';
import type { CanvasNode } from '../useCanvasStore';
import { useCanvasStore } from '../useCanvasStore';

interface PolaroidNodeProps {
  node: CanvasNode;
  isSelected: boolean;
}

export default function PolaroidNode({ node, isSelected }: PolaroidNodeProps) {
  const updateNode = useCanvasStore((state) => state.updateNode);
  const selectNode = useCanvasStore((state) => state.selectNode);

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
    const group = e.target;
    updateNode(node.id, {
      x: group.x(),
      y: group.y(),
      scaleX: group.scaleX(),
      scaleY: group.scaleY(),
      rotation: group.rotation()
    });
  };

  const handleImageDblClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updateNode(node.id, { src: event.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const groupWidth = 300;
  const groupHeight = 400; // Increased height for metadata
  const padding = 15;
  const imageWidth = groupWidth - (padding * 2);
  const imageHeight = 260; 

  return (
    <Group
      id={node.id}
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
    >
      {/* Polaroid White Frame */}
      <Rect
        width={groupWidth}
        height={groupHeight}
        fill="#ffffff"
        shadowColor={isSelected ? '#3b82f6' : 'rgba(0,0,0,0.15)'}
        shadowBlur={isSelected ? 10 : 15}
        shadowOffset={{ x: 5, y: 5 }}
        cornerRadius={2}
      />

      {/* Image Placeholder or Actual Image */}
      {imageObj ? (
        <KonvaImage
          image={imageObj}
          x={padding}
          y={padding}
          width={imageWidth}
          height={imageHeight}
          onDblClick={handleImageDblClick}
          onDblTap={handleImageDblClick}
        />
      ) : (
        <Rect
          x={padding}
          y={padding}
          width={imageWidth}
          height={imageHeight}
          fill="#f3f4f6" // gray-100
          onDblClick={handleImageDblClick}
          onDblTap={handleImageDblClick}
        />
      )}

      {/* Placeholder Text if no image */}
      {!imageObj && (
        <Text
          x={padding}
          y={padding + (imageHeight / 2) - 10}
          width={imageWidth}
          text="Double-click to add photo"
          fontSize={14}
          fontFamily="Inter"
          fill="#9ca3af"
          align="center"
          listening={false}
        />
      )}

      {/* Caption Text */}
      <Text
        x={padding}
        y={padding + imageHeight + 15}
        width={imageWidth}
        text={node.text || "Add a caption..."}
        fontSize={24}
        fontFamily="Caveat"
        fill="#374151"
        align="center"
      />

      {/* Date & Location */}
      <Text
        x={padding}
        y={groupHeight - 35}
        width={imageWidth / 2}
        text={node.date || "Add Date"}
        fontSize={10}
        fontFamily="Inter"
        fill="#9ca3af"
        align="left"
      />
      
      <Text
        x={padding + (imageWidth / 2)}
        y={groupHeight - 35}
        width={imageWidth / 2}
        text={node.location || "Add Location"}
        fontSize={10}
        fontFamily="Inter"
        fill="#9ca3af"
        align="right"
      />

      {/* Author Tag */}
      <Text
        x={padding}
        y={groupHeight - 15}
        width={imageWidth}
        text={node.author || "Guest User"}
        fontSize={10}
        fontFamily="Inter"
        fill="#d1d5db"
        align="center"
      />
    </Group>
  );
}
