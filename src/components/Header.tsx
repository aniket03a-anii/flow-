import React, { useState } from 'react';
import { ChevronDown, Plus, Cpu, Bell, Search, Zap, CheckCircle2, LogOut, UserCheck } from 'lucide-react';
import { AppUser } from '../types/workflow';

interface HeaderProps {
  onOpenNewWorkflowModal: () => void;
  pendingApprovalsCount: number;
  onOpenPendingApprovals: () => void;
  onQuickScan: () => void;
  isScanning: boolean;
  currentUser?: AppUser;
  onLogout?: () => void;
  onSwitchUser?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewWorkflowModal,
  pendingApprovalsCount,
  onOpenPendingApprovals,
  onQuickScan,
  isScanning,
  currentUser = {
    id: 'user-john',
    name: 'John Doe',
    email: 'john.doe@takasho-enterprises.com',
    role: 'Finance & Operations Director',
    avatarInitials: 'JD',
    avatarBgColor: '#E5D7BE',
    approvalLimit: 10000
  },
  onLogout,
  onSwitchUser
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState('TAKASHO');

  const workspaces = ['TAKASHO', 'Apex Global AP', 'Vanguard Operations'];

  return (
    <header className="h-20 bg-white border-b border-[#ECECE6] px-8 flex items-center justify-between shrink-0 select-none">
      {/* Workspace Selector Pill (Left) */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#ECECE6] bg-[#FAFAF8] hover:bg-[#F4F4F0] text-sm font-semibold text-[#111111] transition-all shadow-2xs"
          >
            <div className="w-6 h-6 rounded-lg bg-[#FEF08A] text-[#854D0E] flex items-center justify-center font-bold text-xs shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-[#A16207]" />
            </div>
            <span className="tracking-wide text-xs uppercase">{currentWorkspace}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#888886]" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#ECECE6] py-1.5 z-50">
              <div className="px-3 py-1 text-[11px] font-bold text-[#888886] uppercase tracking-wider">
                Select Workspace
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setCurrentWorkspace(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F9F9F7] ${
                    ws === currentWorkspace ? 'font-bold text-[#111111]' : 'text-[#555554]'
                  }`}
                >
                  <span>{ws}</span>
                  {ws === currentWorkspace && <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* (+) Add Workspace / Quick Action Button */}
        <button
          onClick={onOpenNewWorkflowModal}
          title="Create New Workflow"
          className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-[#2B2B2B] active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Middle Status / Quick Triggers */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={onQuickScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FEF9C3] text-[#854D0E] border border-[#FDE047] hover:bg-[#FEF08A] active:scale-95 transition-all"
        >
          <Zap className={`w-3.5 h-3.5 text-[#CA8A04] ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Mailbox & Sheets...' : 'Scan Inbound Sources'}</span>
        </button>

        {pendingApprovalsCount > 0 && (
          <button
            onClick={onOpenPendingApprovals}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#FACC15] text-[#111111] animate-bounce shadow-xs hover:bg-[#EAB308]"
          >
            <span>{pendingApprovalsCount} Action{pendingApprovalsCount > 1 ? 's' : ''} Require Approval</span>
          </button>
        )}
      </div>

      {/* Right User Profile Pill */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          onClick={onOpenPendingApprovals}
          className="relative p-2 rounded-xl text-[#777775] hover:text-[#111111] hover:bg-[#F4F4F0] transition-colors"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-white"></span>
          )}
        </button>

        {/* Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-[#ECECE6] hover:bg-[#F9F9F7] transition-colors"
          >
            {/* Avatar circle matching mockup */}
            <div 
              className="w-7 h-7 rounded-full overflow-hidden border border-[#D4C5A9] flex items-center justify-center font-bold text-xs text-[#523C1E]"
              style={{ backgroundColor: currentUser.avatarBgColor }}
            >
              {currentUser.avatarInitials}
            </div>
            <span className="text-xs font-bold text-[#111111]">{currentUser.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#888886]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#ECECE6] p-2 z-50">
              <div className="px-3 py-2.5 border-b border-[#ECECE6]">
                <p className="text-xs font-bold text-[#111111]">{currentUser.name}</p>
                <p className="text-[11px] text-[#888886] truncate font-mono">{currentUser.email}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] font-semibold bg-[#FEF08A] text-[#713F12] px-2 py-0.5 rounded-full">
                    {currentUser.role.split('(')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-[#888886]">
                    Limit: ${currentUser.approvalLimit.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="py-1">
                {onSwitchUser && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSwitchUser();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#444443] hover:bg-[#F4F4F0] rounded-lg flex items-center gap-2 font-medium"
                  >
                    <UserCheck className="w-4 h-4 text-[#CA8A04]" />
                    <span>Switch User / Persona</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

