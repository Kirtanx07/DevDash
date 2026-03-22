// ============================================================
//  UNIVERSAL RESOURCE DATABASE SCHEMA
//  Single source of truth for ALL resource types in the app.
//  Every resource, regardless of type, shares a base shape +
//  an optional metadata object for type-specific fields.
// ============================================================

/**
 * BASE RESOURCE SHAPE  (applies to every single resource)
 * ─────────────────────────────────────────────────────────
 * {
 *   id:          string  (uuid or timestamp-based)
 *   userId:      string  (owner — for multi-user)
 *   type:        ResourceType
 *   title:       string  (required)
 *   url:         string  (optional)
 *   description: string  (optional)
 *   category:    string  (auto-creates a tab in the UI)
 *   tags:        string[]
 *   priority:    'pinned' | 'high' | 'normal'
 *   status:      ResourceStatus
 *   meta:        object  (type-specific fields — see below)
 *   createdAt:   number  (timestamp)
 *   updatedAt:   number  (timestamp)
 * }
 */

// ── RESOURCE TYPES ──────────────────────────────────────────
export const RESOURCE_TYPES = {
  // General
  LINK:        'link',
  TOOL:        'tool',
  NOTE:        'note',
  REPO:        'repo',
  OTHER:       'other',

  // Content
  PDF:         'pdf',
  IMAGE:       'image',
  VIDEO:       'video',
  COURSE:      'course',
  BOOK:        'book',

  // Career
  INTERNSHIP:  'internship',
  JOB:         'job',
  ROADMAP:     'roadmap',

  // Academic
  PAPER:       'paper',
  DATASET:     'dataset',
  PROJECT:     'project',
}

// ── STATUS VALUES ────────────────────────────────────────────
export const RESOURCE_STATUS = {
  // Universal
  NONE:            'none',
  SAVED:           'saved',
  IN_PROGRESS:     'in_progress',
  COMPLETED:       'completed',
  ARCHIVED:        'archived',

  // Internship / Job specific
  NOT_APPLIED:     'not_applied',
  APPLIED:         'applied',
  SHORTLISTED:     'shortlisted',
  INTERVIEW:       'interview',
  OFFERED:         'offered',
  REJECTED:        'rejected',
  WITHDRAWN:       'withdrawn',
}

// ── TYPE ICONS ───────────────────────────────────────────────
export const TYPE_ICONS = {
  link:       '🔗',
  tool:       '🛠',
  note:       '📝',
  repo:       '⚡',
  other:      '📦',
  pdf:        '📄',
  image:      '🖼',
  video:      '🎬',
  course:     '🎓',
  book:       '📚',
  internship: '💼',
  job:        '🏢',
  roadmap:    '🗺',
  paper:      '📑',
  dataset:    '🗃',
  project:    '🔧',
}

// ── STATUS LABELS + COLORS ───────────────────────────────────
export const STATUS_CONFIG = {
  none:         { label: '—',             color: '#3d6880' },
  saved:        { label: 'Saved',         color: '#3d6880' },
  in_progress:  { label: 'In Progress',   color: '#ffaa00' },
  completed:    { label: 'Completed',     color: '#00ff88' },
  archived:     { label: 'Archived',      color: '#3d6880' },
  not_applied:  { label: 'Not Applied',   color: '#3d6880' },
  applied:      { label: 'Applied',       color: '#00d4ff' },
  shortlisted:  { label: 'Shortlisted',   color: '#ffaa00' },
  interview:    { label: 'Interview',     color: '#bf00ff' },
  offered:      { label: 'Offered',       color: '#00ff88' },
  rejected:     { label: 'Rejected',      color: '#ff2d55' },
  withdrawn:    { label: 'Withdrawn',     color: '#3d6880' },
}

// ── META SHAPES (type-specific extra fields) ─────────────────
//
// internship / job:
// {
//   organiser:    string   (company / ministry name)
//   stipend:      string   (e.g. "₹10,000/mo" or "Unpaid")
//   duration:     string   (e.g. "2–6 months")
//   eligibility:  string   (degree/year requirements)
//   skills:       string[] (required skills)
//   mode:         string   (online / onsite / hybrid)
//   deadline:     string   (date or "Rolling")
//   sector:       string   (Tech / Finance / Policy…)
//   location:     string   (city or "Remote")
//   applyLink:    string   (direct apply URL)
// }
//
// course:
// {
//   platform:     string   (Coursera / Udemy / YouTube…)
//   instructor:   string
//   duration:     string   (e.g. "12 hours")
//   level:        string   (beginner / intermediate / advanced)
//   certificate:  boolean
//   paid:         boolean
// }
//
// pdf / book / paper:
// {
//   author:       string
//   pages:        number
//   year:         number
//   fileUrl:      string   (Supabase Storage URL after upload)
//   fileSize:     string   (e.g. "2.4 MB")
// }
//
// repo / project:
// {
//   language:     string
//   stars:        number
//   forks:        number
//   lastUpdated:  string
//   license:      string
// }

