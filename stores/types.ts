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
  comments?: {
    id: string;
    memberId: string;
    memberName: string;
    comment: string;
    createdDate: string;
    editedDate?: string;
  }[];
  subtasks?: {
    id: string;
    title: string;
    isCompleted: boolean;
    estimatedDuration: number;
    timeSpent: number;
  }[];
  members?: {
    memberId: string;
    memberName: string;
    addedDate: string;
    removedDate?: string;
  }[];
}

// Types for TaskCard component
export interface TaskCardProps {
  id: string;
  data: TaskData;
}

// Type for saved tasks that get stored in the task book
export type SavedTask = {
  id: string;
  title: string;
  status: string;
  timeSpent: number;
  estimatedHours?: number;
  description?: string;
  comments?: string[];
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