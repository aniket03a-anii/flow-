import React, { useState } from 'react';
import { Workflow, WorkflowStep } from '../types/workflow';
import { 
  Sparkles, 
  Flame, 
  FileSpreadsheet, 
  Mail, 
  Calendar, 
  DollarSign, 
  Check, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkflow: (workflow: Workflow) => void;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  isOpen,
  onClose,
  onCreateWorkflow
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [vendorOrClient, setVendorOrClient] = useState('');
  const [amount, setAmount] = useState('18400');
  const [category, setCategory] = useState<'finance' | 'procurement' | 'compliance' | 'operations'>('finance');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  const templates = [
    {
      title: 'Q3 Vendor Overdue Reconciliation & Settlement',
      objective: 'Scan Accounts Aging sheet range B4:F18, cross-reference vendor dispute emails, extract discount terms from contract PDF, and request CFO approval.',
      vendorOrClient: 'Solaria Energy Group',
      amount: '42000',
      category: 'finance' as const,
      priority: 'critical' as const
    },
    {
      title: 'Contract Renewal & SLA Escalation Pipeline',
      objective: 'Ingest vendor master agreements, monitor upcoming expiry within 30 days, cross-check calendar milestones, and draft renewal terms.',
      vendorOrClient: 'CyberPulse Security',
      amount: '19800',
      category: 'compliance' as const,
      priority: 'high' as const
    },
    {
      title: 'Automated PO Zero-Variance Voucher Clearance',
      objective: 'Compare billed invoices against approved PO Matrix range C2:E8. If variance equals 0 and sum is under $10,000, trigger automated ERP disbursement.',
      vendorOrClient: 'OmniHardware Global',
      amount: '8400',
      category: 'procurement' as const,
      priority: 'medium' as const
    }
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setObjective(tpl.objective);
    setVendorOrClient(tpl.vendorOrClient);
    setAmount(tpl.amount);
    setCategory(tpl.category);
    setPriority(tpl.priority);
  };

  const handleCreate = () => {
    if (!title || !objective) {
      alert('Please provide a title and business objective.');
      return;
    }

    const newId = `wf-custom-${Date.now().toString().slice(-4)}`;
    const parsedAmount = parseFloat(amount) || 10000;
    const requiresSignoff = parsedAmount >= 10000;

    const steps: WorkflowStep[] = [
      {
        id: `step-${Date.now()}-1`,
        title: 'Information Gathering: Multi-Source Cross-Check',
        description: `Query spreadsheet records and Gmail threads for counterparty "${vendorOrClient}".`,
        source: 'spreadsheet',
        status: 'completed',
        startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        dataInput: { targetVendor: vendorOrClient, expectedAmount: parsedAmount },
        dataOutput: { matchedStatus: 'Records found', varianceDetected: false },
        reasoning: 'Autonomous engine matched customer records against master ledger without errors.'
      },
      {
        id: `step-${Date.now()}-2`,
        title: 'Contract Terms & Compliance Verification',
        description: 'Analyze legal agreement PDF for payment terms, dispute conditions, and authorized signatories.',
        source: 'document',
        status: 'completed',
        startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        reasoning: 'Verified valid terms of service and authorized disbursement parameters.'
      },
      {
        id: `step-${Date.now()}-3`,
        title: requiresSignoff ? 'Human-in-the-Loop Sign-off Gate' : 'Automated Policy Execution',
        description: requiresSignoff 
          ? `Disbursement amount ($${parsedAmount.toLocaleString()}) exceeds the $10,000 threshold. Supervisor authorization required.`
          : 'Disbursement within automatic authorization limits. Direct settlement scheduled.',
        source: requiresSignoff ? 'human_approval' : 'erp',
        status: requiresSignoff ? 'waiting_approval' : 'completed',
        requiresApproval: requiresSignoff,
        approvalDetails: requiresSignoff ? {
          actionName: 'Authorize Disbursement & Notification',
          amount: parsedAmount,
          recipient: vendorOrClient,
          proposedDraft: `Dear ${vendorOrClient},\n\nWe have verified your account balance and processed authorization for $${parsedAmount.toLocaleString()}. Payment scheduled in the next batch.\n\nWarm regards,\nTakasho Finance`,
          discrepancyNotes: 'Standard authorization gate for high-value transactions.'
        } : undefined,
        reasoning: requiresSignoff ? 'Triggered AP-10K human escalation gate.' : 'Automated zero-touch approval.'
      }
    ];

    const newWorkflow: Workflow = {
      id: newId,
      title,
      objective,
      category,
      priority,
      status: requiresSignoff ? 'waiting_approval' : 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      currentStepIndex: requiresSignoff ? 2 : 1,
      triggerSource: 'Manual Orchestrator / User Objective',
      associatedEntities: {
        vendorOrClient,
        amount: parsedAmount,
        dueDate: '2026-10-15'
      },
      steps,
      auditTrailIds: []
    };

    onCreateWorkflow(newWorkflow);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-7 border border-[#ECECE6] shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F4F4F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#FACC15]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#111111]">
                Launch Autonomous Workflow
              </h3>
              <p className="text-xs text-[#888886]">
                Define a high-level business objective; Flow.io will plan and orchestrate steps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F4F0] text-[#111111] hover:bg-[#ECECE6] flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Templates Picker */}
        <div>
          <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block mb-2">
            Quick-Start Business Templates
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {templates.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="p-3 text-left rounded-2xl border border-[#ECECE6] bg-[#FAFAF8] hover:bg-[#FEFCE8] hover:border-[#FACC15] transition-all text-xs group"
              >
                <span className="font-bold text-[#111111] line-clamp-1 group-hover:text-[#854D0E]">
                  {tpl.title}
                </span>
                <span className="text-[11px] text-[#777775] block mt-1 line-clamp-2">
                  {tpl.objective}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-[#111111] block mb-1">Workflow Title</label>
            <input
              type="text"
              placeholder="e.g. Overdue Financial Obligations & Settlement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:ring-2 focus:ring-[#111111] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#111111] block mb-1">Business Objective</label>
            <textarea
              rows={3}
              placeholder="Describe what the autonomous agent should accomplish across Gmail, Excel, and contracts..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:ring-2 focus:ring-[#111111] focus:outline-none leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#111111] block mb-1">Target Counterparty</label>
              <input
                type="text"
                placeholder="e.g. Solaria Energy Corp"
                value={vendorOrClient}
                onChange={(e) => setVendorOrClient(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#111111] block mb-1">Amount ($)</label>
              <input
                type="number"
                placeholder="24500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-[#111111] block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:outline-none font-bold"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F4F4F0]">
          <span className="text-[11px] text-[#888886]">
            {parseFloat(amount) >= 10000 ? '⚠️ Will route through Human Supervisor Approval (> $10k)' : '✓ Eligible for automated zero-touch execution'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#666664] hover:bg-[#F4F4F0]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Launch Workflow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
