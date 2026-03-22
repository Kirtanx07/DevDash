import React from 'react'
import { useClock } from '../hooks/useClock'
import { useNetwork } from '../hooks/useNetwork'
import { useStore } from '../store'

const SPEED_COLOR = { excellent: '#00ff88', good: '#00ff88', slow: '#ffaa00', poor: '#ff2d55', offline: '#ff2d55', measuring: '#3d6880', unknown: '#3d6880' }
const SPEED_LABEL = { excellent: 'FAST', good: 'GOOD', slow: 'SLOW', poor: 'POOR', offline: 'OFFLINE', measuring: '...', unknown: '?' }

export function TopBar() {
  const { timeStr, dateStr } = useClock()
  const { online, speed, latency } = useNetwork()
  const resources = useStore(s => s.resources)
  const todos = useStore(s => s.todos)
  const sessions = useStore(s => s.sessions)
  const totalSecs = useStore(s => s.totalSecs)

  const done = todos.filter(t => t.done).length
  const pct = todos.length ? Math.round(done / todos.length * 100) : 0
  const h = Math.floor(totalSecs / 3600)
  const m = Math.floor((totalSecs % 3600) / 60)

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px', borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(180deg, #000e1a 0%, transparent 100%)',
      flexShrink: 0, gap: 12, position: 'relative', zIndex: 10
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 900, color: 'var(--accent)', textShadow: 'var(--glow)', letterSpacing: 3, whiteSpace: 'nowrap' }}>
        CYBER<span style={{ color: 'var(--accent2)' }}>SPACE</span>{' '}
        <span style={{ color: 'var(--text-dim)', fontSize: '.7rem' }}>// DEV DASHBOARD</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Pill label="STATUS" value={online ? '● ONLINE' : '● OFFLINE'} color={online ? 'var(--accent3)' : 'var(--accent2)'} />
        <Pill label="SPEED" value={SPEED_LABEL[speed]} color={SPEED_COLOR[speed]} title={latency ? `${latency}ms latency` : ''} />
        <Pill label="RESOURCES" value={resources.length} />
        <Pill label="TASKS" value={todos.length} />
        <Pill label="DONE" value={pct + '%'} color={pct === 100 ? 'var(--accent3)' : 'var(--accent)'} />
        <Pill label="SESSION" value={`${h}h ${m}m`} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', color: 'var(--accent)', textShadow: 'var(--glow)', letterSpacing: 2 }}>{timeStr}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', color: 'var(--text-dim)', letterSpacing: 1 }}>{dateStr}</div>
        </div>
        <RingIcon pct={pct} />
      </div>
    </header>
  )
}

function Pill({ label, value, color, title }) {
  return (
    <div title={title || ''} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', border: '1px solid var(--border)',
      background: 'var(--panel)', fontFamily: 'var(--font-mono)', fontSize: '.7rem', whiteSpace: 'nowrap'
    }}>
      <span style={{ color: 'var(--text-dim)' }}>{label}</span>
      <span style={{ color: color || 'var(--accent)', fontSize: '.85rem' }}>{value}</span>
    </div>
  )
}

function RingIcon({ pct }) {
  const r = 12, circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <div style={{ position: 'relative', width: 32, height: 32 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="16" cy="16" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle cx="16" cy="16" r={r} fill="none" stroke="var(--accent3)" strokeWidth="3"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .3s', filter: 'drop-shadow(0 0 4px var(--accent3))' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem' }}>⚡</div>
    </div>
  )
}
