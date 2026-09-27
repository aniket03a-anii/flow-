import React, { useState } from 'react';
import { 
  EmailMessage, 
  CalendarEventItem, 
  IntegrationAccount,
  OutgoingIncidentEmail
} from '../types/workflow';
import { 
  Mail, 
  Calendar, 
  Zap, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Sliders,
  DollarSign,
  Send,
  ShieldAlert,
  CornerDownLeft,
  Check,
  Radio
} from 'lucide-react';

interface EmailCalendarScannerProps {
  emails: EmailMessage[];
  calendarEvents: CalendarEventItem[];
  integrations: IntegrationAccount[];
  outgoingIncidentEmails?: OutgoingIncidentEmail[];
  onTriggerScan: () => void;
  isScanning: boolean;
  onSimulateInboundEmail: (customEmail?: Partial<EmailMessage>) => void;
  onCreateWorkflowFromEmail: (email: EmailMessage) => void;
  onToggleIntegration: (serviceId: string) => void;
  onOpenOutgoingIncidentModal?: () => void;
  onSimulateCounterpartyReply?: (outgoingEmail: OutgoingIncidentEmail) => void;
  onSelectWorkflow?: (workflowId: string) => void;
}

export const EmailCalendarScanner: React.FC<EmailCalendarScannerProps> = ({
  emails,
  calendarEvents,
  integrations,
  outgoingIncidentEmails = [],
  onTriggerScan,
  isScanning,
  onSimulateInboundEmail,
  onCreateWorkflowFromEmail,
  onToggleIntegration,
  onOpenOutgoingIncidentModal,
  onSimulateCounterpartyReply,
  onSelectWorkflow
}) => {
  const [activeTab, setActiveTab] = useState<'gmail' | 'outgoing' | 'calendar' | 'accounts'>('gmail');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(emails[0] || null);
  const [selectedOutgoing, setSelectedOutgoing] = useState<OutgoingIncidentEmail | null>(outgoingIncidentEmails[0] || null);

  const filteredEmails = emails.filter(
    (e) =>
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.detectedKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredOutgoing = outgoingIncidentEmails.filter(
    (o) =>
      o.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.incidentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Email & Incident Intelligence
          </h1>
          <p className="text-xs text-[#888886] mt-0.5">
            Inbound email keyword scanning, automated outgoing incident simulation, and SLA milestone routing
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenOutgoingIncidentModal && (
            <button
              onClick={onOpenOutgoingIncidentModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Simulate Outgoing Incident</span>
            </button>
          )}

          <button
            onClick={() => onSimulateInboundEmail()}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F4F4F0] text-[#111111] hover:bg-[#EBEBE6] border border-[#ECECE6] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Incoming Email</span>
          </button>

          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FACC15] text-[#111111] hover:bg-[#EAB308] shadow-xs flex items-center gap-1.5"
          >
            <Zap className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Inbound'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ECECE6] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('gmail')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'gmail'
              ? 'bg-[#18181B] text-white shadow-xs'
              : 'text-[#666664] hover:text-[#111111] hover:bg-[#F4F4F0]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Inbound Gmail Scanner ({emails.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('outgoing');
            if (outgoingIncidentEmails.length > 0 && !selectedOutgoing) {
              setSelectedOutgoing(outgoingIncidentEmails[0]);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'outgoing'
              ? 'bg-[#18181B] text-white shadow-xs'
              : 'text-[#666664] hover:text-[#111111] hover:bg-[#F4F4F0]'
          }`}
        >
          <Send className="w-4 h-4 text-[#FACC15]" />
          <span>Outgoing Incidents Outbox ({outgoingIncidentEmails.length})</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'calendar'
              ? 'bg-[#18181B] text-white shadow-xs'
              : 'text-[#666664] hover:text-[#111111] hover:bg-[#F4F4F0]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Google Calendar Events ({calendarEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'accounts'
              ? 'bg-[#18181B] text-white shadow-xs'
              : 'text-[#666664] hover:text-[#111111] hover:bg-[#F4F4F0]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Connected Accounts & Permissions</span>
        </button>
      </div>

      {/* Tab 1: Inbound Gmail Scanner */}
      {activeTab === 'gmail' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Email List (Left Col 5) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9E9C]" />
              <input
                type="text"
                placeholder="Search subject, sender, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white border border-[#ECECE6] focus:outline-none focus:ring-2 focus:ring-[#111111]"
              />
            </div>

            <div className="space-y-2.5">
              {filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#111111] bg-white ring-2 ring-[#111111]/10 shadow-xs'
                        : 'border-[#ECECE6] bg-white hover:bg-[#FAFAF8]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#888886] mb-1">
                      <span className="font-bold text-[#111111] truncate">{email.senderName}</span>
                      <span>{email.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#111111] line-clamp-1 mb-1">
                      {email.subject}
                    </h4>

                    <p className="text-[11px] text-[#777775] line-clamp-2 mb-2.5">
                      {email.snippet}
                    </p>

                    {/* Detected Keyword Badges */}
                    <div className="flex flex-wrap gap-1">
                      {email.detectedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#FEF08A] text-[#713F12]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email Preview & Auto-Workflow Launch (Right Col 7) */}
          <div className="lg:col-span-7">
            {selectedEmail ? (
              <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#F4F4F0]">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#111111]">
                      {selectedEmail.subject}
                    </h3>
                    <div className="text-xs text-[#888886] mt-1 space-y-0.5">
                      <p>
                        From: <span className="font-semibold text-[#111111]">{selectedEmail.from}</span>
                      </p>
                      <p>Received: {selectedEmail.date}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onCreateWorkflowFromEmail(selectedEmail)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FACC15] text-[#111111] hover:bg-[#EAB308] shadow-xs flex items-center gap-2 self-start"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Create Workflow</span>
                  </button>
                </div>

                {/* Extracted Intelligence Pill Box */}
                <div className="p-4 rounded-2xl bg-[#F9F9F7] border border-[#ECECE6] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block mb-1">
                      Extracted Financial Obligation
                    </span>
                    <span className="text-sm font-extrabold text-[#111111] flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      {selectedEmail.extractedAmount
                        ? `$${selectedEmail.extractedAmount.toLocaleString()}`
                        : 'Under Review'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block mb-1">
                      Detected Action Deadline
                    </span>
                    <span className="text-sm font-extrabold text-rose-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedEmail.extractedDeadline || 'Within 48 hours'}
                    </span>
                  </div>
                </div>

                {/* Email Body Content */}
                <div>
                  <h4 className="text-xs font-bold text-[#888886] uppercase tracking-wider mb-2">
                    Message Body
                  </h4>
                  <div className="text-xs text-[#333332] whitespace-pre-line p-4 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6] leading-relaxed">
                    {selectedEmail.body}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold">Autonomous Rule Applied:</span> Keywords{' '}
                    <span className="font-semibold underline">
                      {selectedEmail.detectedKeywords.join(', ')}
                    </span>{' '}
                    are matched against active contracts and aging spreadsheets.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-[#ECECE6] text-center text-[#888886]">
                Select an email from the left to inspect extracted metadata
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Outgoing Incidents Outbox */}
      {activeTab === 'outgoing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Outgoing List (Left Col 5) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-[#888886] uppercase tracking-wider">
                Dispatched Incidents ({filteredOutgoing.length})
              </span>
              {onOpenOutgoingIncidentModal && (
                <button
                  onClick={onOpenOutgoingIncidentModal}
                  className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>New Simulation</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {filteredOutgoing.map((out) => {
                const isSelected = selectedOutgoing?.id === out.id;
                const isP1 = out.severity.includes('P1');
                return (
                  <div
                    key={out.id}
                    onClick={() => setSelectedOutgoing(out)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#111111] bg-white ring-2 ring-[#111111]/10 shadow-xs'
                        : 'border-[#ECECE6] bg-white hover:bg-[#FAFAF8]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        isP1 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {out.severity}
                      </span>
                      <span className="font-mono text-[10px] text-[#888886] font-bold">{out.incidentId}</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#111111] line-clamp-1 mb-1">
                      {out.subject}
                    </h4>

                    <p className="text-[11px] text-[#777775] line-clamp-2 mb-2 font-mono">
                      To: {out.to}
                    </p>

                    <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#F4F4F0] text-[#888886]">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Check className="w-3 h-3 stroke-[3]" /> SMTP 250 OK
                      </span>
                      <span>{out.timestamp.slice(11, 19)}</span>
                    </div>
                  </div>
                );
              })}

              {filteredOutgoing.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#ECECE6] text-xs text-[#888886]">
                  No outgoing incident emails found. Click "Simulate Outgoing Incident" to dispatch one!
                </div>
              )}
            </div>
          </div>

          {/* Outgoing Incident Inspector (Right Col 7) */}
          <div className="lg:col-span-7">
            {selectedOutgoing ? (
              <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#F4F4F0]">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        selectedOutgoing.severity.includes('P1') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedOutgoing.severity}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#CA8A04] bg-[#FEF9C3] px-2 py-0.5 rounded-full">
                        {selectedOutgoing.incidentId}
                      </span>
                      <span className="text-[11px] text-[#888886] font-mono">
                        {selectedOutgoing.timestamp}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#111111]">
                      {selectedOutgoing.subject}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {onSimulateCounterpartyReply && (
                      <button
                        onClick={() => onSimulateCounterpartyReply(selectedOutgoing)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FACC15] text-[#111111] hover:bg-[#EAB308] shadow-xs flex items-center gap-1.5 transition-all"
                        title="Simulate vendor sending an inbound email reply to this incident"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5" />
                        <span>Simulate Counterparty Reply</span>
                      </button>
                    )}

                    {selectedOutgoing.linkedWorkflowId && onSelectWorkflow && (
                      <button
                        onClick={() => onSelectWorkflow(selectedOutgoing.linkedWorkflowId!)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F4F4F0] text-[#111111] hover:bg-[#ECECE6] border border-[#E2E2DC] flex items-center gap-1"
                      >
                        <span>Open Linked Workflow</span>
                        <ArrowRight className="w-3 h-3 text-[#111111]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Transmission Envelope Details */}
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6] space-y-2 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#888886] block">From Sender:</span>
                      <span className="font-bold text-[#111111]">{selectedOutgoing.from}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#888886] block">Primary Recipient:</span>
                      <span className="font-bold text-[#111111]">{selectedOutgoing.to}</span>
                    </div>
                  </div>

                  {selectedOutgoing.cc && selectedOutgoing.cc.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold text-[#888886] block">CC Stakeholders:</span>
                      <span className="text-[#444443]">{selectedOutgoing.cc.join(', ')}</span>
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-[#888886] block">Enforced Policy:</span>
                    <span className="text-[#854D0E] font-sans font-medium">{selectedOutgoing.policyTriggered}</span>
                  </div>
                </div>

                {/* Message Body Content */}
                <div>
                  <h4 className="text-xs font-bold text-[#888886] uppercase tracking-wider mb-2">
                    Transmitted Incident Notice Body
                  </h4>
                  <div className="text-xs text-[#27272A] whitespace-pre-line p-4 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6] leading-relaxed font-mono">
                    {selectedOutgoing.body}
                  </div>
                </div>

                {/* SMTP Relay Logs Card */}
                <div className="p-3.5 rounded-2xl bg-[#18181B] text-[#E4E4E7] font-mono text-[11px] space-y-1 border border-black/10">
                  <div className="flex items-center justify-between text-[#A1A1AA] pb-1 border-b border-white/10">
                    <span>SMTP Handshake Protocol Log</span>
                    <span className="text-emerald-400 font-bold">250 OK Delivered</span>
                  </div>
                  <p className="text-emerald-300">
                    {selectedOutgoing.smtpLog || '250 2.1.5 Recipient OK. Message accepted for delivery via Google Workspace Relay'}
                  </p>
                  <p className="text-[#71717A] text-[10px]">
                    Dispatched by: {selectedOutgoing.dispatchedBy} • TLS 1.3 Cipher Suite ECDHE-RSA-AES128-GCM-SHA256
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-[#ECECE6] text-center text-[#888886]">
                Select an outgoing incident email from the left to view delivery logs and notice details
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Calendar Events */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl p-7 border border-[#ECECE6] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#111111]">Google Calendar Intelligence</h3>
              <p className="text-xs text-[#888886]">
                Parsed meeting schedules that dictate payment cutoffs, executive reviews, and SLA windows
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Synced with Google Calendar API
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendarEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-2xl border border-[#ECECE6] bg-[#FAFAF8] hover:bg-white hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#854D0E] bg-[#FEF08A] px-2.5 py-0.5 rounded-full">
                    {evt.dateTime}
                  </span>
                  <span className="text-[11px] font-semibold text-[#888886]">{evt.status.toUpperCase()}</span>
                </div>

                <h4 className="text-sm font-bold text-[#111111]">{evt.title}</h4>
                <p className="text-xs text-[#666664] leading-relaxed">{evt.description}</p>

                <div className="pt-3 border-t border-[#ECECE6] text-[11px] text-[#444443]">
                  <span className="font-bold text-[#111111]">Workflow Impact:</span> {evt.relatedContext}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Connected Accounts */}
      {activeTab === 'accounts' && (
        <div className="bg-white rounded-3xl p-7 border border-[#ECECE6] shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-[#111111]">Connected Accounts & Permissions</h3>
            <p className="text-xs text-[#888886]">
              Manage OAuth scopes and external business connectors with enterprise-grade token security
            </p>
          </div>

          <div className="space-y-4">
            {integrations.map((account) => (
              <div
                key={account.id}
                className="p-5 rounded-2xl border border-[#ECECE6] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#ECECE6] flex items-center justify-center font-bold text-xs shadow-2xs">
                    {account.service === 'gmail' ? <Mail className="w-5 h-5 text-rose-500" /> : <Calendar className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111111]">{account.name}</h4>
                    <p className="text-xs text-[#888886]">{account.accountEmail} • Synced {account.lastSync}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {account.permissions.map((p, i) => (
                        <span key={i} className="text-[9px] font-mono bg-white px-2 py-0.5 rounded border border-[#ECECE6] text-[#555554]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Connected
                  </span>
                  <button
                    onClick={() => onToggleIntegration(account.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#888886] hover:text-[#111111] hover:bg-[#ECECE6] transition-colors"
                  >
                    Reconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

