# Project Machine

**AI-Powered Project Management & Canvas Planning Platform**

Transform your project management with intelligent canvas planning, AI-powered insights, and visual project organization. Project Machine combines modern web technologies with AI assistance to revolutionize how you plan and manage projects.

## Tech Stack

### **Frontend**
- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with OKLCH colors
- **shadcn/ui** - Modern component library
- **@xyflow/react** - Interactive canvas and flow diagrams

### **Backend**
- **Supabase** - PostgreSQL database, authentication, storage
- **Drizzle ORM** - TypeScript-first SQL toolkit
- **Row Level Security (RLS)** - Database-level permissions

### **Development Tools**
- **ESLint** - Code quality and consistency
- **Husky** - Git hooks for code quality
- **Vitest** - Unit and integration testing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/the-project-machine.git
   cd project-machine
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   npm run db:rls
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database

This project uses **Drizzle ORM** with Supabase PostgreSQL:

- **Schema**: `lib/db/schema.ts` - TypeScript-first schema definition
- **Migrations**: `supabase/migrations/` - Version-controlled SQL migrations
- **Commands**:
  - `npm run db:generate` - Generate migration from schema changes
  - `npm run db:migrate` - Apply migrations to database
  - `npm run db:rls` - Apply Row Level Security policies
  - `npm run db:push` - Push schema directly (dev only)
  - `npm run db:studio` - Open Drizzle Studio GUI

See [docs/diagrams/ERD.md](docs/diagrams/ERD.md) for database architecture.


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
