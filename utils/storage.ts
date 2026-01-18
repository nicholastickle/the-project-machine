// ========================================================================
// STORAGE UTILITIES
// ========================================================================


export const storageKeys = {
  user: (userId: string) => `dev-user-${userId}`,
  projects: (userId: string) => `dev-projects-${userId}`,
  projectData: (projectId: string) => `dev-project-${projectId}`,
  currentProject: 'dev-current-project',
  initialized: 'dev-initialized',
};

export const clearDevStorage = () => {
  if (typeof window === 'undefined') return;
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('dev-')) {
      localStorage.removeItem(key);
    }
  });
};
