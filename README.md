# Flow.io — Intelligent Business Workflow Automation & Meeting Simulation Hub

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

**Flow.io** is an enterprise-grade autonomous business workflow platform engineered to orchestrate complex corporate processes across **Gmail**, **Excel/XLSX spreadsheets**, **contract documents (PDF/DOCX)**, **ERP relational databases**, and **business calendar cutoffs**.

Featuring a built-in **Executive Meeting Scheduling & Live Simulation Room**, an **Outgoing Incident Dispatcher & SMTP Relay**, and **Human-in-the-Loop Governance Gates (Rule AP-10K)**, Flow.io bridges the gap between autonomous decision-making and strict corporate compliance.

---

## 🌟 Key Features

### 1. 🤝 Meeting Scheduling with Live Simulation
- **Full Database & Backend Sync**: All scheduled meetings persist into an in-memory/SQL backend table (`meetings`) with REST endpoints.
- **Remaining vs. Done Tracking**: Distinct counters and filters for upcoming (`Remaining`) sessions requiring review vs. ratified (`Done`) sessions with official minutes.
- **Interactive Live Simulation Room**:
  - Multi-participant video/audio feed simulation with active-speaker pulses and wave visualizers.
  - Contextual conversation transcripts between the CFO, Operations Director, Vendor Leads, and an AI Compliance Scribe.
  - Interactive playback controls: Play, Pause, speed up (1x, 2x, 4x), or **Instant Finish**.
  - 100% quorum consensus ratification, automatic action item generation, general ledger disbursements, and celebratory confetti.

### 2. ⚡ Autonomous Multi-Step Workflow Engine
- **Multi-Source Context Ingestion**: Extracts amounts, contractual terms, and deadlines from inbound Gmail emails, Excel vendor workbooks, and PDF SLA agreements.
- **Dynamic Re-Planning**: Intelligently re-evaluates routes when discrepancy conditions shift (e.g., qualifying for retroactive 15% volume discounts exceeding $50k annual spend).
- **Rule AP-10K Human Sign-off Gate**: Any payable exceeding $10,000 automatically triggers an executive approval gate with discrepancy notes and proposed drafts.

### 3. 📧 Outgoing Incident Email Simulation & SMTP Relay
- **Automated Incident Notification**: Dispatches formal commercial dispute notices, SLA Clause 7 delinquency cure responses, and audit resolutions.
- **Real SMTP Simulation**: Connects to `/api/incidents/dispatch` to simulate Google Workspace Relay delivery with real queue IDs, TLS v1.3 encryption, and status codes (250 OK).

### 4. 🗄️ Relational SQL Database & ERP Explorer
- **Live SQL Query Console**: Direct querying against 5 core corporate tables:
  - `vendors`: Vendor profiles, cumulative Q3 spend, credit limits, discount eligibility, risk tiers.
  - `invoices`: Invoice registers, PO references, billed vs. adjusted amounts, bank batch cutoffs.
  - `purchase_orders`: Approved fiscal quarter budgets, line items, 3-way matching statuses.
  - `general_ledger`: Double-entry journal postings (Debit/Credit, account codes, authorized signatories).
  - `meetings`: Deliberation logs, quorum records, scheduled dates, and action items.
- **Interactive Presets**: Quick execution of joins, variance analyses, overdue queries, and meeting logs.

### 5. 📅 Business Calendar & Bank Clearing Cutoffs
- **Temporal Constraint Awareness**: Maps workflows to strict financial deadlines (e.g., Friday 14:00 PM bank batch clearing, 7-day cure window expirations).
- **Dual Views**: Interactive Month Grid and Agenda List views.
- **Cross-Linked Workflows**: Click any calendar milestone to inspect its linked active workflow.

### 6. 🔐 Corporate SSO & Executive Persona Switcher
- **Executive Quick-Switch**:
  - **John Doe** — *Director of Finance & Operations* ($10,000 threshold ceiling)
  - **Sarah Lin** — *Chief Financial Officer* ($250,000 threshold ceiling)
  - **Elena Rostova** — *Vendor Accounts Lead, Vanguard Industrial Corp*
- **Role-Aware Authorization**: Automatically synchronizes sign-off thresholds and writes authentication events to the immutable audit log.

