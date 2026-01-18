// src/lib/store/useStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, Project, ProjectData } from '@/stores/types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Projects
  projects: Project[];
  currentProjectId: string | null;
  currentProjectData: ProjectData | null;
  
  // Loading states
  isLoadingProjects: boolean;
  isLoadingProjectData: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (projectId: string | null) => void;
  setCurrentProjectData: (data: ProjectData | null) => void;
  setLoadingProjects: (loading: boolean) => void;
  setLoadingProjectData: (loading: boolean) => void;
  
  // Helper methods
  getCurrentProject: () => Project | null;
  clearStore: () => void;
}

export const useStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      projects: [],
      currentProjectId: null,
      currentProjectData: null,
      isLoadingProjects: false,
      isLoadingProjectData: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setProjects: (projects) => set({ projects }),
      
      setCurrentProject: (projectId) => set({ currentProjectId: projectId }),
      
      setCurrentProjectData: (data) => set({ currentProjectData: data }),
      
      setLoadingProjects: (loading) => set({ isLoadingProjects: loading }),
      
      setLoadingProjectData: (loading) => set({ isLoadingProjectData: loading }),

      // Helper methods
      getCurrentProject: () => {
        const state = get();
        if (!state.currentProjectId) return null;
        return state.projects.find(p => p.id === state.currentProjectId) || null;
      },

      clearStore: () => set({
        user: null,
        isAuthenticated: false,
        projects: [],
        currentProjectId: null,
        currentProjectData: null,
        isLoadingProjects: false,
        isLoadingProjectData: false,
      }),
    }),
    { name: 'AppStore' }
  )
);