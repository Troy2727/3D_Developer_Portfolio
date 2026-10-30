<div align="center">
  <a href="https://www.alexportfolio.net/">
    <img src="docs/hero-2026-10.jpg" alt="Hero section of alexportfolio.net: the headline 'Full-stack engineer who ships real products.' next to an interactive 3D room" />
  </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
    <img src="https://img.shields.io/badge/-Three.js-black?style=for-the-badge&logo=threedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/-React_Three_Fiber-black?style=for-the-badge&logo=threedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/-GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/-EmailJS-FF9E0F?style=for-the-badge" />
    <img src="https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
    <img src="https://img.shields.io/badge/-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
    <img src="https://img.shields.io/badge/-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" />
  </div>

  <h3 align="center">Alex Mieses · 3D Developer Portfolio</h3>

  <p align="center">
    <a href="https://www.alexportfolio.net/"><b>Live site</b></a> ·
    <a href="https://www.alexportfolio.net/#work">Selected work</a> ·
    <a href="https://www.alexportfolio.net/#contact">Contact</a> ·
    <a href="https://www.linkedin.com/in/alexmieses">LinkedIn</a>
  </p>
</div>

## <img src="docs/icons/contents.svg" width="28" height="28" align="top" alt="" /> Table of Contents

1. <img src="docs/icons/about.svg" width="18" height="18" align="top" alt="" /> [About](#about)
2. <img src="docs/icons/selected-work.svg" width="18" height="18" align="top" alt="" /> [Selected Work](#selected-work)
3. <img src="docs/icons/features.svg" width="18" height="18" align="top" alt="" /> [Features](#features)
4. <img src="docs/icons/tech-stack.svg" width="18" height="18" align="top" alt="" /> [Tech Stack](#tech-stack)
5. <img src="docs/icons/project-structure.svg" width="18" height="18" align="top" alt="" /> [Project Structure](#project-structure)
6. <img src="docs/icons/quick-start.svg" width="18" height="18" align="top" alt="" /> [Quick Start](#quick-start)
7. <img src="docs/icons/deployment.svg" width="18" height="18" align="top" alt="" /> [Deployment](#deployment)

## <img src="docs/icons/about.svg" width="28" height="28" align="top" alt="" /> <a name="about">About</a>

This is the source for [alexportfolio.net](https://www.alexportfolio.net/), my personal portfolio. I'm a full-stack engineer, the founder of [FanClash](https://fanclash.io), and an MIT xPRO certified developer. I build production apps end to end in Go, Python, TypeScript, and React.

The site is a single landing page built around an interactive 3D room you can rotate and zoom, followed by my projects, education, tech stack, and a working contact form.

## <img src="docs/icons/selected-work.svg" width="28" height="28" align="top" alt="" /> <a name="selected-work">Selected Work</a>

<img src="docs/screenshot-work.jpg" alt="Project gallery: FanClash as the flagship, with Voxwell, Analytica, Live Docs, and NEXORA, each showing its name, a one-line description, and its tech stack" />

| Project | What it is | Stack | Links |
|---|---|---|---|
| **FanClash** | Live video debate arena where rival sports fans argue on stage and the audience votes on a winner | React 19, Go, MySQL, Redis, Stripe, Docker | [Live](https://fanclash.io) |
| **Voxwell** | Open-source voice studio that runs entirely on your machine: voice cloning, dubbing, transcription, and voice agents | React 19, Electron, Python, FastAPI, PyTorch | [GitHub](https://github.com/Troy2727/voxwell) · [Live](https://voxwell.vercel.app) |
| **Analytica** | Privacy-friendly web analytics with one script tag, real-time events, and Discord alerts | Next.js, shadcn/ui, Supabase | [GitHub](https://github.com/Troy2727/analytica) · [Live](https://analytica-phi.vercel.app) |
| **Live Docs** | Real-time collaborative editor with live cursors, comments, sharing, and version history | Next.js, TypeScript, Liveblocks, Clerk | [GitHub](https://github.com/Troy2727/coedit_flow) · [Live](https://coeditflow.vercel.app) |
| **NEXORA** | Task manager for teams with a kanban board, goals, reports, and chat, backed by an 81-test pytest suite | Python, FastAPI, PostgreSQL | [GitHub](https://github.com/Troy2727/NEXORA) · [Live](https://nexora-five-dun.vercel.app) |

## <img src="docs/icons/features.svg" width="28" height="28" align="top" alt="" /> <a name="features">Features</a>

👉 **Interactive 3D hero**: a lit 3D room with floating particles, built with React Three Fiber. Drag to rotate, scroll to zoom.

👉 **First-screen pitch**: headline, intro, call to action, and proof (MIT xPRO, FanClash, 18+ projects) all visible without scrolling.

👉 **Scroll animations**: GSAP and ScrollTrigger reveal the project cards, the education timeline, and the tech stack as you scroll.

👉 **Animated counters** for years of experience and completed projects.

👉 **Working contact form** that sends messages through EmailJS, next to a 3D desk scene.

👉 **Mobile first**: only one 3D canvas is mounted per breakpoint, and the layout is checked at phone, tablet, and desktop widths.

## <img src="docs/icons/tech-stack.svg" width="28" height="28" align="top" alt="" /> <a name="tech-stack">Tech Stack</a>

<p align="center">
  <a href="docs/diagrams/architecture-dark.svg" title="Open this diagram full size">
    <img src="docs/diagrams/architecture-dark.gif" alt="How alexportfolio.net works: a visitor loads a single-page React 19 app in the browser, which renders the Three.js 3D scenes, runs GSAP scroll animations, and sends the contact form through EmailJS. Every push to main on GitHub is linted and built by GitHub Actions and deployed by Vercel." width="100%" />
  </a>
</p>

- **UI:** React 19, Vite, Tailwind CSS v4
- **3D:** Three.js, React Three Fiber, Drei, React Three Postprocessing
- **Animation:** GSAP with ScrollTrigger
- **Contact:** EmailJS
- **Quality:** ESLint, GitHub Actions (lint and build on every push and pull request)
- **Hosting:** Vercel

## <img src="docs/icons/project-structure.svg" width="28" height="28" align="top" alt="" /> <a name="project-structure">Project Structure</a>

```
src/
├── sections/       # Page sections in order: Hero, ShowcaseSection, FeatureCards,
│                   # Experience, TechStack, Contact, Footer
├── components/     # NavBar, Button, TitleHeader, AnimatedCounter, GlowCard
│   └── models/     # 3D scenes: hero room, contact desk, tech logos
├── constants/      # Copy and data: nav links, counters, education, tech stack, socials
├── hooks/
└── index.css       # Tailwind theme and section styles
public/
├── images/         # Project cards, logos, icons
└── models/         # Compressed .glb 3D models
```

## <img src="docs/icons/quick-start.svg" width="28" height="28" align="top" alt="" /> <a name="quick-start">Quick Start</a>

**Prerequisites:** [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en) 20 or newer.

```bash
git clone https://github.com/Troy2727/3D_Developer_Portfolio.git
cd 3D_Developer_Portfolio
npm install
```

**Environment variables**

The contact form needs an [EmailJS](https://www.emailjs.com/) account. Create a `.env` file in the project root:

```env
VITE_APP_EMAILJS_SERVICE_ID=
VITE_APP_EMAILJS_TEMPLATE_ID=
VITE_APP_EMAILJS_PUBLIC_KEY=
```

Everything except sending messages works without them.

**Run it**

```bash
npm run dev       # dev server at http://localhost:5173
npm run lint      # ESLint
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## <img src="docs/icons/deployment.svg" width="28" height="28" align="top" alt="" /> <a name="deployment">Deployment</a>

Every push to `main` runs the CI workflow (`npm ci`, lint, build) and deploys to production on Vercel at [alexportfolio.net](https://www.alexportfolio.net/). Set the three EmailJS variables in the Vercel project settings.

## <img src="docs/icons/acknowledgements.svg" width="28" height="28" align="top" alt="" /> Acknowledgements

The original 3D layout started from the JavaScript Mastery 3D portfolio tutorial. The content, projects, copy, and design changes are my own.
