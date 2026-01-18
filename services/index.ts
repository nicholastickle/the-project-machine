// =========================================================================
// SERVICE LAYER - Uses adapters based on environment
// =========================================================================

import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

// Select adapter based on environment
const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

// Export all services
export { authService } from './authService';
export { projectService } from './projectService';
export { taskService } from './taskService';
export { subtaskService } from './subtaskService';
export { commentService } from './commentService';
export { nodeService } from './nodeService';
export { edgeService } from './edgeService';