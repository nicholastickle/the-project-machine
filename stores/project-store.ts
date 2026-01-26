import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Project, ProjectMember, PendingInvitation } from './types';

interface ProjectStoreState {
    // Core State
    projects: Project[];
    activeProjectId: string | null;
    isLoading: boolean;

    // Members State
    projectMembers: Record<string, ProjectMember[]>; // projectId -> members
    pendingInvitations: Record<string, PendingInvitation[]>; // projectId -> invitations

    // Backend Integration
    fetchProjects: () => Promise<void>;
    createProject: (name: string, description?: string) => Promise<string | null>;
    deleteProject: (projectId: string) => Promise<void>;
    renameProject: (projectId: string, newName: string) => Promise<void>;

    // Members Integration
    fetchProjectMembers: (projectId: string) => Promise<void>;
    inviteCollaborator: (projectId: string, email: string, role: 'editor' | 'viewer') => Promise<boolean>;
    removeCollaborator: (projectId: string, userId: string) => Promise<boolean>;
    getProjectMembers: (projectId: string) => ProjectMember[];
    getPendingInvitations: (projectId: string) => PendingInvitation[];

    // Project Selection
    setActiveProject: (projectId: string) => void;
    getActiveProject: () => Project | null;
}

const useProjectStore = create<ProjectStoreState>()(
    devtools(
        (set, get) => ({
            projects: [],
            activeProjectId: null,
            isLoading: false,
            projectMembers: {},
            pendingInvitations: {},

            fetchProjects: async () => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/projects');
                    if (response.ok) {
                        const data = await response.json();
                        const projects = data.projects || [];
                        set({ 
                            projects,
                            isLoading: false,
                            // Set first project as active if none selected
                            activeProjectId: get().activeProjectId || (projects[0]?.id ?? null)
                        });
                    } else {
                        console.error('[Project Store] Failed to fetch projects:', response.statusText);
                        set({ isLoading: false });
                    }
                } catch (error) {
                    console.error('[Project Store] Error fetching projects:', error);
                    set({ isLoading: false });
                }
            },

            createProject: async (name: string, description?: string) => {
                try {
                    const response = await fetch('/api/projects', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, description })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const newProject = data.project;
                        set({ 
                            projects: [...get().projects, newProject]
                        });
                        return newProject.id;
                    } else {
                        console.error('[Project Store] Failed to create project:', response.statusText);
                        return null;
                    }
                } catch (error) {
                    console.error('[Project Store] Error creating project:', error);
                    return null;
                }
            },

            deleteProject: async (projectId: string) => {
                try {
                    const response = await fetch(`/api/projects/${projectId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        const { projects, activeProjectId } = get();
                    const updatedProjects = projects.filter(p => p.id !== projectId);

                    // If deleting active project, select first remaining project
                    const newActiveProjectId = activeProjectId === projectId
                        ? (updatedProjects[0]?.id ?? null)                        : activeProjectId;
                    set({
                            projects: updatedProjects,
                            activeProjectId: newActiveProjectId
                        });
                    } else {
                        console.error('[Project Store] Failed to delete project:', response.statusText);
                    }
                } catch (error) {
                    console.error('[Project Store] Error deleting project:', error);
                }
            },

            renameProject: async (projectId: string, newName: string) => {
                // Optimistic update
                const oldProjects = get().projects;
                set({
                    projects: oldProjects.map(p =>
                        p.id === projectId
                            ? { ...p, name: newName, updated_at: new Date().toISOString() }
                            : p
                    )
                });

                try {
                    const response = await fetch(`/api/projects/${projectId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName })
                    });

                    if (!response.ok) {
                        // Revert on failure
                        set({ projects: oldProjects });
                        console.error('[Project Store] Failed to rename project:', response.statusText);
                    }
                } catch (error) {
                    // Revert on error
                    set({ projects: oldProjects });
                    console.error('[Project Store] Error renaming project:', error);
                }
            },

            setActiveProject: (projectId: string) => {
                set({ activeProjectId: projectId });
            },

            getActiveProject: () => {
                const { projects, activeProjectId } = get();
                if (!activeProjectId) {
                    // Auto-select first project if none selected
                    const firstProject = projects[0];
                    if (firstProject) {
                        set({ activeProjectId: firstProject.id });
                        return firstProject;
                    }
                    return null;
                }
                return projects.find(p => p.id === activeProjectId) || null;
            },

            fetchProjectMembers: async (projectId: string) => {
                try {
                    const response = await fetch(`/api/projects/${projectId}/collaborators`);
                    if (response.ok) {
                        const data = await response.json();
                        const { projectMembers, pendingInvitations: currentInvitations } = get();
                        
                        set({
                            projectMembers: {
                                ...projectMembers,
                                [projectId]: data.collaborators || []
                            },
                            pendingInvitations: {
                                ...currentInvitations,
                                [projectId]: data.pending_invitations || []
                            }
                        });
                    } else {
                        console.error('[Project Store] Failed to fetch members:', response.statusText);
                    }
                } catch (error) {
                    console.error('[Project Store] Error fetching members:', error);
                }
            },

            inviteCollaborator: async (projectId: string, email: string, role: 'editor' | 'viewer') => {
                try {
                    const response = await fetch(`/api/projects/${projectId}/collaborators`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, role })
                    });

                    if (response.ok) {
                        // Refresh members list
                        await get().fetchProjectMembers(projectId);
                        return true;
                    } else {
                        console.error('[Project Store] Failed to invite collaborator:', response.statusText);
                        return false;
                    }
                } catch (error) {
                    console.error('[Project Store] Error inviting collaborator:', error);
                    return false;
                }
            },

            removeCollaborator: async (projectId: string, userId: string) => {
                try {
                    const response = await fetch(`/api/projects/${projectId}/collaborators/${userId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        // Update local state
                        const { projectMembers } = get();
                        set({
                            projectMembers: {
                                ...projectMembers,
                                [projectId]: (projectMembers[projectId] || []).filter(m => m.user_id !== userId)
                            }
                        });
                        return true;
                    } else {
                        console.error('[Project Store] Failed to remove collaborator:', response.statusText);
                        return false;
                    }
                } catch (error) {
                    console.error('[Project Store] Error removing collaborator:', error);
                    return false;
                }
            },

            getProjectMembers: (projectId: string) => {
                return get().projectMembers[projectId] || [];
            },

            getPendingInvitations: (projectId: string) => {
                return get().pendingInvitations[projectId] || [];
            }
        }),
        { name: 'project-store' }
    )
);

export default useProjectStore;
