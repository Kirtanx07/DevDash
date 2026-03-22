import React, { useState } from 'react'
import { useStore } from '../store'

const ACCENTS = ['#00d4ff', '#00ff88', '#bf00ff', '#ffaa00', '#ff2d55']

export function ConfigPanel({ onExport, onReset }) {
  const notes    = useStore(s => s.notes)
  const setNotes = useStore(s => s.setNotes)
  const setAccent = useStore(s => s.setAccent)
  const [scanlines, setScanlines] = useState(true)
  const [grid, setGrid]     = useState(true)

  const toggleScanlines = () => {
    document.body.classList.toggle('no-sl')
    setScanlines(v => !v)
  }
  const toggleGrid = () => {
    document.body.classList.toggle('no-grid')
    setGrid(v => !v)
  }

  return (
    <div style={{ padding: 14, background: 'var(--panel)', flexShrink: 0 }}>
      <div className="panel-title"><div className="panel-title-left"><div className="panel-title-dot" />SCRATCHPAD</div></div>
      <textarea className="cyber-textarea" style={{ minHeight: 80 }}
        value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="// notes, commands, ideas..." />

      <div className="divider" />
      <div className="sec-label" style={{ marginTop: 8 }}>ACCENT COLOR</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        {ACCENTS.map(c => (
          <div key={c} onClick={() => setAccent(c)} title={c} style={{
            width: 20, height: 20, background: c, cursor: 'pointer',
            boxShadow: `0 0 8px ${c}`, transition: 'transform .2s'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        ))}
      </div>

      <div style={{ borderBottom: '1px solid #00d4ff11', padding: '7px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: '.75rem' }}>
        <span>Scanlines</span>
        <div className={`toggle ${scanlines ? 'on' : ''}`} onClick={toggleScanlines} />
      </div>
      <div style={{ borderBottom: '1px solid #00d4ff11', padding: '7px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '.75rem' }}>
        <span>Grid</span>
        <div className={`toggle ${grid ? 'on' : ''}`} onClick={toggleGrid} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <button className="cyber-btn" style={{ flex: 1, clipPath: 'none', fontSize: '.45rem' }} onClick={onExport}>↓ EXPORT</button>
        <button className="cyber-btn red" style={{ flex: 1, clipPath: 'none', fontSize: '.45rem' }} onClick={onReset}>RESET</button>
      </div>
    </div>
  )
}
