// =========================================================================
// INITIALIZE LOCAL STORAGE WITH SEED DATA
// =========================================================================

import { storageKeys, clearDevStorage } from '@/utils/storage';
import { mockUser, mockProjects, mockProjectData } from './seeds';

export const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  // Check if already initialized
  const initialized = localStorage.getItem(storageKeys.initialized);
  if (initialized === 'true') {
    console.log('✅ Dev storage already initialized');
    return;
  }

  console.log('🔄 Initializing local storage with seed data...');

  // Clear any existing dev data
  clearDevStorage();

  // Store user
  localStorage.setItem(storageKeys.user(mockUser.id), JSON.stringify(mockUser));

  // Store projects list
  localStorage.setItem(
    storageKeys.projects(mockUser.id),
    JSON.stringify(mockProjects)
  );

  // Store each project's full data
  Object.entries(mockProjectData).forEach(([projectId, data]) => {
    localStorage.setItem(
      storageKeys.projectData(projectId),
      JSON.stringify(data)
    );
  });

  // Set current project
  localStorage.setItem(storageKeys.currentProject, mockProjects[0].id);

  // Mark as initialized
  localStorage.setItem(storageKeys.initialized, 'true');

  console.log('✅ Local storage initialized with seed data');
};

export const resetLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(storageKeys.initialized);
  initializeLocalStorage();
  console.log('🔄 Local storage reset');
};