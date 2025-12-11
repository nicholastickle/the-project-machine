import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';

export type AppNode = Node;

export type SavedTask = {
  id: string;
  title: string;
  description?: string;
  status: string;
  estimatedHours?: number;
  timeSpent: number;
  savedAt: string;
  lastUpdated: string;
  lastUsed?: string;
  subtasks?: Array<{
    name: string;
    estimated: string;
    timeSpent: string;
  }>;
};

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  history: { nodes: AppNode[]; edges: Edge[] }[];
  historyIndex: number;
  savedTasks: SavedTask[];
  hasNewTask: boolean;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addTaskNode: (nodeData?: { title?: string; position?: { x: number; y: number }; status?: string; estimatedHours?: number; timeSpent?: number }) => string;
  deleteNode: (nodeId: string) => void;
  connectTasks: (sourceId: string, targetId: string, handles?: { sourceHandle: string; targetHandle: string }) => void;
  resetCanvas: () => void;
  updateNodeData: (id: string, data: Partial<{ title: string; status: string; timeSpent: number; estimatedHours: number }>, saveToHistory?: boolean) => void;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  addSavedTask: (task: Omit<SavedTask, 'id' | 'savedAt' | 'lastUpdated'>) => void;
  clearNewTaskIndicator: () => void;
};