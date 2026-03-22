import React, { useState } from 'react'
import { STATUS_CONFIG, TYPE_ICONS } from '../lib/schema'
import { useStore } from '../store'

const STIPEND_COLOR = (s = '') => {
  if (!s || s.toUpperCase() === 'UNPAID') return 'var(--accent2)'
  const n = parseInt(s.replace(/[^0-9]/g, ''))
  if (n >= 15000) return 'var(--accent3)'
  if (n >= 10000) return 'var(--accent4)'
  return 'var(--text-dim)'
}

const INTERNSHIP_STATUSES = ['not_applied', 'applied', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn']

export function InternshipsTab({ onNotify }) {
  const resources      = useStore(s => s.resources)
  const updateResource = useStore(s => s.updateResource)
  const deleteResource = useStore(s => s.deleteResource)
  const addResource    = useStore(s => s.addResource)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sectorFilter, setSectorFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('priority')
  const [showAdd, setShowAdd] = useState(false)

  const internships = resources.filter(r => r.type === 'internship')

  const sectors = ['ALL', ...new Set(internships.map(r => r.meta?.sector || 'Other').filter(Boolean))]

  const filtered = internships
    .filter(r => {
      const q = search.toLowerCase()
      const matchQ = !q || [r.title, r.description, r.meta?.organiser, r.meta?.location, r.meta?.sector, ...(r.tags || [])].join(' ').toLowerCase().includes(q)
      const matchS = statusFilter === 'ALL' || r.status === statusFilter
      const matchSec = sectorFilter === 'ALL' || (r.meta?.sector || '') === sectorFilter
      return matchQ && matchS && matchSec
    })
    .sort((a, b) => {
      if (sortBy === 'priority') return ({ pinned: 0, high: 1, normal: 2 }[a.priority] || 2) - ({ pinned: 0, high: 1, normal: 2 }[b.priority] || 2)
      if (sortBy === 'stipend') {
        const na = parseInt((a.meta?.stipend || '0').replace(/[^0-9]/g, '')) || 0
        const nb = parseInt((b.meta?.stipend || '0').replace(/[^0-9]/g, '')) || 0
        return nb - na
      }
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '')
      return 0
    })

  // Stats
  const stats = {
    total:       internships.length,
    applied:     internships.filter(r => r.status === 'applied').length,
    shortlisted: internships.filter(r => r.status === 'shortlisted').length,
    offered:     internships.filter(r => r.status === 'offered').length,
    notApplied:  internships.filter(r => r.status === 'not_applied').length,
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {[
          { label: 'TOTAL',       val: stats.total,       color: 'var(--accent)' },
          { label: 'NOT APPLIED', val: stats.notApplied,  color: 'var(--text-dim)' },
          { label: 'APPLIED',     val: stats.applied,     color: 'var(--accent4)' },
          { label: 'SHORTLISTED', val: stats.shortlisted, color: 'var(--accent)' },
          { label: 'OFFERED',     val: stats.offered,     color: 'var(--accent3)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '10px 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', color: s.color, textShadow: s.color === 'var(--accent)' ? 'var(--glow)' : 'none', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '.48rem', letterSpacing: 2, color: 'var(--text-dim)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, border: '1px solid var(--border)', background: 'var(--panel)', padding: '7px 12px' }}>
          <span style={{ color: 'var(--accent)' }}>⌕</span>
          <input className="cyber-input" style={{ border: 'none', background: 'none', padding: 0, boxShadow: 'none', flex: 1 }}
            placeholder="SEARCH INTERNSHIPS..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <select className="cyber-select" style={{ width: 'auto', minWidth: 130 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">ALL STATUS</option>
          {INTERNSHIP_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>)}
        </select>

        <select className="cyber-select" style={{ width: 'auto', minWidth: 140 }} value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}>
          {sectors.map(s => <option key={s} value={s}>{s === 'ALL' ? 'ALL SECTORS' : s}</option>)}
        </select>

        <select className="cyber-select" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="priority">Sort: Priority</option>
          <option value="stipend">Sort: Stipend ↓</option>
          <option value="status">Sort: Status</option>
        </select>

        <button className="cyber-btn green" onClick={() => setShowAdd(true)}>+ ADD INTERNSHIP</button>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 10 }}>
        {filtered.map(r => (
          <InternshipCard key={r.id} resource={r}
            onStatusChange={(id, status) => { updateResource(id, { status }); onNotify?.(`STATUS → ${STATUS_CONFIG[status]?.label}`) }}
            onDelete={(id) => { deleteResource(id); onNotify?.('INTERNSHIP REMOVED') }} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '.75rem', letterSpacing: 2 }}>
            NO INTERNSHIPS MATCH YOUR FILTERS
          </div>
        )}
      </div>

      {showAdd && <AddInternshipModal onClose={() => setShowAdd(false)} onNotify={onNotify} />}
    </div>
  )
}

