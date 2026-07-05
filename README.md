# QuizVerse: High-Fidelity Developer Assessment Platform

QuizVerse is a full-stack, gamified developer testing and learning assessment platform styled with a sharp, high-contrast **"Retro-Cyber Slate"** aesthetic. The platform enables developers and students to evaluate their capabilities across Python development, Artificial Intelligence, and Cloud computing while giving administrators complete, real-time control over questions, user profiles, and active proctor logs.

---

## 🚀 Key Platform Features

### 1. Multi-Track Developer Arena
Assessment pathways specifically tailored for modern technological disciplines:
*   **Python Development**: Evaluates core syntax, memory management, FastAPI endpoint development, and Django database query optimization.
*   **AI & Machine Learning**: Examines foundational training pipelines, deep neural network layers, linear regression math, and dataset preparation paradigms.
*   **Cloud Computing**: Assesses serverless architecture patterns, security policies, IAM credentials, containerization, and orchestration topologies.

### 2. Gamified Progression Engine
*   **Daily Streaks (🔥)**: Automatically calculates check-ins and tracks consecutive calendar days active to incentivize habit formation.
*   **Dynamic Badge Unlocks**: Automatically awards milestone digital achievement badges (e.g., *FastAPI Architect*, *Cloud Custodian*) for clearing difficulty tiers.
*   **Interactive Leaderboard**: Puts scores in perspective with rolling weekly and all-time ranking filters sorted by subject tracks.

### 3. Active Proctor Guard
*   **Active Session Lock**: Restricts navigation access completely while an exam session is in progress, highlighting critical instructions to ensure testing validity.
*   **Multi-Layout Prompts**: Evaluates candidates through single-select MCQs, multi-select check-boxes, prediction of code outputs, and fill-in-the-blank queries.

### 4. Adaptive Technical Recommendations
*   **Conceptual Diagnostics**: Reviews every missed query and produces immediate, micro-targeted diagnostic study feedback pointing back to the core concept.

### 5. Secure Management CMS
*   **Live Question Editor**: Enables admins to dynamically compile, modify, and deactivate questions with automatic version tracking.
*   **Identity Controller**: Moderates registered user listings, promotes administrators, or completely purges spam accounts from leaderboard structures.

---

## 🛠️ Architecture & Technical Stack

QuizVerse is engineered using a robust, highly modular **full-stack architecture** to deliver zero-flicker state transitions and clean performance parameters.

*   **Frontend**: React (Vite-powered SPA), styled with **Tailwind CSS**, utilising **Framer Motion** for polished transition animations.
*   **State Management**: Zustand, enabling lightweight global synchronization for credentials, telemetry, proctor states, and theme profiles.
*   **Backend Server**: Express.js, hosting proctoring verification middlewares, submission rate-limiters, and role-protected administration endpoints.
*   **Data Serialization**: Local FileDB (`src/db/dbFallback.ts`) for synchronous, persistent storage of profiles and quiz progress across server cold-starts, powered by a dynamic seeder containing over **1,000 track-specific questions**.

---

## 💻 Getting Started (Local Development)

### 1. Prerequisites
Ensure you have **Node.js (v18.0.0 or higher)** installed on your machine.

### 2. Dependency Installation
Initialize base dependencies and compilers:
```bash
npm install
```

### 3. Running the Dev Environment
Start the development server:
```bash
npm run dev
```
The server will boot and bind to `http://localhost:3000`.

### 4. Compiling & Production Build
To build static bundles and compile the backend TypeScript server into a self-contained CommonJS (`.cjs`) bundle:
```bash
npm run build
```
Once the build is complete, launch the production server with:
```bash
npm run start
```

---

## 📂 Project Directory Structure

```text
├── assets/                  # Public visual and audio resources
├── server.ts                # Express backend routing & proctor controllers
├── src/
│   ├── components/          # React screen layers (Auth, Dashboard, Quiz, Results, Admin)
│   ├── db/
│   │   └── dbFallback.ts    # FileDB schema, seeder rules, and question generator
│   ├── store/
│   │   └── quizStore.ts     # Global state machine (Zustand store configuration)
│   ├── themeConfig.ts       # Cohesive color mappings and Swiss typography palettes
│   ├── types.ts             # Shared type interfaces, enums, and structures
│   ├── main.tsx             # SPA entry compiler point
│   └── App.tsx              # Main system routing coordinator
├── index.html               # Main canvas template
├── metadata.json            # Application properties and frame permission requests
├── package.json             # Build commands and system dependencies
└── PRODUCT_DOC.html         # Rich specification and reasoning guide
```

---

## 🔒 Security & Admin Elevating

By default, administrative CMS routes are protected to preserve integrity. 

To easily test administrative CRUD parameters during development, use the **Developer Override Bypass** situated on the mobile footer or by visiting the **Admin CMS** tab, allowing you to instantly elevate your active sandbox profile with root developer privileges.
