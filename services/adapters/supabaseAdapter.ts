// =============================================================================
// SUPABASE ADAPTER (#TO-DO To be updated by Brighton)
// =============================================================================

import type { User, Project, Task, Subtask, TaskComment, ProjectMember, Node, Edge, ProjectData } from '@/stores/types';

export const supabaseAdapter = {
  auth: {
    signIn: async (email: string, otp: string): Promise<User> => {
      throw new Error('Supabase not implemented');
    },
    signUp: async (email: string, otp: string): Promise<User> => {
      throw new Error('Supabase not implemented');
    },
    signOut: async (): Promise<void> => {
      throw new Error('Supabase not implemented');
    },
    getCurrentUser: async (): Promise<User | null> => {
      throw new Error('Supabase not implemented');
    },
  },
  projects: {
    getAll: async (userId: string): Promise<Project[]> => { throw new Error('Supabase not implemented'); },
    getById: async (projectId: string): Promise<Project | null> => { throw new Error('Supabase not implemented'); },
    create: async (userId: string, project: any): Promise<Project> => { throw new Error('Supabase not implemented'); },
    update: async (projectId: string, updates: any): Promise<Project> => { throw new Error('Supabase not implemented'); },
    delete: async (projectId: string, userId: string): Promise<void> => { throw new Error('Supabase not implemented'); },
    getData: async (projectId: string): Promise<ProjectData | null> => { throw new Error('Supabase not implemented'); },
  },
  tasks: {
    getAll: async (projectId: string): Promise<Task[]> => { throw new Error('Supabase not implemented'); },
    getById: async (taskId: string, projectId: string): Promise<Task | null> => { throw new Error('Supabase not implemented'); },
    create: async (projectId: string, task: any): Promise<Task> => { throw new Error('Supabase not implemented'); },
    update: async (taskId: string, projectId: string, updates: any): Promise<Task> => { throw new Error('Supabase not implemented'); },
    delete: async (taskId: string, projectId: string): Promise<void> => { throw new Error('Supabase not implemented'); },
  },
  subtasks: {
    getByTask: async (taskId: string, projectId: string): Promise<Subtask[]> => { throw new Error('Supabase not implemented'); },
    create: async (projectId: string, subtask: any): Promise<Subtask> => { throw new Error('Supabase not implemented'); },
    update: async (subtaskId: string, projectId: string, updates: any): Promise<Subtask> => { throw new Error('Supabase not implemented'); },
    delete: async (subtaskId: string, projectId: string): Promise<void> => { throw new Error('Supabase not implemented'); },
  },
  comments: {
    getByTask: async (taskId: string, projectId: string): Promise<TaskComment[]> => { throw new Error('Supabase not implemented'); },
    create: async (projectId: string, comment: any): Promise<TaskComment> => { throw new Error('Supabase not implemented'); },
    delete: async (commentId: string, projectId: string): Promise<void> => { throw new Error('Supabase not implemented'); },
  },
  canvas: {
    getNodes: async (projectId: string): Promise<Node[]> => { throw new Error('Supabase not implemented'); },
    getEdges: async (projectId: string): Promise<Edge[]> => { throw new Error('Supabase not implemented'); },
    createNode: async (projectId: string, node: any): Promise<Node> => { throw new Error('Supabase not implemented'); },
    updateNode: async (nodeId: string, projectId: string, updates: any): Promise<Node> => { throw new Error('Supabase not implemented'); },
    deleteNode: async (nodeId: string, projectId: string): Promise<void> => { throw new Error('Supabase not implemented'); },
    createEdge: async (projectId: string, edge: any): Promise<Edge> => { throw new Error('Supabase not implemented'); },
    deleteEdge: async (edgeId: string, projectId: string): Promise<void> => { throw new Error('Supabase not implemented'); },
    saveCanvas: async (projectId: string, nodes: Node[], edges: Edge[]): Promise<void> => { throw new Error('Supabase not implemented'); },
  },
  members: {
    getByProject: async (projectId: string): Promise<ProjectMember[]> => { throw new Error('Supabase not implemented'); },
    add: async (projectId: string, member: ProjectMember): Promise<ProjectMember> => { throw new Error('Supabase not implemented'); },
    remove: async (projectId: string, userId: string): Promise<void> => { throw new Error('Supabase not implemented'); },
  },
};

