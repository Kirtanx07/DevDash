import React, { useState } from 'react'
import { SUPABASE_SCHEMA, AI_CONVERSION_PROMPT } from '../lib/schema'

const STEPS = [
  {
    num: '01', title: 'Install Node.js & run locally',
    done: true, // already done if reading this
    commands: [`node -v   # needs v18+\nnpm -v    # needs 9+\nnpm install\nnpm run dev\n# Open http://localhost:3000`],
    notes: 'You are here ✓ — dashboard is running locally.'
  },
  {
    num: '02', title: 'Create Supabase project (database)',
    commands: [`# 1. Go to https://supabase.com → New Project\n# 2. Note down:\n#    - Project URL  (looks like https://xxx.supabase.co)\n#    - Anon/Public key\n# 3. Go to SQL Editor → paste + run the full schema\nnpm install @supabase/supabase-js`],
    notes: 'Free tier: 500MB DB, 1GB storage. No credit card needed.'
  },
  {
    num: '03', title: 'Set up Clerk authentication',
    commands: [`# 1. Go to https://clerk.dev → Create application\n# 2. Enable Google + GitHub OAuth (1 click)\n# 3. Copy Publishable Key\nnpm install @clerk/clerk-react`],
    notes: 'Free tier: 10,000 monthly active users. Handles login UI automatically.'
  },
  {
    num: '04', title: 'Create .env file',
    commands: [`# Create file: .env  (in project root, next to package.json)\nVITE_CLERK_KEY=pk_test_your_key_here\nVITE_SUPABASE_URL=https://xxx.supabase.co\nVITE_SUPABASE_ANON=eyJhbGciOiJIUzI1NiIsInR5c...`],
    notes: 'Never commit .env to Git — add it to .gitignore'
  },
  {
    num: '05', title: 'Wrap App with ClerkProvider',
    commands: [`// src/main.jsx — replace existing content:\nimport { ClerkProvider } from '@clerk/clerk-react'\nimport { AuthGuard } from './components/AuthGuard'\n\nReactDOM.createRoot(root).render(\n  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_KEY}>\n    <App />\n  </ClerkProvider>\n)\n\n// src/components/AuthGuard.jsx — create new file:\nimport { SignIn, useUser } from '@clerk/clerk-react'\nexport function AuthGuard({ children }) {\n  const { isSignedIn, isLoaded } = useUser()\n  if (!isLoaded) return <div style={{color:'var(--accent)',padding:40,fontFamily:'monospace'}}>LOADING...</div>\n  if (!isSignedIn) return <SignIn routing="hash" />\n  return children\n}`],
    notes: 'Users will see a login page before accessing the dashboard.'
  },
  {
    num: '06', title: 'Connect store to Supabase',
    commands: [`// src/lib/supabase.js — uncomment the code in the file\n// Then in src/store/index.js — replace localStorage ops:\n\nimport { supabase } from '../lib/supabase'\nimport { useUser } from '@clerk/clerk-react'\n\n// In addResource action:\naddResource: async (res) => {\n  const { userId } = useAuth()\n  const saved = await upsertResource(userId, res)\n  set(s => ({ resources: [saved, ...s.resources] }))\n},`],
    notes: 'After this step all data syncs to Supabase — accessible from any device.'
  },
  {
    num: '07', title: 'Create Supabase Storage bucket for files',
    commands: [`# In Supabase Dashboard:\n# 1. Storage → New Bucket → name: "user-files" → Public: OFF\n# 2. Storage Policies → Add policy:\n#    Bucket: user-files\n#    Operation: ALL\n#    Policy: (storage.foldername(name))[1] = auth.uid()::text\n\n# In code (src/lib/supabase.js):\n# Uncomment the uploadFile function`],
    notes: 'Free tier: 1GB storage. Users can upload PDFs, images, documents.'
  },
  {
    num: '08', title: 'Deploy to Vercel',
    commands: [`# Option A — CLI:\nnpm install -g vercel\nvercel login\nvercel\n# Follow prompts, add ENV vars when asked\n\n# Option B — GitHub:\n# 1. Push code to GitHub\n# 2. Go to vercel.com → Import Project → select repo\n# 3. Add ENV vars in Project Settings → Environment Variables\n# 4. Click Deploy`],
    notes: 'Hobby plan is completely free. Custom domain support included.'
  },
  {
    num: '09', title: 'Configure Clerk allowed origins',
    commands: [`# In Clerk Dashboard:\n# Configure → Domains → Add your Vercel URL\n# e.g. https://your-app.vercel.app\n\n# Also add localhost for development:\n# http://localhost:3000`],
    notes: 'Without this, Clerk will block login on the deployed domain.'
  },
  {
    num: '10', title: 'Go live & invite users',
    commands: [`# Your app is now:\n# ✓ Authenticated (Clerk — Google/GitHub/Email)\n# ✓ Multi-user (each user sees only their data)\n# ✓ Cloud synced (Supabase — accessible anywhere)\n# ✓ File storage ready (PDFs, images)\n# ✓ Deployed (Vercel — auto-deploys on git push)\n\n# Share the URL — each user creates their own account\n# and gets their own private workspace`],
    notes: 'Total cost for 0–10,000 users: $0/month.'
  },
]

