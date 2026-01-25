// ======================================================================
// TYPES DEFINITIONS
// ======================================================================

import {
  type Edge as ReactFlowEdge,
  type Node as ReactFlowNode,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type OnInit,
} from '@xyflow/react';

export interface User {
  id: string; // uuid (PK)
  email: string;
  created_at: string;
  name?: string;
  avatar_url?: string;
}
export interface Project {
  id: string; // uuid (PK)
  name: string;
  description?: string;
  created_by: string; // uuid (FK)
  viewport: { x: number; y: number; zoom: number }; // JSONB
  created_at: string;
  updated_at: string;
  archived_at?: string;
}
export interface ProjectMember {
  project_id: string; // uuid (FK)
  user_id: string; // uuid (FK)
  name?: string;
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
  created_by: string | null;
}
export interface Node extends ReactFlowNode {
  project_id: string;
  content_id: string; // FK to tasks.id

  //React Flow data already includes id, type, position, and data, so these are excluded from the above.
}
export interface Edge extends ReactFlowEdge {
  id: string; // React Flow Edge ID
  project_id: string;
  source: string; // references nodes.id
  target: string; // references nodes.id
  label?: string;
  type?: string;
}
export interface Task {
  id: string;
  node_id: string;
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
  user_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}
export interface ProjectData {
  project: Project;
  tasks: Task[];
  subtasks: Subtask[];
  comments: TaskComment[];
  nodes: Node[];
  edges: Edge[];
  members: ProjectMember[];
}

// Extended ProjectData with canvas-specific state for project store
export interface ProjectStoreData extends ProjectData {
  history: { nodes: Node[]; edges: Edge[]; tasks: Task[] }[];
  historyIndex: number;
  cursorMode: CursorMode;
}

export type CursorMode = 'select' | 'pan';

export type AppState = {
  nodes: Node[];
  edges: Edge[];
  tasks: Task[];
  history: { nodes: Node[]; edges: Edge[]; tasks: Task[] }[];
  historyIndex: number;
  projectId: string | null;
  lastSavedAt: string | null;
  isDirty: boolean;
  isSaving: boolean;

  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  cursorMode: CursorMode;

  // Node management methods
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setTasks: (tasks: Task[]) => void;
  setProjectId: (projectId: string | null) => void;
  markDirty: () => void;
  markClean: () => void;

  addTaskNode: (taskData?: Partial<Task>, nodeOptions?: {
    position?: { x: number; y: number };
    id?: string;
  }) => Promise<string>;
  deleteTaskNode: (nodeId: string) => void;
  connectTasks: (sourceId: string, targetId: string, handles?: { sourceHandle: string; targetHandle: string }) => void;

  // Task management methods
  updateTask: (taskId: string, data: Partial<Task>, saveToHistory?: boolean) => Promise<void>;
  addSubtask: (taskId: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, data: Partial<Subtask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Helper methods
  getTaskByNodeId: (nodeId: string) => Task | undefined;
  getNodeByTaskId: (taskId: string) => Node | undefined;

  // Legacy method (will be removed after refactor)
  updateNodeData: (id: string, data: Partial<Task>, saveToHistory?: boolean) => void;

  // History and utility methods
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Cursor mode methods
  setCursorMode: (mode: CursorMode) => void;

  // Project sync methods
  syncWithActiveProject: () => void;
  saveToActiveProject: () => void;

};

// Canvas component props
export interface CanvasProps {
  onInit?: OnInit<Node, Edge>;
};