import React, { useState } from 'react'
import { useStore } from '../store'

const PRI_CONFIG = {
  h: { label: 'HIGH', activeClass: 'ah', color: 'var(--accent2)' },
  m: { label: 'MED',  activeClass: 'am', color: 'var(--accent4)' },
  l: { label: 'LOW',  activeClass: 'al', color: 'var(--accent3)' },
}

export function TaskBoard() {
  const todos      = useStore(s => s.todos)
  const addTodo    = useStore(s => s.addTodo)
  const toggleTodo = useStore(s => s.toggleTodo)
  const deleteTodo = useStore(s => s.deleteTodo)

  const [text, setText] = useState('')
  const [priority, setPriority] = useState('h')

  const done = todos.filter(t => t.done).length
  const pct  = todos.length ? Math.round(done / todos.length * 100) : 0

  const handleAdd = () => {
    if (!text.trim()) return
    addTodo(text.trim(), priority)
    setText('')
  }

  return (
    <div style={{ padding: 14, background: 'var(--panel)', flex: 1, overflow: 'auto' }}>
      <div className="panel-title">
        <div className="panel-title-left"><div className="panel-title-dot" />MISSION LOG</div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', color: 'var(--text-dim)' }}>{done}/{todos.length}</span>
      </div>

      {/* Priority selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {Object.entries(PRI_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setPriority(key)} style={{
            flex: 1, fontFamily: 'var(--font-display)', fontSize: '.48rem', letterSpacing: 1,
            padding: 5, border: `1px solid ${priority === key ? cfg.color : 'var(--border)'}`,
            background: priority === key ? cfg.color + '15' : 'none',
            color: priority === key ? cfg.color : 'var(--text-dim)',
            cursor: 'pointer', transition: 'all .15s'
          }}>{cfg.label}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input className="cyber-input" style={{ flex: 1 }} placeholder="NEW TASK..."
          value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()} />
        <button className="cyber-btn" onClick={handleAdd}>ADD</button>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 6 }}>
        <div className="progress-fill" style={{ width: pct + '%' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', color: 'var(--text-dim)', marginBottom: 10 }}>
        {done} / {todos.length} COMPLETE
      </div>

      {/* Todo list */}
      {todos.map(t => (
        <TodoItem key={t.id} todo={t} onToggle={() => toggleTodo(t.id)} onDelete={() => deleteTodo(t.id)} />
      ))}
    </div>
  )
}

function TodoItem({ todo: t, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '7px 5px', borderBottom: '1px solid #00d4ff11', background: hovered ? '#00d4ff05' : 'transparent', transition: 'background .15s' }}>
      <div style={{ width: 3, flexShrink: 0, minHeight: 14, marginTop: 2, background: PRI_CONFIG[t.priority]?.color || 'var(--accent)' }} />
      <div onClick={onToggle} style={{
        width: 13, height: 13, border: `1px solid ${t.done ? 'var(--accent3)' : 'var(--accent)'}`,
        flexShrink: 0, cursor: 'pointer', marginTop: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.done ? 'var(--accent3)' : 'transparent',
        boxShadow: t.done ? 'var(--glow3)' : 'none',
        clipPath: 'polygon(3px 0%, 100% 0%, calc(100% - 3px) 100%, 0% 100%)',
        transition: 'all .2s'
      }}>
        {t.done && <span style={{ fontSize: 8, color: 'var(--bg)' }}>✓</span>}
      </div>
      <div onClick={onToggle} style={{ flex: 1, fontSize: '.8rem', cursor: 'pointer', lineHeight: 1.3, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-dim)' : 'var(--text)', transition: 'color .2s' }}>
        {t.text}
      </div>
      {hovered && <button onClick={onDelete} style={{ opacity: 1, background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', fontSize: '.7rem', padding: '0 2px' }}>✕</button>}
    </div>
  )
}
