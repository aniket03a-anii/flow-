import React, { useState } from 'react';
import { 
  Workflow, 
  WorkflowStep, 
  StepStatus,
  WorkflowStatus 
} from '../types/workflow';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet, 
  Mail, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  Cpu, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  CornerDownRight,
  Database,
  ExternalLink,
  Zap,
  RotateCcw,
  CheckCircle,
  Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbService } from '../db/databaseService';

interface WorkflowsViewProps {
  workflows: Workflow[];
  selectedWorkflowId: string;
  onSelectWorkflow: (id: string) => void;
  onUpdateWorkflow: (workflow: Workflow) => void;
  onOpenApprovalModal: (workflow: Workflow) => void;
  onAddAuditLog: (workflowId: string, action: string, details: string, severity: 'info' | 'warning' | 'critical' | 'success', payload?: any) => void;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({
  workflows,
  selectedWorkflowId,
  onSelectWorkflow,
  onUpdateWorkflow,
  onOpenApprovalModal,
  onAddAuditLog
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'waiting_approval' | 'completed' | 're_planned'>('all');
  const [selectedStepId, setSelectedStepId] = useState<string>('');
  const [isSimulatingAction, setIsSimulatingAction] = useState(false);
  const [isFullRunning, setIsFullRunning] = useState(false);
  const [backendAnalysisRunning, setBackendAnalysisRunning] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];
  const activeStep = selectedWorkflow.steps.find((s) => s.id === selectedStepId) || 
                     selectedWorkflow.steps[selectedWorkflow.currentStepIndex] || 
                     selectedWorkflow.steps[0];

  const filteredWorkflows = workflows.filter((w) => {
    if (filter === 'all') return true;
    if (filter === 'active') return w.status === 'active';
    if (filter === 'waiting_approval') return w.status === 'waiting_approval';
    if (filter === 'completed') return w.status === 'completed';
    if (filter === 're_planned') return w.status === 're_planned' || w.steps.some(s => s.status === 're_planned');
    return true;
  });

  // Full Autonomous Run from start to finish
  const handleFullRun = async () => {
    if (!selectedWorkflow || isFullRunning) return;
    setIsFullRunning(true);

    onAddAuditLog(
      selectedWorkflow.id,
      'Full Autonomous Run Initiated',
      `Orchestrator commenced end-to-end execution of "${selectedWorkflow.title}" through all database, calendar, and document analysis gates.`,
      'info',
      { workflowId: selectedWorkflow.id, totalSteps: selectedWorkflow.steps.length }
    );

    let currentWf = { ...selectedWorkflow };
    let steps = currentWf.steps.map(s => ({ ...s }));

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Mark current step as running
      step.status = 'running';
      step.startedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      currentWf = {
        ...currentWf,
        currentStepIndex: i,
        steps: [...steps],
        status: 'active'
      };
      onUpdateWorkflow(currentWf);
      setSelectedStepId(step.id);

      // Simulate step work latency
      await new Promise(r => setTimeout(r, 650));

      // If it's an Analysis step, query database & backend API
      if (step.source === 'analysis' || step.id.includes('step-4') || step.title.toLowerCase().includes('analysis')) {
        try {
          const dbAnalysis = dbService.runRelationalAnalysis('INV-9044');
          step.analysisData = {
            databaseMatchScore: 99.8,
            cashflowRisk: 'Low',
            calendarDeadlineVarianceHours: 36,
            policyCheckPass: true,
            detectedSavings: 4335,
            sqlQueryExecuted: "SELECT po.approved_budget, v.cumulative_q3_spend FROM purchase_orders po JOIN vendors v ON po.vendor_name = v.vendor_name WHERE po.po_number = 'PO-8812';",
            rulesFired: ['RULE_VOL_DISC_15', 'RULE_ESC_THRESHOLD_10K', 'RULE_CAL_WINDOW_OK', 'RULE_W9_VALIDATED']
          };
          step.dataOutput = {
            ...step.dataOutput,
            relationalValidation: 'Passed',
            verifiedSavings: 4335,
            cfoEscalationTriggered: true
          };
        } catch (e) {
          console.error(e);
        }
      }

      // Check if this step is a Human Approval Gate
      if (step.requiresApproval) {
        step.status = 'waiting_approval';
        currentWf = {
          ...currentWf,
          currentStepIndex: i,
          status: 'waiting_approval',
          steps: [...steps]
        };
        onUpdateWorkflow(currentWf);
        setIsFullRunning(false);

        onAddAuditLog(
          selectedWorkflow.id,
          'Human-in-the-Loop Gate Reached',
          `Full run paused at Step ${i + 1} (${step.title}). Transaction of $${currentWf.associatedEntities.amount?.toLocaleString()} requires CFO sign-off before ERP disbursement.`,
          'warning',
          { requiredRole: 'CFO / John Doe', amount: currentWf.associatedEntities.amount }
        );

        // Open approval modal directly
        onOpenApprovalModal(currentWf);
        return;
      }

      // Mark step completed
      step.status = 'completed';
      step.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      currentWf = {
        ...currentWf,
        currentStepIndex: i,
        steps: [...steps]
      };
      onUpdateWorkflow(currentWf);
    }

    // All steps finished
    currentWf.status = 'completed';
    onUpdateWorkflow(currentWf);
    setIsFullRunning(false);

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    onAddAuditLog(
      selectedWorkflow.id,
      'Full Pipeline Execution Finalized',
      `All ${steps.length} autonomous steps completed successfully. General ledger updated and confirmation wire dispatched.`,
      'success',
      { workflowId: selectedWorkflow.id }
    );
  };

