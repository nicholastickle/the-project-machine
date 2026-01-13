import {
  type Edge as ReactFlowEdge,
  type Node as ReactFlowNode,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';



// --- Interfaces based on the ERD ---

export interface User {
  id: string; // uuid (PK)
  email: string;
  created_at: string;
}

export interface Project {
  id: string; // uuid (PK)
  name: string;
  created_by: string; // uuid (FK)
  viewport: { x: number; y: number; zoom: number }; // JSONB
  created_at: string;
  updated_at: string;
  archived_at?: string;
}

export interface ProjectMember {
  project_id: string; // uuid (FK)
  user_id: string; // uuid (FK)
  role: 'viewer' | 'editor' | 'admin';
}

export interface PendingInvitation {
  id: string;
  project_id: string;
  invited_email: string;
  role: 'editor' | 'viewer';
  invited_by: string;
  invite_token: string;
  expires_at: string;
  accepted_at: string;
  created_at: string;
}

export interface TaskbookEntry {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  category?: string;
  comments?: string;
  subtasks?: Subtask[];
  usage_count: number;
  created_at: string;
  updated_at: string;
  used_at?: string;
}

export interface AIChatThread {
  id: string;
  project_id: string;
  title: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AIChatMessage {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any; // JSONB
  created_by: string; // Null if assistant/system
}

export interface Node extends ReactFlowNode {
  id: string; // React Flow Node ID
  project_id: string;
  type: 'task' | 'chart' | 'note';
  position: { x: number; y: number }; // JSONB
  content_id: string; // FK to tasks.id
}

export interface Edge extends ReactFlowEdge {
  id: string; // React Flow Edge ID
  project_id: string;
  source: string; // references nodes.id
  target: string; // references nodes.id
  label?: string;
}

export interface Task {
  id: string;
  project_id: string;
  title?: string;
  description?: string;
  status: 'backlog' | 'planned' | 'in_progress' | 'stuck' | 'completed' | 'cancelled';
  estimated_hours: number; // in seconds
  time_spent: number; // in seconds
  sort_order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  members?: ProjectMember[];
  comments?: TaskComment[];
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  task_id?: string;
  title?: string;
  is_completed?: boolean;
  estimated_duration: number; // in seconds
  time_spent: number; // in seconds
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignment {
  project_id: string;
  user_id: string;
  role: 'editor' | 'viewer' | 'admin';
  joined_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type AppState = {

  nodes: Node[];
  edges: Edge[];

  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;

  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  addTaskNode: (nodeData?: Partial<Task> & {
  }) => string;

  deleteNode: (nodeId: string) => void;
  connectTasks: (sourceId: string, targetId: string, handles?: { sourceHandle: string; targetHandle: string }) => void;
  updateNodeData: (id: string, data: Partial<Task>, saveToHistory?: boolean) => void;
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