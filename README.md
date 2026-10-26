# 🚀 SkillBridge

> **One Single Platform Connecting Project Discovery, Complementary Student Skills & Team Task Tracking**

SkillBridge is an academic collaboration platform designed to eliminate the hurdles student innovators face when conceptualizing and executing minor, major, and hackathon projects.

---

## 📌 Problem Statement
Students frequently have innovative project ideas but struggle to find suitable projects and teammates with complementary skill sets. Teams often end up with duplicate skill overlaps (e.g. four backend coders with no UI/UX designer) and zero sprint milestone tracking, causing project delays and abandonment.

---

## 💡 Proposed Solution
SkillBridge integrates the entire academic project lifecycle into a single unified platform:
1. **Project Discovery & Idea Pitching:** Centralized showcase for university projects and hackathon concepts categorized by domain (AI/ML, Mobile, Web3, IoT, EdTech).
2. **Complementary Skill Matchmaking:** Intelligent synergy algorithm that matches students with complementary capabilities (e.g., Designer + Backend Dev) and computes real-time compatibility percentages (55%–98%).
3. **Team Leader Recruitment Hub:** Manage incoming teammate applications, review proposals/portfolios, and recruit with one click.
4. **Project Workspace & Kanban Task Board:** 4-column sprint task board (To Do, In Progress, Under Review, Done) with drag-and-drop support, priority badges, and assignee tracking.
5. **Student Skill Profiles:** Showcase skill proficiencies, GitHub/LinkedIn links, and switch demo personas in real-time.

---

## 🛠️ Technology Stack
- **Frontend Structure:** HTML5 (Semantic, accessible layout, modal dialogs)
- **Styling:** Modern Vanilla CSS3 (Custom design system, glassmorphism, responsive grid)
- **Logic & Matchmaking:** Vanilla JavaScript (ES6+), Event-driven SPA
- **State Persistence:** Web Storage API (`localStorage`)
- **Interactive Deck:** Built-in presentation slide deck (`presentation.html`)

---

## 🌐 Quick Start / Running Locally
SkillBridge has **zero build steps** and runs instantly:

### Option 1: Direct in Browser
Double-click `index.html` in your browser.

### Option 2: Local HTTP Server
```bash
python -m http.server 3000
```
Then visit [http://localhost:3000](http://localhost:3000).

---

## 🚢 Deploying to Netlify
1. Connect this repository to [Netlify](https://app.netlify.com/).
2. Set **Build command:** *(leave empty)*
3. Set **Publish directory:** `.` (root directory)
4. Click **Deploy Site**!

---

## 📊 Documentation & Presentation Deck
- **Interactive Presentation Deck:** Open `presentation.html` in your browser for a 9-slide interactive deck with built-in ER diagram and teacher speaking notes.
- **Project Report & ERD:** Located in [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md).
- **Presentation PDF:** [`SkillBridge_Presentation.pdf`](SkillBridge_Presentation.pdf).
