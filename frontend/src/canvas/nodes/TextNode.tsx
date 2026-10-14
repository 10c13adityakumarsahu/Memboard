import React, { useRef, useEffect, useState } from 'react';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import type { CanvasNode } from '../useCanvasStore';
import { useCanvasStore } from '../useCanvasStore';
import Konva from 'konva';

interface TextNodeProps {
  node: CanvasNode;
  isSelected: boolean;
}

export default function TextNode({ node, isSelected }: TextNodeProps) {
  const { selectNode, updateNode } = useCanvasStore();
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(node.text || '');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

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

  const handleBlur = () => {
    setIsEditing(false);
    updateNode(node.id, { text: textValue });
  };

  return (
    <>
      <Text
        id={node.id}
        onClick={() => selectNode(node.id)}
        onTap={() => selectNode(node.id)}
        onDblClick={handleDoubleClick}
        onDblTap={handleDoubleClick}
        {...node}
        visible={!isEditing}
        draggable={!isEditing}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isEditing && (
        <Html
          divProps={{
            style: {
              position: 'absolute',
              top: `${node.y}px`,
              left: `${node.x}px`,
              width: `${(node.width || 100) * (node.scaleX || 1)}px`,
              transform: `rotate(${node.rotation || 0}deg)`,
              transformOrigin: 'top left',
            },
          }}
        >
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleBlur();
              }
            }}
            autoFocus
            style={{
              width: '100%',
              height: `${(node.height || 50) * (node.scaleY || 1)}px`,
              fontSize: `${(node.fontSize || 24) * (node.scaleY || 1)}px`, // approximate scaling for edit mode
              fontFamily: node.fontFamily || 'Inter',
              color: node.fill || '#000000',
              border: '1px solid #3b82f6',
              padding: '0px',
              margin: '0px',
              background: 'transparent',
              outline: 'none',
              resize: 'none',
              overflow: 'hidden',
              lineHeight: 1,
            }}
          />
        </Html>
      )}
    </>
  );
}
