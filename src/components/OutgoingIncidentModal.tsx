/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  OutgoingIncidentEmail, 
  IncidentSeverity, 
  Workflow 
} from '../types/workflow';
import { 
  AlertTriangle, 
  Send, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Mail, 
  Cpu, 
  RefreshCw,
  Layers,
  Clock
} from 'lucide-react';

interface OutgoingIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (email: OutgoingIncidentEmail, createWorkflow: boolean) => void;
  workflows: Workflow[];
}

export const OutgoingIncidentModal: React.FC<OutgoingIncidentModalProps> = ({
  isOpen,
  onClose,
  onDispatch,
  workflows
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('preset-vanguard');
  const [incidentId, setIncidentId] = useState<string>(`INC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [severity, setSeverity] = useState<IncidentSeverity>('P1 - Critical');
  const [toEmail, setToEmail] = useState<string>('billing@vanguardindustrial.com');
  const [ccEmails, setCcEmails] = useState<string>('elena.rostova@vanguardindustrial.com, sarah.cfo@takasho-enterprises.com');
  const [subject, setSubject] = useState<string>('[INCIDENT-ESCALATION] Formal Section 4.2 Volume Discount Enforcement (INV-9044)');
  const [policyTriggered, setPolicyTriggered] = useState<string>('Master Service Agreement Section 4.2 & Commercial Code Clause 12.4');
  const [linkedWorkflowId, setLinkedWorkflowId] = useState<string>('wf-fin-001');
  const [shouldCreateWorkflow, setShouldCreateWorkflow] = useState<boolean>(false);
  const [emailBody, setEmailBody] = useState<string>(
`ATTENTION: Vanguard Industrial Accounts & Commercial Operations

INCIDENT TRACKING ID: INC-2026-8812
SEVERITY LEVEL: P1 - Critical Commercial Discrepancy
INVOICE REFERENCE: INV-9044 ($28,900.00 Billed)
RECONCILED OBLIGATION: $24,565.00 Net Payable

Dear Elena Rostova,

This automated notice confirms that our autonomous financial audit engine identified a discrepancy on Invoice INV-9044. Under Section 4.2 of our Master Service Agreement (CTR-2025-V2), Takasho Enterprises exceeded the $50,000 Q3 order threshold ($54,200 cumulative spend registered in ERP), qualifying for a mandatory 15% volume discount ($4,335.00).

STATUS UPDATE:
1. Executive supervisor sign-off has been staged for the adjusted amount of $24,565.00.
2. Payment is scheduled for inclusion in this Friday's 14:00 PM bank clearing batch.
3. Outbound ACH wire confirmation will be automatically transmitted upon execution.

Please reply with confirmation of ledger adjustment on your records.

Respectfully,
Flow.io Autonomous Incident Engine
Takasho Enterprises Commercial AP Desk`
  );

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSending, setIsSending] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);

  // Incident Simulation Presets
  const PRESETS = [
    {
      id: 'preset-vanguard',
      title: 'P1: Vanguard Contract Discrepancy (INV-9044)',
      severity: 'P1 - Critical' as IncidentSeverity,
      to: 'billing@vanguardindustrial.com',
      cc: 'elena.rostova@vanguardindustrial.com, sarah.cfo@takasho-enterprises.com',
      subject: '[INCIDENT-ESCALATION] Formal Section 4.2 Volume Discount Enforcement (INV-9044)',
      policy: 'Master Service Agreement Section 4.2 & Commercial Code Clause 12.4',
      workflowId: 'wf-fin-001',
      body: `ATTENTION: Vanguard Industrial Accounts & Commercial Operations\n\nINCIDENT TRACKING ID: INC-2026-8812\nSEVERITY LEVEL: P1 - Critical Commercial Discrepancy\nINVOICE REFERENCE: INV-9044 ($28,900.00 Billed)\nRECONCILED OBLIGATION: $24,565.00 Net Payable\n\nDear Elena Rostova,\n\nThis automated notice confirms that our autonomous financial audit engine identified a discrepancy on Invoice INV-9044. Under Section 4.2 of our Master Service Agreement (CTR-2025-V2), Takasho Enterprises exceeded the $50,000 Q3 order threshold ($54,200 cumulative spend registered in ERP), qualifying for a mandatory 15% volume discount ($4,335.00).\n\nSTATUS UPDATE:\n1. Executive supervisor sign-off has been staged for the adjusted amount of $24,565.00.\n2. Payment is scheduled for inclusion in this Friday's 14:00 PM bank clearing batch.\n3. Outbound ACH wire confirmation will be automatically transmitted upon execution.\n\nPlease reply with confirmation of ledger adjustment on your records.\n\nRespectfully,\nFlow.io Autonomous Incident Engine\nTakasho Enterprises Commercial AP Desk`
    },
    {
      id: 'preset-apex',
      title: 'P1: Apex Logix SLA Clause 7 Cure Window (INV-9021)',
      severity: 'P1 - Critical' as IncidentSeverity,
      to: 'collections@apexlogix.io',
      cc: 'legal@takasho-enterprises.com, treasury@takasho-enterprises.com',
      subject: '[INCIDENT-CURE] Formal SLA Clause 7 Cure Response & Installment Remittance for INV-9021 ($14,500)',
      policy: 'Apex Logix SLA Terms 2025 Clause 7 (7-Day Cure Window Protocol)',
      workflowId: 'wf-proc-002',
      body: `ATTENTION: Apex Logix Legal & Collections Desk\n\nINCIDENT TRACKING ID: INC-2026-9021\nSEVERITY LEVEL: P1 - Delinquency Cure Period Response\nCONTRACT REFERENCE: CTR-2025-A9 (SLA Clause 7)\nOUTSTANDING BALANCE: $14,500.00 (Overdue: 42 Days)\n\nDear Collections Desk,\n\nIn response to your formal demand notice regarding Invoice INV-9021, Takasho Enterprises hereby submits our remediation schedule under Clause 7 (7-day cure window prior to legal referral).\n\nREMEDIATION ACTIONS INITIATED:\n• Emergency CFO review meeting convened for Monday 10:00 AM.\n• An immediate initial wire tranche of 50% ($7,250.00) has been authorized for expedited clearance.\n• Second installment scheduled to remit within 7 business days.\n\nAccount suspension remedies are stayed during the active cure period per Section 7.2.\n\nSincerely,\nIncident Response Desk | Takasho Enterprises`
    },
    {
      id: 'preset-nordic',
      title: 'P2: Nordic Cloud Compute SLA Breach Penalty Notice',
      severity: 'P2 - High' as IncidentSeverity,
      to: 'support-ops@nordiccloud.com',
      cc: 'david.chen@nordiccloud.com, devops-oncall@takasho-enterprises.com',
      subject: '[INCIDENT-SLA-PENALTY] Production Compute Availability Degradation (August PO-8830)',
      policy: 'Cloud Service SLA Clause 8.3 (Liquidated Service Credit Protocol)',
      workflowId: 'wf-rec-003',
      body: `ATTENTION: Nordic Cloud Infrastructure Support & Account Management\n\nINCIDENT TRACKING ID: INC-2026-8830\nSEVERITY LEVEL: P2 - SLA Availability Degradation\nSERVICE ACCOUNT: Takasho-Prod-Cluster-US-West\nREFERENCE PO: PO-8830 ($9,800.00 Monthly Allocation)\n\nDear Nordic Cloud Operations,\n\nTelemetry monitoring identified 42 minutes of unplanned cluster outage on 2026-09-18, breaching the 99.95% monthly uptime covenant under Section 8.3.\n\nREQUIRED ACTION:\n• Apply 10% SLA credit ($980.00) against upcoming billing cycle.\n• Submit Root Cause Analysis (RCA) report within 5 business days.\n\nOur system will reconcile this credit against the September ledger balance.\n\nBest regards,\nDevOps Infrastructure & Autonomous Vendor Management`
    },
    {
      id: 'preset-w9',
      title: 'P1: Tax Compliance & Missing W-9 Withholding Enforcement',
      severity: 'P1 - Critical' as IncidentSeverity,
      to: 'compliance@vanguardindustrial.com',
      cc: 'audit-desk@takasho-enterprises.com',
      subject: '[INCIDENT-COMPLIANCE] Missing W-9 Certification & Mandatory Statutory Withholding Notice',
      policy: 'IRS Form W-9 Statutory Backup Withholding Rule 24%',
      workflowId: 'wf-fin-001',
      body: `ATTENTION: Vendor Compliance & Corporate Records Desk\n\nINCIDENT TRACKING ID: INC-2026-4192\nSEVERITY LEVEL: P1 - Statutory Compliance Notice\nVENDOR ENTITY: Vanguard Industrial Corp\n\nDear Compliance Officer,\n\nOur automated ERP onboarding check flagged that your current W-9 form on file has expired for fiscal 2026. Under Federal tax regulations, payment disbursements exceeding $10,000 are subject to 24% backup withholding if a valid Taxpayer Identification Number (TIN) is unverified.\n\nPlease upload or reply with your signed 2026 Form W-9 within 48 hours to avoid payment hold on pending vouchers.\n\nRespectfully,\nCorporate Tax & Compliance Automated Dispatch`
    }
  ];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = PRESETS.find(x => x.id === presetId);
    if (!p) return;
    setSeverity(p.severity);
    setToEmail(p.to);
    setCcEmails(p.cc);
    setSubject(p.subject);
    setPolicyTriggered(p.policy);
    setLinkedWorkflowId(p.workflowId);
    setEmailBody(p.body);
  };

  const handlePolishWithAI = () => {
    setIsPolishing(true);
    setTimeout(() => {
      setEmailBody(prev => {
        return `FORMAL CORPORATE INCIDENT NOTICE - DISPATCHED VIA FLOW.IO\n` +
               `CONFIDENTIAL & LEGALLY PRIVILEGED\n\n` +
               prev + 
               `\n\n---\nAUTOMATED AUDIT METADATA:\n` +
               `• Engine: Flow.io Autonomous Incident Orchestrator v3.4\n` +
               `• Policy Enforcement: ${policyTriggered}\n` +
               `• Digital Timestamp: ${new Date().toISOString()}`;
      });
      setIsPolishing(false);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      const email: OutgoingIncidentEmail = {
        id: `out-inc-${Date.now()}`,
        incidentId,
        severity,
        from: 'incident-response@takasho-enterprises.com',
        to: toEmail,
        cc: ccEmails ? ccEmails.split(',').map(s => s.trim()) : [],
        subject,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'delivered',
        body: emailBody,
        policyTriggered,
        linkedWorkflowId,
        smtpStatusCode: 250,
        smtpLog: `250 2.1.5 Recipient OK. TLSv1.3 connection established to MX for ${toEmail}. Message queued as GMAIL-RELAY-${Math.floor(100000 + Math.random() * 900000)}`,
        stakeholdersNotified: [toEmail, ...(ccEmails ? ccEmails.split(',').map(s => s.trim()) : [])],
        dispatchedBy: 'Flow.io Autonomous Incident Engine'
      };

      onDispatch(email, shouldCreateWorkflow);
      setIsSending(false);
      onClose();
    }, 850);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 border border-[#E2E2DC] shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#ECECE6] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold border border-rose-200">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#111111]">
                Simulate Outgoing Incident Email
              </h2>
              <p className="text-xs text-[#888886]">
                Dispatch automated formal incident reports, contractual escalation notices, and SLA cure demands
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F4F0] text-[#111111] hover:bg-[#ECECE6] flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Preset Selector Banner */}
        <div className="bg-[#FAFAF8] p-3.5 rounded-2xl border border-[#ECECE6] shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#CA8A04]" />
              Select Incident Simulation Preset:
            </span>
            <span className="text-[10px] font-mono text-[#888886]">4 Production Templates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`p-2.5 rounded-xl text-left text-xs transition-all border ${
                  selectedPreset === p.id
                    ? 'border-[#111111] bg-white ring-2 ring-[#111111]/10 font-bold text-[#111111] shadow-2xs'
                    : 'border-[#ECECE6] bg-white/70 hover:bg-white text-[#666664]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{p.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                    p.severity.includes('P1') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.severity.split(' ')[0]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher: Editor vs Live Preview */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 bg-[#F4F4F0] p-1 rounded-xl border border-[#ECECE6]">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'editor' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#666664] hover:text-[#111111]'
              }`}
            >
              Compose & Parameters
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'preview' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#666664] hover:text-[#111111]'
              }`}
            >
              Live Outgoing Email Preview
            </button>
          </div>

          <button
            type="button"
            onClick={handlePolishWithAI}
            disabled={isPolishing}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center gap-1.5"
          >
            <Sparkles className={`w-3.5 h-3.5 text-purple-600 ${isPolishing ? 'animate-spin' : ''}`} />
            <span>{isPolishing ? 'Polishing...' : 'Polish Tone with AI'}</span>
          </button>
        </div>

        {/* Form Body Scroll Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {activeTab === 'editor' ? (
            <div className="space-y-3.5">
              {/* Row 1: Incident ID & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111111] block mb-1">
                    Incident Tracking ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={incidentId}
                      onChange={(e) => setIncidentId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] font-mono text-xs font-bold focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIncidentId(`INC-2026-${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="px-3 py-2 rounded-xl bg-[#F4F4F0] text-[#111111] hover:bg-[#ECECE6] text-xs font-bold"
                    >
                      Gen
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#111111] block mb-1">
                    Incident Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] font-bold text-xs focus:outline-none"
                  >
                    <option value="P1 - Critical">P1 - Critical (Immediate Executive Escalation)</option>
                    <option value="P2 - High">P2 - High (SLA Penalty / Cure Notice)</option>
                    <option value="P3 - Moderate">P3 - Moderate (Operational Inquiry)</option>
                    <option value="P4 - Low">P4 - Low (Informational Notice)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: To & CC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111111] block mb-1">
                    Primary Recipient Email
                  </label>
                  <input
                    type="email"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#111111] block mb-1">
                    CC Stakeholders (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={ccEmails}
                    onChange={(e) => setCcEmails(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="font-bold text-[#111111] block mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-bold focus:outline-none"
                  required
                />
              </div>

              {/* Policy Triggered */}
              <div>
                <label className="font-bold text-[#111111] block mb-1">
                  Contractual Clause / Compliance Policy Triggered
                </label>
                <input
                  type="text"
                  value={policyTriggered}
                  onChange={(e) => setPolicyTriggered(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:outline-none"
                  required
                />
              </div>

              {/* Linked Workflow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="font-bold text-[#111111] block mb-1">
                    Linked Autonomous Workflow
                  </label>
                  <select
                    value={linkedWorkflowId}
                    onChange={(e) => setLinkedWorkflowId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                  >
                    {workflows.map(wf => (
                      <option key={wf.id} value={wf.id}>
                        {wf.id}: {wf.title.substring(0, 38)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#111111]">
                    <input
                      type="checkbox"
                      checked={shouldCreateWorkflow}
                      onChange={(e) => setShouldCreateWorkflow(e.target.checked)}
                      className="rounded text-[#111111] focus:ring-0 w-4 h-4"
                    />
                    <span>Auto-create fresh remediation workflow on dispatch</span>
                  </label>
                </div>
              </div>

              {/* Body */}
              <div>
                <label className="font-bold text-[#111111] block mb-1">
                  Outgoing Incident Message Body
                </label>
                <textarea
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-[#18181B] text-[#F4F4F5] font-mono text-xs focus:ring-2 focus:ring-[#FACC15] focus:outline-none leading-relaxed resize-none"
                  required
                />
              </div>
            </div>
          ) : (
            /* Live Email Preview */
            <div className="bg-[#FAFAF8] rounded-2xl p-5 border border-[#ECECE6] space-y-4 font-sans">
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-white border border-[#E4E4DF] space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#F4F4F0]">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    severity.includes('P1') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {severity}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#888886]">{incidentId}</span>
                </div>

                <div className="text-xs space-y-1">
                  <p><strong className="text-[#666664]">From:</strong> incident-response@takasho-enterprises.com (Flow.io Relay)</p>
                  <p><strong className="text-[#666664]">To:</strong> <span className="font-mono">{toEmail}</span></p>
                  {ccEmails && <p><strong className="text-[#666664]">CC:</strong> <span className="font-mono">{ccEmails}</span></p>}
                  <p><strong className="text-[#666664]">Subject:</strong> <span className="font-bold text-[#111111]">{subject}</span></p>
                  <p><strong className="text-[#666664]">Policy Enforced:</strong> <span className="text-[#854D0E] font-medium">{policyTriggered}</span></p>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-white border border-[#E4E4DF] font-mono text-xs whitespace-pre-line leading-relaxed text-[#27272A]">
                {emailBody}
              </div>

              {/* SMTP Envelope Footer */}
              <div className="p-3 rounded-xl bg-[#111111] text-white flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#A1A1AA]">SMTP Relay: Gmail Workspace API</span>
                <span className="text-emerald-400 font-bold">250 OK Protocol Ready</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F4F4F0] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#666664] hover:bg-[#F4F4F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-md flex items-center gap-2 transition-all"
            >
              <Send className={`w-3.5 h-3.5 text-[#FACC15] ${isSending ? 'animate-bounce' : ''}`} />
              <span>{isSending ? 'Transmitting via SMTP Relay...' : 'Dispatch Outgoing Incident Email'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