function InternshipCard({ resource: r, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered]   = useState(false)
  const m = r.meta || {}
  const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.none
  const priColor = r.priority === 'pinned' ? 'var(--accent)' : r.priority === 'high' ? 'var(--accent2)' : 'var(--border)'

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ border: `1px solid ${hovered ? 'var(--accent)' : priColor}`, background: 'var(--panel)', transition: 'all .2s', position: 'relative', overflow: 'hidden' }}>
      {/* Priority strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: priColor, opacity: .8 }} />

      <div style={{ padding: '12px 12px 12px 16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: '.85rem' }}>💼</span>
              {r.priority === 'pinned' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.55rem', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '1px 5px' }}>PINNED</span>}
            </div>
            <div style={{ fontWeight: 700, fontSize: '.92rem', color: hovered ? 'var(--accent)' : 'var(--text)', transition: 'color .2s', lineHeight: 1.2 }}>{r.title}</div>
            <div style={{ fontSize: '.7rem', color: 'var(--text-dim)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{m.organiser}</div>
          </div>
          {/* Status badge */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', padding: '3px 8px', border: `1px solid ${sc.color}`, color: sc.color, flexShrink: 0, whiteSpace: 'nowrap' }}>
            {sc.label}
          </div>
        </div>

        {/* Key meta pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <MetaPill icon="💰" value={m.stipend || '?'} color={STIPEND_COLOR(m.stipend)} />
          <MetaPill icon="⏱" value={m.duration || '?'} />
          <MetaPill icon="📍" value={m.location || '?'} />
          <MetaPill icon="📅" value={m.deadline || '?'} color="var(--accent4)" />
        </div>

        {/* Description */}
        <div style={{ fontSize: '.73rem', color: 'var(--text-dim)', lineHeight: 1.4, marginBottom: 8 }}>{r.description}</div>

        {/* Expanded details */}
        {expanded && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginBottom: 8 }}>
            <Detail label="ELIGIBILITY" value={m.eligibility} />
            <Detail label="SECTOR"      value={m.sector} />
            <Detail label="MODE"        value={m.mode} />
            {(m.skills || []).length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.55rem', color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 4 }}>REQUIRED SKILLS</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {m.skills.map(s => (
                    <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', padding: '2px 6px', border: '1px solid var(--accent)', color: 'var(--accent)' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {(r.tags || []).length > 0 && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                {r.tags.map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', padding: '2px 5px', border: '1px solid var(--text-dim)', color: 'var(--text-dim)' }}>#{t}</span>)}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <select className="cyber-select" style={{ width: 'auto', fontSize: '.6rem', padding: '4px 8px' }}
            value={r.status} onChange={e => onStatusChange(r.id, e.target.value)}>
            {INTERNSHIP_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>)}
          </select>

          <button onClick={() => setExpanded(v => !v)} style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', padding: '4px 10px', border: '1px solid var(--border)', color: 'var(--text-dim)', background: 'none', cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)' }}>
            {expanded ? '▲ LESS' : '▼ MORE'}
          </button>

          {(m.applyLink || r.url) && (
            <a href={m.applyLink || r.url} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', padding: '4px 10px', border: '1px solid var(--accent3)', color: 'var(--accent3)', textDecoration: 'none', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent3)'; e.currentTarget.style.color = 'var(--bg)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--accent3)' }}>
              APPLY ↗
            </a>
          )}

          <button onClick={() => onDelete(r.id)} style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '.6rem', padding: '4px 8px', border: '1px solid transparent', color: 'var(--text-dim)', background: 'none', cursor: 'pointer', opacity: hovered ? 1 : 0, transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent2)'; e.currentTarget.style.color = 'var(--accent2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text-dim)' }}>
            DEL
          </button>
        </div>
      </div>
    </div>
  )
}

