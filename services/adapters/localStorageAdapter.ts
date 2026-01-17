// =========================================================================
// LOCAL STORAGE ADAPTER
// =========================================================================

import { v4 as uuidv4 } from 'uuid';
import type { User, Project, Task, Subtask, TaskComment, ProjectMember, Node, Edge, ProjectData } from '@/stores/types';
import { storageKeys } from '@/utils/storage';

export const localStorageAdapter = {
  // ==================== AUTH ====================
  auth: {
    signIn: async (email: string, otp: string): Promise<User> => {
      // Mock sign in - always succeeds with dev user
      const userJson = localStorage.getItem(storageKeys.user('user-dev-123'));
      if (!userJson) throw new Error('User not found');
      return JSON.parse(userJson);
    },

    signUp: async (email: string, otp: string): Promise<User> => {
      const newUser: User = {
        id: uuidv4(),
        email,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(storageKeys.user(newUser.id), JSON.stringify(newUser));
      return newUser;
    },

    signOut: async (): Promise<void> => {
      // Mock sign out
      console.log('User signed out (mock)');
    },

    getCurrentUser: async (): Promise<User | null> => {
      const userJson = localStorage.getItem(storageKeys.user('user-dev-123'));
      return userJson ? JSON.parse(userJson) : null;
    },
  },

  // ==================== PROJECTS ====================
  projects: {
    getAll: async (userId: string): Promise<Project[]> => {
      const projectsJson = localStorage.getItem(storageKeys.projects(userId));
      return projectsJson ? JSON.parse(projectsJson) : [];
    },

    getById: async (projectId: string): Promise<Project | null> => {
      const dataJson = localStorage.getItem(storageKeys.projectData(projectId));
      if (!dataJson) return null;
      const data: ProjectData = JSON.parse(dataJson);
      return data.project;
    },

    create: async (userId: string, project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
      const newProject: Project = {
        ...project,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to projects list
      const projects = await localStorageAdapter.projects.getAll(userId);
      projects.push(newProject);
      localStorage.setItem(storageKeys.projects(userId), JSON.stringify(projects));

      // Create empty project data
      const projectData: ProjectData = {
        project: newProject,
        tasks: [],
        subtasks: [],
        comments: [],
        nodes: [],
        edges: [],
        members: [{
          project_id: newProject.id,
          user_id: userId,
          name: undefined, // Will be populated when user data is available
          role: 'admin',
        }],
      };
      localStorage.setItem(storageKeys.projectData(newProject.id), JSON.stringify(projectData));

      return newProject;
    },

    update: async (projectId: string, updates: Partial<Project>): Promise<Project> => {
      const dataJson = localStorage.getItem(storageKeys.projectData(projectId));
      if (!dataJson) throw new Error('Project not found');
      
      const data: ProjectData = JSON.parse(dataJson);
      const updatedProject = {
        ...data.project,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      data.project = updatedProject;
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      // Update in projects list
      const projects = await localStorageAdapter.projects.getAll(data.project.created_by);
      const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
      localStorage.setItem(storageKeys.projects(data.project.created_by), JSON.stringify(updatedProjects));
      
      return updatedProject;
    },

    delete: async (projectId: string, userId: string): Promise<void> => {
      localStorage.removeItem(storageKeys.projectData(projectId));
      
      const projects = await localStorageAdapter.projects.getAll(userId);
      const filtered = projects.filter(p => p.id !== projectId);
      localStorage.setItem(storageKeys.projects(userId), JSON.stringify(filtered));
    },

    getData: async (projectId: string): Promise<ProjectData | null> => {
      const dataJson = localStorage.getItem(storageKeys.projectData(projectId));
      return dataJson ? JSON.parse(dataJson) : null;
    },
  },

  // ==================== TASKS ====================
  tasks: {
    getAll: async (projectId: string): Promise<Task[]> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      return data?.tasks || [];
    },

    getById: async (taskId: string, projectId: string): Promise<Task | null> => {
      const tasks = await localStorageAdapter.tasks.getAll(projectId);
      return tasks.find(t => t.id === taskId) || null;
    },

    create: async (projectId: string, task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      const newTask: Task = {
        ...task,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      data.tasks.push(newTask);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      return newTask;
    },

    update: async (taskId: string, projectId: string, updates: Partial<Task>): Promise<Task> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      const taskIndex = data.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) throw new Error('Task not found');

      data.tasks[taskIndex] = {
        ...data.tasks[taskIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      return data.tasks[taskIndex];
    },

    delete: async (taskId: string, projectId: string): Promise<void> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      data.tasks = data.tasks.filter(t => t.id !== taskId);
      data.subtasks = data.subtasks.filter(s => s.task_id !== taskId);
      data.comments = data.comments.filter(c => c.task_id !== taskId);
      data.nodes = data.nodes.filter(n => n.content_id !== taskId);

      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
    },
  },

  // ==================== SUBTASKS ====================
  subtasks: {
    getByTask: async (taskId: string, projectId: string): Promise<Subtask[]> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      return data?.subtasks.filter(s => s.task_id === taskId) || [];
    },

    create: async (projectId: string, subtask: Omit<Subtask, 'id' | 'created_at' | 'updated_at'>): Promise<Subtask> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      const newSubtask: Subtask = {
        ...subtask,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      data.subtasks.push(newSubtask);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      return newSubtask;
    },

    update: async (subtaskId: string, projectId: string, updates: Partial<Subtask>): Promise<Subtask> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      const index = data.subtasks.findIndex(s => s.id === subtaskId);
      if (index === -1) throw new Error('Subtask not found');

      data.subtasks[index] = { 
        ...data.subtasks[index], 
        ...updates,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      return data.subtasks[index];
    },

    delete: async (subtaskId: string, projectId: string): Promise<void> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      data.subtasks = data.subtasks.filter(s => s.id !== subtaskId);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
    },
  },

  // ==================== COMMENTS ====================
  comments: {
    getByTask: async (taskId: string, projectId: string): Promise<TaskComment[]> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      return data?.comments.filter(c => c.task_id === taskId) || [];
    },

    create: async (projectId: string, comment: Omit<TaskComment, 'id' | 'created_at' | 'updated_at'>): Promise<TaskComment> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      const newComment: TaskComment = {
        ...comment,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      data.comments.push(newComment);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      return newComment;
    },

    delete: async (commentId: string, projectId: string): Promise<void> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      data.comments = data.comments.filter(c => c.id !== commentId);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
    },
  },

  // ==================== CANVAS (NODES & EDGES) ====================
  canvas: {
    getNodes: async (projectId: string): Promise<Node[]> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      return data?.nodes || [];
    },

    getEdges: async (projectId: string): Promise<Edge[]> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      return data?.edges || [];
    },

    createNode: async (projectId: string, node: Omit<Node, 'id'>): Promise<Node> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      const newNode: Node = {
        ...node,
        id: uuidv4(),
      };

      data.nodes.push(newNode);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      return newNode;
    },

    updateNode: async (nodeId: string, projectId: string, updates: Partial<Node>): Promise<Node> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      const index = data.nodes.findIndex(n => n.id === nodeId);
      if (index === -1) throw new Error('Node not found');

      data.nodes[index] = { ...data.nodes[index], ...updates };
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      return data.nodes[index];
    },

    deleteNode: async (nodeId: string, projectId: string): Promise<void> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      data.nodes = data.nodes.filter(n => n.id !== nodeId);
      data.edges = data.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
    },

    createEdge: async (projectId: string, edge: Omit<Edge, 'id'>): Promise<Edge> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      const newEdge: Edge = {
        ...edge,
        id: uuidv4(),
      };

      data.edges.push(newEdge);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      return newEdge;
    },

    deleteEdge: async (edgeId: string, projectId: string): Promise<void> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      data.edges = data.edges.filter(e => e.id !== edgeId);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
    },

    saveCanvas: async (projectId: string, nodes: Node[], edges: Edge[]): Promise<void> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      data.nodes = nodes;
      data.edges = edges;
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
    },
  },

  // ==================== MEMBERS ====================
  members: {
    getByProject: async (projectId: string): Promise<ProjectMember[]> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      return data?.members || [];
    },

    add: async (projectId: string, member: ProjectMember): Promise<ProjectMember> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      data.members.push(member);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
      
      return member;
    },

    remove: async (projectId: string, userId: string): Promise<void> => {
      const data = await localStorageAdapter.projects.getData(projectId);
      if (!data) throw new Error('Project not found');

      data.members = data.members.filter(m => m.user_id !== userId);
      localStorage.setItem(storageKeys.projectData(projectId), JSON.stringify(data));
    },
  },
};