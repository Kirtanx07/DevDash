import React, { useState } from 'react'
import { useStore } from '../store'

const TYPES = ['link','tool','pdf','roadmap','internship','course','image','note','repo','other']
const TYPE_LABELS = { link:'🔗 Link / URL', tool:'🛠 Tool', pdf:'📄 PDF / Document', roadmap:'🗺 Roadmap', internship:'💼 Internship / Job', course:'🎓 Course / Tutorial', image:'🖼 Image / Reference', note:'📝 Note / Snippet', repo:'⚡ Repository', other:'📦 Other' }

export function AddResourceModal({ open, onClose, onNotify }) {
  const addResource = useStore(s => s.addResource)
  const [form, setForm] = useState({ type: 'link', title: '', url: '', description: '', category: '', tags: '', priority: 'normal' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.title.trim()) { onNotify?.('TITLE IS REQUIRED', 'error'); return }
    addResource({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), category: form.category || 'General' })
    onNotify?.(`SAVED: ${form.title}`, 'success')
    onClose()
    setForm({ type: 'link', title: '', url: '', description: '', category: '', tags: '', priority: 'normal' })
  }

  if (!open) return null

  return (
    <div className={`modal-overlay open`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ position: 'relative' }}>
        <div className="corner-tl" /><div className="corner-tr" /><div className="corner-bl" /><div className="corner-br" />
        <div className="modal-header">
          ADD RESOURCE
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">TYPE</label>
          <select className="cyber-select" value={form.type} onChange={e => set('type', e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">TITLE *</label>
          <input className="cyber-input" placeholder="Resource name..." value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">URL</label>
          <input className="cyber-input" placeholder="https://..." value={form.url} onChange={e => set('url', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">DESCRIPTION</label>
          <textarea className="cyber-textarea" style={{ minHeight: 56 }} placeholder="Brief description..." value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">CATEGORY</label>
          <input className="cyber-input" placeholder="e.g. Cybersecurity, AI, Career..." value={form.category} onChange={e => set('category', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">TAGS (comma separated)</label>
          <input className="cyber-input" placeholder="free, important, beginner" value={form.tags} onChange={e => set('tags', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">PRIORITY</label>
          <select className="cyber-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="pinned">Pinned</option>
          </select>
        </div>

        <div className="modal-footer">
          <button className="cyber-btn red" onClick={onClose}>CANCEL</button>
          <button className="cyber-btn green" onClick={save}>SAVE RESOURCE</button>
        </div>
      </div>
    </div>
  )
}
