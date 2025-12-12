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
    id: string;
    title: string;
    isCompleted: boolean;
    estimatedDuration: number;
    timeSpent: number;
  }>;
};

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  history: { nodes: AppNode[]; edges: Edge[] }[];
  historyIndex: number;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addTaskNode: (nodeData?: {
    title?: string;
    position?: { x: number; y: number };
    status?: string;
    estimatedHours?: number;
    timeSpent?: number;
    description?: string;
    subtasks?: {
      id: string;
      title: string;
      isCompleted: boolean;
      estimatedDuration: number;
      timeSpent: number;
    }[]
  }) => string;
  deleteNode: (nodeId: string) => void;
  connectTasks: (sourceId: string, targetId: string, handles?: { sourceHandle: string; targetHandle: string }) => void;
  resetCanvas: () => void;
  updateNodeData: (id: string, data: Partial<{
    title: string;
    status: string;
    timeSpent: number;
    estimatedHours: number;
    description: string;
    subtasks: {
      id: string;
      title: string;
      isCompleted: boolean;
      estimatedDuration: number;
      timeSpent: number;
    }[]
  }>, saveToHistory?: boolean) => void;
  addSubtask: (nodeId: string) => void;
  updateSubtask: (nodeId: string, subtaskId: string, data: Partial<{
    id: string;
    title: string;
    isCompleted: boolean;
    estimatedDuration: number;
    timeSpent: number;
  }>) => void;
  deleteSubtask: (nodeId: string, subtaskId: string) => void;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
};