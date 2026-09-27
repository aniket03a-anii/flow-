import React, { useState } from 'react';
import { IntegrationAccount, AppUser } from '../types/workflow';
import { 
  Sliders, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  FileSpreadsheet, 
  Database, 
  Check, 
  Lock, 
  Sparkles,
  RefreshCw,
  Cpu,
  UserCheck,
  LogOut,
  KeyRound
} from 'lucide-react';

interface SettingsViewProps {
  integrations: IntegrationAccount[];
  onToggleIntegration: (serviceId: string) => void;
  approvalCeiling: number;
  onUpdateApprovalCeiling: (val: number) => void;
  currentUser?: AppUser;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  integrations,
  onToggleIntegration,
  approvalCeiling,
  onUpdateApprovalCeiling,
  currentUser,
  onLogout
}) => {
  const [ceilingInput, setCeilingInput] = useState(approvalCeiling.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePolicy = () => {
    const val = parseFloat(ceilingInput) || 10000;
    onUpdateApprovalCeiling(val);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
          System Settings & Enterprise Controls
        </h1>
        <p className="text-xs text-[#888886] mt-0.5">
          Configure autonomous gates, escalation rules, and connected external systems
        </p>
      </div>

      {/* Active User Session & Authentication Card */}
      {currentUser && (
        <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm text-[#523C1E] border border-black/10"
                style={{ backgroundColor: currentUser.avatarBgColor }}
              >
                {currentUser.avatarInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#111111]">{currentUser.name}</h3>
                  <span className="text-[10px] font-bold bg-[#FEF08A] text-[#713F12] px-2 py-0.5 rounded-full">
                    {currentUser.role.split('(')[0]}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#888886]">{currentUser.email}</p>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Sign Out</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6]">
              <span className="text-[10px] font-bold text-[#888886] uppercase block">Approval Authorization</span>
              <span className="text-sm font-extrabold font-mono text-[#111111]">
                ${currentUser.approvalLimit.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6]">
              <span className="text-[10px] font-bold text-[#888886] uppercase block">SSO Directory</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Takasho Google Workspace
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6]">
              <span className="text-[10px] font-bold text-[#888886] uppercase block">Security Method</span>
              <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5 mt-0.5">
                <KeyRound className="w-3.5 h-3.5 text-[#CA8A04]" />
                OAuth 2.0 + TOTP 2FA
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Policy Governance Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF08A] text-[#854D0E] flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 text-[#CA8A04]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111111]">
              Human-in-the-Loop Escalation Rules
            </h3>
            <p className="text-xs text-[#888886]">
              Set financial thresholds above which automated execution must pause for executive approval
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#111111] block">
              Automated Disbursement Ceiling ($)
            </span>
            <span className="text-[11px] text-[#777775]">
              Transactions exceeding this amount trigger a supervisor review gate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={ceilingInput}
              onChange={(e) => setCeilingInput(e.target.value)}
              className="w-32 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-[#ECECE6] focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
            <button
              onClick={handleSavePolicy}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black transition-colors"
            >
              {savedSuccess ? 'Saved ✓' : 'Save Policy'}
            </button>
          </div>
        </div>
      </div>

      {/* Connected Workspace Accounts Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-[#111111]">
          Connected Data Integrations
        </h3>
        <p className="text-xs text-[#888886]">
          Real-time webhook listeners & OAuth scopes configured for Takasho Enterprises
        </p>

        <div className="space-y-3 pt-2">
          {integrations.map((account) => (
            <div
              key={account.id}
              className="p-4 rounded-2xl border border-[#ECECE6] bg-[#FAFAF8] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#ECECE6] flex items-center justify-center font-bold">
                  {account.service === 'gmail' && <Mail className="w-4 h-4 text-rose-500" />}
                  {account.service === 'calendar' && <Calendar className="w-4 h-4 text-blue-500" />}
                  {account.service === 'sheets' && <FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
                  {account.service === 'quickbooks' && <Database className="w-4 h-4 text-indigo-500" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">{account.name}</h4>
                  <p className="text-[11px] text-[#888886]">{account.accountEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {account.status.toUpperCase()}
                </span>
                <button
                  onClick={() => onToggleIntegration(account.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#666664] hover:bg-[#ECECE6] transition-colors"
                >
                  Sync Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Model Intelligence Config */}
      <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111111]">
              Autonomous Reasoning Model
            </h3>
            <p className="text-xs text-[#888886]">
              Powered by Google Gemini 2.5 Flash for high-speed multi-step inference & dynamic re-planning
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
          <p className="font-semibold mb-1">Active Capabilities:</p>
          <ul className="list-disc list-inside space-y-1 text-purple-800">
            <li>Dynamic re-planning upon missing invoice fields or counterparty dispute flags</li>
            <li>Spreadsheet range computation (<code className="font-mono bg-white px-1 py-0.5 rounded text-purple-900">B4:F18</code>) and PO variance calculation</li>
            <li>Outbound executive email drafting with customized settlement proposals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
