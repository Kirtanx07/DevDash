import React from 'react'

const SUGGESTIONS = [
  { icon: '🎵', name: 'Spotify / Music Widget',      desc: 'Embed Spotify Web API player or lofi radio stream for focus sessions' },
  { icon: '📊', name: 'Productivity Analytics',       desc: 'Charts showing tasks completed per day, session time history, streaks' },
  { icon: '🌤', name: 'Weather Widget',               desc: 'Local weather via OpenWeather API with auto location detection' },
  { icon: '📅', name: 'Calendar Integration',         desc: 'Google Calendar or CalDAV to show upcoming events and deadlines' },
  { icon: '🔖', name: 'Browser Extension',            desc: 'One-click save any webpage directly to your dashboard from the browser' },
  { icon: '🤖', name: 'AI Chat Assistant',            desc: 'Claude or GPT to help find, organize, and summarize your resources' },
  { icon: '📱', name: 'PWA / Mobile App',             desc: 'Make it installable as a PWA with offline support and push notifications' },
  { icon: '🔔', name: 'Smart Reminders',              desc: 'Set reminders on tasks/resources with browser notifications' },
  { icon: '🏷',  name: 'Advanced Tagging',            desc: 'Nested tags, tag colors, tag-based smart filtering with item counts' },
  { icon: '🗃',  name: 'Kanban Board',                desc: 'Drag-drop task board with columns: Backlog → Doing → Done → Archived' },
  { icon: '📈', name: 'GitHub Activity Graph',        desc: 'Show your GitHub contribution graph and recent commits via GitHub API' },
  { icon: '💬', name: 'Team Sharing',                 desc: 'Share specific resource collections or boards with other users' },
  { icon: '🔍', name: 'Semantic Search (AI)',         desc: 'AI-powered search that finds resources by meaning, not just keywords' },
  { icon: '📌', name: 'Named Collections',            desc: 'Group resources into collections: "Interview Prep", "Side Project", etc.' },
  { icon: '⏰', name: 'Deadline Tracker',             desc: 'Add due dates to tasks, show countdown, highlight overdue in red' },
  { icon: '🌐', name: 'Link Health Checker',          desc: 'Auto-detect broken/dead links in your resources and flag them' },
  { icon: '📝', name: 'Rich Markdown Editor',         desc: 'Full markdown editor with live preview for notes and scratchpad' },
  { icon: '🔐', name: 'Secure Credential Store',      desc: 'Encrypted local storage for API keys and personal credentials' },
  { icon: '📦', name: 'Version History',              desc: 'Track changes to your resource list and todos with timeline rollback' },
  { icon: '🎯', name: 'Goal Tracker',                 desc: 'Set weekly/monthly goals with progress bars and habit streaks' },
  { icon: '🌙', name: 'Theme Presets',                desc: 'Save and switch between named custom color themes and layouts' },
  { icon: '📤', name: 'Public Share Links',           desc: 'Generate read-only shareable links to your resource collections' },
  { icon: '🧩', name: 'Widget / Layout Builder',      desc: 'Add/remove/resize panels — a drag-and-drop dashboard composer' },
  { icon: '🖼',  name: 'Built-in PDF / Image Viewer', desc: 'Inline preview panel for PDFs and images without leaving the dashboard' },
  { icon: '📻', name: 'Focus Sounds',                 desc: 'Built-in ambient audio: rain, café, white noise, binaural beats' },
]

export function SuggestionsTab() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
      <div style={{ fontSize: '.8rem', color: 'var(--text-dim)', marginBottom: 18, lineHeight: 1.6, borderLeft: '3px solid var(--accent3)', paddingLeft: 12 }}>
        <strong style={{ color: 'var(--accent3)' }}>25 features</strong> you can add next to make this dashboard truly yours.
        Each one is implementable as a self-contained component.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
        {SUGGESTIONS.map((s, i) => (
          <SuggestCard key={i} {...s} index={i} />
        ))}
      </div>
    </div>
  )
}

function SuggestCard({ icon, name, desc, index }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#00d4ff08' : 'var(--panel)',
        border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        padding: 14, display: 'flex', gap: 12, transition: 'all .2s',
        transform: hovered ? 'translateX(2px)' : 'none',
        cursor: 'default',
      }}>
      <div style={{ fontSize: '1.3rem', flexShrink: 0, width: 28, textAlign: 'center', marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '.85rem', color: hovered ? 'var(--accent)' : 'var(--text)', marginBottom: 4, transition: 'color .2s' }}>{name}</div>
        <div style={{ fontSize: '.72rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>{desc}</div>
      </div>
    </div>
  )
}
