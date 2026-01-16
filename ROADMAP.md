# The Project Machine - Product Roadmap

## Vision
Visual project planning tool with AI assistance - canvas-based task management meets intelligent workflow optimization.

## ✅ Sprint 0: Backend Foundation
**Status:** ✅ Done - PR submitted  

### Completed
- ✅ Next.js 15 + React 19 setup with App Router
- ✅ Supabase SSR authentication + session management
- ✅ Drizzle ORM with 16-table PostgreSQL schema
- ✅ Complete REST API (31+ endpoints)
  - Projects, Tasks, Subtasks, Comments, Assignments
  - Snapshots (canvas save/restore)
  - Collaborators & Invitations
  - Files (upload, parsing, AI summaries)
  - Notes, Reflections, Chat
  - Export (Excel, timesheets)
- ✅ RLS policies applied and tested
- ✅ Migrations system with validation scripts
- ✅ Rate limiting (usage_logs table)
- ✅ Comprehensive testing (107 tests passing)
- ✅ Swagger/OpenAPI documentation
- ✅ API testing guide (REST Client + curl)

## 🚧 v0.3: Deployment & Manual Testing (CURRENT - 5%)
**Status:** PR #[TBD] submitted, awaiting merge  
**Focus:** Production deployment + comprehensive testing

### Phase 1: Deployment Setup (Not Started)
- ⏳ Vercel deployment configuration
  - Environment variables
  - Build commands
  - Migration runner on deploy
- ⏳ Supabase Storage buckets
  - project-files bucket (user uploads)
  - RLS policies for storage
  - File download URLs
- ⏳ Production environment
  - Separate Supabase project
  - Environment variable documentation
  - Health check endpoints

### Phase 2: Manual Testing (0 of 200+ tasks)
See `TESTING_CHECKLIST.md` for complete list:
- ⏳ Authentication & sessions (7 tasks)
- ⏳ Projects API (9 tasks)
- ⏳ Tasks, Subtasks, Comments (25+ tasks)
- ⏳ Snapshots & canvas state (10 tasks)
- ⏳ Collaborators & invitations (10 tasks)
- ⏳ Files, notes, reflections (20+ tasks)
- ⏳ Export & chat (15+ tasks)
- ⏳ Security, RLS, error handling (15+ tasks)
- ⏳ Performance & data integrity (15+ tasks)


## Frontend-Backend Integration (NEXT)
**Prerequisites:** Nick completes landing page work

### Core Features
- Canvas ↔ API integration
  - Load projects and tasks from DB
  - Autosave to snapshots API
  - Real-time task updates
- Sidebar functionality
  - Project list from API
  - Create/delete projects
- Task management
  - Create tasks from canvas
  - Update status/description
  - Add subtasks and comments
- Chat panel
  - AI command execution
  - Task creation from chat
  - Context-aware responses

### Polish
- Loading states
- Error handling & toast notifications
- Empty states
- Optimistic updates

---

**Last Updated:** 2026-01-12  
**Current Phase:** v0.3 - Manual testing & deployment setup  
**Next Milestone:** Production deployment with working frontend integration
