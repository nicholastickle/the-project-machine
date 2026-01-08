import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';

export type AppNode = Node;

// Base type for task data
export interface TaskData {
  title: string;
  status: string;
  timeSpent?: number;
  estimatedHours?: number;
  description?: string;
  comments?: string;
  subtasks?: {
    id: string;
    title: string;
    isCompleted: boolean;
    estimatedDuration: number;
    timeSpent: number;
  }[];
  members?: string[];
}

// Types for TaskCard component
export interface TaskCardProps {
  id: string;
  data: TaskData;
}

// Types for EditableTitle component
export interface TaskCardTitleProps {
  nodeId: string;
  title: string;
}

// Type for saved tasks that get stored in the task book
export type SavedTask = {
  id: string;
  title: string;
  status: string;
  timeSpent: number;
  estimatedHours?: number;
  description?: string;
  comments?: string;
  subtasks?: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    estimatedDuration: number;
    timeSpent: number;
  }>;
  savedAt: string;
  lastUpdated: string;
  lastUsed?: string;
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

  addTaskNode: (nodeData?: Partial<TaskData> & {
    position?: { x: number; y: number };
  }) => string;

  deleteNode: (nodeId: string) => void;

  connectTasks: (sourceId: string, targetId: string, handles?: { sourceHandle: string; targetHandle: string }) => void;

  

  updateNodeData: (id: string, data: Partial<TaskData>, saveToHistory?: boolean) => void;

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
  resetCanvas: () => void;

  undo: () => void;
  redo: () => void;
};