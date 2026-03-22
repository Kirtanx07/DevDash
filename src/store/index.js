import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEMO_RESOURCES = [
  { id: 1, type: 'roadmap', title: 'Cybersecurity Roadmap 2024', url: 'https://roadmap.sh/cyber-security', description: 'Complete learning path for cybersecurity', category: 'Cybersecurity', tags: ['roadmap', 'free'], priority: 'pinned', addedAt: Date.now() },
  { id: 2, type: 'tool', title: 'CyberChef', url: 'https://gchq.github.io/CyberChef/', description: 'Encoding, decoding, crypto analysis tool', category: 'Tools', tags: ['crypto', 'encoding'], priority: 'high', addedAt: Date.now() },
  { id: 3, type: 'course', title: 'TryHackMe', url: 'https://tryhackme.com', description: 'Hands-on cybersecurity training labs', category: 'Cybersecurity', tags: ['hacking', 'labs', 'free'], priority: 'high', addedAt: Date.now() },
  { id: 4, type: 'internship', title: 'Google STEP Internship', url: 'https://careers.google.com/students/', description: 'Software engineering internship for students', category: 'Career', tags: ['internship', 'paid'], priority: 'high', addedAt: Date.now() },
  { id: 5, type: 'repo', title: 'Awesome Hacking', url: 'https://github.com/Hack-with-Github/Awesome-Hacking', description: 'Curated hacking resources list', category: 'Development', tags: ['github', 'list'], priority: 'normal', addedAt: Date.now() },
  { id: 6, type: 'pdf', title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', description: 'Top 10 web application security risks', category: 'Cybersecurity', tags: ['owasp', 'web', 'security'], priority: 'pinned', addedAt: Date.now() },
  { id: 7, type: 'tool', title: 'Shodan', url: 'https://shodan.io', description: 'Internet-connected devices search engine', category: 'Tools', tags: ['osint', 'recon'], priority: 'normal', addedAt: Date.now() },
  { id: 8, type: 'link', title: 'HackTheBox', url: 'https://hackthebox.com', description: 'Penetration testing platform & CTF', category: 'Cybersecurity', tags: ['ctf', 'hacking'], priority: 'normal', addedAt: Date.now() },
]

const DEMO_TODOS = [
  { id: 1, text: 'Complete TryHackMe Web Fundamentals path', done: false, priority: 'h' },
  { id: 2, text: 'Apply for Google STEP internship', done: false, priority: 'h' },
  { id: 3, text: 'Practice CTF challenges on HackTheBox', done: true, priority: 'm' },
  { id: 4, text: 'Read OWASP Top 10 docs', done: false, priority: 'm' },
  { id: 5, text: 'Set up home lab environment', done: false, priority: 'l' },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // Resources
      resources: DEMO_RESOURCES,
      activeCat: 'ALL',
      searchQuery: '',

      addResource: (res) => set(s => ({
        resources: [...s.resources, { ...res, id: Date.now(), addedAt: Date.now() }]
      })),
      deleteResource: (id) => set(s => ({
        resources: s.resources.filter(r => r.id !== id)
      })),
      importResources: (list) => set(s => ({
        resources: [...s.resources, ...list.map(r => ({ ...r, id: Date.now() + Math.random(), addedAt: Date.now() }))]
      })),
      setActiveCat: (cat) => set({ activeCat: cat }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      // Todos
      todos: DEMO_TODOS,
      addTodo: (text, priority) => set(s => ({
        todos: [{ id: Date.now(), text, priority, done: false }, ...s.todos]
      })),
      toggleTodo: (id) => set(s => ({
        todos: s.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
      })),
      deleteTodo: (id) => set(s => ({
        todos: s.todos.filter(t => t.id !== id)
      })),

      // Notes
      notes: '// workspace initialized\n// add your own resources via + or JSON import\n\n> categories auto-generate\n> pinned items appear in quick access',
      setNotes: (notes) => set({ notes }),

      // Timer sessions
      sessions: 0,
      totalSecs: 0,
      addSession: (secs) => set(s => ({
        sessions: s.sessions + 1,
        totalSecs: s.totalSecs + secs
      })),

      // Accent
      accent: '#00d4ff',
      setAccent: (color) => {
        document.documentElement.style.setProperty('--accent', color)
        document.documentElement.style.setProperty('--border', color + '22')
        document.documentElement.style.setProperty('--glow', `0 0 10px ${color}66, 0 0 30px ${color}22`)
        set({ accent: color })
      },

      // Reset
      resetAll: () => set({
        resources: DEMO_RESOURCES,
        todos: DEMO_TODOS,
        notes: '',
        sessions: 0,
        totalSecs: 0,
      }),
    }),
    {
      name: 'cyberspace-dashboard-v1',
      partialize: (s) => ({
        resources: s.resources,
        todos: s.todos,
        notes: s.notes,
        sessions: s.sessions,
        totalSecs: s.totalSecs,
        accent: s.accent,
      })
    }
  )
)
