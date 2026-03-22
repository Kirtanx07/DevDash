import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'

const MODES = [
  { label: 'FOCUS', key: 'focus', secs: 25 * 60 },
  { label: 'SHORT', key: 'short', secs: 5 * 60 },
  { label: 'LONG',  key: 'long',  secs: 15 * 60 },
  { label: 'FREE',  key: 'free',  secs: 0 },
]
const CIRC = 427.3

export function Timer({ onNotify }) {
  const addSession = useStore(s => s.addSession)
  const sessions   = useStore(s => s.sessions)
  const totalSecs  = useStore(s => s.totalSecs)

  const [mode, setMode]       = useState('focus')
  const [maxSecs, setMaxSecs] = useState(25 * 60)
  const [secs, setSecs]       = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [pomoCycle, setPomo]  = useState(0)
  const intervalRef = useRef(null)

  const fmt = (s) => {
    if (mode === 'free') {
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
      return h > 0 ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
                   : `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    }
    return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
  }

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setSecs(prev => {
        if (mode === 'free') return prev + 1
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setPomo(p => (p + 1) % 5)
          addSession(maxSecs)
          onNotify?.('SESSION COMPLETE! 🎉', 'success')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, mode, maxSecs])

  const start = () => setRunning(true)
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    if (mode !== 'free' && secs < maxSecs - 5) addSession(maxSecs - secs)
    setSecs(mode === 'free' ? 0 : maxSecs)
  }

  const switchMode = (m) => {
    setRunning(false)
    setMode(m.key)
    const s = m.secs
    setMaxSecs(s)
    setSecs(s)
  }

  const pct = mode === 'free' ? 1 : maxSecs > 0 ? secs / maxSecs : 1
  const offset = CIRC * (1 - pct)
  const strokeColor = pct < .25 ? 'var(--accent2)' : pct < .5 ? 'var(--accent4)' : 'var(--accent)'

  const h = Math.floor(totalSecs / 3600), m2 = Math.floor((totalSecs % 3600) / 60)

  return (
    <div style={{ padding: 14, background: 'var(--panel)', position: 'relative' }}>
      <div className="corner-tl" /><div className="corner-tr" /><div className="corner-bl" /><div className="corner-br" />

      <div className="panel-title">
        <div className="panel-title-left"><div className="panel-title-dot" />SESSION TIMER</div>
      </div>

      {/* Mode buttons */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, justifyContent: 'center' }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => switchMode(m)} style={{
            fontFamily: 'var(--font-display)', fontSize: '.5rem', letterSpacing: 2,
            padding: '4px 10px', border: '1px solid var(--border)', background: 'none',
            color: mode === m.key ? 'var(--accent)' : 'var(--text-dim)', cursor: 'pointer',
            borderColor: mode === m.key ? 'var(--accent)' : 'var(--border)',
            background: mode === m.key ? '#00d4ff10' : 'none',
            transition: 'all .15s'
          }}>{m.label}</button>
        ))}
      </div>

      {/* Circle */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ position: 'relative', width: 160, height: 160 }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="68" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle cx="80" cy="80" r="68" fill="none" stroke={strokeColor} strokeWidth="6"
              strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset .5s linear, stroke .3s', filter: `drop-shadow(0 0 6px ${strokeColor})` }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.9rem', color: strokeColor, textShadow: `0 0 10px ${strokeColor}`, letterSpacing: 2 }}>{fmt(secs)}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '.6rem', color: 'var(--text-dim)', marginTop: 4, letterSpacing: 3 }}>{mode.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Pomodoro dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '8px 0' }}>
        {[0,1,2,3].map(i => (
          <div key={i} onClick={() => setPomo(i < pomoCycle ? i : i + 1)} style={{
            width: 14, height: 14, border: '1px solid var(--accent2)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            cursor: 'pointer', transition: 'all .2s',
            background: i < pomoCycle ? 'var(--accent2)' : 'transparent',
            boxShadow: i < pomoCycle ? 'var(--glow2)' : 'none'
          }} />
        ))}
      </div>

      {/* Control buttons */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
        <button className="cyber-btn" onClick={start} disabled={running}>▶ START</button>
        <button className="cyber-btn" onClick={pause}>⏸</button>
        <button className="cyber-btn red" onClick={reset}>↺</button>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: 8 }}>
        SESSIONS: <span style={{ color: 'var(--accent3)' }}>{sessions}</span>
        {'  |  '}
        TOTAL: <span style={{ color: 'var(--accent3)' }}>{h}h {m2}m</span>
      </div>
    </div>
  )
}
