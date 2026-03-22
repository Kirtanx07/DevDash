<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=900&size=40&duration=3000&pause=1000&color=00F5FF&center=true&vCenter=true&width=600&height=80&lines=CYBERSPACE+v2.0;PERSONAL+MISSION+CONTROL" alt="Cyberspace" />

```
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗██████╗  █████╗  ██████╗███████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗██████╔╝███████║██║     █████╗  
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝  
╚██████╗   ██║   ██████╔╝███████╗██║  ██║███████║██║     ██║  ██║╚██████╗███████╗
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
```

**// PERSONAL MISSION CONTROL — COMMAND CENTER FOR THE MODERN ENGINEER**

[![Live](https://img.shields.io/badge/⚡_Status-PRODUCTION_LIVE-00ff88?style=for-the-badge&labelColor=030b12)](https://cyberspace-dashboard.vercel.app/)
[![Version](https://img.shields.io/badge/Version-2.0.0-00f5ff?style=for-the-badge&labelColor=030b12)](https://cyberspace-dashboard.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-white?style=for-the-badge&logo=nextdotjs&labelColor=030b12)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-white?style=for-the-badge&logo=vercel&labelColor=030b12)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Personal_Use-ff2d6e?style=for-the-badge&labelColor=030b12)](#license)

<br/>

> *"One interface to rule your roadmaps, your internships, your tools — and your time."*

**[🚀 Live Demo](https://cyberspace-dashboard.vercel.app/) · [📖 Full Docs](https://cyberspace-dashboard.vercel.app/) · [🐛 Report Bug](#) · [💡 Request Feature](#)**

</div>

---

## 🌌 What is Cyberspace?

**Cyberspace v2.0** is a high-performance, utility-first productivity dashboard built for the modern engineer. It serves as a centralized **Command & Control (C2)** hub — a single sovereign interface to manage your professional roadmaps, track high-stakes internships, audit technical resources, and monitor system health in real time.

Forget juggling 12 tabs. Cyberspace brings it all into one terminal-grade cockpit.

```
┌─────────────────────────────────────────────────────────────────┐
│  ◉ SYS OK   NET FAST   LATENCY 52ms   RESOURCES 65   DONE 20%  │
├──────────────┬──────────────────────────────┬───────────────────┤
│ SESSION TIMER│      RESOURCE HUB            │   MISSION LOG     │
│   25:00      │  [ALL] [ROADMAPS] [TOOLS]    │  ▸ HIGH priority  │
│   FOCUS      │  ┌──────┐ ┌──────┐ ┌──────┐ │  ▸ MED  priority  │
│              │  │ Card │ │ Card │ │ Card │ │  ▸ LOW  priority  │
├──────────────│  └──────┘ └──────┘ └──────┘ ├───────────────────┤
│ SYSTEM HEALTH│                              │   SCRATCHPAD      │
│  NET: FAST   │  ┌──────┐ ┌──────┐ ┌──────┐ │  > terminal input │
│  LAT: 52ms   │  │ Card │ │ Card │ │ Card │ │                   │
└──────────────┴──────────────────────────────┴───────────────────┘
```

---

## 🚀 Key Features

<table>
<tr>
<td width="50%">

### 📦 Centralized Resource Hub
A categorizable, tag-based repository for **roadmaps** (AI, Fullstack, Cybersecurity), internship listings, tools, courses, and PDFs. Full-text search with 11 filter categories.

### ⏱️ Mission Log & Focus Timer
Integrated **Pomodoro timer** (FOCUS / SHORT / LONG / FREE) synced with a persistent task management "Mission Log." Priority levels: HIGH / MED / LOW.

### 📤 Universal JSON Import/Export
Seamlessly migrate your entire environment via **standardized JSON schemas**. Drag-and-drop import. Zero vendor lock-in. AI Conversion Prompt included.

</td>
<td width="50%">

### 📊 System Health Analytics
Real-time monitoring of **network status**, session uptime, resource count, and latency — all displayed in the HUD status bar.

### 🎨 Cyber-UI Engine
Utility-first terminal aesthetic with **scan lines**, grid overlays, and dynamic **5-color accent switching** (Cyan, Green, Purple, Amber, Red).

### 🔐 Sovereign Auth
Secure identity management via **Auth-Core** microservice (Clerk) with Google and GitHub OAuth. JWT-based session tokens with Supabase RLS integration.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | [Next.js 14+](https://nextjs.org/) (App Router) | Full-stack React framework |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Custom Terminal Theme) | Utility-first cyber UI |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via Supabase + Prisma | Type-safe persistent storage |
| **Auth** | [Clerk](https://clerk.com/) | Identity microservice + OAuth |
| **State** | Zustand + LocalStorage | Client-side persistence |
| **Deployment** | [Vercel](https://vercel.com/) | Edge CDN + CI/CD |

---

## 📂 Project Structure

```
cyberspace-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Main C2 interface
│   │   ├── auth/               # Sign in / Create account
│   │   └── import/             # JSON import page
│   ├── components/
│   │   ├── HUD/                # Status bar & system metrics
│   │   ├── MissionLog/         # Task manager panel
│   │   ├── ResourceCard/       # Resource display cards
│   │   └── SystemHealth/       # Network & latency monitor
│   ├── hooks/
│   │   ├── useTimer.ts         # Pomodoro timer logic
│   │   └── useSystemHealth.ts  # Real-time health metrics
│   └── lib/
│       ├── prisma.ts           # Prisma client singleton
│       └── supabase.ts         # Supabase config + auth
├── public/                     # Static assets, cyber-fonts
├── prisma/
│   └── schema.prisma           # Database schema
├── .env.local                  # 🔒 Secrets (never commit)
├── vercel.json                 # Deployment config
└── package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js `18+`
- PostgreSQL database (Supabase recommended)
- Clerk account
- Vercel account

### 1. Clone & Install

```bash
git clone https://github.com/kirtan__x/cyberspace-dashboard.git
cd cyberspace-dashboard
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://...
```

### 3. Initialize Database

```bash
npx prisma db push
npx prisma generate
```

### 4. Run Dev Server

```bash
npm run dev
# → http://localhost:3000
```

---

## 📤 JSON Import Schema

Import resources in bulk using the standardized schema:

```json
{
  "resources": [
    {
      "type": "internship | tool | roadmap | course | pdf | repo | other",
      "title": "Resource Name",
      "url": "https://...",
      "description": "1-2 sentence description",
      "category": "Career | Roadmaps | Tools | Security",
      "tags": ["tag1", "tag2"],
      "priority": "normal | high | pinned",
      "status": "not_applied | applied | accepted | rejected",
      "meta": { "stipend": "₹30,000/mo", "duration": "3 months" }
    }
  ]
}
```

> 💡 **Pro tip:** Use the built-in **AI Conversion Prompt** on the Import page — copy it into any AI model to instantly convert a plain text resource list into valid import JSON.

---

## 🔒 Security

- All secrets stored in `.env.local` — enforced by `.gitignore`
- **Supabase RLS** enabled — users access only their own data via Clerk JWT
- Production Clerk keys used on Vercel (never dev keys on custom domains)
- CORS restricted to production domain only
- No sensitive data stored in LocalStorage

> ⚠️ **Supabase Free Tier:** Projects pause after **7 days of inactivity**. Set up a health-check cron job to keep your production instance alive.

---

## 🚢 Deployment

### One-command deploy via Vercel

```bash
# Push to main — Vercel auto-deploys
git push origin main

# Schema changes only
npx prisma db push
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kirtan__x/cyberspace-dashboard)

---

## 🗺️ Roadmap

- [x] Resource Hub with tag filtering
- [x] Mission Log & Pomodoro timer
- [x] JSON import/export
- [x] System health monitoring
- [x] Cyber-UI engine with accent switcher
- [x] Sovereign auth (Clerk + OAuth)
- [ ] Supabase Realtime sync across tabs
- [ ] GitHub OAuth repo auto-import
- [ ] Internship deadline calendar
- [ ] AI-powered resource auto-tagging
- [ ] Mobile PWA with offline mode
- [ ] Multi-workspace collaboration

---

## 📄 License

```
Copyright (c) 2026 Kirtan Kumar Kori (kirtan__x)

Personal use only. Redistribution or commercial deployment
without explicit written consent is prohibited.

AI-assisted development using Claude by Anthropic (anthropic.com).
All architecture, design decisions, and feature specifications
are original work of the author.
```

---

<div align="center">

**Built with ⚡ by [Kirtan Kumar Kori](https://github.com/kirtan__x) — handle: `kirtan__x`**

*AI-assisted development with [Claude](https://anthropic.com) by Anthropic*

[![GitHub](https://img.shields.io/badge/GitHub-kirtan__x-181717?style=for-the-badge&logo=github)](https://github.com/kirtan__x)

```
// END OF TRANSMISSION — ALL SYSTEMS NOMINAL
```

</div>
