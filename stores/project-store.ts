import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { ProjectStoreData, ProjectData } from './types';
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { initialTasks } from '@/components/canvas/initial-tasks';

interface ProjectStoreState {
    // Core State
    projects: ProjectStoreData[];
    activeProjectId: string | null;

    // Project Management Methods
    addProject: (name: string, description?: string) => string;
    deleteProject: (projectId: string) => void;
    duplicateProject: (projectId: string, newName?: string) => string;
    renameProject: (projectId: string, newName: string) => void;

    // Project Selection
    setActiveProject: (projectId: string) => void;
    getActiveProject: () => ProjectStoreData | null;

    // Project Data Management
    updateProjectData: (projectId: string, data: Partial<ProjectStoreData>) => void;
    updateProjectViewport: (projectId: string, viewport: { x: number; y: number; zoom: number }) => void;
}

// Helper function to deep clone nodes/edges/tasks with new IDs
const cloneWithNewIds = <T extends { id: string }>(items: T[], taskIdMap?: Map<string, string>): T[] => {
    const idMap = new Map<string, string>();

    // Use provided task ID map or create new one
    const finalTaskIdMap = taskIdMap || new Map<string, string>();

    // First pass: generate new IDs for all items
    items.forEach(item => {
        const newId = uuidv4();
        idMap.set(item.id, newId);

        // If this is a task (has node_id and project_id properties), add to task ID map
        if ('node_id' in item && 'project_id' in item && 'status' in item) {
            finalTaskIdMap.set(item.id, newId);
        }
    });

    // Second pass: clone items with new IDs and update references
    return items.map(item => {
        const cloned = JSON.parse(JSON.stringify(item)) as T;
        cloned.id = idMap.get(item.id) || uuidv4();

        // Update task references in nodes using task ID map
        if ('data' in cloned && typeof cloned.data === 'object' && cloned.data && 'taskId' in cloned.data) {
            const taskData = cloned.data as { taskId: string };
            if (finalTaskIdMap.has(taskData.taskId)) {
                taskData.taskId = finalTaskIdMap.get(taskData.taskId)!;
            }
        }

        // Update node_id in tasks if this is a task
        if ('node_id' in cloned) {
            const task = cloned as any;
            // node_id should reference the new node ID, not get a new ID
            if (idMap.has(task.node_id)) {
                task.node_id = idMap.get(task.node_id)!;
            }
        }

        // Update edge references
        if ('source' in cloned && 'target' in cloned) {
            const edge = cloned as any;
            if (idMap.has(edge.source)) edge.source = idMap.get(edge.source);
            if (idMap.has(edge.target)) edge.target = idMap.get(edge.target);
        }

        return cloned;
    });
};