  // Reset workflow to Step 1 for re-running
  const handleResetWorkflow = () => {
    const resetSteps = selectedWorkflow.steps.map((s, idx) => ({
      ...s,
      status: (idx === 0 ? 'pending' : 'pending') as StepStatus,
      startedAt: undefined,
      completedAt: undefined
    }));

    const resetWf: Workflow = {
      ...selectedWorkflow,
      currentStepIndex: 0,
      status: 'active',
      steps: resetSteps,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onUpdateWorkflow(resetWf);
    setSelectedStepId(resetSteps[0].id);
    onAddAuditLog(
      selectedWorkflow.id,
      'Workflow State Reset',
      `Pipeline reset to Step 1 for clean re-execution demo.`,
      'info'
    );
  };

  // Execute or Advance the next single step
  const handleAdvanceStep = () => {
    if (!selectedWorkflow) return;
    setIsSimulatingAction(true);

    setTimeout(() => {
      const updatedSteps = [...selectedWorkflow.steps];
      const currentIdx = selectedWorkflow.currentStepIndex;

      if (currentIdx < updatedSteps.length) {
        const step = updatedSteps[currentIdx];

        if (step.requiresApproval && step.status === 'waiting_approval') {
          setIsSimulatingAction(false);
          onOpenApprovalModal(selectedWorkflow);
          return;
        }

        step.status = 'completed';
        step.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

        let nextIdx = currentIdx + 1;
        let newWorkflowStatus: WorkflowStatus = selectedWorkflow.status;

        if (nextIdx < updatedSteps.length) {
          const nextStep = updatedSteps[nextIdx];
          if (nextStep.requiresApproval) {
            nextStep.status = 'waiting_approval';
            newWorkflowStatus = 'waiting_approval';
          } else {
            nextStep.status = 'running';
            nextStep.startedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
            newWorkflowStatus = 'active';
          }
        } else {
          newWorkflowStatus = 'completed';
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}
        }

        const updatedWf: Workflow = {
          ...selectedWorkflow,
          currentStepIndex: nextIdx < updatedSteps.length ? nextIdx : currentIdx,
          status: newWorkflowStatus,
          steps: updatedSteps,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };

        onUpdateWorkflow(updatedWf);
        onAddAuditLog(
          selectedWorkflow.id,
          `Step '${step.title}' Executed`,
          `Successfully completed step via autonomous execution engine. Next step: ${updatedSteps[nextIdx]?.title || 'Workflow Finalized'}`,
          'success',
          { completedStep: step.id, output: step.dataOutput }
        );
      }
      setIsSimulatingAction(false);
    }, 600);
  };

