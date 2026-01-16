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
    { name: 'Tasks', description: 'Task CRUD operations' },
    { name: 'Subtasks', description: 'Subtask operations' },
    { name: 'Comments', description: 'Task comments' },
    { name: 'Assignments', description: 'Task assignments' },
    { name: 'Snapshots', description: 'Canvas state snapshots' },
    { name: 'Chat', description: 'AI chat interactions' },
    { name: 'Collaborators', description: 'Project collaboration' },
    { name: 'Files', description: 'File uploads and management' },
    { name: 'Notes', description: 'Reference notes' },
    { name: 'Reflections', description: 'Daily reflections' },
    { name: 'Export', description: 'Data export endpoints' },
    { name: 'Invitations', description: 'Collaboration invites' },
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
    '/api/projects/{id}/snapshots/{snapshotId}': {
      get: {
        tags: ['Snapshots'],
        summary: 'Get specific snapshot',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'snapshotId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: {
            description: 'Snapshot details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Snapshot' },
              },
            },
          },
          404: { description: 'Snapshot not found' },
        },
      },
    },
    '/api/projects/{id}/snapshots/{snapshotId}/restore': {
      post: {
        tags: ['Snapshots'],
        summary: 'Restore project to snapshot state',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'snapshotId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: {
            description: 'Project restored successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    snapshot_data: { type: 'object' },
                  },
                },
              },
            },
          },
          404: { description: 'Snapshot not found' },
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
    '/api/projects/{id}/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List project tasks',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of tasks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create task',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  status: { type: 'string', enum: ['Backlog', 'Planned', 'In Progress', 'Stuck', 'Completed', 'Cancelled'], default: 'Backlog' },
                  estimatedHours: { type: 'integer', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Task created' },
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get task by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Task details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Task' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Tasks'],
        summary: 'Update task',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string' },
                  estimatedHours: { type: 'integer' },
                  timeSpent: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Task updated' },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete task (soft delete)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Task deleted' },
        },
      },
    },
    '/api/tasks/{id}/subtasks': {
      get: {
        tags: ['Subtasks'],
        summary: 'List task subtasks',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of subtasks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    subtasks: { type: 'array', items: { $ref: '#/components/schemas/Subtask' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Subtasks'],
        summary: 'Create subtask',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string' },
                  estimatedDuration: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Subtask created' },
        },
      },
    },
    '/api/tasks/{id}/comments': {
      get: {
        tags: ['Comments'],
        summary: 'List task comments',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of comments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    comments: { type: 'array', items: { $ref: '#/components/schemas/Comment' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Comments'],
        summary: 'Add comment',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Comment added' },
        },
      },
    },
    '/api/tasks/{id}/assignments': {
      get: {
        tags: ['Assignments'],
        summary: 'List task assignments',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of assignments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    assignments: { type: 'array', items: { $ref: '#/components/schemas/Assignment' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Assignments'],
        summary: 'Assign user to task',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  userId: { type: 'string', format: 'uuid' },
                  role: { type: 'string', enum: ['assignee', 'reviewer'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User assigned' },
        },
      },
    },
    '/api/projects/{id}/collaborators': {
      get: {
        tags: ['Collaborators'],
        summary: 'List project members',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of collaborators',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    members: { type: 'array', items: { $ref: '#/components/schemas/ProjectMember' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Collaborators'],
        summary: 'Add collaborator',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  role: { type: 'string', enum: ['editor', 'viewer'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Invitation sent' },
        },
      },
    },
    '/api/projects/{id}/collaborators/{userId}': {
      delete: {
        tags: ['Collaborators'],
        summary: 'Remove collaborator',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Collaborator removed' },
          403: { description: 'Forbidden - only owner can remove' },
          404: { description: 'Collaborator not found' },
        },
      },
    },
    '/api/projects/{id}/files': {
      get: {
        tags: ['Files'],
        summary: 'List project files',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of files',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    files: { type: 'array', items: { $ref: '#/components/schemas/FileSummary' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Files'],
        summary: 'Upload file and generate summary',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: { type: 'string', format: 'binary', description: 'Excel (.xlsx, .xls), CSV, PDF, or Word (.docx, .doc) file (max 10MB)' },
                  extractStructure: { type: 'boolean', description: 'Extract file structure for AI analysis' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'File uploaded with AI summary' },
          400: { description: 'Invalid file type or too large' },
        },
      },
    },
    '/api/projects/{id}/files/{fileId}': {
      patch: {
        tags: ['Files'],
        summary: 'Confirm file summary',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'fileId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['summary'],
                properties: {
                  summary: { type: 'string', description: 'User-confirmed summary of file contents' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'File summary confirmed' },
          404: { description: 'File not found' },
        },
      },
      delete: {
        tags: ['Files'],
        summary: 'Delete file',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'fileId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'File deleted' },
          404: { description: 'File not found' },
        },
      },
    },
    '/api/projects/{id}/notes': {
      get: {
        tags: ['Notes'],
        summary: 'List project notes',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of notes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    notes: { type: 'array', items: { $ref: '#/components/schemas/Note' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Notes'],
        summary: 'Create note',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Note created' },
        },
      },
    },
    '/api/projects/{id}/notes/{noteId}': {
      patch: {
        tags: ['Notes'],
        summary: 'Update note',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'noteId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Note updated' },
          404: { description: 'Note not found' },
        },
      },
      delete: {
        tags: ['Notes'],
        summary: 'Delete note',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'noteId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Note deleted' },
        },
      },
    },
    '/api/projects/{id}/reflections': {
      get: {
        tags: ['Reflections'],
        summary: 'List project reflections',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of reflections',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    reflections: { type: 'array', items: { $ref: '#/components/schemas/Reflection' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Reflections'],
        summary: 'Create reflection',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reflection_type', 'content'],
                properties: {
                  reflection_type: { type: 'string', example: 'start_of_day' },
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Reflection created' },
        },
      },
    },
    '/api/ai/chat': {
      post: {
        tags: ['Chat'],
        summary: 'Send message to AI assistant with project context',
        description: 'AI assistant analyzes your project context (current plan, reflections, files, notes) to provide grounded advice',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['projectId', 'message'],
                properties: {
                  projectId: { 
                    type: 'string', 
                    format: 'uuid',
                    description: 'Project ID for context'
                  },
                  message: { 
                    type: 'string',
                    description: 'Your message/question to the AI',
                    example: 'What should I work on next?'
                  },
                  history: {
                    type: 'array',
                    description: 'Previous conversation messages (optional)',
                    items: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', enum: ['user', 'assistant'] },
                        content: { type: 'string' }
                      }
                    }
                  },
                  currentSnapshot: {
                    type: 'object',
                    description: 'Current canvas state (optional)',
                    properties: {
                      nodes: { type: 'array', items: { type: 'object' } },
                      edges: { type: 'array', items: { type: 'object' } }
                    }
                  }
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'AI response with sources',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: { type: 'string', description: 'AI assistant response' },
                    sources: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'Context sources used (current_plan, reflections, file_summaries, etc.)'
                    },
                    tokens_used: { type: 'integer', description: 'OpenAI tokens consumed' }
                  }
                }
              }
            }
          },
          400: { description: 'Missing required fields' },
          401: { description: 'Unauthorized' },
          500: { description: 'OpenAI API error or internal error' }
        },
      },
    },
    '/api/projects/{id}/export/excel': {
      post: {
        tags: ['Export'],
        summary: 'Export project to Excel',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nodes', 'edges'],
                properties: {
                  nodes: {
                    type: 'array',
                    description: 'Canvas nodes from snapshot',
                    items: { type: 'object' }
                  },
                  edges: {
                    type: 'array',
                    description: 'Canvas edges from snapshot',
                    items: { type: 'object' }
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Excel file with Tasks, Subtasks, and Project Info sheets',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
    },
    '/api/projects/{id}/export/timesheet': {
      post: {
        tags: ['Export'],
        summary: 'Export project as timesheet',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nodes'],
                properties: {
                  nodes: {
                    type: 'array',
                    description: 'Canvas nodes from snapshot',
                    items: { type: 'object' }
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Excel timesheet file',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
    },
    '/api/invite/{token}': {
      post: {
        tags: ['Invitations'],
        summary: 'Accept invitation',
        parameters: [
          { name: 'token', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Invitation accepted' },
          404: { description: 'Invalid or expired token' },
        },
      },
    },
    '/api/projects/{id}/invitations': {
      get: {
        tags: ['Invitations'],
        summary: 'List pending invitations for project',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'List of pending invitations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    invitations: { type: 'array', items: { $ref: '#/components/schemas/Invitation' } },
                  },
                },
              },
            },
          },
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
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          projectId: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['Backlog', 'Planned', 'In Progress', 'Stuck', 'Completed', 'Cancelled'] },
          estimatedHours: { type: 'integer', nullable: true },
          timeSpent: { type: 'integer' },
          sortOrder: { type: 'integer' },
          createdBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Subtask: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          taskId: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          isCompleted: { type: 'boolean' },
          estimatedDuration: { type: 'integer' },
          timeSpent: { type: 'integer' },
          sortOrder: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          taskId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Assignment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          taskId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          role: { type: 'string', enum: ['assignee', 'reviewer'] },
          assignedAt: { type: 'string', format: 'date-time' },
          assignedBy: { type: 'string', format: 'uuid' },
        },
      },
      ProjectMember: {
        type: 'object',
        properties: {
          projectId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          role: { type: 'string', enum: ['editor', 'viewer'] },
          joinedAt: { type: 'string', format: 'date-time' },
        },
      },
      Note: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          projectId: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          content: { type: 'string' },
          createdBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Reflection: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          projectId: { type: 'string', format: 'uuid' },
          reflectionType: { type: 'string' },
          content: { type: 'string' },
          createdBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      FileSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          projectId: { type: 'string', format: 'uuid' },
          filename: { type: 'string' },
          fileType: { type: 'string' },
          fileSizeBytes: { type: 'integer' },
          storagePath: { type: 'string' },
          aiGeneratedSummary: { type: 'string' },
          summary: { type: 'string', nullable: true },
          confirmedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Invitation: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          projectId: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['editor', 'viewer'] },
          token: { type: 'string' },
          expiresAt: { type: 'string', format: 'date-time' },
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
