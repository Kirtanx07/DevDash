import React from 'react'

const steps = [
  { num: '01', title: 'Frontend', detail: 'React + Vite (current) — already set up!' },
  { num: '02', title: 'Auth', detail: 'Clerk.dev — free tier, supports Google/GitHub OAuth + email' },
  { num: '03', title: 'Database', detail: 'Supabase — PostgreSQL, free 500MB, row-level security' },
  { num: '04', title: 'File Storage', detail: 'Supabase Storage — for PDFs, images, attachments' },
  { num: '05', title: 'Backend API', detail: 'Next.js API routes OR Express on Railway (free tier)' },
  { num: '06', title: 'Deploy', detail: 'Vercel (frontend free) + Railway (backend $5/mo)' },
]

export function AuthTab() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
      <div style={{ fontSize: '.8rem', color: 'var(--text-dim)', marginBottom: 18, lineHeight: 1.6, borderLeft: '3px solid var(--accent)', paddingLeft: 12 }}>
        Currently running as a <strong style={{ color: 'var(--text)' }}>client-side app</strong> with localStorage. Below is the complete production setup — follow these steps to add auth, a real backend, and cloud sync.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>

        <Card title="🏗 RECOMMENDED STACK">
          {steps.map(s => (
            <div key={s.num} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #00d4ff11' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', color: 'var(--accent)', width: 20, flexShrink: 0 }}>{s.num}</span>
              <div style={{ fontSize: '.78rem', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text)' }}>{s.title}</strong>
                <span style={{ color: 'var(--text-dim)' }}> — {s.detail}</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <div className="sec-label">QUICK START COMMANDS</div>
            <pre className="code-block">{`# Clone & install
git clone your-repo && cd dashboard
npm install

# Add Supabase client
npm install @supabase/supabase-js

# Add Clerk auth  
npm install @clerk/clerk-react

# Run dev server
npm run dev`}</pre>
          </div>
        </Card>

        <Card title="🔐 AUTH SETUP (CLERK)">
          <p style={{ fontSize: '.72rem', color: 'var(--text-dim)', marginBottom: 10, lineHeight: 1.5 }}>1. Go to <a href="https://clerk.dev" target="_blank" style={{ color: 'var(--accent)' }}>clerk.dev</a> → Create app → Copy keys</p>
          <div className="sec-label">src/main.jsx</div>
          <pre className="code-block">{`import { ClerkProvider } from '@clerk/clerk-react'

const KEY = import.meta.env.VITE_CLERK_KEY

ReactDOM.createRoot(root).render(
  <ClerkProvider publishableKey={KEY}>
    <App />
  </ClerkProvider>
)`}</pre>
          <div className="sec-label">src/components/AuthGuard.jsx</div>
          <pre className="code-block">{`import { SignIn, useUser } from '@clerk/clerk-react'

export function AuthGuard({ children }) {
  const { isSignedIn, isLoaded } = useUser()
  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) return <SignIn />
  return children
}

// Wrap in App.jsx:
// <AuthGuard><Dashboard /></AuthGuard>`}</pre>
          <div className="sec-label">.env file</div>
          <pre className="code-block">{`VITE_CLERK_KEY=pk_test_your_key_here
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON=eyJhbGc...`}</pre>
        </Card>

        <Card title="🗄 DATABASE SCHEMA (SUPABASE)">
          <p style={{ fontSize: '.72rem', color: 'var(--text-dim)', marginBottom: 10, lineHeight: 1.5 }}>1. Go to <a href="https://supabase.com" target="_blank" style={{ color: 'var(--accent)' }}>supabase.com</a> → New project → SQL Editor → run this:</p>
          <pre className="code-block">{`-- Resources table
CREATE TABLE resources (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'link',
  title       TEXT NOT NULL,
  url         TEXT,
  description TEXT,
  category    TEXT DEFAULT 'General',
  tags        TEXT[],
  priority    TEXT DEFAULT 'normal',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Todos table  
CREATE TABLE todos (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    TEXT NOT NULL,
  text       TEXT NOT NULL,
  done       BOOLEAN DEFAULT FALSE,
  priority   TEXT DEFAULT 'h',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (users see only their own data)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_resources" ON resources
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "own_todos" ON todos
  FOR ALL USING (user_id = auth.uid()::text);`}</pre>
        </Card>

        <Card title="⚡ SUPABASE CLIENT">
          <div className="sec-label">src/lib/supabase.js</div>
          <pre className="code-block">{`import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON
)

// Fetch user's resources
export async function getResources(userId) {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Add a resource
export async function addResource(userId, resource) {
  const { data, error } = await supabase
    .from('resources')
    .insert({ ...resource, user_id: userId })
    .select()
  if (error) throw error
  return data[0]
}

// Delete a resource
export async function deleteResource(id) {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)
  if (error) throw error
}`}</pre>
        </Card>

        <Card title="📁 FILE UPLOAD (PDFs/Images)">
          <pre className="code-block">{`// src/lib/storage.js
import { supabase } from './supabase'

export async function uploadFile(file, userId) {
  const ext  = file.name.split('.').pop()
  const path = \`\${userId}/\${Date.now()}.\${ext}\`

  const { error } = await supabase.storage
    .from('user-files')
    .upload(path, file, { cacheControl: '3600' })
  
  if (error) throw error

  const { data } = supabase.storage
    .from('user-files')
    .getPublicUrl(path)

  return data.publicUrl
}

// In Supabase dashboard:
// Storage → Create bucket "user-files"
// → Policies → Add policy:
// Allow: auth.uid()::text = 
//   (storage.foldername(name))[1]`}</pre>
        </Card>

        <Card title="🚀 DEPLOY CHECKLIST">
          {[
            ['□', 'Push code to GitHub'],
            ['□', 'Import project on vercel.com'],
            ['□', 'Create Clerk app at clerk.dev → copy key'],
            ['□', 'Create Supabase project → run SQL schema'],
            ['□', 'Add ENV vars in Vercel Project Settings'],
            ['□', 'Add your domain in Clerk → Allowed Origins'],
            ['□', 'Create Supabase storage bucket "user-files"'],
            ['□', 'Set storage RLS policy for user folders'],
            ['□', 'Deploy → test signup → add first resource!'],
          ].map(([s, t]) => (
            <div key={t} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid #00d4ff11', fontSize: '.78rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', flexShrink: 0 }}>{s}</span>
              <span style={{ color: 'var(--text-dim)' }}>{t}</span>
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <div className="sec-label">FREE TIER LIMITS</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-dim)', lineHeight: 1.9 }}>
              Clerk: 10,000 MAU free<br />
              Supabase: 500MB DB · 1GB storage<br />
              Vercel: Unlimited hobby deploys<br />
              Railway: $5/mo hobby (backend)
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 18 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '.62rem', fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>{title}</div>
      {children}
    </div>
  )
}