### 7. 🤖 Grounded AI Copilot & Chatbot
- Context-aware chatbot grounded directly in real workspace data (invoices, emails, calendar events, spreadsheets, documents, and audit logs).
- Can trigger system scans, highlight pending sign-offs, and navigate the workspace.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express 4, tsx |
| **Build & Tooling** | Vite 8, TypeScript 5.7, ESBuild |
| **Data Parsing** | XLSX (SheetJS), Canvas Confetti |
| **API Architecture** | RESTful `/api/*` endpoints mounted via Express with Vite middlewares |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **bun** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/flow.io.git
   cd flow.io
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application runs full-stack at `http://localhost:3000`.

4. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Reference

The backend runs on Express (`server.ts`) and provides the following RESTful routes:

### Meetings & Simulation
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meetings` | Returns all meetings, with optional `?filter=remaining` or `?filter=done`. Returns `{ totalCount, remainingCount, doneCount, meetings }`. |
| `POST` | `/api/meetings` | Schedules and persists a new meeting record in the relational database. |
| `POST` | `/api/meetings/:id/simulate` | Executes live/accelerated meeting simulation, produces consensus transcript, logs action items, and shifts status to `completed`. |
| `PATCH` | `/api/meetings/:id/status` | Toggles meeting status between `scheduled` (Remaining) and `completed` (Done). |
| `DELETE` | `/api/meetings/:id` | Cancels and purges a meeting session from the database. |

### Business Pipeline & ERP
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/database/query` | Inspects database tables (`invoices`, `vendors`, `purchase_orders`, `meetings`). |
| `POST` | `/api/analysis/evaluate` | Cross-checks invoice amounts against vendor volume rebates and bank cutoff constraints. |
| `POST` | `/api/workflows/run-full-pipeline`| Executes an automated end-to-end reconciliation run. |
| `POST` | `/api/incidents/dispatch` | Dispatches outgoing incident response emails through Google Workspace relay simulation. |
| `GET` | `/api/health` | Health check endpoint returning backend uptime. |

---

## 📁 Project Structure

```
├── server.ts                   # Express full-stack entry point & REST APIs
├── index.html                  # HTML entry point
├── metadata.json               # Applet configuration & permissions
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
└── src/
    ├── App.tsx                 # Main application state orchestrator
    ├── main.tsx                # React DOM mount point
    ├── index.css               # Global styles & Tailwind CSS v4 import
    ├── components/
    │   ├── MeetingSchedulerView.tsx       # Meeting Hub (Remaining vs Done views)
    │   ├── MeetingSimulationModal.tsx     # Live interactive meeting simulation room
    │   ├── OutgoingIncidentModal.tsx      # Outgoing incident email & SMTP relay
    │   ├── LoginPage.tsx                  # Corporate SSO & Executive Persona switcher
    │   ├── OverviewDashboard.tsx          # High-level KPIs, activity feeds, and approvals
    │   ├── WorkflowsView.tsx              # Multi-step visualizer with re-planning
    │   ├── CalendarView.tsx               # Fiscal calendar, bank cutoffs, cure deadlines
    │   ├── DatabaseExplorerView.tsx       # Interactive SQL query console & tables
    │   ├── EmailCalendarScanner.tsx       # Gmail inbox scanner & incident trigger
    │   ├── DocumentSpreadsheetViewer.tsx  # XLSX spreadsheet & PDF viewer
    │   ├── ConventionalChatbot.tsx        # Grounded AI Copilot assistant
    │   ├── ApprovalModal.tsx              # Human-in-the-loop sign-off modal
    │   ├── CreateWorkflowModal.tsx        # Custom workflow initiator
    │   ├── Header.tsx                     # Top navigation, search, and user profile
    │   └── Sidebar.tsx                    # Main navigation sidebar with badges
    ├── db/
    │   └── databaseService.ts  # In-memory relational database & query engine
    ├── types/
    │   └── workflow.ts         # TypeScript interfaces (Workflow, Meeting, Step, etc.)
    └── data/
        └── mockData.ts         # Seed data (emails, workflows, documents, ledger)
```

---

## 🛡️ Enterprise Governance & SOC2 Compliance

- **Immutable Audit Trail**: Every automated step, prompt evaluation, spreadsheet cell extraction, and manual approval is stamped with an actor, timestamp, severity, and payload.
- **Rule AP-10K Enforcement**: Strict programmatic gate halting wire execution on any transaction $\ge \$10,000$ until authorized by a credentialed executive.
- **Zero Mock Fallback**: Integrates real relational SQL schemas, live SMTP response headers, and bi-directional state synchronization.

---

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.
