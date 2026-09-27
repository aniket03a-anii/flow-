import React, { useState } from 'react';
import { Workflow } from '../types/workflow';
import { 
  ShieldAlert, 
  Check, 
  X, 
  Sparkles, 
  Mail, 
  DollarSign, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';
import { generateEscalationDraft } from '../utils/gemini';
import confetti from 'canvas-confetti';

interface ApprovalModalProps {
  workflow: Workflow | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (workflowId: string, updatedDraft: string) => void;
  onReject: (workflowId: string, reason: string) => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  workflow,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  if (!isOpen || !workflow) return null;

  const currentStep = workflow.steps[workflow.currentStepIndex] || workflow.steps.find(s => s.requiresApproval);
  const details = currentStep?.approvalDetails;

  const [draftMessage, setDraftMessage] = useState(
    details?.proposedDraft ||
    `Dear ${details?.recipient || 'Vendor'},\n\nWe have completed our contract reconciliation and verified our volume discount under Section 4.2. Takasho Enterprises approves payment in the amount of $${details?.amount?.toLocaleString() || '0.00'}.\n\nSincerely,\nJohn Doe | Operations & Finance`
  );
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleApprove = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    onApprove(workflow.id, draftMessage);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason) {
      alert('Please enter a rejection justification for the audit trail.');
      return;
    }
    onReject(workflow.id, rejectReason);
    onClose();
  };

  const handleRegenerateWithAI = async () => {
    setIsGeneratingAI(true);
    try {
      const generated = await generateEscalationDraft(
        details?.recipient || 'Vanguard Industrial',
        details?.amount || 24565,
        'INV-9044',
        details?.discrepancyNotes || '15% discount applied per contract clause 4.2'
      );
      setDraftMessage(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-7 border border-[#ECECE6] shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F4F4F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF08A] text-[#854D0E] flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 text-[#CA8A04]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#111111]">
                  Human Supervisor Sign-off Required
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#111111] text-white">
                  Gate AP-10K
                </span>
              </div>
              <p className="text-xs text-[#888886] mt-0.5">
                Workflow: <span className="font-semibold text-[#111111]">{workflow.title}</span>
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

        {/* Verification Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6]">
            <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block">Authorized Counterparty</span>
            <span className="font-extrabold text-[#111111] text-sm mt-0.5 block truncate">
              {details?.recipient || workflow.associatedEntities.vendorOrClient}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6]">
            <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block">Approved Amount</span>
            <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">
              ${(details?.amount || workflow.associatedEntities.amount)?.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FEF9C3]/70 border border-[#FDE047]">
            <span className="text-[10px] font-bold text-[#854D0E] uppercase tracking-wider block">Policy Trigger</span>
            <span className="font-bold text-[#713F12] text-xs mt-0.5 block">
              Amount &gt; $10k Threshold
            </span>
          </div>
        </div>

        {/* Discrepancy / Reconciliation Notes */}
        <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-[#FDE047] text-xs text-[#713F12] space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#854D0E]">
            <AlertTriangle className="w-4 h-4 text-[#CA8A04]" />
            <span>Autonomous Reconciliation Findings</span>
          </div>
          <p className="leading-relaxed">
            {details?.discrepancyNotes ||
              'Billed $28,900 reduced by 15% ($4,335) under Master Agreement Clause 4.2 following Gmail confirmation. Cash release scheduled for Friday 2:00 PM batch.'}
          </p>
        </div>

        {/* Action Dispatch Draft */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#888886] uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#111111]" />
              <span>Outbound Communication to Vendor (Editable)</span>
            </span>

            <button
              onClick={handleRegenerateWithAI}
              disabled={isGeneratingAI}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingAI ? 'Drafting...' : 'Polish with Gemini'}</span>
            </button>
          </div>

          <textarea
            rows={5}
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            className="w-full p-4 rounded-2xl text-xs bg-[#FAFAF8] border border-[#ECECE6] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] leading-relaxed resize-none font-sans"
          />
        </div>

        {/* Rejection Drawer if requested */}
        {isRejecting && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-xs">
            <label className="font-bold text-rose-900 block">
              Reason for Rejection / Escalation to Legal
            </label>
            <input
              type="text"
              placeholder="e.g. Additional proof of delivery required from freight carrier..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-rose-300 text-xs focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsRejecting(false)}
                className="px-3 py-1.5 text-xs text-rose-700 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F4F4F0]">
          {!isRejecting ? (
            <button
              onClick={() => setIsRejecting(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Reject / Dispute</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#666664] hover:bg-[#F4F4F0] transition-colors"
            >
              Postpone
            </button>

            <button
              onClick={handleApprove}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#111111] text-white hover:bg-black shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3] text-[#FACC15]" />
              <span>Approve & Dispatch Settlement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
