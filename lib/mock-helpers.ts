// mockHelpers.ts
import { 
  mockUsers, 
  mockProjects, 
  mockTasks, 
  mockSubtasks, 
  mockNodes, 
  mockEdges, 
  mockTaskComments, 
  mockTaskbookEntries,
  User,
  Project,
  Task,
  Subtask,
  Node,
  Edge,
  TaskComment,
  TaskbookEntry
} from './mock-data';

/**
 * SYNCHRONOUS HELPERS
 * Explicitly typing the parameters (e.g., 'id: string') resolves the 'any' error.
 */

export const getMockUserById = (id: string): User | undefined => 
  mockUsers.find((u: User) => u.id === id);

export const getMockProjectById = (id: string): Project | undefined => 
  mockProjects.find((p: Project) => p.id === id);

export const getMockTasksByProjectId = (projectId: string): Task[] => 
  mockTasks.filter((t: Task) => t.project_id === projectId);

export const getMockSubtasksByTaskId = (taskId: string): Subtask[] => 
  mockSubtasks.filter((s: Subtask) => s.task_id === taskId);

export const getMockCommentsByTaskId = (taskId: string): TaskComment[] => 
  mockTaskComments.filter((c: TaskComment) => c.task_id === taskId);

export const getMockNodesByProjectId = (projectId: string): Node[] => 
  mockNodes.filter((n: Node) => n.project_id === projectId);

export const getMockEdgesByProjectId = (projectId: string): Edge[] => 
  mockEdges.filter((e: Edge) => e.project_id === projectId);

export const getMockTaskbookByUserId = (userId: string): TaskbookEntry[] => 
  mockTaskbookEntries.filter((tb: TaskbookEntry) => tb.user_id === userId);

/**
 * ASYNCHRONOUS API HELPERS
 */

export const createMockApiResponse = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const apiFetchProjectData = async (projectId: string) => {
  const project = getMockProjectById(projectId);
  if (!project) throw new Error("Project not found");

  const [nodes, edges, tasks] = await Promise.all([
    createMockApiResponse(getMockNodesByProjectId(projectId)),
    createMockApiResponse(getMockEdgesByProjectId(projectId)),
    createMockApiResponse(getMockTasksByProjectId(projectId))
  ]);

  return { project, nodes, edges, tasks };
};