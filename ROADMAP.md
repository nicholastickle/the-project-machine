# The Project Machine - Product Roadmap

## 🎯 Vision
Visual project planning tool with AI assistance - canvas-based task management meets intelligent workflow optimization.

## ✅ Sprint 0: Foundation (COMPLETE)
- ✅ Next.js 15 + React 19 setup
- ✅ Supabase auth + database  
- ✅ ReactFlow canvas with drag-drop nodes
- ✅ Basic task cards with subtasks
- ✅ AI chat integration (OpenRouter/Anthropic)
- ✅ File upload + parsing (PDF/TXT/MD)

## 🚧 v0.3: Hybrid Model (IN PROGRESS - 65%)
**Database-First Architecture**

### Completed
- ✅ Drizzle ORM setup with 14-table schema
- ✅ Migrations + programmatic execution
- ✅ Rate limiting (usage_logs table)
- ✅ Debounced autosave (3s delay)

### In Progress  
- ⏳ RLS policies (82% applied - fixing column mismatches)
- ⏳ Task CRUD API endpoints

### Remaining
- Tasks API (POST/GET/PATCH/DELETE)
- Subtasks + assignments endpoints
- Comments API
- Frontend integration (stores → DB queries)

## 📋 v0.4: Team Collaboration (NEXT)
- Project invitations (pending_invitations table)
- Real-time updates (Supabase subscriptions)
- Activity feed
- Member management UI

## 🔮 v0.5: AI Enhancements
- Task duration estimation
- Dependency detection from descriptions
- Smart task breakdown suggestions
- Reflection-based insights (daily summaries)

## 📊 v0.6: Analytics & Polish
- Usage analytics (PostHog integration)
- Plan snapshots (version history)
- Export to PDF/PNG
- Keyboard shortcuts

## 🎨 v1.0: Public Beta
- Landing page polish
- Onboarding flow
- Pricing/tiers
- Performance optimization

---

**Last Updated:** 2026-01-05  
**Current Focus:** Completing hybrid model DB migration
