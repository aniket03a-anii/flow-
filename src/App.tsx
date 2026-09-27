/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { WorkflowsView } from './components/WorkflowsView';
import { CalendarView } from './components/CalendarView';
import { DatabaseExplorerView } from './components/DatabaseExplorerView';
import { EmailCalendarScanner } from './components/EmailCalendarScanner';
import { DocumentSpreadsheetViewer } from './components/DocumentSpreadsheetViewer';
import { AuditTrailView } from './components/AuditTrailView';
import { SettingsView } from './components/SettingsView';
import { ConventionalChatbot } from './components/ConventionalChatbot';
import { ApprovalModal } from './components/ApprovalModal';
import { CreateWorkflowModal } from './components/CreateWorkflowModal';
import { OutgoingIncidentModal } from './components/OutgoingIncidentModal';
import { LoginPage, DEMO_USERS } from './components/LoginPage';
import { MeetingSchedulerView } from './components/MeetingSchedulerView';
import { dbService } from './db/databaseService';

import { 
  Workflow, 
  AuditLog, 
  EmailMessage, 
  CalendarEventItem, 
  SpreadsheetData, 
  DocumentData, 
  IntegrationAccount,
  OutgoingIncidentEmail,
  AppUser,
  ScheduledMeeting,
  MeetingStatus
} from './types/workflow';

