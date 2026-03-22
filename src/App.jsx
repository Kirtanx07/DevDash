import React, { useState, useEffect } from 'react'
import { TopBar }           from './components/TopBar'
import { Timer }            from './components/Timer'
import { QuickLinks }       from './components/QuickLinks'
import { ResourceHub }      from './components/ResourceHub'
import { TaskBoard }        from './components/TaskBoard'
import { ConfigPanel }      from './components/ConfigPanel'
import { AddResourceModal } from './components/AddResourceModal'
import { ImportTab }        from './components/ImportTab'
import { AuthTab }          from './components/AuthTab'
import { SuggestionsTab }   from './components/SuggestionsTab'
import { Notification }     from './components/Notification'
import { useNotification }  from './hooks/useNotification'
import { useStore }         from './store'

const TABS = [
  { id: 'dashboard',   label: '⬡ DASHBOARD' },
  { id: 'import',      label: '↑ IMPORT / UPLOAD' },
  { id: 'auth',        label: '🔐 AUTH & BACKEND' },
  { id: 'suggestions', label: '✦ SUGGESTIONS' },
]

export default function App() {
  const [activeTab, setActiveTab]   = useState('dashboard')
  const [modalOpen, setModalOpen]   = useState(false)
  const { notif, notify }           = useNotification()
  const accent   = useStore(s => s.accent)
  const resetAll = useStore(s => s.resetAll)

  // Restore accent on load
  useEffect(() => {
    if (accent) {
      document.documentElement.style.setProperty('--accent', accent)
      document.documentElement.style.setProperty('--border', accent + '22')
      document.documentElement.style.setProperty('--glow', `0 0 10px ${accent}66, 0 0 30px ${accent}22`)
    }
  }, [])

  const exportData = () => {
    const state = useStore.getState()
    const blob = new Blob(
      [JSON.stringify({ resources: state.resources, todos: state.todos, exportedAt: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'cyberspace-export.json'
    a.click()
    URL.revokeObjectURL(a.href)
    notify('DATA EXPORTED')
  }

  const handleReset = () => {
    if (window.confirm('RESET ALL DATA? This cannot be undone.')) {
      resetAll()
      notify('DATA RESET TO DEFAULTS')
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <TopBar />

      {/* Nav Tabs */}
      <nav style={{
        display: 'flex', gap: 2, padding: '8px 20px 0',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)', flexShrink: 0,
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            fontFamily: 'var(--font-display)', fontSize: '.55rem', fontWeight: 700, letterSpacing: 2,
            padding: '7px 18px', border: '1px solid transparent', borderBottom: 'none',
            background: activeTab === tab.id ? 'var(--panel)' : 'transparent',
            color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-dim)',
            cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
            borderColor: activeTab === tab.id ? 'var(--border)' : 'transparent',
            boxShadow: activeTab === tab.id ? '0 -2px 0 var(--accent)' : 'none',
            borderBottomColor: activeTab === tab.id ? 'var(--panel)' : 'transparent',
          }}>{tab.label}</button>
        ))}
      </nav>

      {/* Tab content */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr 270px', gap: 1, background: 'var(--border)' }}>

            {/* LEFT column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', overflow: 'hidden' }}>
              <Timer onNotify={notify} />
              <QuickLinks onAddClick={() => setModalOpen(true)} />
            </div>

            {/* CENTER */}
            <ResourceHub
              onNotify={notify}
              onAddClick={() => setModalOpen(true)}
            />

            {/* RIGHT column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', overflow: 'hidden' }}>
              <TaskBoard />
              <ConfigPanel onExport={exportData} onReset={handleReset} />
            </div>

          </div>
        )}

        {activeTab === 'import'      && <ImportTab onNotify={notify} />}
        {activeTab === 'auth'        && <AuthTab />}
        {activeTab === 'suggestions' && <SuggestionsTab />}

      </main>

      {/* Global Add Resource Modal */}
      <AddResourceModal open={modalOpen} onClose={() => setModalOpen(false)} onNotify={notify} />

      {/* Notification toast */}
      <Notification msg={notif.msg} type={notif.type} show={notif.show} />
    </div>
  )
}
