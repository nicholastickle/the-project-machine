// =========================================================================
// NODE SERVICE (Canvas Nodes)
// =========================================================================

import type { Node } from '@/stores/types';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

export const nodeService = {
  /**
   * Get all nodes for a project
   */
  getAll: async (projectId: string): Promise<Node[]> => {
    return await adapter.canvas.getNodes(projectId);
  },

  /**
   * Create a new node
   */
  create: async (
    projectId: string,
    node: Omit<Node, 'id' | 'project_id'>
  ): Promise<Node> => {
    return await adapter.canvas.createNode(projectId, {
      ...node,
      project_id: projectId,
    });
  },

  /**
   * Update a node
   */
  update: async (
    nodeId: string,
    projectId: string,
    updates: Partial<Node>
  ): Promise<Node> => {
    return await adapter.canvas.updateNode(nodeId, projectId, updates);
  },

  /**
   * Update node position
   */
  updatePosition: async (
    nodeId: string,
    projectId: string,
    position: { x: number; y: number }
  ): Promise<Node> => {
    return await adapter.canvas.updateNode(nodeId, projectId, { position });
  },

  /**
   * Delete a node
   */
  delete: async (nodeId: string, projectId: string): Promise<void> => {
    await adapter.canvas.deleteNode(nodeId, projectId);
  },
};