// ── FACTORY — create a new resource object ───────────────────
export function createResource(overrides = {}) {
  return {
    id:          String(Date.now() + Math.random()),
    userId:      null,                // set when auth is added
    type:        'link',
    title:       '',
    url:         '',
    description: '',
    category:    'General',
    tags:        [],
    priority:    'normal',
    status:      'none',
    meta:        {},
    createdAt:   Date.now(),
    updatedAt:   Date.now(),
    ...overrides,
  }
}

// ── JSON IMPORT FORMAT (what users paste / AI generates) ─────
export const JSON_IMPORT_FORMAT = {
  resources: [
    {
      type:        'link',
      title:       'Resource Name',
      url:         'https://...',
      description: '1-2 sentence description',
      category:    'Category Name',
      tags:        ['tag1', 'tag2'],
      priority:    'normal',
      status:      'none',
      meta:        {},
    },
    {
      type:        'internship',
      title:       'Example Internship',
      url:         'https://apply-link.com',
      description: 'Brief description',
      category:    'Career',
      tags:        ['government', 'paid'],
      priority:    'high',
      status:      'not_applied',
      meta: {
        organiser:   'Ministry / Company Name',
        stipend:     '₹10,000/mo',
        duration:    '2–3 months',
        eligibility: 'B.Tech / Any UG',
        skills:      ['Python', 'Research'],
        mode:        'Onsite',
        deadline:    'Rolling',
        sector:      'Technology',
        location:    'Delhi',
        applyLink:   'https://...',
      },
    },
  ],
}

// ── SUPABASE SQL SCHEMA ──────────────────────────────────────
export const SUPABASE_SCHEMA = `
-- ============================================================
--  CYBERSPACE DASHBOARD — PRODUCTION DATABASE SCHEMA
--  Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. RESOURCES (universal table for ALL resource types)
CREATE TABLE IF NOT EXISTS resources (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      TEXT        NOT NULL,
  type         TEXT        NOT NULL DEFAULT 'link',
  title        TEXT        NOT NULL,
  url          TEXT,
  description  TEXT,
  category     TEXT        DEFAULT 'General',
  tags         TEXT[]      DEFAULT '{}',
  priority     TEXT        DEFAULT 'normal'
                           CHECK (priority IN ('normal','high','pinned')),
  status       TEXT        DEFAULT 'none',
  meta         JSONB       DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TODOS
CREATE TABLE IF NOT EXISTS todos (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      TEXT        NOT NULL,
  text         TEXT        NOT NULL,
  done         BOOLEAN     DEFAULT FALSE,
  priority     TEXT        DEFAULT 'h'
                           CHECK (priority IN ('h','m','l')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NOTES (user scratchpad, versioned)
CREATE TABLE IF NOT EXISTS notes (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      TEXT        NOT NULL UNIQUE,
  content      TEXT        DEFAULT '',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER SESSIONS (timer data)
CREATE TABLE IF NOT EXISTS sessions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      TEXT        NOT NULL,
  duration_sec INTEGER     NOT NULL,
  mode         TEXT        DEFAULT 'focus',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER PROFILE / SETTINGS
CREATE TABLE IF NOT EXISTS user_settings (
  user_id      TEXT        PRIMARY KEY,
  accent_color TEXT        DEFAULT '#00d4ff',
  settings     JSONB       DEFAULT '{}',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_resources_user     ON resources (user_id);
CREATE INDEX IF NOT EXISTS idx_resources_type     ON resources (type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources (category);
CREATE INDEX IF NOT EXISTS idx_resources_status   ON resources (status);
CREATE INDEX IF NOT EXISTS idx_todos_user         ON todos (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user      ON sessions (user_id);

-- ── ROW LEVEL SECURITY (users see ONLY their own data) ───────
ALTER TABLE resources     ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_resources"     ON resources     FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_todos"         ON todos         FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_notes"         ON notes         FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_sessions"      ON sessions      FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_user_settings" ON user_settings FOR ALL USING (user_id = auth.uid()::text);

-- ── AUTO-UPDATE updated_at trigger ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_notes_updated BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`

// ── AI CONVERSION PROMPT ─────────────────────────────────────
export const AI_CONVERSION_PROMPT = `Convert my resource list into this EXACT JSON format.
Return ONLY valid JSON — no markdown fences, no explanation, no preamble.

${JSON.stringify({ resources: JSON_IMPORT_FORMAT.resources }, null, 2)}

RULES:
- "type" must be one of: link, tool, pdf, roadmap, internship, course, image, note, repo, book, video, job, paper, dataset, project, other
- "priority" must be: normal | high | pinned
- "status" must be: none | saved | in_progress | completed | not_applied | applied | shortlisted | interview | offered | rejected
- "tags" is an array of strings (can be empty [])
- "url" can be "" if none
- "meta" holds type-specific fields (see internship example above)
- Every resource MUST have a non-empty "title"

For INTERNSHIPS specifically, populate the meta object with:
organiser, stipend, duration, eligibility, skills (array), mode, deadline, sector, location, applyLink

My resources:
[PASTE YOUR LIST HERE]`