export function ProductionTab({ onNotify }) {
  const [openStep, setOpenStep] = useState(null)
  const [schemaCopied, setSchemaCopied] = useState(false)

  const copySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA).then(() => {
      setSchemaCopied(true)
      onNotify?.('SQL SCHEMA COPIED — paste in Supabase SQL Editor')
      setTimeout(() => setSchemaCopied(false), 3000)
    })
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(AI_CONVERSION_PROMPT).then(() => onNotify?.('AI PROMPT COPIED!'))
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ borderLeft: '3px solid var(--accent3)', paddingLeft: 14 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '.65rem', letterSpacing: 3, color: 'var(--accent3)', marginBottom: 6 }}>PRODUCTION ROADMAP</div>
        <div style={{ fontSize: '.82rem', color: 'var(--text-dim)', lineHeight: 1.7 }}>
          Follow these <strong style={{ color: 'var(--text)' }}>10 steps</strong> to go from localhost → production multi-user app.
          Each step is independent — click to expand details and copy commands.
          <span style={{ color: 'var(--accent)' }}> Total cost for 0–10K users: $0/month.</span>
        </div>
      </div>

      {/* Step-by-step */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {STEPS.map((step, i) => (
          <StepCard key={step.num} step={step} isOpen={openStep === i}
            onToggle={() => setOpenStep(openStep === i ? null : i)}
            onNotify={onNotify} />
        ))}
      </div>

      {/* Quick tools */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 18 }}>
          <div className="panel-title"><div className="panel-title-left"><div className="panel-title-dot" />SQL DATABASE SCHEMA</div></div>
          <p style={{ fontSize: '.73rem', color: 'var(--text-dim)', marginBottom: 12, lineHeight: 1.6 }}>
            Complete Supabase SQL schema with all tables, indexes, Row Level Security policies, and auto-updated triggers.
            Paste this in <strong style={{ color: 'var(--accent)' }}>Supabase → SQL Editor → Run</strong>.
          </p>
          <div style={{ background: '#020a10', border: '1px solid var(--border)', padding: 12, fontFamily: 'var(--font-mono)', fontSize: '.62rem', color: 'var(--accent3)', lineHeight: 1.8, maxHeight: 200, overflowY: 'auto', marginBottom: 12, whiteSpace: 'pre' }}>
            {SUPABASE_SCHEMA.trim().slice(0, 600)}...
          </div>
          <button className="cyber-btn green full" onClick={copySchema}>
            {schemaCopied ? '✓ COPIED!' : 'COPY FULL SQL SCHEMA'}
          </button>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 18 }}>
          <div className="panel-title"><div className="panel-title-left"><div className="panel-title-dot" />AI IMPORT PROMPT</div></div>
          <p style={{ fontSize: '.73rem', color: 'var(--text-dim)', marginBottom: 12, lineHeight: 1.6 }}>
            Copy this prompt → paste into any AI (ChatGPT / Claude / Gemini) + your resource list.
            The AI will return <strong style={{ color: 'var(--accent)' }}>valid JSON</strong> ready to import directly into the dashboard.
          </p>
          <div style={{ background: 'var(--panel2)', border: '1px solid var(--accent3)', borderLeft: '3px solid var(--accent3)', padding: 12, fontFamily: 'var(--font-mono)', fontSize: '.6rem', color: 'var(--accent3)', lineHeight: 1.8, maxHeight: 200, overflowY: 'auto', marginBottom: 12, whiteSpace: 'pre-wrap' }}>
            {AI_CONVERSION_PROMPT.slice(0, 400)}...
          </div>
          <button className="cyber-btn full" onClick={copyPrompt}>COPY AI PROMPT</button>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 18 }}>
          <div className="panel-title"><div className="panel-title-left"><div className="panel-title-dot" />FREE TIER SUMMARY</div></div>
          {[
            ['Clerk Auth',      '10,000 MAU',         'clerk.dev', 'var(--accent)'],
            ['Supabase DB',     '500MB database',     'supabase.com', 'var(--accent3)'],
            ['Supabase Storage','1GB file storage',   'supabase.com', 'var(--accent3)'],
            ['Vercel Deploy',   'Unlimited (hobby)',  'vercel.com', 'var(--text)'],
            ['Railway Backend', '$5/mo (if needed)',  'railway.app', 'var(--accent4)'],
          ].map(([svc, limit, url, color]) => (
            <div key={svc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #00d4ff11', fontSize: '.78rem' }}>
              <div>
                <strong style={{ color }}>{svc}</strong>
                <span style={{ color: 'var(--text-dim)', marginLeft: 8, fontSize: '.68rem' }}>{limit}</span>
              </div>
              <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', color: 'var(--text-dim)', letterSpacing: 1 }}>{url} ↗</a>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 18 }}>
          <div className="panel-title"><div className="panel-title-left"><div className="panel-title-dot" />NEXT FEATURES TO BUILD</div></div>
          {[
            ['🎵', 'Spotify / lofi radio widget'],
            ['📊', 'Productivity analytics charts'],
            ['📱', 'PWA — installable on mobile'],
            ['🤖', 'AI chat to search resources'],
            ['🔔', 'Browser notifications for deadlines'],
            ['📅', 'Google Calendar sync'],
            ['🌐', 'Link health checker (broken links)'],
            ['🗃',  'Kanban board for tasks'],
          ].map(([icon, name]) => (
            <div key={name} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px solid #00d4ff11', fontSize: '.78rem', color: 'var(--text-dim)' }}>
              <span>{icon}</span> {name}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function StepCard({ step, isOpen, onToggle, onNotify }) {
  const copyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd).then(() => onNotify?.('COMMAND COPIED!'))
  }

  return (
    <div style={{ background: 'var(--panel)', border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--border)'}`, transition: 'border-color .2s' }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', cursor: 'pointer' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.75rem', color: 'var(--accent)', width: 28, flexShrink: 0 }}>{step.num}</div>
        <div style={{ flex: 1, fontWeight: 600, fontSize: '.88rem', color: isOpen ? 'var(--accent)' : 'var(--text)', transition: 'color .2s' }}>{step.title}</div>
        {step.done && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', padding: '2px 8px', border: '1px solid var(--accent3)', color: 'var(--accent3)' }}>✓ DONE</span>}
        <span style={{ color: 'var(--text-dim)', fontSize: '.75rem', transition: 'transform .2s', display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
      </div>

      {isOpen && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border)' }}>
          {step.notes && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--accent4)', padding: '8px 12px', borderLeft: '3px solid var(--accent4)', background: '#ffaa0008', margin: '10px 0' }}>
              💡 {step.notes}
            </div>
          )}
          {step.commands.map((cmd, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 8 }}>
              <pre style={{ background: '#020a10', border: '1px solid var(--border)', padding: '12px 50px 12px 14px', fontFamily: 'var(--font-mono)', fontSize: '.65rem', color: 'var(--accent3)', lineHeight: 1.8, overflowX: 'auto', whiteSpace: 'pre', margin: 0 }}>{cmd}</pre>
              <button onClick={() => copyCmd(cmd)} style={{ position: 'absolute', top: 8, right: 8, fontFamily: 'var(--font-display)', fontSize: '.45rem', letterSpacing: 1, padding: '3px 8px', border: '1px solid var(--accent3)', color: 'var(--accent3)', background: 'none', cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent3)'; e.currentTarget.style.color = 'var(--bg)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--accent3)' }}>
                COPY
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
