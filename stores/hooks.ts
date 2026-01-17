// =============================================================================
// STORE HOOKS (Helper hooks for common operations)
// =============================================================================

// src/lib/store/hooks.ts
import { useEffect } from 'react';
import {useStore} from './app-store';
import { authService, projectService } from '@/services';

/**
 * Hook to load user on mount
 */
export const useLoadUser = () => {
  const setUser = useStore(state => state.setUser);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      }
    };

    loadUser();
  }, [setUser]);
};

/**
 * Hook to load projects for current user
 */
export const useLoadProjects = () => {
  const user = useStore(state => state.user);
  const setProjects = useStore(state => state.setProjects);
  const setLoadingProjects = useStore(state => state.setLoadingProjects);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      return;
    }

    const loadProjects = async () => {
      setLoadingProjects(true);
      try {
        const projects = await projectService.getAll(user.id);
        setProjects(projects);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [user, setProjects, setLoadingProjects]);
};

/**
 * Hook to load current project data
 */
export const useLoadProjectData = () => {
  const currentProjectId = useStore(state => state.currentProjectId);
  const setCurrentProjectData = useStore(state => state.setCurrentProjectData);
  const setLoadingProjectData = useStore(state => state.setLoadingProjectData);

  useEffect(() => {
    if (!currentProjectId) {
      setCurrentProjectData(null);
      return;
    }

    const loadProjectData = async () => {
      setLoadingProjectData(true);
      try {
        const data = await projectService.getData(currentProjectId);
        setCurrentProjectData(data);
      } catch (error) {
        console.error('Failed to load project data:', error);
        setCurrentProjectData(null);
      } finally {
        setLoadingProjectData(false);
      }
    };

    loadProjectData();
  }, [currentProjectId, setCurrentProjectData, setLoadingProjectData]);
};