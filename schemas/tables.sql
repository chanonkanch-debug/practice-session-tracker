-- Basic schemas for PostgreSQL

-- One user has many practice_sessions (1:many)
-- One practice_session has many session_items (1:many)

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "password_hash" varchar NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "created_at" timestamps,
  "updated_at" timestamps
);

CREATE TABLE "practice_sessions" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "practice_date" date NOT NULL,
  "total_duration" integer NOT NULL,
  "instrument" varchar,
  "session_notes" text,
  "created_at" timestamps,
  "updated_at" timestamps
);

CREATE TABLE "session_items" (
  "id" integer PRIMARY KEY,
  "session_id" integer NOT NULL,
  "item_type" varchar,
  "item_name" varchar,
  "tempo_bpm" integer,
  "time_spent_minutes" integer,
  "difficulty_level" varchar,
  "notes" text
);

COMMENT ON COLUMN "session_items"."item_type" IS 'scale, piece, technique, sight-reading';

COMMENT ON COLUMN "session_items"."item_name" IS 'C Major Scale, Moonlight Sonata';

COMMENT ON COLUMN "session_items"."tempo_bpm" IS 'specifc to this item';

COMMENT ON COLUMN "session_items"."difficulty_level" IS 'beginner, intermediate, advanced';

ALTER TABLE "users" ADD CONSTRAINT "user_practice_sessions" FOREIGN KEY ("id") REFERENCES "practice_sessions" ("user_id");

ALTER TABLE "practice_sessions" ADD CONSTRAINT "session_items_sessions" FOREIGN KEY ("id") REFERENCES "session_items" ("session_id");
