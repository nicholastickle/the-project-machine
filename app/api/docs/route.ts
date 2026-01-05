import { NextResponse } from 'next/server'

/**
 * OpenAPI/Swagger documentation for Project Machine API
 * Access at /api/docs
 */

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Project Machine API',
    version: '0.3.0',
    description: 'API for managing projects, tasks, snapshots, and AI interactions',
    contact: {
      name: 'Project Machine Team',
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      description: 'Current environment',
    },
  ],
  tags: [
    { name: 'Projects', description: 'Project management endpoints' },
    { name: 'Tasks', description: 'Task and subtask operations' },
    { name: 'Snapshots', description: 'Canvas state snapshots' },
    { name: 'Chat', description: 'AI chat interactions' },
    { name: 'Collaborators', description: 'Project collaboration' },
    { name: 'Analytics', description: 'Usage tracking' },
  ],
  paths: {
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List all projects',
        description: 'Get all projects for authenticated user (excludes archived)',
        responses: {
          200: {
            description: 'List of projects',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    projects: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Project' },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Projects'],
        summary: 'Create new project',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Q1 Marketing Campaign' },
                  description: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Project created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Project' },
              },
            },
          },
          400: { description: 'Invalid input' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Get project by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: {
            description: 'Project details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Project' },
              },
            },
          },
          404: { description: 'Project not found' },
        },
      },
      patch: {
        tags: ['Projects'],
        summary: 'Update project',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Project updated' },
          404: { description: 'Project not found' },
        },
      },
      delete: {
        tags: ['Projects'],
        summary: 'Archive project (soft delete)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: { description: 'Project archived' },
          404: { description: 'Project not found' },
        },
      },
    },
    '/api/projects/{id}/snapshots': {
      get: {
        tags: ['Snapshots'],
        summary: 'List project snapshots',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 },
          },
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string', enum: ['manual', 'autosave', 'ai_generated'] },
          },
        ],
        responses: {
          200: {
            description: 'List of snapshots',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    snapshots: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Snapshot' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Snapshots'],
        summary: 'Save new snapshot',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['snapshot_data'],
                properties: {
                  snapshot_data: {
                    type: 'object',
                    properties: {
                      nodes: { type: 'array', items: { type: 'object' } },
                      edges: { type: 'array', items: { type: 'object' } },
                    },
                  },
                  snapshot_type: {
                    type: 'string',
                    enum: ['manual', 'autosave', 'ai_generated'],
                    default: 'manual',
                  },
                  summary: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Snapshot saved' },
          400: { description: 'Invalid snapshot data' },
        },
      },
    },
    '/api/usage': {
      post: {
        tags: ['Analytics'],
        summary: 'Log usage event',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['event_type'],
                properties: {
                  event_type: { type: 'string', example: 'session_started' },
                  project_id: { type: 'string', format: 'uuid', nullable: true },
                  event_data: { type: 'object', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Event logged' },
          400: { description: 'Invalid input' },
        },
      },
      get: {
        tags: ['Analytics'],
        summary: 'Get user usage stats',
        responses: {
          200: {
            description: 'Usage statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total_events: { type: 'integer' },
                    summary: { type: 'object' },
                    recent_events: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
  components: {
    schemas: {
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          createdBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          archivedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Snapshot: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          projectId: { type: 'string', format: 'uuid' },
          snapshotData: { type: 'object' },
          snapshotType: { type: 'string', enum: ['manual', 'autosave', 'ai_generated'] },
          summary: { type: 'string', nullable: true },
          createdBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sb-access-token',
      },
    },
  },
  security: [{ cookieAuth: [] }],
}

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