import { 
  INITIAL_WORKFLOWS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_EMAILS, 
  INITIAL_OUTGOING_INCIDENT_EMAILS,
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_SPREADSHEETS, 
  INITIAL_DOCUMENTS, 
  INITIAL_INTEGRATIONS 
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(INITIAL_WORKFLOWS[0].id);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [emails, setEmails] = useState<EmailMessage[]>(INITIAL_EMAILS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(INITIAL_CALENDAR_EVENTS);
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetData[]>(INITIAL_SPREADSHEETS);
  const [documents, setDocuments] = useState<DocumentData[]>(INITIAL_DOCUMENTS);
  const [integrations, setIntegrations] = useState<IntegrationAccount[]>(INITIAL_INTEGRATIONS);
  
  const [approvalCeiling, setApprovalCeiling] = useState<number>(10000);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(DEMO_USERS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState<boolean>(false);
  const [outgoingIncidentEmails, setOutgoingIncidentEmails] = useState<OutgoingIncidentEmail[]>(INITIAL_OUTGOING_INCIDENT_EMAILS);
  const [isOutgoingIncidentModalOpen, setIsOutgoingIncidentModalOpen] = useState<boolean>(false);
  const [approvalWorkflow, setApprovalWorkflow] = useState<Workflow | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Database-backed Meetings state
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>(() => dbService.getMeetings());

  const pendingApprovalsCount = workflows.filter((w) => w.status === 'waiting_approval').length;
  const activeWorkflowsCount = workflows.filter((w) => w.status === 'active' || w.status === 'waiting_approval').length;
  const upcomingDeadlinesCount = calendarEvents.filter((e) => e.status === 'upcoming').length;
  const remainingMeetingsCount = meetings.filter((m) => m.status === 'scheduled' || m.status === 'in_progress').length;
  const doneMeetingsCount = meetings.filter((m) => m.status === 'completed').length;

  // Sync meetings with Express backend API
  useEffect(() => {
    fetch('/api/meetings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.meetings)) {
          setMeetings(data.meetings);
        }
      })
      .catch((err) => {
        console.warn('Backend /api/meetings unavailable, local databaseService utilized:', err);
      });
  }, []);

  const handleAddMeeting = async (newMtg: Partial<ScheduledMeeting>) => {
    const created = dbService.addMeeting(newMtg);
    setMeetings([...dbService.getMeetings()]);

    // Also add to Calendar milestones for unified visibility
    const calItem: CalendarEventItem = {
      id: `cal-${created.id}`,
      title: created.title,
      organizer: created.organizer,
      dateTime: created.dateTime,
      dateString: created.dateString,
      timeString: created.timeString,
      type: 'meeting',
      description: created.notes || created.title,
      attendees: created.attendees.map((a) => a.email),
      relatedContext: `Scheduled deliberation session (${created.priority} priority)`,
      relatedWorkflowId: created.relatedWorkflowId,
      status: 'upcoming',
      severity: created.priority === 'critical' ? 'critical' : 'normal',
      linkedMeetingId: created.id
    };
    setCalendarEvents((prev) => [calItem, ...prev]);

    // Sync to Express backend API
    try {
      await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }

    addAuditLog(
      created.relatedWorkflowId || selectedWorkflowId,
      'Meeting Scheduled in Relational Database',
      `Session "${created.title}" scheduled for ${created.dateTime} (${created.durationMinutes} mins). Counterparty: ${created.relatedVendor || 'Internal'}. Added to SQL database.`,
      'info',
      { meeting: created }
    );
  };

  const handleUpdateMeetingStatus = async (id: string, status: MeetingStatus, outcomes?: any) => {
    dbService.updateMeetingStatus(id, status, outcomes);
    setMeetings([...dbService.getMeetings()]);

    // If completed and linked to a workflow, update corresponding workflow or step
    const mtg = dbService.getMeetingById(id);
    if (status === 'completed' && mtg) {
      if (mtg.relatedWorkflowId === 'wf-fin-001' || mtg.title.includes('24,565')) {
        // Mark approval completed on workflow if pending
        setWorkflows((prev) =>
          prev.map((w) => {
            if (w.id === 'wf-fin-001') {
              return {
                ...w,
                status: 'active',
                currentStepIndex: Math.max(w.currentStepIndex, 4),
                steps: w.steps.map((st) =>
                  st.requiresApproval ? { ...st, status: 'completed' as const } : st
                )
              };
            }
            return w;
          })
        );
      }
    }

    try {
      await fetch(`/api/meetings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, outcomes })
      });
    } catch (e) {
      console.warn('Backend status update failed:', e);
    }

    addAuditLog(
      mtg?.relatedWorkflowId || selectedWorkflowId,
      `Meeting Status Updated: ${status.toUpperCase()}`,
      `Meeting "${mtg?.title || id}" transitioned to ${status}. ${outcomes?.resolutionSummary || 'Quorum verified.'}`,
      status === 'completed' ? 'success' : 'info',
      { meetingId: id, status, outcomes }
    );
  };

  const handleDeleteMeeting = async (id: string) => {
    dbService.deleteMeeting(id);
    setMeetings([...dbService.getMeetings()]);

    try {
      await fetch(`/api/meetings/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete failed:', e);
    }

    addAuditLog(
      selectedWorkflowId,
      'Meeting Removed from Database',
      `Meeting ${id} was cancelled and purged from the database table.`,
      'warning',
      { meetingId: id }
    );
  };

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    setApprovalCeiling(user.approvalLimit);
    addAuditLog(
      selectedWorkflowId,
      'User Authenticated via Corporate SSO',
      `Session established for ${user.name} (${user.role}) - Approval Ceiling: $${user.approvalLimit.toLocaleString()}.`,
      'info',
      { user }
    );
  };

  const handleLogout = () => {
    if (currentUser) {
      addAuditLog(
        selectedWorkflowId,
        'User Session Terminated',
        `${currentUser.name} signed out. Redirecting to corporate SSO portal.`,
        'info',
        { user: currentUser }
      );
    }
    setCurrentUser(null);
  };

  // Calendar Sync
  const handleSyncCalendar = () => {
    setIsSyncingCalendar(true);
    setTimeout(() => {
      setIsSyncingCalendar(false);
      addAuditLog(
        selectedWorkflowId,
        'Google Calendar API Synced',
        'Refreshed bank clearing cutoffs and milestone cure windows from Google Calendar API. 5 milestones indexed.',
        'info',
        { syncedCount: calendarEvents.length, source: 'Google Calendar API' }
      );
      alert('✓ Calendar synchronized with Google Calendar API. Verified 5 business milestones and Friday bank cutoff.');
    }, 900);
  };

  // Dispatch outgoing incident email
  const handleDispatchOutgoingIncident = (email: OutgoingIncidentEmail, createWorkflow: boolean) => {
    setOutgoingIncidentEmails((prev) => [email, ...prev]);

    addAuditLog(
      email.linkedWorkflowId || 'wf-fin-001',
      `Outgoing Incident Dispatched [${email.incidentId}]`,
      `Transmitted ${email.severity} notice to ${email.to} enforcing policy: "${email.policyTriggered}". SMTP Status: 250 OK.`,
      email.severity.includes('P1') ? 'critical' : 'warning',
      { incidentId: email.incidentId, recipient: email.to, policy: email.policyTriggered, smtpLog: email.smtpLog }
    );

    if (createWorkflow) {
      const newIncidentWf: Workflow = {
        id: `wf-inc-${email.incidentId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        title: `Remediate ${email.incidentId}: ${email.subject.substring(0, 36)}...`,
        objective: `Track counterparty response and resolution for outgoing incident notice ${email.incidentId}. Enforce compliance with ${email.policyTriggered}.`,
        category: 'compliance',
        priority: email.severity.includes('P1') ? 'critical' : 'high',
        status: 'active',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        currentStepIndex: 1,
        triggerSource: `Outgoing Incident Email (${email.incidentId})`,
        associatedEntities: {
          vendorOrClient: email.to.split('@')[1] || 'Vendor',
          dueDate: '2026-10-02'
        },
        steps: [
          {
            id: `step-${Date.now()}-1`,
            title: 'Transmit Formal Incident Notice',
            description: `Delivered via Google Workspace relay to ${email.to}. Status: 250 OK.`,
            source: 'gmail',
            status: 'completed',
            completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            dataOutput: { incidentId: email.incidentId, recipient: email.to, status: 'Delivered' }
          },
          {
            id: `step-${Date.now()}-2`,
            title: 'Awaiting Counterparty Formal Response / SLA Cure',
            description: `Monitoring inbound mailbox for reference ${email.incidentId}. Cure window active.`,
            source: 'analysis',
            status: 'running',
            startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            reasoning: 'System awaiting vendor acknowledgment or adjusted ledger remittance.'
          },
          {
            id: `step-${Date.now()}-3`,
            title: 'Escalation to General Counsel & CFO if Unremediated',
            description: 'If vendor fails to respond within cure window, initiate formal commercial dispute.',
            source: 'human_approval',
            status: 'pending',
            requiresApproval: true
          }
        ],
        auditTrailIds: []
      };

      setWorkflows((prev) => [newIncidentWf, ...prev]);
      setSelectedWorkflowId(newIncidentWf.id);
    }

    setCurrentTab('scanner');
  };

  // Simulate counterparty reply
  const handleSimulateCounterpartyReply = (outgoing: OutgoingIncidentEmail) => {
    const isVanguard = outgoing.to.includes('vanguard');
    const isApex = outgoing.to.includes('apex');

    const replySubject = `RE: ${outgoing.subject}`;
    const replySender = isVanguard ? 'billing@vanguardindustrial.com' : isApex ? 'collections@apexlogix.io' : outgoing.to;
    const replyName = isVanguard ? 'Elena Rostova (Vanguard Accounts)' : isApex ? 'Apex Logix Collections' : 'Counterparty Response';

    const replyBody = isVanguard 
      ? `Dear John,\n\nWe acknowledge receipt of Incident Notice ${outgoing.incidentId} regarding Invoice INV-9044.\n\nOur controller has verified Section 4.2 eligibility based on your $54,200 quarterly volume spend. We have adjusted our accounts receivable ledger to reflect the 15% discount ($4,335.00), bringing the net balance due to $24,565.00.\n\nPlease proceed with payment execution in Friday's 14:00 batch.\n\nBest regards,\nElena Rostova`
      : `Dear Takasho Finance Team,\n\nReceipt of Cure Schedule Notice ${outgoing.incidentId} is acknowledged. We have registered your Monday CFO review meeting and initial 50% wire remittance commitment ($7,250.00).\n\nPer Section 7.2, account suspension is stayed pending remittance confirmation.\n\nApex Logix Collections Desk`;

    const newReplyEmail: EmailMessage = {
      id: `email-reply-${Date.now()}`,
      from: replySender,
      senderName: replyName,
      to: 'incident-response@takasho-enterprises.com',
      subject: replySubject,
      date: 'Just now',
      snippet: replyBody.substring(0, 100) + '...',
      body: replyBody,
      detectedKeywords: [outgoing.incidentId, 'ACKNOWLEDGED', 'ADJUSTED', 'RECONCILED'],
      extractedAmount: isVanguard ? 24565 : 7250,
      extractedDeadline: '2026-10-02',
      isRead: false
    };

    setEmails((prev) => [newReplyEmail, ...prev]);

    addAuditLog(
      outgoing.linkedWorkflowId || 'wf-fin-001',
      `Counterparty Incident Reply Received [${outgoing.incidentId}]`,
      `Inbound reply received from ${replySender} acknowledging incident notice and agreeing to terms.`,
      'success',
      { replyEmailId: newReplyEmail.id, subject: replySubject }
    );

    alert(`✓ Counterparty reply received from ${replyName} for ${outgoing.incidentId}!\n\nAdded to Inbound Gmail Scanner and logged in Audit Trail.`);
  };

  // Add an audit log entry
  const addAuditLog = (
    workflowId: string,
    action: string,
    details: string,
    severity: 'info' | 'warning' | 'critical' | 'success',
    payload?: any
  ) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      workflowId,
      actor: 'System Engine',
      action,
      details,
      severity,
      payload
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Update a workflow in state
  const handleUpdateWorkflow = (updated: Workflow) => {
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  // Open approval modal
  const handleOpenApprovalModal = (wf: Workflow) => {
    setApprovalWorkflow(wf);
  };

  // Human approval action
  const handleApproveWorkflow = (workflowId: string, updatedDraft: string) => {
    const target = workflows.find((w) => w.id === workflowId);
    if (!target) return;

    const updatedSteps = [...target.steps];
    const approvalStepIdx = target.currentStepIndex;
    if (updatedSteps[approvalStepIdx]) {
      updatedSteps[approvalStepIdx].status = 'completed';
      updatedSteps[approvalStepIdx].completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      if (updatedSteps[approvalStepIdx].approvalDetails) {
        updatedSteps[approvalStepIdx].approvalDetails!.proposedDraft = updatedDraft;
      }
    }

    // Advance to next step or complete
    let nextIdx = approvalStepIdx + 1;
    let finalStatus = target.status;
    if (nextIdx < updatedSteps.length) {
      updatedSteps[nextIdx].status = 'completed'; // auto-disburse remaining
      nextIdx = updatedSteps.length;
      finalStatus = 'completed';
    } else {
      finalStatus = 'completed';
    }

    const updatedWf: Workflow = {
      ...target,
      status: finalStatus,
      currentStepIndex: nextIdx >= updatedSteps.length ? updatedSteps.length - 1 : nextIdx,
      steps: updatedSteps,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    handleUpdateWorkflow(updatedWf);
    addAuditLog(
      workflowId,
      'Human Supervisor Sign-off Granted',
      `John Doe authorized payment of $${target.associatedEntities.amount?.toLocaleString()} to ${target.associatedEntities.vendorOrClient}. Outbound notice dispatched to vendor.`,
      'success',
      { approver: 'John Doe', approvedAmount: target.associatedEntities.amount, draft: updatedDraft }
    );
  };

  // Reject action
  const handleRejectWorkflow = (workflowId: string, reason: string) => {
    const target = workflows.find((w) => w.id === workflowId);
    if (!target) return;

    const updatedWf: Workflow = {
      ...target,
      status: 'failed',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    handleUpdateWorkflow(updatedWf);
    addAuditLog(
      workflowId,
      'Supervisor Dispute / Rejection',
      `Payment rejected by supervisor: "${reason}". Escalated to CFO and vendor accounts for re-negotiation.`,
      'critical',
      { reason, reviewer: 'John Doe' }
    );
  };

  // Inbound Scanner Trigger
  const handleQuickScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      addAuditLog(
        'wf-fin-001',
        'Inbound Source Refresh Complete',
        'Scanned 3 connected mailboxes, 2 calendar schedules, and Accounts_Aging_Q3.xlsx. Zero unhandled exceptions.',
        'info',
        { scannedSources: ['gmail', 'google_calendar', 'excel_aging'] }
      );
      alert('✓ Inbound scan complete. 3 emails analyzed, 2 calendar deadlines verified, spreadsheet cells indexed.');
    }, 1000);
  };

  // Simulate incoming email
  const handleSimulateInboundEmail = () => {
    const newEmail: EmailMessage = {
      id: `email-${Date.now()}`,
      from: 'accounts@solariaenergy.com',
      senderName: 'Solaria Energy Accounts',
      to: 'john.doe@takasho-enterprises.com',
      subject: 'URGENT REMINDER: Overdue Invoice INV-9110 Settlement Schedule ($42,000)',
      date: 'Just now',
      snippet: 'Regarding Invoice INV-9110 past due by 21 days. Requesting confirmation of payment before scheduled CFO cash review meeting...',
      body: 'Dear John,\n\nWe noted that Invoice INV-9110 for $42,000 remains pending on your accounts aging report. Per our quarterly service covenant, please advise if remittance will execute in this week\'s batch.\n\nThank you,\nSolaria Accounts Payable',
      detectedKeywords: ['URGENT', 'INV-9110', 'OVERDUE', 'SETTLEMENT'],
      extractedAmount: 42000,
      extractedDeadline: '2026-10-05',
      isRead: false
    };

    setEmails((prev) => [newEmail, ...prev]);
    addAuditLog(
      'wf-fin-001',
      'Inbound Email Ingestion',
      `Parsed new inbound email from ${newEmail.from} with extracted obligation $42,000 and keywords [${newEmail.detectedKeywords.join(', ')}].`,
      'warning',
      { emailId: newEmail.id, subject: newEmail.subject }
    );
    setCurrentTab('scanner');
  };

  // Auto create workflow from email
  const handleCreateWorkflowFromEmail = (email: EmailMessage) => {
    const newWf: Workflow = {
      id: `wf-auto-${Date.now().toString().slice(-4)}`,
      title: `Remediate ${email.detectedKeywords[1] || 'Invoice'} (${email.senderName})`,
      objective: `Process inbound email request regarding ${email.subject}. Reconcile with Accounts Aging spreadsheet and prepare supervisor sign-off.`,
      category: 'finance',
      priority: email.detectedKeywords.includes('URGENT') ? 'critical' : 'high',
      status: 'waiting_approval',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      currentStepIndex: 1,
      triggerSource: `Gmail Inbound (${email.from})`,
      associatedEntities: {
        vendorOrClient: email.senderName,
        amount: email.extractedAmount || 15000,
        dueDate: email.extractedDeadline || '2026-10-05',
        relatedEmailId: email.id
      },
      steps: [
        {
          id: `step-${Date.now()}-1`,
          title: 'Gmail Context Extraction & Keyword Scoring',
          description: `Extracted terms from ${email.from}. High urgency score flagged.`,
          source: 'gmail',
          status: 'completed',
          dataOutput: { sender: email.from, amount: email.extractedAmount, keywords: email.detectedKeywords }
        },
        {
          id: `step-${Date.now()}-2`,
          title: 'Human-in-the-Loop Settlement Authorization',
          description: `Transaction value ($${(email.extractedAmount || 15000).toLocaleString()}) triggers supervisor sign-off gate AP-10K.`,
          source: 'human_approval',
          status: 'waiting_approval',
          requiresApproval: true,
          approvalDetails: {
            actionName: 'Approve Payment Scheduling',
            amount: email.extractedAmount || 15000,
            recipient: email.senderName,
            proposedDraft: `Dear ${email.senderName},\n\nWe have received your reminder regarding ${email.subject}. Management has approved this invoice for inclusion in Friday's disbursement run.\n\nWarm regards,\nTakasho Finance`,
            discrepancyNotes: 'Urgent reminder matched with Accounts Aging Q3 delinquency list.'
          }
        },
        {
          id: `step-${Date.now()}-3`,
          title: 'ERP Ledger Posting & Vendor Confirmation',
          description: 'Update voucher status to paid and dispatch wire confirmation.',
          source: 'erp',
          status: 'pending'
        }
      ],
      auditTrailIds: []
    };

    setWorkflows((prev) => [newWf, ...prev]);
    setSelectedWorkflowId(newWf.id);
    setCurrentTab('workflows');
    addAuditLog(
      newWf.id,
      'Autonomous Workflow Spurred from Email',
      `Auto-created multi-step remediation pipeline from inbound message: "${email.subject}".`,
      'info',
      { workflowId: newWf.id, emailSubject: email.subject }
    );
  };

  const handleEnrichWithRange = (sheetName: string, range: string, calculatedValue: any) => {
    addAuditLog(
      selectedWorkflowId,
      'Spreadsheet Range Context Ingested',
      `Extracted cell range ${sheetName}!${range} (computed aggregate $${calculatedValue.toLocaleString()}) to enrich active workflow decision matrix.`,
      'info',
      { sheet: sheetName, range, calculatedValue }
    );
    alert(`Enriched active workflow with range ${sheetName}!${range} ($${calculatedValue.toLocaleString()}). Check Audit Trail!`);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#EFEFEA] text-[#111111] font-sans antialiased flex flex-col justify-center p-2 sm:p-5 lg:p-7">
      {/* Outer Mockup Framing - Exact Neumorphic Style from image.png */}
      <div className="w-full max-w-[1520px] mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-[#DFDFD9] overflow-hidden flex flex-col md:flex-row min-h-[920px]">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingApprovalsCount={pendingApprovalsCount}
          activeWorkflowsCount={activeWorkflowsCount}
          upcomingDeadlinesCount={upcomingDeadlinesCount}
          remainingMeetingsCount={remainingMeetingsCount}
          onLogout={handleLogout}
        />

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFA]">
          {/* Top Bar Header */}
          <Header
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchUser={handleLogout}
            onOpenNewWorkflowModal={() => setIsCreateModalOpen(true)}
            pendingApprovalsCount={pendingApprovalsCount}
            onOpenPendingApprovals={() => {
              const waiting = workflows.find((w) => w.status === 'waiting_approval');
              if (waiting) {
                setApprovalWorkflow(waiting);
              } else {
                setCurrentTab('workflows');
              }
            }}
            onQuickScan={handleQuickScan}
            isScanning={isScanning}
          />

          {/* Body Content Container */}
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
            {currentTab === 'overview' && (
              <OverviewDashboard
                workflows={workflows}
                onSelectWorkflow={(id) => {
                  setSelectedWorkflowId(id);
                  setCurrentTab('workflows');
                }}
                onOpenApprovalModal={handleOpenApprovalModal}
                onNavigateToTab={setCurrentTab}
              />
            )}

            {currentTab === 'workflows' && (
              <WorkflowsView
                workflows={workflows}
                selectedWorkflowId={selectedWorkflowId}
                onSelectWorkflow={setSelectedWorkflowId}
                onUpdateWorkflow={handleUpdateWorkflow}
                onOpenApprovalModal={handleOpenApprovalModal}
                onAddAuditLog={addAuditLog}
              />
            )}

            {currentTab === 'meetings' && (
              <MeetingSchedulerView
                meetings={meetings}
                onAddMeeting={handleAddMeeting}
                onUpdateMeetingStatus={handleUpdateMeetingStatus}
                onDeleteMeeting={handleDeleteMeeting}
                onSelectWorkflow={(id) => {
                  setSelectedWorkflowId(id);
                  setCurrentTab('workflows');
                }}
                onNavigateToTab={setCurrentTab}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarView
                events={calendarEvents}
                onSelectWorkflow={(id) => {
                  setSelectedWorkflowId(id);
                  setCurrentTab('workflows');
                }}
                onAddEvent={(e) => {
                  setCalendarEvents((prev) => [e, ...prev]);
                  addAuditLog(
                    e.relatedWorkflowId || selectedWorkflowId,
                    'Calendar Milestone Scheduled',
                    `New business milestone scheduled: "${e.title}" at ${e.dateTime}.`,
                    'info',
                    { milestone: e }
                  );
                }}
                onSyncCalendar={handleSyncCalendar}
                isSyncing={isSyncingCalendar}
                onNavigateToMeetings={() => setCurrentTab('meetings')}
              />
            )}

            {currentTab === 'database' && (
              <DatabaseExplorerView
                onSelectWorkflow={(id) => {
                  setSelectedWorkflowId(id);
                  setCurrentTab('workflows');
                }}
              />
            )}

            {currentTab === 'chatbot' && (
              <ConventionalChatbot
                workflows={workflows}
                emails={emails}
                calendarEvents={calendarEvents}
                spreadsheets={spreadsheets}
                documents={documents}
                auditLogs={auditLogs}
                onOpenApprovalModal={handleOpenApprovalModal}
                onSelectWorkflow={(id) => {
                  setSelectedWorkflowId(id);
                  setCurrentTab('workflows');
                }}
                onNavigateToTab={setCurrentTab}
                onTriggerScan={handleQuickScan}
              />
            )}

            {currentTab === 'scanner' && (
              <EmailCalendarScanner
                emails={emails}
                calendarEvents={calendarEvents}
                integrations={integrations}
                outgoingIncidentEmails={outgoingIncidentEmails}
                onTriggerScan={handleQuickScan}
                isScanning={isScanning}
                onSimulateInboundEmail={handleSimulateInboundEmail}
                onCreateWorkflowFromEmail={handleCreateWorkflowFromEmail}
                onToggleIntegration={(id) => {
                  alert(`Integration account ${id} re-synchronized.`);
                }}
                onOpenOutgoingIncidentModal={() => setIsOutgoingIncidentModalOpen(true)}
                onSimulateCounterpartyReply={handleSimulateCounterpartyReply}
                onSelectWorkflow={(id) => {
                  setSelectedWorkflowId(id);
                  setCurrentTab('workflows');
                }}
              />
            )}

            {currentTab === 'docs' && (
              <DocumentSpreadsheetViewer
                spreadsheets={spreadsheets}
                documents={documents}
                onUploadSpreadsheet={(sheet) => setSpreadsheets((prev) => [sheet, ...prev])}
                onUploadDocument={(doc) => setDocuments((prev) => [doc, ...prev])}
                onEnrichWorkflowWithRange={handleEnrichWithRange}
              />
            )}

            {currentTab === 'audit' && (
              <AuditTrailView
                logs={auditLogs}
                workflowIds={workflows.map((w) => w.id)}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                integrations={integrations}
                onToggleIntegration={(id) => alert(`Re-authorized token for ${id}`)}
                approvalCeiling={approvalCeiling}
                onUpdateApprovalCeiling={setApprovalCeiling}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            )}
          </main>
        </div>
      </div>

      {/* Human Approval Sign-off Modal */}
      <ApprovalModal
        workflow={approvalWorkflow}
        isOpen={Boolean(approvalWorkflow)}
        onClose={() => setApprovalWorkflow(null)}
        onApprove={handleApproveWorkflow}
        onReject={handleRejectWorkflow}
      />

      {/* Create / Launch Workflow Modal */}
      <CreateWorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateWorkflow={(newWf) => {
          setWorkflows((prev) => [newWf, ...prev]);
          setSelectedWorkflowId(newWf.id);
          setCurrentTab('workflows');
          addAuditLog(
            newWf.id,
            'New Autonomous Workflow Initiated',
            `User launched workflow "${newWf.title}" for counterparty ${newWf.associatedEntities.vendorOrClient} ($${newWf.associatedEntities.amount?.toLocaleString()}).`,
            'info',
            { workflow: newWf }
          );
        }}
      />

      {/* Outgoing Incident Email Simulation Modal */}
      <OutgoingIncidentModal
        isOpen={isOutgoingIncidentModalOpen}
        onClose={() => setIsOutgoingIncidentModalOpen(false)}
        onDispatch={handleDispatchOutgoingIncident}
        workflows={workflows}
      />
    </div>
  );
}
