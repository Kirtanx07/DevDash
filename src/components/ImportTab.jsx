import React, { useState } from 'react'
import { useStore } from '../store'

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

export function ImportTab({ onNotify }) {
  const importResources = useStore(s => s.importResources)
  const [jsonText, setJsonText] = useState('')
  const [dragging, setDragging] = useState(false)

  const doImport = () => {
    try {
      const data = JSON.parse(jsonText.trim())
      if (!data.resources || !Array.isArray(data.resources)) throw new Error('bad')
      const valid = data.resources.filter(r => r.title)
      importResources(valid)
      setJsonText('')
      onNotify?.(`IMPORTED ${valid.length} RESOURCES`, 'success')
    } catch { onNotify?.('INVALID JSON FORMAT', 'error') }
  }

  const handleFile = (file) => {
    const reader = new FileReader()
    reader.onload = e => setJsonText(e.target.result)
    reader.readAsText(file)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

      {/* Drop zone */}
      <div style={{ gridColumn: '1/-1', background: 'var(--panel)', border: '1px solid var(--border)', padding: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '.65rem', fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>↑ DRAG & DROP IMPORT</div>
        <div
          onClick={() => document.getElementById('file-inp').click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if(f) handleFile(f) }}
          style={{
            border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
            padding: '30px 20px', textAlign: 'center', cursor: 'pointer',
            background: dragging ? '#00d4ff05' : 'transparent',
            color: dragging ? 'var(--accent)' : 'var(--text-dim)',
            fontFamily: 'var(--font-mono)', fontSize: '.72rem', letterSpacing: 1,
            marginBottom: 14, transition: 'all .2s'
          }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8, opacity: .5 }}>📁</div>
          DRAG & DROP YOUR JSON FILE HERE — OR CLICK TO BROWSE<br />
          <span style={{ fontSize: '.6rem', color: 'var(--text-dim)' }}>Accepts .json files in the defined format</span>
        </div>
        <input id="file-inp" type="file" accept=".json" style={{ display: 'none' }} onChange={e => { if(e.target.files[0]) handleFile(e.target.files[0]) }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', color: 'var(--text-dim)' }}>OR PASTE JSON</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <textarea className="cyber-textarea" style={{ minHeight: 80, marginBottom: 10 }}
          placeholder='{"resources": [...]}' value={jsonText} onChange={e => setJsonText(e.target.value)} />

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="cyber-btn green" onClick={doImport}>↑ IMPORT RESOURCES</button>
          <button className="cyber-btn" onClick={() => navigator.clipboard.writeText(JSON_FORMAT).then(() => onNotify?.('FORMAT COPIED!'))}>COPY FORMAT</button>
        </div>
      </div>

      {/* AI Prompt */}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '.65rem', fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>🤖 AI CONVERSION PROMPT</div>
        <p style={{ fontSize: '.75rem', color: 'var(--text-dim)', marginBottom: 12, lineHeight: 1.6 }}>
          Copy this prompt and send to any AI (ChatGPT, Claude, Gemini) with your resource list. It will convert everything to the correct JSON format.
        </p>
        <div style={{ background: 'var(--panel2)', border: '1px solid var(--accent3)', borderLeft: '3px solid var(--accent3)', padding: 16, fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--accent3)', lineHeight: 1.8, position: 'relative', whiteSpace: 'pre-wrap', marginBottom: 14 }}>
          <button onClick={() => navigator.clipboard.writeText(AI_PROMPT).then(() => onNotify?.('AI PROMPT COPIED!'))}
            style={{ position: 'absolute', top: 10, right: 10, fontFamily: 'var(--font-display)', fontSize: '.45rem', letterSpacing: 1, padding: '3px 8px', border: '1px solid var(--accent3)', color: 'var(--accent3)', background: 'none', cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent3)'; e.currentTarget.style.color = 'var(--bg)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--accent3)' }}>
            COPY
          </button>
          {AI_PROMPT}
        </div>
        <p style={{ fontSize: '.65rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          💡 Works with any AI: paste your bookmarks, Notion pages, spreadsheet rows, links list — the AI will format them all.
        </p>
      </div>

      {/* JSON Format Reference */}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '.65rem', fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>{'{ }'} JSON FORMAT REFERENCE</div>
        <div style={{ background: '#020a10', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: 14, fontFamily: 'var(--font-mono)', fontSize: '.65rem', lineHeight: 1.8, overflowX: 'auto', whiteSpace: 'pre', maxHeight: 280, overflowY: 'auto', marginBottom: 12 }}>
          <span style={{ color: 'var(--accent)' }}>{`{
  "resources": [
    {`}</span>
          {`
      `}<span style={{ color: 'var(--accent)' }}>"type"</span>{`:        `}<span style={{ color: 'var(--accent4)' }}>"link"</span>{`,          `}<span style={{ color: 'var(--text-dim)' }}>// link|tool|pdf|roadmap|internship|course|image|note|repo|other</span>
          {`
      `}<span style={{ color: 'var(--accent)' }}>"title"</span>{`:       `}<span style={{ color: 'var(--accent4)' }}>"Resource Name"</span>{`,  `}<span style={{ color: 'var(--text-dim)' }}>// required</span>
          {`
      `}<span style={{ color: 'var(--accent)' }}>"url"</span>{`:         `}<span style={{ color: 'var(--accent4)' }}>"https://..."</span>{`,    `}<span style={{ color: 'var(--text-dim)' }}>// optional</span>
          {`
      `}<span style={{ color: 'var(--accent)' }}>"description"</span>{`: `}<span style={{ color: 'var(--accent4)' }}>"Brief desc"</span>{`,     `}<span style={{ color: 'var(--text-dim)' }}>// optional</span>
          {`
      `}<span style={{ color: 'var(--accent)' }}>"category"</span>{`:    `}<span style={{ color: 'var(--accent4)' }}>"Cybersecurity"</span>{`,  `}<span style={{ color: 'var(--text-dim)' }}>// auto-creates tab</span>
          {`
      `}<span style={{ color: 'var(--accent)' }}>"tags"</span>{`:        `}<span style={{ color: 'var(--accent3)' }}>["free","important"]</span>{`,`}
          {`
      `}<span style={{ color: 'var(--accent)' }}>"priority"</span>{`:    `}<span style={{ color: 'var(--accent4)' }}>"normal"</span>{`         `}<span style={{ color: 'var(--text-dim)' }}>// normal|high|pinned</span>
          <span style={{ color: 'var(--accent)' }}>{`
    }
  ]
}`}</span>
        </div>
        <button className="cyber-btn full" onClick={() => navigator.clipboard.writeText(JSON_FORMAT).then(() => onNotify?.('FORMAT COPIED!'))}>COPY FORMAT</button>
      </div>

    </div>
  )
}
