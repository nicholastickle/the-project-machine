// ========================================================================
// EDGE SERVICE (Canvas Edges)
// ========================================================================

import type { Edge, Node } from '@/stores/types';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

export const edgeService = {
  /**
   * Get all edges for a project
   */
  getAll: async (projectId: string): Promise<Edge[]> => {
    return await adapter.canvas.getEdges(projectId);
  },

  /**
   * Create a new edge
   */
  create: async (
    projectId: string,
    edge: Omit<Edge, 'id' | 'project_id'>
  ): Promise<Edge> => {
    return await adapter.canvas.createEdge(projectId, {
      ...edge,
      project_id: projectId,
    });
  },

  /**
   * Delete an edge
   */
  delete: async (edgeId: string, projectId: string): Promise<void> => {
    await adapter.canvas.deleteEdge(edgeId, projectId);
  },

  /**
   * Save entire canvas state (batch operation)
   */
  saveCanvas: async (
    projectId: string,
    nodes: Node[],
    edges: Edge[]
  ): Promise<void> => {
    await adapter.canvas.saveCanvas(projectId, nodes, edges);
  },
};