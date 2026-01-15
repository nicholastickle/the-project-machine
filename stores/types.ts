import {
  type Edge as ReactFlowEdge,
  type Node as ReactFlowNode,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type OnInit,
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
  created_by: string; // Null if assistant/system
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

export type AppState = {
  nodes: Node[];
  edges: Edge[];
  tasks: Task[];
  history: { nodes: Node[]; edges: Edge[]; tasks: Task[] }[];
  historyIndex: number;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Node management methods
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addTaskNode: (taskData?: Partial<Task>, nodeOptions?: {
    position?: { x: number; y: number };
    id?: string;
  }) => string;
  deleteTaskNode: (nodeId: string) => void;
  connectTasks: (sourceId: string, targetId: string, handles?: { sourceHandle: string; targetHandle: string }) => void;

  // Task management methods
  updateTask: (taskId: string, data: Partial<Task>, saveToHistory?: boolean) => void;
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
  resetCanvas: () => void;
  undo: () => void;
  redo: () => void;
};

// Canvas component props
export interface CanvasProps {
  onInit?: OnInit<Node, Edge>;
};