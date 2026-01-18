# API Testing Guide

## Quick Start

### Option 1: Swagger UI (Recommended for Exploration)

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI**
   - Navigate to: http://localhost:3000/api-docs
   - Interactive documentation with "Try it out" buttons
   - No authentication required for viewing
   - For testing authenticated endpoints, copy session cookie from browser

3. **Advantages**
   - Visual, interactive interface
   - See all endpoints, schemas, and examples
   - Test directly in browser
   - Auto-generated from OpenAPI spec

### Option 2: REST Client (Recommended for Automated Testing)

1. **Install Extension**
   - Open VS Code Extensions (Ctrl+Shift+X)
   - Search for "REST Client" by Huachao Mao
   - Click Install

2. **Update Variables**
   - Open `api-tests.http`
   - Replace `YOUR_PROJECT_ID_HERE` with actual project ID
   - Get project ID by running the "Get all projects" request first

3. **Send Requests**
   - Click "Send Request" above any request
   - Results appear in split pane
   - Cookies are automatically handled
   - Save tests for regression testing

### Option 3: curl Commands

```bash
# Get all projects
curl http://localhost:3000/api/projects \
  -H "Cookie: your-session-cookie"

# Create project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"name":"Test Project","description":"Testing"}'

# Upload file
curl -X POST http://localhost:3000/api/projects/PROJECT_ID/files \
  -H "Cookie: your-session-cookie" \
  -F "file=@/path/to/file.xlsx" \
  -F "extractStructure=true"
```

**Recommendation:** Start with Swagger UI for exploration, then create REST Client tests for regression testing.

---

## Authentication Setup

All endpoints require authentication. Here's how to get session cookies:

1. **Start dev server**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Sign in** with your test account
4. **Get cookies** (choose one):
   - **Chrome DevTools**: F12 → Application → Cookies → localhost:3000
   - **REST Client**: Cookies are auto-shared if browser is logged in
   - **Manual**: Copy `sb-access-token` and `sb-refresh-token` values

## Testing Workflow

### 1. Basic Flow
```http
1. GET /api/projects          → Get project ID
2. POST /api/projects         → Create new project
3. POST .../snapshots         → Save canvas state
4. POST .../reflections       → Add reflection
5. GET .../snapshots          → Verify saved
```

### 2. File Upload Flow
```http
1. POST .../files             → Upload Excel/PDF
2. GET .../files              → See AI summary
3. PATCH .../files/[id]       → Confirm summary
4. GET /api/ai/chat           → AI uses file context
```

### 3. Collaboration Flow
```http
1. GET .../collaborators      → List team
2. POST .../collaborators     → Invite user (501 stub)
3. DELETE .../collaborators   → Remove user
```

## Common Issues

### 401 Unauthorized
- **Cause**: Not logged in or session expired
- **Fix**: Sign in at http://localhost:3000 first

### 404 Not Found
- **Cause**: Invalid project/resource ID
- **Fix**: Run GET /api/projects to get valid IDs

### 403 Forbidden
- **Cause**: Trying to access another user's project
- **Fix**: Only access your own projects

### 500 Server Error
- **Cause**: Database not set up or missing env vars
- **Fix**: Check Supabase connection in `.env.local`

## Testing Tips

### 1. Get IDs Quickly
After creating a resource, copy the `id` from the response:
```json
{
  "project": {
    "id": "abc-123-def",  ← Copy this
    "name": "Test Project"
  }
}
```

Update the variable in `api-tests.http`:
```http
@projectId = abc-123-def
```

### 2. Test AI Commands
The AI can return embedded commands. Test by sending:
```json
{
  "message": "Add a task for login feature",
  "currentSnapshot": { "nodes": [], "edges": [] }
}
```

Look for `[COMMAND:{...}]` in the response.

### 3. Verify RLS Security
Try accessing another user's project ID (should return 404/403):
```http
GET {{baseUrl}}/api/projects/someone-elses-project-id
```

### 4. Test File Uploads
Use curl for file uploads (REST Client doesn't support multipart/form-data well):
```bash
curl -X POST "http://localhost:3000/api/projects/PROJECT_ID/files" \
  -H "Cookie: $(pbpaste)" \
  -F "file=@test.xlsx" \
  -F "extractStructure=true"
```

## Example Test Session

```http
# 1. Create project
POST /api/projects
{ "name": "Test Project" }
→ Get project ID: abc-123

# 2. Add reflection
POST /api/projects/abc-123/reflections
{ "reflection_type": "start-of-day", "reflection_text": "Testing APIs" }

# 3. Save snapshot
POST /api/projects/abc-123/snapshots
{ "snapshot_data": { "nodes": [...], "edges": [] }}

# 4. Test AI chat
POST /api/ai/chat
{ "projectId": "abc-123", "message": "What should I work on?" }

# 5. Export
GET /api/projects/abc-123/export/excel
→ Downloads Excel file
```

## Team Testing

Share this guide with the team:

1. **Nick (UI)**: Use `api-tests.http` to test before building UI
2. **Backend devs**: Add new tests to `api-tests.http` when adding endpoints
3. **QA**: Use Postman collection for regression testing
4. **Everyone**: Check `docs/API_REFERENCE.md` for complete documentation

## Troubleshooting Commands

```bash
# Check if server is running
curl http://localhost:3000/api/projects

# Check database connection (look for Supabase errors in logs)
npm run dev

# Check auth status in browser console
document.cookie

# View server logs
# Terminal where you ran `npm run dev`
```

## Next Steps

1. ✅ Install REST Client extension
2. ✅ Sign in at http://localhost:3000
3. ✅ Open `api-tests.http`
4. ✅ Update `@projectId` variable
5. ✅ Click "Send Request" and test!

Happy testing! 🚀