const createDefaultProject = (name: string = 'Default Project', description?: string): ProjectStoreData => ({
    project: {
        id: uuidv4(),
        name,
        description,
        created_by: 'local-user',
        viewport: { x: 0, y: 0, zoom: 1 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    tasks: initialTasks,
    subtasks: [],
    comments: [],
    nodes: initialNodes,
    edges: initialEdges,
    members: [],
    history: [{ nodes: initialNodes, edges: initialEdges, tasks: initialTasks }],
    historyIndex: 0,
    cursorMode: 'select'
});

const useProjectStore = create<ProjectStoreState>()(
    persist(
        (set, get) => {
            const defaultProject = createDefaultProject();
            return {
                projects: [defaultProject],
                activeProjectId: defaultProject.project.id, // Auto-select the default project

                addProject: (name: string, description?: string) => {
                    const newProject = createDefaultProject(name, description);
                    set({
                        projects: [...get().projects, newProject]
                        // Remove activeProjectId update - don't auto-select new project
                    });
                    return newProject.project.id;
                },

                deleteProject: (projectId: string) => {
                    const { projects, activeProjectId } = get();
                    const updatedProjects = projects.filter(p => p.project.id !== projectId);

                    // If we're deleting the last project, create a new default one
                    if (updatedProjects.length === 0) {
                        const defaultProject = createDefaultProject();
                        set({
                            projects: [defaultProject],
                            activeProjectId: defaultProject.project.id
                        });
                        return;
                    }

                    // If we're deleting the active project, set the first remaining project as active
                    const newActiveProjectId = activeProjectId === projectId
                        ? updatedProjects[0].project.id
                        : activeProjectId;

                    set({
                        projects: updatedProjects,
                        activeProjectId: newActiveProjectId
                    });
                },

                duplicateProject: (projectId: string, newName?: string) => {
                    const originalProject = get().projects.find(p => p.project.id === projectId);
                    if (!originalProject) return '';

                    // Create separate ID maps for nodes and tasks
                    const nodeIdMap = new Map<string, string>();
                    const taskIdMap = new Map<string, string>();

                    // Generate new IDs for nodes first
                    originalProject.nodes.forEach(node => {
                        nodeIdMap.set(node.id, uuidv4());
                    });

                    // Generate new IDs for tasks and map them to their corresponding new node IDs
                    originalProject.tasks.forEach(task => {
                        const newTaskId = uuidv4();
                        taskIdMap.set(task.id, newTaskId);
                    });

                    // Clone tasks with new IDs and updated node_id references
                    const clonedTasks = originalProject.tasks.map(task => {
                        const clonedTask = JSON.parse(JSON.stringify(task));
                        clonedTask.id = taskIdMap.get(task.id)!;
                        clonedTask.node_id = nodeIdMap.get(task.node_id) || task.node_id;
                        return clonedTask;
                    });

                    // Clone nodes with new IDs and updated taskId references
                    const clonedNodes = originalProject.nodes.map(node => {
                        const clonedNode = JSON.parse(JSON.stringify(node));
                        clonedNode.id = nodeIdMap.get(node.id)!;
                        // Update content_id to reference the new task ID
                        if (node.content_id && taskIdMap.has(node.content_id)) {
                            clonedNode.content_id = taskIdMap.get(node.content_id)!;
                        }
                        // Update taskId in node data if it exists (for compatibility)
                        if (clonedNode.data && clonedNode.data.taskId) {
                            clonedNode.data.taskId = taskIdMap.get(clonedNode.data.taskId) || clonedNode.data.taskId;
                        }
                        return clonedNode;
                    });

                    // Clone edges with updated source/target references
                    const clonedEdges = originalProject.edges.map(edge => {
                        const clonedEdge = JSON.parse(JSON.stringify(edge));
                        clonedEdge.id = uuidv4();
                        clonedEdge.source = nodeIdMap.get(edge.source) || edge.source;
                        clonedEdge.target = nodeIdMap.get(edge.target) || edge.target;
                        return clonedEdge;
                    });

                    const duplicatedProject: ProjectStoreData = {
                        ...originalProject,
                        project: {
                            ...originalProject.project,
                            id: uuidv4(),
                            name: newName || `${originalProject.project.name} (copy)`,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        },
                        tasks: clonedTasks,
                        nodes: clonedNodes,
                        edges: clonedEdges,
                        subtasks: cloneWithNewIds(originalProject.subtasks || []),
                        comments: cloneWithNewIds(originalProject.comments || []),
                        history: [{
                            nodes: clonedNodes,
                            edges: clonedEdges,
                            tasks: clonedTasks
                        }]
                    };

                    set({
                        projects: [...get().projects, duplicatedProject]
                        // Remove auto-selection as requested by user
                    });

                    return duplicatedProject.project.id;
                },

                renameProject: (projectId: string, newName: string) => {
                    set({
                        projects: get().projects.map(project =>
                            project.project.id === projectId
                                ? {
                                    ...project,
                                    project: {
                                        ...project.project,
                                        name: newName,
                                        updated_at: new Date().toISOString()
                                    }
                                }
                                : project
                        )
                    });
                },

                setActiveProject: (projectId: string) => {
                    const projectExists = get().projects.some(p => p.project.id === projectId);
                    if (projectExists) {
                        set({ activeProjectId: projectId });
                    }
                },

                getActiveProject: () => {
                    const { projects, activeProjectId } = get();
                    if (!activeProjectId) {
                        // Auto-select first project if none is active
                        const firstProject = projects[0];
                        if (firstProject) {
                            set({ activeProjectId: firstProject.project.id });
                            return firstProject;
                        }
                        return null;
                    }
                    return projects.find(p => p.project.id === activeProjectId) || null;
                },

                updateProjectData: (projectId: string, data: Partial<ProjectStoreData>) => {
                    set({
                        projects: get().projects.map(project =>
                            project.project.id === projectId
                                ? {
                                    ...project,
                                    ...data,
                                    project: {
                                        ...project.project,
                                        ...data.project,
                                        updated_at: new Date().toISOString()
                                    }
                                }
                                : project
                        )
                    });
                },

                updateProjectViewport: (projectId: string, viewport: { x: number; y: number; zoom: number }) => {
                    set({
                        projects: get().projects.map(project =>
                            project.project.id === projectId
                                ? {
                                    ...project,
                                    project: {
                                        ...project.project,
                                        viewport,
                                        updated_at: new Date().toISOString()
                                    }
                                }
                                : project
                        )
                    });
                }
            }
        },
        {
            name: 'project-store'
        }
    )
);

export default useProjectStore;