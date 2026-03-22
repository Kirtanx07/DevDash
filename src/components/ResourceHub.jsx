import React, { useState } from 'react'
import { useStore } from '../store'

const TYPE_ICONS = { link:'🔗', tool:'🛠', pdf:'📄', roadmap:'🗺', internship:'💼', course:'🎓', image:'🖼', note:'📝', repo:'⚡', other:'📦' }

export function ResourceHub({ onNotify, onAddClick }) {
  const resources    = useStore(s => s.resources)
  const activeCat    = useStore(s => s.activeCat)
  const searchQuery  = useStore(s => s.searchQuery)
  const deleteResource = useStore(s => s.deleteResource)
  const setActiveCat   = useStore(s => s.setActiveCat)
  const setSearchQuery = useStore(s => s.setSearchQuery)

  const cats = ['ALL', ...new Set(resources.map(r => (r.category || 'General').toUpperCase()))]

  const filtered = resources
    .filter(r => {
      const matchCat = activeCat === 'ALL' || (r.category || 'General').toUpperCase() === activeCat
      const q = searchQuery.toLowerCase()
      const matchQ = !q || [r.title, r.description, r.category, ...(r.tags || [])].join(' ').toLowerCase().includes(q)
      return matchCat && matchQ
    })
    .sort((a, b) => ({ pinned: 0, high: 1, normal: 2 }[a.priority || 'normal'] - { pinned: 0, high: 1, normal: 2 }[b.priority || 'normal']))

  return (
    <div className="panel" style={{ flex: 1, overflow: 'auto' }}>
      <div className="panel-title">
        <div className="panel-title-left"><div className="panel-title-dot" />RESOURCE HUB</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="cyber-btn" style={{ padding: '3px 10px', fontSize: '.45rem', clipPath: 'none' }} onClick={onAddClick}>+ ADD</button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', background: 'var(--panel2)', padding: '8px 12px', marginBottom: 12 }}>
        <span style={{ color: 'var(--accent)' }}>⌕</span>
        <input className="cyber-input" style={{ border: 'none', background: 'none', padding: 0, boxShadow: 'none' }}
          placeholder="SEARCH RESOURCES..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap' }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{
            fontFamily: 'var(--font-display)', fontSize: '.5rem', letterSpacing: 2,
            padding: '4px 12px', border: '1px solid var(--border)', background: 'none',
            color: activeCat === cat ? 'var(--accent)' : 'var(--text-dim)', cursor: 'pointer',
            borderColor: activeCat === cat ? 'var(--accent)' : 'var(--border)',
            background: activeCat === cat ? '#00d4ff08' : 'none',
            clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
            transition: 'all .15s'
          }}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
        {filtered.map(r => <ResourceCard key={r.id} resource={r} onDelete={() => { deleteResource(r.id); onNotify('RESOURCE REMOVED') }} />)}
        <AddCard onClick={onAddClick} />
      </div>
    </div>
  )
}

function ResourceCard({ resource: r, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const borderColor = r.priority === 'pinned' ? '#00d4ff55' : r.priority === 'high' ? '#ff2d5555' : 'var(--border)'

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? 'var(--accent)' : borderColor}`,
        background: hovered ? '#00d4ff08' : 'var(--panel2)',
        padding: 12, position: 'relative', overflow: 'hidden',
        transition: 'all .2s', transform: hovered ? 'translateX(2px)' : 'none'
      }}>
      {hovered && <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'var(--accent)' }} />}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', color: 'var(--accent2)', letterSpacing: 2, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        {(TYPE_ICONS[r.type] || '📦')} {(r.type || 'other').toUpperCase()}
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--accent2), transparent)' }} />
      </div>
      <div style={{ fontSize: '.88rem', fontWeight: 600, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {r.priority === 'pinned' ? '📌 ' : ''}{r.title}
      </div>
      <div style={{ fontSize: '.7rem', color: 'var(--text-dim)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.description}</div>
      {(r.tags || []).length > 0 && (
        <div style={{ display: 'flex', gap: 3, marginTop: 7, flexWrap: 'wrap' }}>
          {r.tags.map(t => <span key={t} style={{ fontSize: '.58rem', padding: '2px 6px', border: '1px solid var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{t}</span>)}
        </div>
      )}
      {hovered && (
        <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
          {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="rc-btn" style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', padding: '3px 8px', border: '1px solid var(--accent)', color: 'var(--accent)', background: 'none' }}>OPEN ↗</a>}
          <button onClick={onDelete} style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', padding: '3px 8px', border: '1px solid var(--accent2)', color: 'var(--accent2)', background: 'none', cursor: 'pointer' }}>DEL</button>
        </div>
      )}
    </div>
  )
}

function AddCard({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick}
      style={{
        border: `1px dashed ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 6, minHeight: 110, cursor: 'pointer',
        color: hovered ? 'var(--accent)' : 'var(--text-dim)',
        background: hovered ? '#00d4ff05' : 'transparent',
        fontFamily: 'var(--font-mono)', fontSize: '.68rem', letterSpacing: 2,
        transition: 'all .2s'
      }}>
      <div style={{ fontSize: '1.8rem', color: 'var(--accent)', opacity: hovered ? 1 : .4, lineHeight: 1, transition: 'opacity .2s' }}>+</div>
      ADD RESOURCE
    </div>
  )
}
