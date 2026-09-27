import React, { useState } from 'react';
import { 
  HelpCircle, 
  User, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  Flame, 
  FileSpreadsheet, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Eye,
  Bot,
  ShieldAlert,
  Sparkles,
  Layers,
  CornerDownRight,
  Database,
  CheckSquare
} from 'lucide-react';
import { Workflow } from '../types/workflow';

interface OverviewDashboardProps {
  workflows: Workflow[];
  onSelectWorkflow: (workflowId: string) => void;
  onOpenApprovalModal: (workflow: Workflow) => void;
  onNavigateToTab: (tab: any) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  workflows,
  onSelectWorkflow,
  onOpenApprovalModal,
  onNavigateToTab
}) => {
  const [timeFilter, setTimeFilter] = useState<'30 days' | '3 months' | '6 months' | '12 months'>('30 days');

  // Time filter metric calculations
  const totalVolumeDisplay = timeFilter === '30 days' ? '$142,865' : timeFilter === '3 months' ? '$486,200' : timeFilter === '6 months' ? '$1,024,500' : '$2,480,000';
  const replanCountDisplay = timeFilter === '30 days' ? '14' : timeFilter === '3 months' ? '42' : timeFilter === '6 months' ? '89' : '174';
  const savingsDisplay = timeFilter === '30 days' ? '$8,670' : timeFilter === '3 months' ? '$27,450' : timeFilter === '6 months' ? '$61,200' : '$142,800';

  // Multi-source information gathering distribution
  const ingestionSources = [
    { id: 1, name: 'Spreadsheets (XLSX/CSV)', pct: 38, color: '#FACC15', count: '8 sheets' },
    { id: 2, name: 'Inbound Gmail Scans', pct: 32, color: '#FDE047', count: '14 threads' },
    { id: 3, name: 'Legal Contracts (PDF/DOC)', pct: 18, color: '#111111', count: '6 documents' },
    { id: 4, name: 'ERP Ledgers & APIs', pct: 12, color: '#EAB308', count: 'QuickBooks' },
  ];

  // Workflow stages & health
  const workflowStages = [
    { id: 1, name: 'Auto-Executed Steps', pct: 55, color: '#111111', count: '34 steps' },
    { id: 2, name: 'Dynamic Re-Plans', pct: 25, color: '#FACC15', count: '14 events' },
    { id: 3, name: 'Human Escalation Gates', pct: 15, color: '#FDE047', count: '3 pending' },
    { id: 4, name: 'Active Inbound Triage', pct: 5, color: '#FEF08A', count: '1 queued' },
  ];

  const pendingApprovalWorkflows = workflows.filter(w => w.status === 'waiting_approval');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Time Filter Header - sleek color context & theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-[#A16207]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Workflow Intelligence</h1>
            <p className="text-xs text-[#888886]">Autonomous multi-step execution, dynamic re-planning, and cross-source verification</p>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F4F0] rounded-2xl border border-[#ECECE6]">
          {(['30 days', '3 months', '6 months', '12 months'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                timeFilter === period
                  ? 'bg-[#18181B] text-white shadow-xs font-bold'
                  : 'text-[#666664] hover:text-[#111111] hover:bg-white/60'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Statistics Grid - 1 Large Line Chart Card + 4 Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Financial Obligations & Workflow Execution Chart Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-7 border border-[#ECECE6] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#888886] tracking-wider uppercase">Obligations Processed & Reconciled</p>
                <h2 className="text-4xl font-extrabold text-[#111111] tracking-tight mt-1">
                  {totalVolumeDisplay}
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                +18.4% faster vs manual cycle
              </span>
            </div>

            {/* Interactive SVG Curve Chart */}
            <div className="mt-6 relative h-56 w-full">
              {/* Y-axis values */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[11px] font-medium text-[#A1A19E] select-none font-mono">
                <span>$150k</span>
                <span>$100k</span>
                <span>$75k</span>
                <span>$25k</span>
                <span>$0</span>
              </div>

              {/* Chart SVG */}
              <div className="ml-14 h-full relative">
                <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="flowYellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FDE047" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#FEF9C3" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal gridlines */}
                  <line x1="0" y1="5" x2="500" y2="5" stroke="#F4F4F0" strokeWidth="1" />
                  <line x1="0" y1="47" x2="500" y2="47" stroke="#F4F4F0" strokeWidth="1" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#F4F4F0" strokeWidth="1" />
                  <line x1="0" y1="132" x2="500" y2="132" stroke="#F4F4F0" strokeWidth="1" />
                  <line x1="0" y1="175" x2="500" y2="175" stroke="#ECECE6" strokeWidth="1" />

                  {/* Chart Area Fill */}
                  <path
                    d="M 0,140 Q 50,110 90,60 T 170,95 T 260,20 T 340,110 T 430,40 T 500,25 L 500,175 L 0,175 Z"
                    fill="url(#flowYellowGradient)"
                  />

                  {/* Golden Curve Line */}
                  <path
                    d="M 0,140 Q 50,110 90,60 T 170,95 T 260,20 T 340,110 T 430,40 T 500,25"
                    fill="none"
                    stroke="#EAB308"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Peak inflection dot */}
                  <circle cx="260" cy="20" r="5" fill="#111111" stroke="#FACC15" strokeWidth="3" />
                </svg>

                {/* X-axis Milestone Labels */}
                <div className="flex justify-between text-[11px] font-medium text-[#888886] mt-2 select-none">
                  <span>Aging Ingest</span>
                  <span>Gmail Match</span>
                  <span>Contract Re-Plan</span>
                  <span>Discrepancy Check</span>
                  <span>CFO Sign-off</span>
                  <span>Voucher Disbursed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4F4F0] flex items-center justify-between text-xs text-[#888886]">
            <span>Automated cross-check: <strong>Accounts_Aging_Q3.xlsx</strong> + <strong>Gmail</strong> + <strong>PDF MSA</strong></span>
            <button 
              onClick={() => onNavigateToTab('workflows')}
              className="font-bold text-[#111111] hover:underline flex items-center gap-1"
            >
              Open Step Visualizer <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: 4 Metric Cards (Black Card + 3 White Cards) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Black Card - Dynamic Re-plans Triggered */}
          <div className="bg-[#0E0E10] text-white rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF08A]/20 flex items-center justify-center text-[#FACC15]">
                <CornerDownRight className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#4ADE80]">
                <span>▲</span>
                <span>Self-Healed</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-3xl font-extrabold tracking-tight text-white">{replanCountDisplay}</h3>
              <p className="text-xs text-[#A1A1AA] font-medium mt-0.5">Dynamic Re-Plans</p>
            </div>

            <button 
              onClick={() => onNavigateToTab('workflows')}
              title="Workflows that dynamically re-planned when conditions changed (e.g. invoice variances or missing W-9s)"
              className="absolute bottom-5 right-5 text-[#71717A] hover:text-white transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: White Card - Discrepancy & Dispute Savings */}
          <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs flex flex-col justify-between relative">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-[#CA8A04]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span>▲</span>
                <span>Verified</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#111111]">{savingsDisplay}</h3>
              <p className="text-xs text-[#888886] font-medium mt-0.5">Contract Savings Discovered</p>
            </div>

            <button 
              title="Discrepancies identified between billed amount and contract discount clauses (e.g. 15% Vanguard volume discount)"
              className="absolute bottom-5 right-5 text-[#B0B0AE] hover:text-[#111111] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: White Card - Autonomous Success Rate */}
          <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs flex flex-col justify-between relative">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-[#CA8A04]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span>▲</span>
                <span>Zero Stalls</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#111111]">98.4%</h3>
              <p className="text-xs text-[#888886] font-medium mt-0.5">Task Self-Healing Rate</p>
            </div>

            <button 
              title="Percentage of multi-step tasks completing without manual data re-entry"
              className="absolute bottom-5 right-5 text-[#B0B0AE] hover:text-[#111111] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: White Card - Human Escalation Turnaround */}
          <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs flex flex-col justify-between relative">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-[#CA8A04]">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#CA8A04]">
                <span>⏱</span>
                <span>Gate AP-10K</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#111111]">00:04:12</h3>
              <p className="text-xs text-[#888886] font-medium mt-0.5">Avg. Approval Turnaround</p>
            </div>

            <button 
              title="Average time from supervisor notification to sign-off"
              className="absolute bottom-5 right-5 text-[#B0B0AE] hover:text-[#111111] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Information Gathering Sources & Workflow Stage Breakdown (Donut Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Donut Card: Information Gathering Sources */}
        <div className="bg-white rounded-3xl p-7 border border-[#ECECE6] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-[#111111]">Multi-Source Information Gathering</h3>
              <p className="text-xs text-[#888886]">Real-time data ingested across disconnected systems</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('docs')}
              className="text-xs font-bold text-[#111111] hover:underline"
            >
              View Sources →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Table breakdown */}
            <div className="sm:col-span-7">
              <div className="grid grid-cols-12 pb-2 text-[11px] font-bold text-[#A1A19E] uppercase tracking-wider border-b border-[#F4F4F0]">
                <span className="col-span-8">Source System</span>
                <span className="col-span-4 text-right">Share %</span>
              </div>
              <div className="divide-y divide-[#F9F9F7]">
                {ingestionSources.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 py-3 text-xs items-center hover:bg-[#FAFAF8] rounded-lg px-1 transition-colors"
                  >
                    <div className="col-span-8 flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-semibold text-[#888886]">{item.id}</span>
                      <span className="font-bold text-[#111111] truncate">{item.name}</span>
                    </div>
                    <div className="col-span-4 text-right font-extrabold text-[#111111]">
                      {item.pct}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Circular Gauge Graphic matching mockup aesthetic */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F4F4F0"
                    strokeWidth="10"
                  />
                  {/* Black segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#111111"
                    strokeWidth="10"
                    strokeDasharray="238.7"
                    strokeDashoffset="170"
                    strokeLinecap="round"
                  />
                  {/* Yellow primary arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#FACC15"
                    strokeWidth="10"
                    strokeDasharray="238.7"
                    strokeDashoffset="80"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="12" r="3" fill="#111111" />
                </svg>

                <div className="absolute text-center select-none">
                  <span className="text-2xl font-extrabold text-[#111111] block leading-none">
                    38%
                  </span>
                  <span className="text-[11px] font-semibold text-[#888886] mt-1 block">
                    Spreadsheets
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Donut Card: Workflow Stages & Health */}
        <div className="bg-white rounded-3xl p-7 border border-[#ECECE6] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-[#111111]">Execution Health & Dynamic Actions</h3>
              <p className="text-xs text-[#888886]">Stage distribution and autonomous interventions</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('audit')}
              className="text-xs font-bold text-[#111111] hover:underline"
            >
              Audit Trail →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Table breakdown */}
            <div className="sm:col-span-7">
              <div className="grid grid-cols-12 pb-2 text-[11px] font-bold text-[#A1A19E] uppercase tracking-wider border-b border-[#F4F4F0]">
                <span className="col-span-8">Pipeline Stage</span>
                <span className="col-span-4 text-right">Ratio %</span>
              </div>
              <div className="divide-y divide-[#F9F9F7]">
                {workflowStages.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 py-3 text-xs items-center hover:bg-[#FAFAF8] rounded-lg px-1 transition-colors"
                  >
                    <div className="col-span-8 flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-semibold text-[#888886]">{item.id}</span>
                      <span className="font-bold text-[#111111] truncate">{item.name}</span>
                    </div>
                    <div className="col-span-4 text-right font-extrabold text-[#111111]">
                      {item.pct}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Circular Gauge Graphic matching mockup aesthetic */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F4F4F0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#111111"
                    strokeWidth="10"
                    strokeDasharray="238.7"
                    strokeDashoffset="140"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#FACC15"
                    strokeWidth="10"
                    strokeDasharray="238.7"
                    strokeDashoffset="95"
                    strokeLinecap="round"
                  />
                  <circle cx="88" cy="50" r="3" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
                </svg>

                <div className="absolute text-center select-none">
                  <span className="text-2xl font-extrabold text-[#111111] block leading-none">
                    55%
                  </span>
                  <span className="text-[11px] font-semibold text-[#888886] mt-1 block">
                    Auto-Executed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Live Problem Statement Features Showcase Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#111111] via-[#1E1E24] to-[#111111] text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FACC15] text-[#111111]">
                End-to-End Problem Demonstration
              </span>
              <span className="text-xs text-[#A1A1AA]">Not a generic chatbot; an autonomous multi-step orchestrator</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Autonomous Business Workflow Engine with Dynamic Re-Planning
            </h3>
            <p className="text-xs text-[#D4D4D8] max-w-3xl leading-relaxed">
              Demonstrates <strong>business objective understanding</strong>, <strong>multi-source information gathering</strong> (Gmail, Excel cell ranges, PDF agreements), <strong>handling missing info/failed tasks</strong>, <strong>dynamic re-planning</strong> on contract discount verification, and <strong>human sign-off</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('calendar')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-1.5 border border-white/10"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => onNavigateToTab('database')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-1.5 border border-white/10"
            >
              <Database className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>SQL ERP</span>
            </button>
            <button
              onClick={() => onNavigateToTab('chatbot')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FEF08A] text-[#713F12] hover:bg-[#FDE047] transition-all flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-[#A16207]" />
              <span>Grounded Copilot</span>
            </button>
            <button
              onClick={() => onNavigateToTab('workflows')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#111111] hover:bg-gray-100 transition-all flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-[#FACC15]" />
              <span>Pipelines & Full Run</span>
            </button>
          </div>
        </div>

        {/* 8 Core Capabilities Checklist Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 text-[#E4E4E7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="truncate">1. Business Objective Understanding</span>
          </div>
          <div className="flex items-center gap-2 text-[#E4E4E7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="truncate">2. Multi-Source Ingestion</span>
          </div>
          <div className="flex items-center gap-2 text-[#E4E4E7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="truncate">3. Multi-Step Execution</span>
          </div>
          <div className="flex items-center gap-2 text-[#E4E4E7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="truncate">4. Missing Info Self-Healing</span>
          </div>
          <div className="flex items-center gap-2 text-[#E4E4E7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="truncate">5. Dynamic Re-Planning</span>
          </div>
          <div className="flex items-center gap-2 text-[#E4E4E7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="truncate">6. Human Approval & Escalation</span>
          </div>
          <div className="flex items-center gap-2 text-[#E4E4E7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="truncate">7. Traceability Audit Trail</span>
          </div>
          <div className="flex items-center gap-2 text-[#E4E4E7]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="truncate">8. Grounded Real-Data Chatbot</span>
          </div>
        </div>
      </div>

      {/* Row 4: Active Workflows Snapshot */}
      <div className="bg-white rounded-3xl p-7 border border-[#ECECE6] shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 fill-current text-[#CA8A04]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111111]">Active Autonomous Workflows</h3>
              <p className="text-xs text-[#888886]">Live multi-step pipelines currently executing across systems</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('workflows')}
            className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1.5"
          >
            <span>Open Visualizer</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflows.map((wf) => {
            const isWaiting = wf.status === 'waiting_approval';
            const isCompleted = wf.status === 'completed';

            return (
              <div
                key={wf.id}
                onClick={() => onSelectWorkflow(wf.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between ${
                  isWaiting
                    ? 'border-[#FACC15] bg-[#FEFCE8]'
                    : isCompleted
                    ? 'border-[#ECECE6] bg-[#FAFAF8]'
                    : 'border-[#E4E4DF] bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#111111] text-white">
                      {wf.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isWaiting
                          ? 'bg-[#FACC15] text-[#111111] animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isWaiting ? '⚠️ Needs Sign-Off' : isCompleted ? 'Completed' : 'Running Step ' + (wf.currentStepIndex + 1)}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#111111] line-clamp-1 mb-1">
                    {wf.title}
                  </h4>
                  <p className="text-xs text-[#666664] line-clamp-2 mb-3">
                    {wf.objective}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#777775]">
                    <span className="font-semibold text-[#111111]">
                      ${wf.associatedEntities.amount?.toLocaleString()}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[110px]">{wf.associatedEntities.vendorOrClient}</span>
                  </div>

                  {isWaiting ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenApprovalModal(wf);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#111111] text-white hover:bg-black transition-colors"
                    >
                      Review
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#888886] flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Inspect
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
