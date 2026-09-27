import React from 'react';
import { 
  Home, 
  Flame, 
  MessageSquareText,
  Mail, 
  FileText, 
  CheckSquare, 
  Sliders, 
  HelpCircle, 
  LogOut, 
  Search,
  Sparkles,
  Bot,
  CalendarDays,
  Database,
  Users
} from 'lucide-react';

export type NavTab = 'overview' | 'workflows' | 'meetings' | 'calendar' | 'database' | 'chatbot' | 'scanner' | 'docs' | 'audit' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingApprovalsCount: number;
  activeWorkflowsCount: number;
  upcomingDeadlinesCount?: number;
  remainingMeetingsCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount,
  activeWorkflowsCount,
  upcomingDeadlinesCount = 3,
  remainingMeetingsCount = 3,
  onLogout
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Overview',
      icon: Home,
      badge: null
    },
    {
      id: 'workflows' as NavTab,
      label: 'Workflows & Analysis',
      icon: Flame,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} req` : `${activeWorkflowsCount}`
    },
    {
      id: 'meetings' as NavTab,
      label: 'Meetings & Simulation',
      icon: Users,
      badge: remainingMeetingsCount > 0 ? `${remainingMeetingsCount} remaining` : 'Done'
    },
    {
      id: 'calendar' as NavTab,
      label: 'Calendar & Cutoffs',
      icon: CalendarDays,
      badge: `${upcomingDeadlinesCount} due`
    },
    {
      id: 'database' as NavTab,
      label: 'SQL Database & ERP',
      icon: Database,
      badge: '5 Tables'
    },
    {
      id: 'chatbot' as NavTab,
      label: 'AI Copilot / Chat',
      icon: Bot,
      badge: 'Grounded'
    },
    {
      id: 'scanner' as NavTab,
      label: 'Gmail & Scanner',
      icon: Mail,
      badge: 'Live'
    },
    {
      id: 'docs' as NavTab,
      label: 'Documents & Sheets',
      icon: FileText,
      badge: 'XLSX/PDF'
    },
    {
      id: 'audit' as NavTab,
      label: 'Audit Trail',
      icon: CheckSquare,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#ECECE6] flex flex-col justify-between p-6 select-none shrink-0 min-h-screen">
      <div>
        {/* Brand Logo & Search Pill */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white shadow-sm">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-2xl tracking-tight text-[#111111]">flow.io</span>
            <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#F4F4F0] text-[#111111] font-semibold shadow-xs'
                    : 'text-[#828280] hover:text-[#111111] hover:bg-[#F9F9F7]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-[#111111] stroke-[2.2]' : 'text-[#9E9E9C] stroke-[1.8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.id === 'workflows' && pendingApprovalsCount > 0
                        ? 'bg-[#FACC15] text-[#111111] animate-pulse'
                        : item.id === 'meetings' && remainingMeetingsCount > 0
                        ? 'bg-[#FEF08A] text-[#713F12] border border-[#FDE047] font-extrabold'
                        : item.id === 'chatbot'
                        ? 'bg-[#FEF08A] text-[#713F12]'
                        : isActive
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#ECECE6] text-[#666664]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Small Assistant Status Banner */}
        <div className="mt-8 p-3.5 bg-gradient-to-br from-[#FEF9C3] to-[#FEF08A] rounded-2xl border border-[#FDE047]/60">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-[#854D0E]" />
            <span className="text-xs font-bold text-[#713F12]">Flow Orchestrator</span>
          </div>
          <p className="text-[11px] text-[#854D0E] leading-relaxed">
            Multi-step dynamic pipelines with Gmail, Excel, PDF contracts & human sign-off.
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-[#ECECE6] space-y-1">
        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            currentTab === 'settings'
              ? 'bg-[#F4F4F0] text-[#111111] font-semibold'
              : 'text-[#828280] hover:text-[#111111] hover:bg-[#F9F9F7]'
          }`}
        >
          <Sliders className="w-4 h-4 stroke-[1.8]" />
          <span>Settings</span>
        </button>

        <a
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            alert('flow.io Intelligent Business Workflow Automation\n\nFeatures:\n• Business Objective Understanding\n• Multi-Source Information Gathering (Gmail, XLSX, PDF, ERP)\n• Multi-Step Planning & Autonomous Execution\n• Dynamic Re-Planning on Condition Change\n• Handling Missing Info / Failed Tasks\n• Human-in-the-Loop Sign-off Gate\n• Comprehensive Traceability Audit Trail\n• Grounded Real-Data Chatbot');
          }}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#828280] hover:text-[#111111] hover:bg-[#F9F9F7] transition-colors"
        >
          <HelpCircle className="w-4 h-4 stroke-[1.8]" />
          <span>Help & Specs</span>
        </a>

        <button
          onClick={() => {
            if (confirm('Reset workspace session to initial state?')) {
              window.location.reload();
            }
          }}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#828280] hover:text-[#111111] hover:bg-[#F9F9F7] transition-colors"
        >
          <HelpCircle className="w-4 h-4 stroke-[1.8]" />
          <span>Reset Session</span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#828280] hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 stroke-[1.8]" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