function MetaPill({ icon, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', border: '1px solid var(--border)', background: 'var(--panel2)', fontFamily: 'var(--font-mono)', fontSize: '.6rem', color: color || 'var(--text)', whiteSpace: 'nowrap' }}>
      <span>{icon}</span> {value}
    </div>
  )
}

function Detail({ label, value }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 5, fontSize: '.72rem' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.55rem', color: 'var(--text-dim)', letterSpacing: 2, width: 80, flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ color: 'var(--text)', flex: 1 }}>{value}</span>
    </div>
  )
}

function AddInternshipModal({ onClose, onNotify }) {
  const addResource = useStore(s => s.addResource)
  const [f, setF] = useState({ title: '', url: '', description: '', tags: '', priority: 'normal',
    organiser: '', stipend: '', duration: '', eligibility: '', skills: '', mode: 'Onsite', deadline: '', sector: '', location: '' })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const save = () => {
    if (!f.title.trim()) { onNotify?.('TITLE IS REQUIRED', 'error'); return }
    addResource({
      type: 'internship', title: f.title, url: f.url, description: f.description,
      category: 'Internships', tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
      priority: f.priority, status: 'not_applied',
      meta: { organiser: f.organiser, stipend: f.stipend, duration: f.duration, eligibility: f.eligibility,
        skills: f.skills.split(',').map(s => s.trim()).filter(Boolean), mode: f.mode,
        deadline: f.deadline, sector: f.sector, location: f.location, applyLink: f.url }
    })
    onNotify?.(`INTERNSHIP ADDED: ${f.title}`)
    onClose()
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 560, position: 'relative' }}>
        <div className="corner-tl" /><div className="corner-tr" /><div className="corner-bl" /><div className="corner-br" />
        <div className="modal-header">ADD INTERNSHIP <button className="modal-close" onClick={onClose}>✕</button></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['title','TITLE *',''], ['organiser','ORGANISING BODY',''], ['url','APPLY URL','https://...'], ['stipend','STIPEND','₹10,000/month'], ['duration','DURATION','2–3 months'], ['deadline','DEADLINE','Rolling'], ['sector','SECTOR','Technology'], ['location','LOCATION','Delhi']].map(([k, l, p]) => (
            <div className="form-group" key={k}>
              <label className="form-label">{l}</label>
              <input className="cyber-input" placeholder={p} value={f[k]} onChange={e => set(k, e.target.value)} />
            </div>
          ))}
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">ELIGIBILITY</label>
            <input className="cyber-input" placeholder="B.Tech / Any UG | Age ≤25" value={f.eligibility} onChange={e => set('eligibility', e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">REQUIRED SKILLS (comma separated)</label>
            <input className="cyber-input" placeholder="Python, Research, Data Analysis" value={f.skills} onChange={e => set('skills', e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">DESCRIPTION</label>
            <textarea className="cyber-textarea" style={{ minHeight: 52 }} placeholder="Brief description..." value={f.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">TAGS (comma separated)</label>
            <input className="cyber-input" placeholder="government, paid, tech" value={f.tags} onChange={e => set('tags', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">PRIORITY</label>
            <select className="cyber-select" value={f.priority} onChange={e => set('priority', e.target.value)}>
              <option value="normal">Normal</option><option value="high">High</option><option value="pinned">Pinned</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cyber-btn red" onClick={onClose}>CANCEL</button>
          <button className="cyber-btn green" onClick={save}>SAVE INTERNSHIP</button>
        </div>
      </div>
    </div>
  )
}
