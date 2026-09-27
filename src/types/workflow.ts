export type WorkflowStatus = 'active' | 'waiting_approval' | 'completed' | 'failed' | 're_planned';

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval' | 'skipped' | 're_planned';

export type StepSource = 
  | 'gmail' 
  | 'calendar' 
  | 'spreadsheet' 
  | 'document' 
  | 'database' 
  | 'analysis' 
  | 'ai_decision' 
  | 'human_approval' 
  | 'erp';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  source: StepSource;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  dataInput?: Record<string, any>;
  dataOutput?: Record<string, any>;
  reasoning?: string;
  error?: string;
  requiresApproval?: boolean;
  approvalDetails?: {
    actionName: string;
    amount?: number;
    recipient?: string;
    proposedDraft?: string;
    discrepancyNotes?: string;
  };
  analysisData?: {
    databaseMatchScore?: number;
    cashflowRisk?: 'Low' | 'Medium' | 'High';
    calendarDeadlineVarianceHours?: number;
    policyCheckPass?: boolean;
    detectedSavings?: number;
    sqlQueryExecuted?: string;
    rulesFired?: string[];
  };
}

export interface Workflow {
  id: string;
  title: string;
  objective: string;
  category: 'finance' | 'procurement' | 'compliance' | 'operations';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  triggerSource: string;
  associatedEntities: {
    vendorOrClient?: string;
    amount?: number;
    dueDate?: string;
    relatedEmailId?: string;
    relatedSpreadsheetRange?: string;
    relatedDocId?: string;
  };
  auditTrailIds: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  workflowId: string;
  stepId?: string;
  actor: 'System Engine' | 'Gemini Reasoner' | 'Gmail Scanner' | 'Spreadsheet Ingester' | 'Database Query Engine' | 'Analysis Engine' | 'John Doe (User)';
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  payload?: Record<string, any>;
}

export interface EmailMessage {
  id: string;
  from: string;
  senderName: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  detectedKeywords: string[];
  matchedWorkflowId?: string;
  extractedDeadline?: string;
  extractedAmount?: number;
  isRead: boolean;
}

export type CalendarEventType = 'payment_cutoff' | 'meeting' | 'cure_deadline' | 'sla_review';

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type MeetingType = 'executive_review' | 'vendor_cure' | 'dispute_resolution' | 'post_mortem' | 'quarterly_audit' | 'board_signoff';

export interface MeetingAttendee {
  name: string;
  email: string;
  role: string;
  status: 'confirmed' | 'tentative' | 'declined';
}

export interface MeetingSimulationStep {
  stepNumber: number;
  speaker: string;
  avatarRole: string;
  action: string;
  dialogue: string;
  timestamp: string;
  status: 'pending' | 'active' | 'completed';
}

export interface MeetingActionItem {
  id: string;
  task: string;
  assignee: string;
  due: string;
  completed: boolean;
}

export interface ScheduledMeeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus; // 'scheduled' (Remaining) | 'in_progress' | 'completed' (Done) | 'cancelled'
  dateString: string; // YYYY-MM-DD
  timeString: string; // e.g. "10:00"
  dateTime: string;
  durationMinutes: number;
  organizer: string;
  attendees: MeetingAttendee[];
  agenda: string[];
  relatedWorkflowId?: string;
  relatedVendor?: string;
  priority: 'critical' | 'high' | 'normal';
  meetingLink?: string;
  notes?: string;
  outcomes?: {
    resolutionSummary: string;
    decision: 'approved' | 'conditional_approval' | 'escalated' | 'adjourned';
    actionItems: MeetingActionItem[];
    approvedDisbursement?: number;
    executedAt?: string;
  };
  simulationTranscript?: MeetingSimulationStep[];
  databaseSynced: boolean;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  organizer: string;
  dateTime: string;
  dateString: string; // YYYY-MM-DD
  timeString: string; // e.g. "14:00"
  type: CalendarEventType;
  description: string;
  attendees: string[];
  relatedContext: string;
  relatedWorkflowId?: string;
  status: 'upcoming' | 'today' | 'passed';
  severity?: 'critical' | 'warning' | 'normal';
  linkedMeetingId?: string;
}

export interface DatabaseRecord {
  id: string;
  table: 'invoices' | 'purchase_orders' | 'vendors' | 'tax_compliance' | 'general_ledger' | 'meetings';
  record: Record<string, any>;
}

export interface SpreadsheetData {
  id: string;
  title: string;
  fileName: string;
  sheetName: string;
  rowsCount: number;
  columns: string[];
  data: Record<string, any>[];
  lastUpdated: string;
}

export interface DocumentData {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: string;
  uploadDate: string;
  extractedText: string;
  summary: string;
  keyEntities: {
    vendor: string;
    effectiveDate: string;
    expirationDate: string;
    paymentTerms: string;
    totalObligation?: string;
    penaltiesClause: string;
    governingLaw: string;
  };
}

export interface IntegrationAccount {
  id: string;
  name: string;
  service: 'gmail' | 'calendar' | 'sheets' | 'drive' | 'quickbooks';
  accountEmail: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  permissions: string[];
}

export type IncidentSeverity = 'P1 - Critical' | 'P2 - High' | 'P3 - Moderate' | 'P4 - Low';

export interface OutgoingIncidentEmail {
  id: string;
  incidentId: string;
  severity: IncidentSeverity;
  to: string;
  cc?: string[];
  from: string;
  subject: string;
  timestamp: string;
  status: 'drafting' | 'dispatching' | 'delivered' | 'failed';
  body: string;
  policyTriggered: string;
  linkedWorkflowId?: string;
  smtpStatusCode?: number;
  smtpLog?: string;
  stakeholdersNotified: string[];
  dispatchedBy: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  avatarBgColor: string;
  approvalLimit: number;
}


