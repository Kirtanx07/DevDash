import React from 'react'
import { useStore } from '../store'

const TYPE_ICONS = { link:'🔗', tool:'🛠', pdf:'📄', roadmap:'🗺', internship:'💼', course:'🎓', image:'🖼', note:'📝', repo:'⚡', other:'📦' }

export function QuickLinks({ onAddClick }) {
  const resources = useStore(s => s.resources)
  const shown = resources.filter(r => r.priority === 'pinned' || r.priority === 'high').slice(0, 10)
  const display = shown.length ? shown : resources.slice(0, 8)

  return (
    <div className="panel" style={{ flex: 1, overflow: 'auto' }}>
      <div className="panel-title">
        <div className="panel-title-left"><div className="panel-title-dot" />QUICK ACCESS</div>
        <button className="cyber-btn" style={{ padding: '3px 10px', fontSize: '.45rem', clipPath: 'none' }} onClick={onAddClick}>+</button>
      </div>

      {display.map(r => (
        <a key={r.id} href={r.url || '#'} target={r.url ? '_blank' : '_self'} rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', border: '1px solid transparent', cursor: 'pointer', textDecoration: 'none', color: 'var(--text)', marginBottom: 3, transition: 'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#00d4ff08'; e.currentTarget.style.paddingLeft = '14px' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '8px' }}>
          <div style={{ width: 28, height: 28, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', flexShrink: 0, background: 'var(--panel2)' }}>
            {TYPE_ICONS[r.type] || '📦'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
            <div style={{ fontSize: '.62rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>{(r.category || '').toUpperCase()}</div>
          </div>
        </a>
      ))}

      {display.length === 0 && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', color: 'var(--text-dim)', textAlign: 'center', padding: 20 }}>
          No pinned resources yet.<br />Mark resources as "pinned" or "high" to see them here.
        </div>
      )}
    </div>
  )
}
