# 🛸 CYBERSPACE // Dev Dashboard

A fully-featured personal developer dashboard with cyber aesthetics.
Includes: Resource Hub, Timer (Pomodoro), Task Board, JSON Import, and more.

---

## ⚡ LOCAL SETUP — Run in 3 Steps

### Prerequisites
- **Node.js 18+** → https://nodejs.org (download LTS)
- **npm** (comes with Node)

Check you have them:
```bash
node -v   # should show v18+ or v20+
npm -v    # should show 9+
```

---

### Step 1 — Install dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This installs React, Vite, Zustand, and Lucide icons (~30 seconds).

---

### Step 2 — Start the dev server

```bash
npm run dev
```

Terminal will show:
```
  VITE v5.x  ready in 300ms
  ➜  Local:   http://localhost:3000/
```

---

### Step 3 — Open in browser

Go to → **http://localhost:3000**

Your dashboard is live! 🎉

---

## 📁 Project Structure

```
cyberspace-dashboard/
├── index.html                  ← Entry HTML
├── vite.config.js              ← Vite config (port 3000)
├── package.json                ← Dependencies
└── src/
    ├── main.jsx                ← React entry point
    ├── App.jsx                 ← Root layout + tab routing
    ├── index.css               ← Global CSS variables & styles
    ├── overrides.css           ← Toggle utility classes
    ├── store/
    │   └── index.js            ← Zustand global state (persisted to localStorage)
    ├── hooks/
    │   ├── useClock.js         ← Live clock hook
    │   ├── useNetwork.js       ← Internet speed / online status
    │   └── useNotification.js  ← Toast notification hook
    └── components/
        ├── TopBar.jsx          ← Header with clock, network, stats
        ├── Timer.jsx           ← Pomodoro / session timer
        ├── QuickLinks.jsx      ← Sidebar pinned resources
        ├── ResourceHub.jsx     ← Main resource grid with search/filter
        ├── TaskBoard.jsx       ← Todo list with priority
        ├── ConfigPanel.jsx     ← Scratchpad, accent color, toggles
        ├── AddResourceModal.jsx← Add resource form modal
        ├── ImportTab.jsx       ← JSON import + AI prompt
        ├── AuthTab.jsx         ← Backend setup guide
        ├── SuggestionsTab.jsx  ← 25 feature ideas
        └── Notification.jsx    ← Toast notification
```

---

## 🎮 Features

| Feature | Description |
|---|---|
| 🔗 Resource Hub | Add links, tools, PDFs, roadmaps, internships, courses, repos |
| ⏱ Timer | Focus / Short / Long / Free mode with Pomodoro cycle tracker |
| ✅ Task Board | High/Med/Low priority todos with progress bar |
| 📝 Scratchpad | Auto-saved notes in localStorage |
| ⚡ Quick Access | Sidebar shows pinned/high-priority resources |
| ↑ JSON Import | Drag-drop or paste JSON to bulk import resources |
| 🤖 AI Prompt | Ready-made prompt to convert any list into JSON via AI |
| 🌐 Network | Live internet speed + online/offline detection |
| 🕐 Live Clock | Real-time clock + date in header |
| 🎨 Accent Colors | 5 color themes switchable in config panel |
| ↓ Export | Download all data as JSON backup |
| 🔐 Auth Guide | Step-by-step Clerk + Supabase setup guide |
| ✦ Suggestions | 25 feature ideas to extend the dashboard |

---

## 📦 JSON Import Format

Use the **Import tab** in the dashboard, or paste this format:

```json
{
  "resources": [
    {
      "type": "link",
      "title": "Resource Name",
      "url": "https://...",
      "description": "Brief description",
      "category": "Cybersecurity",
      "tags": ["free", "important"],
      "priority": "normal"
    }
  ]
}
```

**type** options: `link` | `tool` | `pdf` | `roadmap` | `internship` | `course` | `image` | `note` | `repo` | `other`

**priority** options: `normal` | `high` | `pinned`

---

## 🤖 AI Conversion Prompt

Go to the **Import tab** → copy the AI prompt → paste it into ChatGPT/Claude/Gemini
along with your list of resources (links, bookmarks, tools, etc.).
The AI will return valid JSON ready to paste straight into the dashboard.

---

## 🔐 Adding Authentication (Optional)

See the **Auth & Backend** tab in the dashboard for complete instructions.

**TL;DR:**
1. Create account at [clerk.dev](https://clerk.dev) → get publishable key
2. Create project at [supabase.com](https://supabase.com) → run SQL schema
3. Create `.env` file:
```
VITE_CLERK_KEY=pk_test_your_key_here
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON=eyJhbGc...
```
4. `npm install @clerk/clerk-react @supabase/supabase-js`
5. Wrap `<App />` with `<ClerkProvider>` in `main.jsx`

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **Vite 5** — lightning fast dev server + build tool
- **Zustand** — global state management with localStorage persistence
- **Lucide React** — icon library
- **CSS Variables** — full theming system, no Tailwind needed

---

## 🚀 Build for Production

```bash
npm run build
```

Output goes to `dist/` folder. Deploy to:
- **Vercel**: `npx vercel` or connect GitHub repo at vercel.com
- **Netlify**: drag `dist/` folder to netlify.com
- **GitHub Pages**: `npm install gh-pages` then `npm run deploy`

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| `node: command not found` | Install Node.js from nodejs.org |
| Port 3000 already in use | Change port in `vite.config.js` to 3001 |
| Fonts not loading | Check internet connection (Google Fonts CDN) |
| Blank screen | Open browser console (F12) → check for errors |
| State not saving | Check localStorage isn't blocked (private mode) |

---

Made with ⚡ — your personal mission control.
