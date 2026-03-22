# 🌌 Cyberspace v2.0: Personal Mission Control

**Cyberspace** is a high-performance, utility-first productivity dashboard built for the modern engineer. It serves as a centralized Command Center (C2) to manage professional roadmaps, track high-stakes internships, and audit technical resources with a focus on data portability.

[![Deployment Status](https://img.shields.io/badge/Status-Production-success?style=flat-square)](https://cyberspace-dashboard.vercel.app/)
[![Version](https://img.shields.io/badge/Version-2.0.0-blue?style=flat-square)](https://github.com/Kirtan__x/cyberspace)

## 🚀 Key Features (v2.0)

- **Centralized Resource Hub:** A categorizable, tag-based repository for roadmaps (AI, Fullstack, Cybersecurity) and professional tools.
- **Mission Log & Focus Timer:** Integrated Pomodoro system synced with a persistent task management "Mission Log."
- **Universal JSON Import/Export:** Seamlessly migrate your entire environment via standardized JSON schemas. No vendor lock-in.
- **System Health Analytics:** Real-time monitoring of session uptime, resource count, and latency metrics.
- **Cyber-UI Engine:** Utility-first styling featuring scan lines, grid overlays, and dynamic accent color switching.
- **Sovereign Auth:** Secure account management using the "Auth-Core" microservice logic with Google/GitHub OAuth.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom Terminal Theme)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via Supabase & Prisma)
- **Deployment:** [Vercel](https://vercel.com/)
- **State Management:** React Context + LocalStorage Persistence

## 📂 Project Structure

```text
├── src/
│   ├── app/            # Next.js App Router (Dashboard, Auth, Import)
│   ├── components/     # UI Components (HUD, MissionLog, ResourceCard)
│   ├── hooks/          # Custom hooks for Timer and System Health
│   └── lib/            # Prisma Client & Supabase Config
├── public/             # Static assets (Cyber-fonts & Icons)
└── prisma/             # Database Schema
