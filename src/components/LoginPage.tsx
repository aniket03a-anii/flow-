/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Search, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  KeyRound, 
  Building2, 
  Users,
  AlertCircle,
  HelpCircle,
  Terminal
} from 'lucide-react';
import { AppUser } from '../types/workflow';

interface LoginPageProps {
  onLogin: (user: AppUser) => void;
}

export const DEMO_USERS: AppUser[] = [
  {
    id: 'user-john',
    name: 'John Doe',
    email: 'john.doe@takasho-enterprises.com',
    role: 'Finance & Operations Director',
    avatarInitials: 'JD',
    avatarBgColor: '#E5D7BE',
    approvalLimit: 10000
  },
  {
    id: 'user-sarah',
    name: 'Sarah Lin',
    email: 'sarah.cfo@takasho-enterprises.com',
    role: 'Chief Financial Officer (CFO)',
    avatarInitials: 'SL',
    avatarBgColor: '#FEF08A',
    approvalLimit: 250000
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    email: 'billing@vanguardindustrial.com',
    role: 'Vanguard Industrial Commercial Lead',
    avatarInitials: 'ER',
    avatarBgColor: '#E0E7FF',
    approvalLimit: 50000
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<AppUser>(DEMO_USERS[0]);
  const [email, setEmail] = useState<string>(DEMO_USERS[0].email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [twoFactorCode, setTwoFactorCode] = useState<string>('491028');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);

  const handleSelectDemoUser = (user: AppUser) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword('••••••••••••');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedUser);
    }, 600);
  };

  const handleGoogleSSO = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedUser);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#EFEFEA] text-[#111111] font-sans antialiased flex flex-col justify-center p-3 sm:p-6 lg:p-8">
      {/* Outer Card Framing matching flow.io aesthetic */}
      <div className="w-full max-w-[1240px] mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-[#DFDFD9] overflow-hidden flex flex-col lg:flex-row min-h-[760px]">
        {/* Left Side: Brand Narrative & Intelligence Architecture (Col 5) */}
        <div className="lg:w-5/12 bg-[#18181B] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Golden Glow Gradient in Background */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#FACC15]/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#EAB308]/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Brand Logo Header */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#111111] shadow-sm">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">flow.io</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15] animate-pulse"></span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-[#FACC15] border border-white/10 inline-block">
                Enterprise Business Automation
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Autonomous workflow intelligence for real operations.
              </h1>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                Connect your spreadsheets, Gmail, and ERP tables into self-healing, multi-step pipelines with automated policy enforcement and human sign-off gates.
              </p>
            </div>

            {/* 4 Architectural Highlights */}
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-lg bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Multi-Source Information Gathering</h4>
                  <p className="text-[11px] text-[#A1A1AA]">Cross-references Accounts Aging XLSX, Gmail notices, and PDF contracts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-lg bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dynamic Re-Planning & Self-Healing</h4>
                  <p className="text-[11px] text-[#A1A1AA]">Adapts to condition changes and missing information without pipeline stall.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-lg bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Human Approval Gate (Policy AP-10K)</h4>
                  <p className="text-[11px] text-[#A1A1AA]">Escalates obligations exceeding $10,000 for supervisor authorization.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Certifications Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-[#71717A] relative z-10 font-mono">
            <span className="flex items-center gap-1.5 text-[#A1A1AA]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 Type II Certified
            </span>
            <span>256-bit AES SSO</span>
          </div>
        </div>

        {/* Right Side: Interactive Login Console & Role Presets (Col 7) */}
        <div className="lg:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-[#FBFBFA]">
          <div className="max-w-md mx-auto w-full space-y-6">
            {/* Top Welcome Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#888886] uppercase tracking-wider">
                  Authentication Console
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#FEF9C3] text-[#713F12] px-2 py-0.5 rounded-full border border-[#FDE047]">
                  Takasho SSO Active
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">
                Sign in to your workspace
              </h2>
              <p className="text-xs text-[#666664] mt-1">
                Select a verified corporate role or enter your credentials below
              </p>
            </div>

            {/* Quick-Select Demo Personas */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block">
                Quick Demo Personas (1-Click Switch):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_USERS.map((u) => {
                  const isSelected = selectedUser.id === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectDemoUser(u)}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#111111] bg-white ring-2 ring-[#111111]/15 shadow-xs'
                          : 'border-[#ECECE6] bg-[#FAFAF8] hover:bg-white text-[#666664]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-[#111111] border border-black/10 shrink-0"
                          style={{ backgroundColor: u.avatarBgColor }}
                        >
                          {u.avatarInitials}
                        </div>
                        <span className="text-xs font-bold text-[#111111] truncate">{u.name}</span>
                      </div>
                      <p className="text-[10px] text-[#888886] truncate">{u.role.split('(')[0]}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Google Workspace Enterprise SSO Button */}
            <button
              type="button"
              onClick={handleGoogleSSO}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-2xl bg-white border border-[#DFDFD9] hover:bg-[#F9F9F7] text-[#111111] font-bold text-xs flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Workspace (Takasho SSO)</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#ECECE6] w-full"></div>
              <span className="bg-[#FBFBFA] px-3 text-[10px] font-bold text-[#888886] uppercase tracking-wider relative">
                or sign in with password
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888886]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DFDFD9] text-xs font-mono text-[#111111] focus:ring-2 focus:ring-[#111111] focus:outline-none"
                    placeholder="name@takasho-enterprises.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#111111]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] font-semibold text-[#888886] hover:text-[#111111] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888886]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#DFDFD9] text-xs font-mono text-[#111111] focus:ring-2 focus:ring-[#111111] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888886] hover:text-[#111111]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2FA Toggle / Simulator */}
              <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#111111] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requires2FA}
                      onChange={(e) => setRequires2FA(e.target.checked)}
                      className="rounded text-[#111111] w-4 h-4"
                    />
                    <span>Require 2FA Security Token</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#888886]">TOTP</span>
                </div>

                {requires2FA && (
                  <div className="pt-2 border-t border-[#ECECE6]">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#CA8A04]" />
                      <input
                        type="text"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        placeholder="6-digit token e.g. 491028"
                        className="w-full p-2 rounded-lg bg-white border border-[#ECECE6] text-xs font-mono font-bold tracking-widest text-[#111111]"
                        maxLength={6}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#666664] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#111111] w-4 h-4"
                  />
                  <span>Keep session authenticated for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#111111] text-white hover:bg-black font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-[#FACC15] rounded-full animate-spin"></span>
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as {selectedUser.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#FACC15]" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Help & Terms */}
          <div className="pt-6 border-t border-[#ECECE6] text-center text-xs text-[#888886] max-w-md mx-auto w-full">
            <p>
              Protected by enterprise OAuth 2.0 and Google Workspace directory integration.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E2DC] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECECE6]">
              <div className="flex items-center gap-2 font-extrabold text-sm text-[#111111]">
                <HelpCircle className="w-4 h-4 text-[#CA8A04]" />
                <span>Reset Corporate Access</span>
              </div>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                }}
                className="w-7 h-7 rounded-full bg-[#F4F4F0] flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {resetEmailSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-800">Password Reset Transmitted</h4>
                <p className="text-[11px] text-emerald-700">
                  A cryptographic reset link has been dispatched to <strong>{email}</strong> via Google Workspace relay.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-[#666664]">
                  Enter your verified organization email address. We will dispatch an automated SSO password recovery token.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setResetEmailSent(true)}
                  className="w-full py-2.5 rounded-xl bg-[#111111] text-white hover:bg-black font-bold text-xs"
                >
                  Dispatch Reset Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