  // Simulate Dynamic Re-Planning: conditions change
  const handleSimulateConditionChange = () => {
    setIsSimulatingAction(true);

    setTimeout(() => {
      const rePlanStep: WorkflowStep = {
        id: `step-replan-${Date.now()}`,
        title: 'Dynamic Re-Plan: Missing W-9 & Tax Exemption Ingestion',
        description: 'Conditions changed: Counterparty tax withholding status was absent from ERP ledger. Dynamically querying compliance repository.',
        source: 'document',
        status: 'completed',
        startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        dataInput: { counterparty: selectedWorkflow.associatedEntities.vendorOrClient, targetForm: 'W-9 / Tax ID' },
        dataOutput: { status: 'Verified', taxId: 'XX-XXX4192', withholdingExempt: true },
        reasoning: 'Autonomous engine adapted pipeline to prevent tax penalty; validated W-9 without requiring workflow reset.'
      };

      const updatedSteps = [...selectedWorkflow.steps];
      updatedSteps.splice(selectedWorkflow.currentStepIndex + 1, 0, rePlanStep);

      const updatedWf: Workflow = {
        ...selectedWorkflow,
        status: selectedWorkflow.status === 'completed' ? 'active' : selectedWorkflow.status,
        steps: updatedSteps,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      onUpdateWorkflow(updatedWf);
      onAddAuditLog(
        selectedWorkflow.id,
        'Dynamic Pipeline Re-Planning',
        'Injected dynamic compliance verification step following condition change (missing tax record detected). Workflow self-healed.',
        'warning',
        { injectedStepId: rePlanStep.id }
      );

      setSelectedStepId(rePlanStep.id);
      setIsSimulatingAction(false);
    }, 700);
  };

  // Simulate Handling Missing Information or Failed Task
  const handleSimulateMissingDataRecovery = () => {
    setIsSimulatingAction(true);

    setTimeout(() => {
      const recoveryStep: WorkflowStep = {
        id: `step-missing-${Date.now()}`,
        title: 'Missing Info Handled: Automated Carrier Rate Recovery',
        description: 'Missing information encountered: Carrier rate sheet was absent from repository. Autonomous agent queried carrier API, retrieved confirmation #CR-8821, and resumed execution.',
        source: 'document',
        status: 'completed',
        startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        dataInput: { missingParameter: 'Carrier Delivery Slip', queriedEndpoint: 'logistics.vanguard.com/rates' },
        dataOutput: { resolved: true, trackingNumber: 'TRK-990218-USA', signedBy: 'Warehouse Dock A' },
        reasoning: 'Autonomous recovery: System did not stall or crash upon missing data; retrieved secondary confirmation and self-healed the pipeline.'
      };

      const updatedSteps = [...selectedWorkflow.steps];
      updatedSteps.splice(selectedWorkflow.currentStepIndex + 1, 0, recoveryStep);

      const updatedWf: Workflow = {
        ...selectedWorkflow,
        steps: updatedSteps,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      onUpdateWorkflow(updatedWf);
      onAddAuditLog(
        selectedWorkflow.id,
        'Missing Information Self-Healing',
        'Handled missing carrier document gracefully by querying external records and injecting verification step.',
        'warning',
        { injectedStepId: recoveryStep.id }
      );

      setSelectedStepId(recoveryStep.id);
      setIsSimulatingAction(false);
    }, 700);
  };

  // Trigger backend evaluation API
  const handleTriggerBackendAnalysis = async () => {
    setBackendAnalysisRunning(true);
    try {
      const res = await fetch('/api/analysis/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: 'INV-9044',
          vendor: selectedWorkflow.associatedEntities.vendorOrClient || 'Vanguard Industrial Corp',
          amount: selectedWorkflow.associatedEntities.amount || 24565,
          calendarCutoff: 'Friday 14:00 (Bank Batch Cutoff)'
        })
      });
      const data = await res.json();
      if (data.analysis) {
        onAddAuditLog(
          selectedWorkflow.id,
          'Backend Analysis API Evaluated',
          `Evaluated /api/analysis/evaluate: Verified cumulative spend $54.2k, savings $4,335 under Section 4.2. Decision Score: ${data.analysis.auditDecisionScore}%`,
          'success',
          data.analysis
        );
      }
    } catch (e) {
      console.warn('Backend API fallback to local dbService');
      const localRes = dbService.runRelationalAnalysis('INV-9044');
      onAddAuditLog(
        selectedWorkflow.id,
        'Relational Database Evaluated',
        `Validated against internal vendors and PO table. Match: 99.8%. Recommended payable: $${localRes.recommendedPayable.toLocaleString()}`,
        'success',
        localRes
      );
    } finally {
      setBackendAnalysisRunning(false);
    }
  };

  // AI Reasoning assistance
  const handleAskAIReasoning = () => {
    setIsSimulatingAction(true);
    setTimeout(() => {
      setAiSuggestions(
        `Gemini Reasoning for "${selectedWorkflow.title}":\n` +
        `• Root Objective: Settle accounts with ${selectedWorkflow.associatedEntities.vendorOrClient || 'Vendor'} while guaranteeing contract clause compliance.\n` +
        `• Multi-Source Cross-Check: Verified 99.8% match across Gmail confirmation, Service_Agreement_Vanguard_v2.pdf Section 4.2, and PostgreSQL table vendors.\n` +
        `• Database Analysis: Customer spend ($54,200) qualifies for 15% discount. Net payable of $24,565 meets all audit thresholds.\n` +
        `• Calendar Constraint: Friday 14:00 PM Bank Batch Cutoff leaves 36 hours for supervisor sign-off.`
      );
      setIsSimulatingAction(false);
    }, 500);
  };

  const getSourceIcon = (source: WorkflowStep['source']) => {
    switch (source) {
      case 'spreadsheet': return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'gmail': return <Mail className="w-4 h-4 text-rose-500" />;
      case 'calendar': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'document': return <FileText className="w-4 h-4 text-amber-600" />;
      case 'database': return <Database className="w-4 h-4 text-indigo-600" />;
      case 'analysis': return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'ai_decision': return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'human_approval': return <ShieldAlert className="w-4 h-4 text-[#854D0E]" />;
      case 'erp': return <Database className="w-4 h-4 text-indigo-600" />;
      default: return <Cpu className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Check className="w-3 h-3 stroke-[3]" /> Completed
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      case 'waiting_approval':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#854D0E] bg-[#FEF08A] px-2 py-0.5 rounded-full border border-[#FDE047] animate-bounce">
            <AlertCircle className="w-3 h-3" /> Requires Approval
          </span>
        );
      case 're_planned':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            <CornerDownRight className="w-3 h-3" /> Re-Planned
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <X className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-[#888886] bg-[#F4F4F0] px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Workflows & Analysis Engine</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#111111] text-white">
              Full Autonomous Runs
            </span>
          </div>
          <p className="text-xs text-[#888886] mt-0.5">
            End-to-end multi-step pipelines with attached analysis steps, database queries, calendar deadlines, and human gates
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F4F0] rounded-2xl border border-[#ECECE6] overflow-x-auto">
          {(['all', 'active', 'waiting_approval', 'completed', 're_planned'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-[#18181B] text-white shadow-xs font-bold'
                  : 'text-[#666664] hover:text-[#111111] hover:bg-white/60'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Workflows List (Col 4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-[#888886] uppercase tracking-wider px-1">
            Registered Workflows ({filteredWorkflows.length})
          </div>

          <div className="space-y-3">
            {filteredWorkflows.map((wf) => {
              const isSelected = wf.id === selectedWorkflow.id;
              const isWaiting = wf.status === 'waiting_approval';
              const isCompleted = wf.status === 'completed';

              return (
                <div
                  key={wf.id}
                  onClick={() => onSelectWorkflow(wf.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-[#111111] bg-white ring-2 ring-[#111111]/10 shadow-sm'
                      : isWaiting
                      ? 'border-[#FACC15] bg-[#FEFCE8] hover:bg-amber-50/80'
                      : 'border-[#ECECE6] bg-white hover:bg-[#FAFAF8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#111111] text-white">
                      {wf.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isWaiting
                          ? 'bg-[#FACC15] text-[#111111] animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isWaiting ? '⚠️ Needs Sign-Off' : isCompleted ? 'Completed' : 'Running'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#111111] line-clamp-1">
                    {wf.title}
                  </h3>
                  <p className="text-xs text-[#777775] line-clamp-2 mt-1">
                    {wf.objective}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#F4F4F0] flex items-center justify-between text-[11px] text-[#888886]">
                    <span className="font-semibold text-[#111111]">
                      ${wf.associatedEntities.amount?.toLocaleString()}
                    </span>
                    <span>{wf.steps.length} steps ({wf.currentStepIndex}/{wf.steps.length} done)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Workflow Visualizer (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visualizer Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#F4F4F0]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#713F12]">
                    ID: {selectedWorkflow.id}
                  </span>
                  <span className="text-xs font-bold text-[#CA8A04] bg-[#FEF9C3] px-2 py-0.5 rounded-full">
                    Priority: {selectedWorkflow.priority.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-[#888886]">
                    Step {selectedWorkflow.currentStepIndex + 1} of {selectedWorkflow.steps.length}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-[#111111]">
                  {selectedWorkflow.title}
                </h2>
                <p className="text-xs text-[#666664] mt-1 max-w-2xl leading-relaxed">
                  {selectedWorkflow.objective}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                {/* Prominent Full Run Button */}
                <button
                  onClick={handleFullRun}
                  disabled={isFullRunning || isSimulatingAction}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#111111] text-white hover:bg-black shadow-md flex items-center gap-2 transition-all"
                  title="Execute entire multi-step pipeline automatically with database checks and analysis"
                >
                  <Zap className={`w-3.5 h-3.5 text-[#FACC15] fill-current ${isFullRunning ? 'animate-bounce' : ''}`} />
                  <span>{isFullRunning ? 'Running Full Pipeline...' : '⚡ Full Autonomous Run'}</span>
                </button>

                {selectedWorkflow.status === 'waiting_approval' && (
                  <button
                    onClick={() => onOpenApprovalModal(selectedWorkflow)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FACC15] text-[#111111] hover:bg-[#EAB308] shadow-xs flex items-center gap-2 animate-bounce"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#111111]" />
                    <span>Review Approval</span>
                  </button>
                )}

                {selectedWorkflow.status !== 'completed' && selectedWorkflow.status !== 'waiting_approval' && (
                  <button
                    onClick={handleAdvanceStep}
                    disabled={isSimulatingAction || isFullRunning}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#F4F4F0] text-[#111111] hover:bg-[#ECECE6] border border-[#E2E2DC] flex items-center gap-1.5"
                  >
                    <Play className={`w-3 h-3 fill-current ${isSimulatingAction ? 'animate-spin' : ''}`} />
                    <span>Step-by-Step Advance</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSimulateMissingDataRecovery}
                    disabled={isSimulatingAction || isFullRunning}
                    title="Simulate missing entity or failed task to demonstrate autonomous self-healing recovery"
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-700" />
                    <span>Missing Info</span>
                  </button>

                  <button
                    onClick={handleSimulateConditionChange}
                    disabled={isSimulatingAction || isFullRunning}
                    title="Simulate unexpected condition change to demonstrate autonomous re-planning"
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center gap-1"
                  >
                    <CornerDownRight className="w-3 h-3 text-purple-600" />
                    <span>Re-Plan</span>
                  </button>

                  <button
                    onClick={handleResetWorkflow}
                    disabled={isFullRunning}
                    title="Reset workflow to Step 1 to demonstrate clean run"
                    className="p-1.5 rounded-xl text-[#777775] hover:text-[#111111] hover:bg-[#F4F4F0] border border-transparent hover:border-[#ECECE6]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Reasoning Box if active */}
            {aiSuggestions && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-xs text-[#2E1065] relative">
                <button
                  onClick={() => setAiSuggestions(null)}
                  className="absolute top-2 right-2 text-purple-400 hover:text-purple-700"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="font-bold flex items-center gap-1.5 mb-1 text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Gemini Autonomous Assessment
                </div>
                <div className="whitespace-pre-line leading-relaxed font-sans">{aiSuggestions}</div>
              </div>
            )}

            {/* Interactive Step Graph / Visualizer Nodes */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold text-[#888886] uppercase tracking-wider">
                  Step-by-Step Execution Graph (Click node to inspect)
                </div>
                <button
                  onClick={handleAskAIReasoning}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Explain AI Reasoning</span>
                </button>
              </div>

              <div className="space-y-3">
                {selectedWorkflow.steps.map((step, index) => {
                  const isCurrent = index === selectedWorkflow.currentStepIndex;
                  const isSelected = (selectedStepId === step.id) || (!selectedStepId && isCurrent);
                  const isAnalysisStep = step.source === 'analysis' || step.title.toLowerCase().includes('analysis');

                  return (
                    <div
                      key={step.id}
                      onClick={() => setSelectedStepId(step.id)}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#111111] bg-[#FAFAF8] ring-2 ring-[#111111]/10 shadow-xs'
                          : isAnalysisStep
                          ? 'border-purple-200 bg-purple-50/20 hover:bg-purple-50/40'
                          : 'border-[#ECECE6] bg-white hover:bg-[#FAFAF8]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          {/* Step number badge with source icon */}
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                            isAnalysisStep ? 'bg-[#FEF08A] text-[#713F12] border-[#FDE047]' : 'bg-[#F4F4F0] text-[#111111] border-[#ECECE6]'
                          }`}>
                            {index + 1}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                              {getSourceIcon(step.source)}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-[#111111]">{step.title}</h4>
                                {isAnalysisStep && (
                                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                                    Analysis Step
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#777775] line-clamp-1">{step.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          {getStatusBadge(step.status)}
                          {step.requiresApproval && (
                            <span className="text-[10px] font-bold text-[#854D0E] bg-[#FEF9C3] px-2 py-0.5 rounded-md border border-[#FDE047]">
                              Human Gate
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Connecting Line between steps if not last */}
                      {index < selectedWorkflow.steps.length - 1 && (
                        <div className="absolute left-8 -bottom-3 w-0.5 h-3 bg-[#ECECE6] z-10"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Node Inspector: Details of Selected Step */}
          {activeStep && (
            <div className="bg-white rounded-3xl p-6 border border-[#ECECE6] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#F4F4F0]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FEF9C3] text-[#CA8A04]">
                    {getSourceIcon(activeStep.source)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#111111]">
                      Node Inspector: {activeStep.title}
                    </h3>
                    <p className="text-xs text-[#888886]">
                      Source System: <span className="font-bold uppercase text-[#111111]">{activeStep.source}</span> • Status: <span className="font-bold text-[#111111]">{activeStep.status}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeStep.source === 'analysis' && (
                    <button
                      onClick={handleTriggerBackendAnalysis}
                      disabled={backendAnalysisRunning}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#FACC15] ${backendAnalysisRunning ? 'animate-spin' : ''}`} />
                      <span>{backendAnalysisRunning ? 'Evaluating...' : 'Re-run Backend API'}</span>
                    </button>
                  )}
                  {getStatusBadge(activeStep.status)}
                </div>
              </div>

              {/* SPECIAL ANALYSIS STEP DEEP DIVE CARD */}
              {(activeStep.source === 'analysis' || activeStep.analysisData) && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FEFCE8] via-white to-purple-50 border border-[#FDE047] space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#FDE047]/50">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#CA8A04]" />
                      <span className="text-xs font-extrabold text-[#713F12] uppercase tracking-wider">
                        Attached Deep Analysis & Relational Database Engine
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                      Decision Score: {activeStep.analysisData?.databaseMatchScore ?? 99.8}%
                    </span>
                  </div>

                  {/* 4 Analysis Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#ECECE6]">
                      <span className="text-[10px] uppercase font-bold text-[#888886] block">Cashflow Risk</span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        {activeStep.analysisData?.cashflowRisk || 'Low'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#ECECE6]">
                      <span className="text-[10px] uppercase font-bold text-[#888886] block">Calendar Cutoff</span>
                      <span className="text-xs font-extrabold text-[#111111]">
                        {activeStep.analysisData?.calendarDeadlineVarianceHours || 36}h remaining
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#ECECE6]">
                      <span className="text-[10px] uppercase font-bold text-[#888886] block">Verified Savings</span>
                      <span className="text-xs font-extrabold text-emerald-700 font-mono">
                        +${(activeStep.analysisData?.detectedSavings || 4335).toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#ECECE6]">
                      <span className="text-[10px] uppercase font-bold text-[#888886] block">Compliance Status</span>
                      <span className="text-xs font-extrabold text-emerald-700">
                        W-9 Verified
                      </span>
                    </div>
                  </div>

                  {/* Executed SQL Query Display */}
                  <div>
                    <span className="text-[10px] font-bold text-[#713F12] uppercase tracking-wider block mb-1">
                      Relational SQL Query Executed Against ERP Database:
                    </span>
                    <div className="p-3 rounded-xl bg-[#18181B] text-[#E4E4E7] font-mono text-[11px] leading-relaxed overflow-x-auto border border-black/10">
                      {activeStep.analysisData?.sqlQueryExecuted || "SELECT po.approved_budget, v.cumulative_q3_spend FROM purchase_orders po JOIN vendors v ON po.vendor_name = v.vendor_name WHERE po.po_number = 'PO-8812';"}
                    </div>
                  </div>

                  {/* Fired Policy Rules */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#854D0E] uppercase">Fired Rules:</span>
                    {(activeStep.analysisData?.rulesFired || ['RULE_VOL_DISC_15', 'RULE_ESC_THRESHOLD_10K', 'RULE_CAL_WINDOW_OK']).map((rule) => (
                      <span key={rule} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FEF08A] text-[#713F12] border border-[#FDE047]">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Step Reasoning */}
              <div>
                <h4 className="text-xs font-bold text-[#888886] uppercase tracking-wider mb-1">
                  System Reasoning & Decision Logic
                </h4>
                <p className="text-xs text-[#333332] bg-[#F9F9F7] p-3.5 rounded-xl border border-[#ECECE6] leading-relaxed">
                  {activeStep.reasoning || 'Standard autonomous step execution based on configured business parameters.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Data */}
                <div>
                  <h4 className="text-xs font-bold text-[#888886] uppercase tracking-wider mb-1">
                    Input Payload
                  </h4>
                  <pre className="text-[11px] font-mono bg-[#18181B] text-[#E4E4E7] p-3.5 rounded-xl overflow-x-auto max-h-48 border border-black/10">
                    {JSON.stringify(activeStep.dataInput || { status: 'Direct Ingest' }, null, 2)}
                  </pre>
                </div>

                {/* Output Data */}
                <div>
                  <h4 className="text-xs font-bold text-[#888886] uppercase tracking-wider mb-1">
                    Output Extracted Record
                  </h4>
                  <pre className="text-[11px] font-mono bg-[#18181B] text-[#E4E4E7] p-3.5 rounded-xl overflow-x-auto max-h-48 border border-black/10">
                    {JSON.stringify(activeStep.dataOutput || { status: activeStep.status }, null, 2)}
                  </pre>
                </div>
              </div>

              {/* If Requires Approval details */}
              {activeStep.requiresApproval && activeStep.approvalDetails && (
                <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-[#FDE047]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#854D0E] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#CA8A04]" />
                      Human-in-the-Loop Sign-off Required
                    </span>
                    <span className="text-xs font-extrabold text-[#111111]">
                      Amount: ${activeStep.approvalDetails.amount?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#713F12] mb-3">
                    {activeStep.approvalDetails.discrepancyNotes}
                  </p>
                  <button
                    onClick={() => onOpenApprovalModal(selectedWorkflow)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs"
                  >
                    Open Human Sign-off Dialog
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
