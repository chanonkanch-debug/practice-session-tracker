-- Basic schemas for PostgreSQL (Using supabase)

-- One user has many practice_sessions (1:many)
-- One practice_session has many session_items (1:many)
-- Create users table
CREATE TABLE "users" (
  "id" BIGSERIAL PRIMARY KEY,
  "email" VARCHAR UNIQUE NOT NULL,
  "password_hash" VARCHAR NOT NULL,
  "username" VARCHAR UNIQUE NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create practice_sessions table
CREATE TABLE "practice_sessions" (
  "id" BIGSERIAL PRIMARY KEY,
  "user_id" BIGINT NOT NULL,
  "practice_date" DATE NOT NULL,
  "total_duration" INTEGER NOT NULL,
  "instrument" VARCHAR,
  "session_notes" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT "fk_user_practice_sessions" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- Create session_items table
CREATE TABLE "session_items" (
  "id" BIGSERIAL PRIMARY KEY,
  "session_id" BIGINT NOT NULL,
  "item_type" VARCHAR,
  "item_name" VARCHAR,
  "tempo_bpm" INTEGER,
  "time_spent_minutes" INTEGER,
  "difficulty_level" VARCHAR,
  "notes" TEXT,
  CONSTRAINT "fk_session_items_sessions" FOREIGN KEY ("session_id") REFERENCES "practice_sessions" ("id") ON DELETE CASCADE
);

-- Add comments
COMMENT ON COLUMN "session_items"."item_type" IS 'scale, piece, technique, sight-reading';
COMMENT ON COLUMN "session_items"."item_name" IS 'C Major Scale, Moonlight Sonata';
COMMENT ON COLUMN "session_items"."tempo_bpm" IS 'specific to this item';
COMMENT ON COLUMN "session_items"."difficulty_level" IS 'beginner, intermediate, advanced';

-- Create indexes for foreign keys (optional but recommended for performance)
CREATE INDEX "idx_practice_sessions_user_id" ON "practice_sessions" ("user_id");
CREATE INDEX "idx_session_items_session_id" ON "session_items" ("session_id");