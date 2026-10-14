import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; // Need to install uuid

export type NodeType = 'text' | 'image' | 'shape' | 'circle' | 'polaroid' | 'scribble';

export interface CanvasNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  fill?: string;
  text?: string;
  src?: string; // For images
  fontSize?: number;
  fontFamily?: string;
  points?: number[]; // For scribbles
  tension?: number; // For scribbles
}

interface CanvasState {
  nodes: CanvasNode[];
  past: CanvasNode[][];
  future: CanvasNode[][];
  selectedId: string | null;
  stageConfig: { scale: number; x: number; y: number };
  pages: { id: string; themeId: string; pageColor: string }[];
  pageSize: 'A4' | 'Letter' | 'Square';
  activeTool: 'select' | 'draw' | 'erase';
  drawTension: number;
  
  // Actions
  addNode: (node: Omit<CanvasNode, 'id'>) => void;
  updateNode: (id: string, attrs: Partial<CanvasNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  setStageConfig: (config: { scale: number; x: number; y: number }) => void;
  
  // Page actions
  addPage: () => void;
  removePage: (pageId: string) => void;
  updatePageBackground: (pageId: string, themeId: string, pageColor: string) => void;
  
  setPageSize: (size: 'A4' | 'Letter' | 'Square') => void;
  setPageOrientation: (orientation: 'Portrait' | 'Landscape') => void;
  setShowBorder: (show: boolean) => void;
  setActiveTool: (tool: 'select' | 'draw' | 'erase') => void;
  setDrawTension: (tension: number) => void;
  undo: () => void;
  redo: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  past: [],
  future: [],
  selectedId: null,
  stageConfig: { scale: 1, x: 0, y: 0 },
  pages: [{ id: uuidv4(), themeId: 'default', pageColor: '#ffffff' }],
  pageSize: 'A4',
  pageOrientation: 'Portrait',
  showBorder: false,
  activeTool: 'select',
  drawTension: 0.5,

  addNode: (node) => set((state) => {
    const newNodes = [...state.nodes, { ...node, id: uuidv4() }];
    return {
      nodes: newNodes,
      past: [...state.past, state.nodes],
      future: []
    };
  }),

  updateNode: (id, attrs) => set((state) => {
    const newNodes = state.nodes.map((node) => (node.id === id ? { ...node, ...attrs } : node));
    return {
      nodes: newNodes,
      past: [...state.past, state.nodes],
      future: []
    };
  }),

  deleteNode: (id) => set((state) => {
    const newNodes = state.nodes.filter((node) => node.id !== id);
    return {
      nodes: newNodes,
      selectedId: state.selectedId === id ? null : state.selectedId,
      past: [...state.past, state.nodes],
      future: []
    };
  }),

  selectNode: (id) => set({ selectedId: id }),

  bringForward: (id) => set((state) => {
    const nodes = [...state.nodes];
    const index = nodes.findIndex(n => n.id === id);
    if (index < nodes.length - 1 && index !== -1) {
      const temp = nodes[index];
      nodes[index] = nodes[index + 1];
      nodes[index + 1] = temp;
    }
    return { nodes };
  }),

  sendBackward: (id) => set((state) => {
    const nodes = [...state.nodes];
    const index = nodes.findIndex(n => n.id === id);
    if (index > 0) {
      const temp = nodes[index];
      nodes[index] = nodes[index - 1];
      nodes[index - 1] = temp;
    }
    return { nodes };
  }),

  setStageConfig: (config) => set({ stageConfig: config }),
  
  addPage: () => set((state) => ({
    pages: [...state.pages, { id: uuidv4(), themeId: 'default', pageColor: '#ffffff' }]
  })),
  
  removePage: (pageId) => set((state) => ({
    pages: state.pages.filter(p => p.id !== pageId)
  })),
  
  updatePageBackground: (pageId, themeId, pageColor) => set((state) => ({
    pages: state.pages.map(p => p.id === pageId ? { ...p, themeId, pageColor } : p)
  })),

  setPageSize: (size) => set({ pageSize: size }),
  setPageOrientation: (orientation) => set({ pageOrientation: orientation }),
  setShowBorder: (show) => set({ showBorder: show }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setDrawTension: (tension) => set({ drawTension: tension }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    return {
      past: newPast,
      nodes: previous,
      future: [state.nodes, ...state.future]
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      past: [...state.past, state.nodes],
      nodes: next,
      future: newFuture
    };
  })
}));
