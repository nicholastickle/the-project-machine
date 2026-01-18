CREATE TABLE "reference_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_thread_id_chat_threads_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'Not started'::text;--> statement-breakpoint
DROP TYPE "public"."task_status";--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('Not started', 'On-going', 'Stuck', 'Complete', 'Abandoned');--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'Not started'::"public"."task_status";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE "public"."task_status" USING "status"::"public"."task_status";--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "project_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "plan_snapshots" ADD COLUMN "snapshot_data" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "plan_snapshots" ADD COLUMN "snapshot_type" text DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "archived_at" timestamp;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD COLUMN "anonymous_id" text;--> statement-breakpoint
ALTER TABLE "reference_notes" ADD CONSTRAINT "reference_notes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "thread_id";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "metadata";--> statement-breakpoint
ALTER TABLE "plan_snapshots" DROP COLUMN "canvas_state";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "deleted_at";