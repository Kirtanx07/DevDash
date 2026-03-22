'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { apiFetch } from '@/lib/api'
import type { Resource, Todo, Priority, TodoPriority } from '@/types'

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, string> = {
  link: '🔗', tool: '🛠', pdf: '📄', roadmap: '🗺',
  internship: '💼', course: '🎓', image: '🖼', note: '📝', repo: '⚡', other: '📦'
}

const JSON_FORMAT = `{
  "resources": [
    {
      "type": "link",
      "title": "Resource Name",
      "url": "https://...",
      "description": "Description",
      "category": "CategoryName",
      "tags": ["tag1", "tag2"],
      "priority": "normal"
    }
  ]
}`

const AI_PROMPT = `Convert my resource list into this EXACT JSON format. Return ONLY valid JSON, no markdown, no explanation:

{
  "resources": [
    {
      "type": "link|tool|pdf|roadmap|internship|course|image|note|repo|other",
      "title": "Resource Name",
      "url": "https://...",
      "description": "1-2 sentence description",
      "category": "Category Name",
      "tags": ["tag1", "tag2"],
      "priority": "normal|high|pinned"
    }
  ]
}

Rules:
- type must be one of: link, tool, pdf, roadmap, internship, course, image, note, repo, other
- priority must be: normal, high, or pinned
- tags is an array of strings
- url can be empty string if no URL
- Every resource MUST have a title

My resources:
[PASTE YOUR RESOURCES LIST HERE — links, PDFs, tools, notes, etc.]`

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useClock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-GB', { hour12: false }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase())
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return { time, date }
}

function useNetworkSpeed() {
  const [status, setStatus] = useState<'online' | 'offline'>('online')
  const [speed, setSpeed] = useState<string>('—')

  const measure = useCallback(async () => {
    try {
      const t0 = performance.now()
      await fetch('/api/health', { cache: 'no-store' }).catch(() => {})
      const ms = performance.now() - t0
      const kbps = Math.round(1000 / ms * 8)
      setStatus('online')
      setSpeed(kbps > 5000 ? 'FAST' : kbps > 1000 ? 'GOOD' : kbps > 200 ? 'SLOW' : 'POOR')
    } catch {
      setStatus('offline')
      setSpeed('—')
    }
  }, [])

  useEffect(() => {
    measure()
    const id = setInterval(measure, 30000)
    const online = () => { setStatus('online'); measure() }
    const offline = () => { setStatus('offline'); setSpeed('—') }
    window.addEventListener('online', online)
    window.addEventListener('offline', offline)
    return () => { clearInterval(id); window.removeEventListener('online', online); window.removeEventListener('offline', offline) }
  }, [measure])

  return { status, speed }
}

function useTimer() {
  const [secs, setSecs] = useState(25 * 60)
  const [max, setMax] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState<'focus' | 'short' | 'long' | 'free'>('focus')
  const [pomoCycle, setPomoCycle] = useState(0)
  const [sessions, setSessions] = useState(0)
  const [totalSecs, setTotalSecs] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const start = useCallback(() => {
    if (running) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setSecs(s => {
        if (mode === 'free') return s + 1
        if (s <= 1) {
          stop()
          setSessions(n => n + 1)
          setPomoCycle(c => (c + 1) % 5)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [running, mode, stop])

  const pause = useCallback(() => stop(), [stop])

  const reset = useCallback(() => {
    const elapsed = mode === 'free' ? secs : max - secs
    if (elapsed > 60) {
      setSessions(n => n + 1)
      setTotalSecs(t => t + elapsed)
    }
    stop()
    setSecs(mode === 'free' ? 0 : max)
  }, [secs, max, mode, stop])

  const switchMode = useCallback((m: typeof mode, seconds: number) => {
    stop()
    setMode(m)
    if (m !== 'free') { setMax(seconds); setSecs(seconds) }
    else setSecs(0)
  }, [stop])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const pct = max > 0 ? (mode === 'free' ? Math.min((secs / (60 * 60)) * 100, 100) : (secs / max) * 100) : 100
  const h = Math.floor(totalSecs / 3600)
  const min = Math.floor((totalSecs % 3600) / 60)

  return { display: fmt(secs), pct, running, pomoCycle, sessions, totalTime: `${h}h ${min}m`, start, pause, reset, switchMode, mode }
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function PanelHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pb-2 mb-3 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 flex-shrink-0" style={{
          background: 'var(--accent)', boxShadow: 'var(--glow)',
          clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)'
        }} />
        <span className="font-orbitron text-[10px] font-bold tracking-[3px] uppercase" style={{ color: 'var(--accent)' }}>{title}</span>
      </div>
      {action}
    </div>
  )
}

