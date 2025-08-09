# Break Buddy 🐨☕
Helping individuals and teams plan meaningful breaks, recharge, and boost productivity.

## 🚀 Overview
Break Buddy is built for people who want intentional, restorative breaks. Whether you work remotely, on-site, or manage a team, Break Buddy helps you schedule and track breaks to maintain focus, protect mental health, and sustain performance.

## ✨ Features
- 🧘 **Break planning** – Schedule short or long breaks tailored to your day
- 👥 **Individual & corporate modes** – Start simple and scale to teams
- 📅 **Smart scheduling** – Balance work and rest windows
- 📊 **Insights (roadmap)** – Trends and patterns around break habits
- 🌐 **Responsive** – Designed for desktop and mobile browsers

## 🛠️ Tech Stack
- **App framework:** Remix (Vite) + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Auth & DB:** Supabase (Auth + Postgres)
- **Animations:** Framer Motion, Lottie

## ⚙️ Requirements
- Node.js >= 20 (see `package.json` engines)

## 📦 Setup
```bash
# 1) Clone
git clone https://github.com/Oreva-Dev9112/Break_Buddy.git
cd Break_Buddy

# 2) Install
npm install

# 3) Develop (Remix + Vite dev server)
npm run dev

# App will be available at:
# http://localhost:5173
```

## 🔑 Environment & Supabase
Today, the Supabase URL and anon key are defined in `app/lib/supabase.ts` for ease of local development.

For production, move these to environment variables and read them in your client/server as appropriate (e.g., `import.meta.env.VITE_SUPABASE_URL`). Example `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then update `app/lib/supabase.ts` to read from `import.meta.env`.

## 🧪 Useful scripts
```bash
npm run lint        # ESLint (clean)
npm run typecheck   # TypeScript (clean)
npm run build       # Production build (SSR + client)
npm start           # Run built server
```

## 📅 Roadmap
- [ ] Custom break reminders and notifications
- [ ] Insights dashboard with trends
- [ ] Team sharing and admin features

## 🤝 Contributing
Issues and PRs are welcome. Please keep PRs small and focused; include context in descriptions so teammates can review quickly.

## 📜 License
MIT — see `LICENSE`.