function CyberBtn({ children, onClick, variant = 'default', className = '', disabled = false }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'default' | 'red' | 'green' | 'ghost'
  className?: string; disabled?: boolean
}) {
  const colors = {
    default: { border: 'var(--accent)', color: 'var(--accent)' },
    red: { border: 'var(--accent2)', color: 'var(--accent2)' },
    green: { border: 'var(--accent3)', color: 'var(--accent3)' },
    ghost: { border: 'var(--border)', color: 'var(--text-dim)' },
  }
  const c = colors[variant]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-orbitron text-[9px] font-bold tracking-[2px] uppercase px-3 py-1.5 bg-transparent cursor-pointer transition-all duration-150 hover:opacity-80 disabled:opacity-30 ${className}`}
      style={{ border: `1px solid ${c.border}`, color: c.color,
        clipPath: 'polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)' }}
    >
      {children}
    </button>
  )
}

function Notification({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 transition-transform duration-300 font-mono-cyber text-xs px-4 py-2.5"
      style={{
        background: 'var(--panel)', border: '1px solid var(--accent3)', color: 'var(--accent3)',
        transform: visible ? 'translateX(0)' : 'translateX(130%)',
        boxShadow: '0 0 10px rgba(0,255,136,0.3)'
      }}>
      // {msg}
    </div>
  )
}

function AddResourceModal({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: (r: Omit<Resource, 'id' | 'user_id' | 'created_at'>) => Promise<void>
}) {
  const [form, setForm] = useState({ type: 'link', title: '', url: '', description: '', category: '', tags: '', priority: 'normal' as Priority })
  const [saving, setSaving] = useState(false)

  const handle = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    await onSave({
      type: form.type as Resource['type'],
      title: form.title.trim(),
      url: form.url.trim(),
      description: form.description.trim(),
      category: form.category.trim() || 'General',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      priority: form.priority,
    })
    setSaving(false)
    setForm({ type: 'link', title: '', url: '', description: '', category: '', tags: '', priority: 'normal' })
    onClose()
  }

  if (!open) return null

  const inputCls = "w-full text-xs px-3 py-2 font-mono-cyber outline-none transition-colors"
  const inputStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 0 }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,8,16,0.88)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-[460px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-5 relative"
        style={{ background: 'var(--panel)', border: '1px solid var(--accent)', boxShadow: 'var(--glow)' }}>
        <div className="flex justify-between items-center pb-3 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="font-orbitron text-[11px] font-bold tracking-[3px]" style={{ color: 'var(--accent)' }}>ADD RESOURCE</span>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-xs transition-all"
            style={{ border: '1px solid var(--accent2)', color: 'var(--accent2)', background: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        <div className="space-y-3">
          {[
            { label: 'TYPE', key: 'type', el: 'select', opts: ['link','tool','pdf','roadmap','internship','course','image','note','repo','other'] },
            { label: 'TITLE *', key: 'title', placeholder: 'Resource name...' },
            { label: 'URL', key: 'url', placeholder: 'https://...' },
            { label: 'DESCRIPTION', key: 'description', placeholder: 'Brief description...', el: 'textarea' },
            { label: 'CATEGORY', key: 'category', placeholder: 'e.g. Cybersecurity, AI, Career...' },
            { label: 'TAGS (comma separated)', key: 'tags', placeholder: 'free, important, beginner' },
            { label: 'PRIORITY', key: 'priority', el: 'select', opts: ['normal','high','pinned'] },
          ].map(({ label, key, placeholder, el, opts }) => (
            <div key={key}>
              <label className="block font-mono-cyber text-[9px] tracking-[2px] mb-1" style={{ color: 'var(--text-dim)' }}>{label}</label>
              {el === 'select' ? (
                <select className={inputCls} style={{ ...inputStyle, appearance: 'none' }}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}>
                  {opts!.map(o => <option key={o} value={o} style={{ background: 'var(--panel)' }}>{o}</option>)}
                </select>
              ) : el === 'textarea' ? (
                <textarea className={inputCls} style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                  placeholder={placeholder} value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              ) : (
                <input className={inputCls} style={inputStyle} placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handle()} />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <CyberBtn variant="red" onClick={onClose}>CANCEL</CyberBtn>
          <CyberBtn variant="green" onClick={handle} disabled={saving}>{saving ? 'SAVING...' : 'SAVE RESOURCE'}</CyberBtn>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'upload' | 'auth' | 'suggestions'

export default function DashboardPage() {
  const { user } = useUser()
  const { time, date } = useClock()
  const { status: netStatus, speed } = useNetworkSpeed()
  const timer = useTimer()

  // Data state
  const [resources, setResources] = useState<Resource[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  // UI state
  const [tab, setTab] = useState<Tab>('dashboard')
  const [activeCat, setActiveCat] = useState('ALL')
  const [searchQ, setSearchQ] = useState('')
  const [selPri, setSelPri] = useState<TodoPriority>('h')
  const [todoInput, setTodoInput] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [notifMsg, setNotifMsg] = useState('')
  const [notifVisible, setNotifVisible] = useState(false)
  const [accent, setAccent] = useState('#00d4ff')
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load data
  useEffect(() => {
    if (!user) return
    Promise.all([
      apiFetch('/api/resources').then(setResources).catch(() => {}),
      apiFetch('/api/todos').then(setTodos).catch(() => {}),
      apiFetch('/api/notes').then(d => setNotes(d.content || '')).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [user])

  const notify = useCallback((msg: string) => {
    setNotifMsg(msg)
    setNotifVisible(true)
    if (notifTimer.current) clearTimeout(notifTimer.current)
    notifTimer.current = setTimeout(() => setNotifVisible(false), 2500)
  }, [])

  // Resources CRUD
  const addResource = async (r: Omit<Resource, 'id' | 'user_id' | 'created_at'>) => {
    const created = await apiFetch('/api/resources', { method: 'POST', body: JSON.stringify(r) })
    setResources(prev => [created, ...prev])
    notify(`SAVED: ${r.title}`)
  }

  const deleteResource = async (id: string) => {
    await apiFetch('/api/resources', { method: 'DELETE', body: JSON.stringify({ id }) })
    setResources(prev => prev.filter(r => r.id !== id))
    notify('RESOURCE REMOVED')
  }

  // Todos CRUD
  const addTodo = async () => {
    if (!todoInput.trim()) return
    const created = await apiFetch('/api/todos', { method: 'POST', body: JSON.stringify({ text: todoInput.trim(), priority: selPri }) })
    setTodos(prev => [created, ...prev])
    setTodoInput('')
  }

  const toggleTodo = async (todo: Todo) => {
    const updated = await apiFetch('/api/todos', { method: 'PATCH', body: JSON.stringify({ id: todo.id, done: !todo.done }) })
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const deleteTodo = async (id: string) => {
    await apiFetch('/api/todos', { method: 'DELETE', body: JSON.stringify({ id }) })
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  // Notes autosave
  const handleNotes = (val: string) => {
    setNotes(val)
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      apiFetch('/api/notes', { method: 'POST', body: JSON.stringify({ content: val }) }).catch(() => {})
    }, 1000)
  }

  // Import JSON
  const doImport = async () => {
    try {
      const data = JSON.parse(importJson)
      if (!data.resources || !Array.isArray(data.resources)) throw new Error('bad')
      let count = 0
      for (const r of data.resources) {
        if (r.title) { await addResource(r); count++ }
      }
      setImportJson('')
      notify(`IMPORTED ${count} RESOURCES`)
    } catch { notify('INVALID JSON FORMAT') }
  }

  // Export
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ resources, todos, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cyberspace-export.json'; a.click()
  }

  // Accent color
  const applyAccent = (c: string) => {
    setAccent(c)
    document.documentElement.style.setProperty('--accent', c)
    document.documentElement.style.setProperty('--border', c + '22')
    document.documentElement.style.setProperty('--glow', `0 0 10px ${c}66, 0 0 30px ${c}22`)
    notify('ACCENT UPDATED')
  }

  // Computed
  const categories = ['ALL', ...Array.from(new Set(resources.map(r => (r.category || 'General').toUpperCase())))]
  const filteredResources = resources
    .filter(r => {
      const mc = activeCat === 'ALL' || (r.category || 'General').toUpperCase() === activeCat
      const mq = !searchQ || [r.title, r.description, r.category, ...(r.tags || [])].join(' ').toLowerCase().includes(searchQ.toLowerCase())
      return mc && mq
    })
    .sort((a, b) => ({ pinned: 0, high: 1, normal: 2 }[a.priority || 'normal'] || 2) - ({ pinned: 0, high: 1, normal: 2 }[b.priority || 'normal'] || 2))

  const doneTodos = todos.filter(t => t.done).length
  const todoPct = todos.length ? Math.round(doneTodos / todos.length * 100) : 0
  const CIRC = 427.3
  const timerOffset = CIRC * (1 - timer.pct / 100)

  // Panels
  const panelBase = "overflow-y-auto scrollbar-thin p-3.5"
  const panelStyle = { background: 'var(--panel)', scrollbarColor: 'var(--accent) transparent' }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: '⬡ DASHBOARD' },
    { id: 'upload', label: '↑ IMPORT' },
    { id: 'auth', label: '🔐 AUTH & BACKEND' },
    { id: 'suggestions', label: '✦ IDEAS' },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="font-orbitron text-sm tracking-[4px] animate-pulse" style={{ color: 'var(--accent)' }}>LOADING WORKSPACE...</div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>

      {/* ── TOPBAR ── */}
      <header className="flex items-center justify-between px-5 py-2.5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(180deg,#000e1a 0%,transparent 100%)' }}>
        <div className="font-orbitron font-black text-base tracking-[3px]" style={{ color: 'var(--accent)', textShadow: 'var(--glow)' }}>
          CYBER<span style={{ color: 'var(--accent2)' }}>SPACE</span>
          <span className="text-[10px] ml-2" style={{ color: 'var(--text-dim)' }}>// DEV DASHBOARD</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {[
            { lbl: 'NET', val: netStatus === 'online' ? '● ONLINE' : '● OFFLINE', cls: netStatus === 'online' ? 'text-[var(--accent3)]' : 'text-[var(--accent2)]' },
            { lbl: 'SPEED', val: speed, cls: 'text-[var(--accent4)]' },
            { lbl: 'RESOURCES', val: String(resources.length), cls: 'text-[var(--accent)]' },
            { lbl: 'TASKS', val: String(todos.length), cls: 'text-[var(--accent)]' },
            { lbl: 'DONE', val: todoPct + '%', cls: 'text-[var(--accent3)]' },
            { lbl: 'SESSION', val: timer.totalTime, cls: 'text-[var(--accent)]' },
          ].map(({ lbl, val, cls }) => (
            <div key={lbl} className="flex items-center gap-1.5 px-2.5 py-1 font-mono-cyber text-[11px]"
              style={{ border: '1px solid var(--border)', background: 'var(--panel)' }}>
              <span style={{ color: 'var(--text-dim)' }}>{lbl}</span>
              <span className={cls}>{val}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono-cyber">
            <div className="text-base tracking-[2px]" style={{ color: 'var(--accent)', textShadow: 'var(--glow)' }}>{time}</div>
            <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{date}</div>
          </div>
          <UserButton afterSignOutUrl="/sign-in" appearance={{
            elements: { avatarBox: 'w-8 h-8 border-2', userButtonAvatarBox: 'border-2' }
          }} />
        </div>
      </header>

      {/* ── TAB NAV ── */}
      <nav className="flex gap-0.5 px-5 flex-shrink-0 overflow-x-auto no-scrollbar" style={{ borderBottom: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="font-orbitron text-[9px] font-bold tracking-[2px] px-4 py-2 border-b-0 transition-all duration-150 whitespace-nowrap"
            style={{
              border: tab === t.id ? `1px solid var(--border)` : '1px solid transparent',
              borderBottom: 'none',
              background: tab === t.id ? 'var(--panel)' : 'transparent',
              color: tab === t.id ? 'var(--accent)' : 'var(--text-dim)',
              boxShadow: tab === t.id ? `0 -2px 0 var(--accent)` : 'none',
              cursor: 'pointer',
            }}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── DASHBOARD TAB ── */}
      {tab === 'dashboard' && (
        <div className="flex-1 overflow-hidden grid" style={{ gridTemplateColumns: '272px 1fr 264px', gap: 1, background: 'var(--border)' }}>

          {/* LEFT: Timer + Quick Links */}
          <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>

            {/* Timer */}
            <div className={panelBase} style={{ ...panelStyle, flexShrink: 0 }}>
              <PanelHeader title="SESSION TIMER" />
              {/* Mode buttons */}
              <div className="flex gap-1 mb-3 flex-wrap">
                {[['FOCUS', 'focus', 25*60], ['SHORT', 'short', 5*60], ['LONG', 'long', 15*60], ['FREE', 'free', 0]] .map(([label, m, s]) => (
                  <button key={m as string} onClick={() => timer.switchMode(m as typeof timer.mode, s as number)}
                    className="font-orbitron text-[9px] font-bold tracking-[2px] px-2.5 py-1 transition-all"
                    style={{
                      border: timer.mode === m ? '1px solid var(--accent)' : '1px solid var(--border)',
                      color: timer.mode === m ? 'var(--accent)' : 'var(--text-dim)',
                      background: timer.mode === m ? 'rgba(0,212,255,0.08)' : 'none',
                      cursor: 'pointer',
                    }}>{label}</button>
                ))}
              </div>
              {/* Circle */}
              <div className="flex justify-center my-2">
                <div className="relative w-36 h-36">
                  <svg width="144" height="144" viewBox="0 0 144 144" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="72" cy="72" r="62" fill="none" stroke="var(--panel2)" strokeWidth="6" />
                    <circle cx="72" cy="72" r="62" fill="none" strokeWidth="6" strokeLinecap="round"
                      style={{
                        stroke: timer.pct < 25 ? 'var(--accent2)' : timer.pct < 50 ? 'var(--accent4)' : 'var(--accent)',
                        strokeDasharray: CIRC, strokeDashoffset: timerOffset,
                        transition: 'stroke-dashoffset 0.5s linear, stroke 0.5s',
                        filter: 'drop-shadow(0 0 6px var(--accent))'
                      }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-mono-cyber text-2xl leading-none" style={{ color: 'var(--accent)', textShadow: 'var(--glow)' }}>{timer.display}</div>
                    <div className="font-orbitron text-[9px] tracking-[2px] mt-1" style={{ color: 'var(--text-dim)' }}>{timer.mode.toUpperCase()}</div>
                  </div>
                </div>
              </div>
              {/* Pomodoro dots */}
              <div className="flex gap-1.5 justify-center my-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 cursor-pointer transition-all hover:scale-125"
                    style={{
                      border: '1px solid var(--accent2)',
                      background: i < timer.pomoCycle ? 'var(--accent2)' : 'transparent',
                      clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
                      boxShadow: i < timer.pomoCycle ? '0 0 6px var(--accent2)' : 'none'
                    }} />
                ))}
              </div>
              {/* Controls */}
              <div className="flex gap-1.5 justify-center">
                <CyberBtn onClick={timer.start} variant="green">▶ START</CyberBtn>
                <CyberBtn onClick={timer.pause}>⏸</CyberBtn>
                <CyberBtn onClick={timer.reset} variant="red">↺</CyberBtn>
              </div>
              <div className="font-mono-cyber text-[10px] text-center mt-2" style={{ color: 'var(--text-dim)' }}>
                SESSIONS: <span style={{ color: 'var(--accent3)' }}>{timer.sessions}</span>&nbsp;&nbsp;
                TOTAL: <span style={{ color: 'var(--accent3)' }}>{timer.totalTime}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className={`${panelBase} flex-1`} style={panelStyle}>
              <PanelHeader title="QUICK ACCESS"
                action={<CyberBtn onClick={() => setModalOpen(true)} className="!px-2 !py-0.5 !text-[8px]">+</CyberBtn>} />
              {resources.filter(r => r.priority === 'pinned' || r.priority === 'high').slice(0, 12).map(r => (
                <a key={r.id} href={r.url || '#'} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-2 py-1.5 mb-0.5 transition-all duration-150 no-underline"
                  style={{ border: '1px solid transparent', color: 'var(--text)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.05)'; (e.currentTarget as HTMLElement).style.paddingLeft = '14px' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.paddingLeft = '8px' }}>
                  <div className="w-6 h-6 flex items-center justify-center text-sm flex-shrink-0"
                    style={{ border: '1px solid var(--border)', background: 'var(--panel2)' }}>
                    {TYPE_ICONS[r.type] || '📦'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{r.title}</div>
                    <div className="font-mono-cyber text-[10px] tracking-wider truncate" style={{ color: 'var(--text-dim)' }}>{(r.category || '').toUpperCase()}</div>
                  </div>
                </a>
              ))}
              {resources.filter(r => r.priority === 'pinned' || r.priority === 'high').length === 0 && (
                <p className="text-xs text-center mt-4" style={{ color: 'var(--text-dim)' }}>
                  Pin or mark resources as<br />High priority to see them here
                </p>
              )}
            </div>
          </div>

          {/* CENTER: Resource Hub */}
          <div className={panelBase} style={panelStyle}>
            <PanelHeader title="RESOURCE HUB"
              action={
                <div className="flex gap-1.5">
                  <CyberBtn onClick={() => setTab('upload')} className="!px-2 !py-0.5 !text-[8px]">↑ IMPORT</CyberBtn>
                  <CyberBtn onClick={() => setModalOpen(true)} className="!px-2 !py-0.5 !text-[8px]">+ ADD</CyberBtn>
                </div>
              } />
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 mb-3" style={{ border: '1px solid var(--border)', background: 'var(--panel2)' }}>
              <span style={{ color: 'var(--accent)' }}>⌕</span>
              <input className="flex-1 bg-transparent border-none outline-none font-mono-cyber text-xs"
                style={{ color: 'var(--text)' }} placeholder="SEARCH RESOURCES..."
                value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              {searchQ && <button onClick={() => setSearchQ('')} className="text-xs cursor-pointer" style={{ color: 'var(--text-dim)', background: 'none', border: 'none' }}>✕</button>}
            </div>
            {/* Category tabs */}
            <div className="flex gap-1 mb-3 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)}
                  className="font-orbitron text-[9px] font-bold tracking-[2px] px-3 py-1 transition-all"
                  style={{
                    border: activeCat === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
                    color: activeCat === cat ? 'var(--accent)' : 'var(--text-dim)',
                    background: activeCat === cat ? 'rgba(0,212,255,0.05)' : 'none',
                    cursor: 'pointer',
                    clipPath: 'polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)'
                  }}>{cat}</button>
              ))}
            </div>
            {/* Resource grid */}
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))' }}>
              {filteredResources.map(r => (
                <div key={r.id} className="p-3 transition-all duration-200 relative overflow-hidden group cursor-pointer"
                  style={{
                    border: r.priority === 'pinned' ? '1px solid rgba(0,212,255,0.4)' : r.priority === 'high' ? '1px solid rgba(255,45,85,0.4)' : '1px solid var(--border)',
                    background: 'var(--panel2)',
                  }}>
                  <div className="absolute top-0 left-0 w-0.5 h-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--accent)' }} />
                  <div className="font-mono-cyber text-[9px] tracking-[2px] mb-1.5 flex items-center gap-1.5"
                    style={{ color: 'var(--accent2)' }}>
                    {TYPE_ICONS[r.type] || '📦'} {(r.type || '').toUpperCase()}
                    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,var(--accent2),transparent)' }} />
                  </div>
                  <div className="text-sm font-semibold truncate mb-1">
                    {r.priority === 'pinned' && '📌 '}{r.title}
                  </div>
                  <div className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-dim)' }}>{r.description}</div>
                  {r.tags && r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.tags.map(t => (
                        <span key={t} className="font-mono-cyber text-[9px] px-1.5 py-0.5" style={{ border: '1px solid var(--text-dim)', color: 'var(--text-dim)' }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="font-mono-cyber text-[9px] px-2 py-0.5 transition-all no-underline"
                      style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = '#000' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}>
                      OPEN ↗
                    </a>}
                    <button onClick={() => deleteResource(r.id!)} className="font-mono-cyber text-[9px] px-2 py-0.5 cursor-pointer transition-all"
                      style={{ border: '1px solid var(--accent2)', color: 'var(--accent2)', background: 'none' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent2)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--accent2)' }}>
                      DEL
                    </button>
                  </div>
                </div>
              ))}
              {/* Add card */}
              <div onClick={() => setModalOpen(true)} className="flex flex-col items-center justify-center gap-1.5 min-h-[100px] cursor-pointer transition-all duration-200"
                style={{ border: '1px dashed var(--border)', color: 'var(--text-dim)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.03)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <div className="text-3xl leading-none opacity-40" style={{ color: 'var(--accent)' }}>+</div>
                <div className="font-mono-cyber text-[10px] tracking-[2px]">ADD RESOURCE</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Todos + Notes + Config */}
          <div className="flex flex-col gap-px" style={{ background: 'var(--border)' }}>

            {/* Todos */}
            <div className={`${panelBase} flex-1`} style={panelStyle}>
              <PanelHeader title="MISSION LOG" />
              {/* Priority selector */}
              <div className="flex gap-1 mb-2">
                {([['HIGH', 'h', 'var(--accent2)'], ['MED', 'm', 'var(--accent4)'], ['LOW', 'l', 'var(--accent3)']] as [string, TodoPriority, string][]).map(([lbl, p, clr]) => (
                  <button key={p} onClick={() => setSelPri(p)}
                    className="flex-1 font-orbitron text-[9px] font-bold tracking-[1px] py-1 transition-all"
                    style={{
                      border: selPri === p ? `1px solid ${clr}` : '1px solid var(--border)',
                      color: selPri === p ? clr : 'var(--text-dim)',
                      background: selPri === p ? `${clr}18` : 'none', cursor: 'pointer'
                    }}>{lbl}</button>
                ))}
              </div>
              {/* Input */}
              <div className="flex gap-1.5 mb-2">
                <input className="flex-1 font-mono-cyber text-xs px-2.5 py-1.5 outline-none transition-colors"
                  style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 0 }}
                  placeholder="NEW TASK..." value={todoInput}
                  onChange={e => setTodoInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTodo()}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
                />
                <CyberBtn onClick={addTodo}>ADD</CyberBtn>
              </div>
              {/* Progress */}
              <div className="h-0.5 mb-1 overflow-hidden" style={{ background: 'var(--panel2)' }}>
                <div className="h-full transition-all duration-300" style={{ width: `${todoPct}%`, background: 'linear-gradient(90deg,var(--accent),var(--accent3))' }} />
              </div>
              <div className="font-mono-cyber text-[9px] mb-2" style={{ color: 'var(--text-dim)' }}>{doneTodos} / {todos.length} COMPLETE</div>
              {/* Todo items */}
              <div>
                {todos.map(t => (
                  <div key={t.id} className="flex items-start gap-1.5 py-1.5 group"
                    style={{ borderBottom: '1px solid rgba(0,255,136,0.05)' }}>
                    <div className="w-1 min-h-[14px] flex-shrink-0 mt-0.5"
                      style={{ background: t.priority === 'h' ? 'var(--accent2)' : t.priority === 'm' ? 'var(--accent4)' : 'var(--accent3)' }} />
                    <div onClick={() => toggleTodo(t)} className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center cursor-pointer mt-0.5 transition-all"
                      style={{
                        border: '1px solid var(--accent)', background: t.done ? 'var(--accent3)' : 'transparent',
                        borderColor: t.done ? 'var(--accent3)' : 'var(--accent)',
                        boxShadow: t.done ? '0 0 5px var(--accent3)' : 'none',
                        clipPath: 'polygon(3px 0%,100% 0%,calc(100% - 3px) 100%,0% 100%)'
                      }}>
                      {t.done && <span className="text-[8px]" style={{ color: 'var(--bg)' }}>✓</span>}
                    </div>
                    <div onClick={() => toggleTodo(t)} className={`flex-1 text-xs leading-snug cursor-pointer transition-colors ${t.done ? 'line-through' : ''}`}
                      style={{ color: t.done ? 'var(--text-dim)' : 'var(--text)' }}>{t.text}</div>
                    <button onClick={() => deleteTodo(t.id!)} className="opacity-0 group-hover:opacity-100 text-xs transition-opacity"
                      style={{ background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes + Config */}
            <div className={panelBase} style={{ ...panelStyle, flexShrink: 0 }}>
              <PanelHeader title="SCRATCHPAD" />
              <textarea className="w-full font-mono-cyber text-xs p-2.5 outline-none transition-colors"
                style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)', resize: 'vertical', minHeight: 80, borderRadius: 0 }}
                value={notes} onChange={e => handleNotes(e.target.value)}
                placeholder="// notes, commands, ideas..."
                onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--accent)'}
                onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'} />
              <div className="h-px my-3" style={{ background: 'linear-gradient(90deg,var(--accent),transparent)', opacity: 0.3 }} />
              <div className="font-mono-cyber text-[9px] tracking-[3px] mb-2" style={{ color: 'var(--text-dim)' }}>ACCENT COLOR</div>
              <div className="flex gap-2 mb-3">
                {['#00d4ff','#00ff88','#bf00ff','#ffaa00','#ff2d55'].map(c => (
                  <div key={c} onClick={() => applyAccent(c)} className="w-5 h-5 cursor-pointer transition-transform hover:scale-125"
                    style={{ background: c, boxShadow: accent === c ? `0 0 8px ${c}` : 'none', outline: accent === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
                ))}
              </div>
              <div className="flex gap-1.5">
                <CyberBtn onClick={exportData} className="!text-[8px] flex-1 !clip-path-none">↓ EXPORT</CyberBtn>
                <CyberBtn variant="ghost" onClick={() => { if (confirm('RESET ALL DATA?')) { apiFetch('/api/resources', { method: 'DELETE', body: JSON.stringify({ id: 'ALL' }) }).catch(() => {}); window.location.reload() } }} className="!text-[8px] flex-1">RESET</CyberBtn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD TAB ── */}
      {tab === 'upload' && (
        <div className="flex-1 overflow-y-auto p-5 grid gap-5" style={{ scrollbarColor: 'var(--accent) transparent', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))' }}>
          {/* Drop zone + import */}
          <div className="p-5" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
            <div className="font-orbitron text-[10px] font-bold tracking-[3px] mb-4 pb-2.5" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>↑ IMPORT RESOURCES</div>
            <div className="border-2 border-dashed p-8 text-center cursor-pointer mb-4 transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
              onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)' }}
              onDragLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
              onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; const f = e.dataTransfer.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setImportJson(ev.target!.result as string); r.readAsText(f) }}
              onClick={() => document.getElementById('file-inp')?.click()}>
              <div className="text-4xl mb-2 opacity-50">📁</div>
              <div className="font-mono-cyber text-xs tracking-wider">DRAG & DROP JSON FILE</div>
              <div className="font-mono-cyber text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>or click to browse</div>
            </div>
            <input type="file" id="file-inp" accept=".json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setImportJson(ev.target!.result as string); r.readAsText(f) }} />
            <textarea className="w-full font-mono-cyber text-[11px] p-2.5 outline-none mb-3" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--accent3)', resize: 'vertical', minHeight: 120, borderRadius: 0 }}
              placeholder={'{"resources": [...]}'}
              value={importJson} onChange={e => setImportJson(e.target.value)} />
            <div className="flex gap-2">
              <CyberBtn variant="green" onClick={doImport}>↑ IMPORT</CyberBtn>
              <CyberBtn onClick={() => navigator.clipboard.writeText(JSON_FORMAT).then(() => notify('FORMAT COPIED!'))}>COPY FORMAT</CyberBtn>
            </div>
          </div>
          {/* AI Prompt */}
          <div className="p-5" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
            <div className="font-orbitron text-[10px] font-bold tracking-[3px] mb-4 pb-2.5" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>🤖 AI CONVERSION PROMPT</div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-dim)' }}>Copy this prompt → paste into ChatGPT, Claude, or Gemini with your resource list → it returns JSON you can import directly.</p>
            <div className="relative p-3 font-mono-cyber text-[10px] leading-relaxed whitespace-pre-wrap overflow-auto max-h-64"
              style={{ background: 'var(--panel2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent3)', color: 'var(--accent3)' }}>
              <button onClick={() => navigator.clipboard.writeText(AI_PROMPT).then(() => notify('AI PROMPT COPIED!'))}
                className="absolute top-2 right-2 font-orbitron text-[8px] px-2 py-1 cursor-pointer transition-all"
                style={{ border: '1px solid var(--accent3)', color: 'var(--accent3)', background: 'none' }}>COPY</button>
              {AI_PROMPT}
            </div>
          </div>
          {/* JSON Format */}
          <div className="p-5" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
            <div className="font-orbitron text-[10px] font-bold tracking-[3px] mb-4 pb-2.5" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>{'{ }'} JSON FORMAT</div>
            <pre className="font-mono-cyber text-[10px] leading-relaxed overflow-auto p-3" style={{ background: 'var(--panel2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', color: 'var(--text-dim)', maxHeight: 300 }}>
              {JSON_FORMAT}
            </pre>
            <div className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              <strong style={{ color: 'var(--text)' }}>type</strong> values: link | tool | pdf | roadmap | internship | course | image | note | repo | other<br />
              <strong style={{ color: 'var(--text)' }}>priority</strong>: normal | high | pinned
            </div>
          </div>
        </div>
      )}

      {/* ── AUTH TAB (Info) ── */}
      {tab === 'auth' && (
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarColor: 'var(--accent) transparent' }}>
          <div className="mb-4 p-3 font-mono-cyber text-xs leading-relaxed" style={{ border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', color: 'var(--text-dim)', background: 'var(--panel)' }}>
            // auth is live — you are signed in as <span style={{ color: 'var(--accent3)' }}>{user?.emailAddresses[0]?.emailAddress}</span>
            <br />// your data is isolated in Supabase per user_id: <span style={{ color: 'var(--accent)' }}>{user?.id?.slice(0, 20)}...</span>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
            {[
              { title: 'CURRENT STACK', body: '✓ Clerk auth — sign in / sign up / session\n✓ Supabase PostgreSQL — resources, todos, notes\n✓ Supabase Storage — bucket ready for PDFs/images\n✓ Next.js API routes — /api/resources, /api/todos, /api/notes\n✓ Vercel deploy — auto-deploys on git push\n✓ Row Level Security — users only see their own data' },
              { title: 'WHAT TO ADD NEXT', body: 'File uploads → use Supabase Storage SDK in /api/upload\nSharing → generate read-only collection links\nOAuth → enable Google/GitHub in Clerk dashboard\nCustom domain → Vercel → Project → Domains\nTeam mode → Clerk Organizations feature' },
            ].map(card => (
              <div key={card.title} className="p-4" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
                <div className="font-orbitron text-[10px] font-bold tracking-[3px] mb-3 pb-2" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>{card.title}</div>
                <pre className="font-mono-cyber text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-dim)' }}>{card.body}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUGGESTIONS TAB ── */}
      {tab === 'suggestions' && (
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarColor: 'var(--accent) transparent' }}>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {[
              ['🎵', 'Spotify / lofi radio widget', 'Embed music for focus sessions'],
              ['📊', 'Productivity analytics', 'Charts: tasks per day, session streaks, heatmap'],
              ['🌤', 'Weather widget', 'Local weather via OpenWeather API'],
              ['📅', 'Google Calendar sync', 'Upcoming events and deadlines'],
              ['🔖', 'Browser extension', 'One-click save any URL to dashboard'],
              ['🤖', 'AI assistant sidebar', 'Chat with Claude to find & organize resources'],
              ['📱', 'PWA / mobile install', 'Make it installable with offline support'],
              ['🔔', 'Smart reminders', 'Browser notifications for tasks and deadlines'],
              ['🗃', 'Kanban board', 'Drag-drop: Backlog → Doing → Done'],
              ['📈', 'GitHub activity graph', 'Your contribution chart via GitHub API'],
              ['💬', 'Share collections', 'Share resource sets with teammates'],
              ['🔍', 'Semantic search', 'AI search by meaning, not just keywords'],
              ['⏰', 'Deadline tracker', 'Due dates on tasks, countdown, overdue alerts'],
              ['🌐', 'Link health checker', 'Auto-detect dead links in your resources'],
              ['📝', 'Markdown editor', 'Rich notes with live preview'],
              ['📦', 'Version history', 'Track changes to your resource list over time'],
              ['🎯', 'Goal & habit tracker', 'Weekly goals with streaks and progress rings'],
              ['🌙', 'Multiple themes', 'Save and switch between custom color themes'],
              ['🖼', 'Inline PDF viewer', 'Preview PDFs without leaving the dashboard'],
              ['📻', 'Focus sounds', 'Rain, cafe, white noise, binaural beats built-in'],
              ['📤', 'Shareable read-only links', 'Public view of specific collections'],
              ['🧩', 'Drag-drop layout', 'Customize panel sizes and positions'],
              ['🔐', 'Encrypted notes', 'End-to-end encrypted scratchpad'],
              ['🏷', 'Smart tagging', 'AI auto-suggests tags for new resources'],
              ['📡', 'RSS feed reader', 'Follow tech blogs and news directly in dashboard'],
            ].map(([icon, name, desc]) => (
              <div key={name as string} className="flex gap-3 p-3" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
                <div className="text-xl flex-shrink-0 w-6 text-center">{icon}</div>
                <div>
                  <div className="text-sm font-semibold mb-0.5">{name as string}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>{desc as string}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODALS & TOASTS ── */}
      <AddResourceModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={addResource} />
      <Notification msg={notifMsg} visible={notifVisible} />
    </div>
  )
}
