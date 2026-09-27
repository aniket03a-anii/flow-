import { Workflow, EmailMessage, CalendarEventItem, SpreadsheetData, DocumentData, AuditLog, IntegrationAccount, OutgoingIncidentEmail } from '../types/workflow';

export const INITIAL_INTEGRATIONS: IntegrationAccount[] = [
  {
    id: 'int-gmail',
    name: 'Google Workspace Gmail',
    service: 'gmail',
    accountEmail: 'john.doe@takasho-enterprises.com',
    status: 'connected',
    lastSync: '2 minutes ago',
    permissions: ['gmail.readonly', 'gmail.compose', 'gmail.modify']
  },
  {
    id: 'int-calendar',
    name: 'Google Calendar API',
    service: 'calendar',
    accountEmail: 'john.doe@takasho-enterprises.com',
    status: 'connected',
    lastSync: '4 minutes ago',
    permissions: ['calendar.events.readonly', 'calendar.events.write']
  },
  {
    id: 'int-sheets',
    name: 'Google Sheets & Drive Ingest',
    service: 'sheets',
    accountEmail: 'john.doe@takasho-enterprises.com',
    status: 'connected',
    lastSync: '10 minutes ago',
    permissions: ['spreadsheets.readonly', 'drive.file']
  },
  {
    id: 'int-quickbooks',
    name: 'Intuit QuickBooks ERP',
    service: 'quickbooks',
    accountEmail: 'finance@takasho-enterprises.com',
    status: 'connected',
    lastSync: '1 hour ago',
    permissions: ['accounting.transactions', 'ledger.read']
  }
];

export const INITIAL_SPREADSHEETS: SpreadsheetData[] = [
  {
    id: 'sheet-aging-q3',
    title: 'Accounts Receivable Aging Q3',
    fileName: 'Accounts_Aging_Q3.xlsx',
    sheetName: 'Overdue_Aging',
    rowsCount: 8,
    columns: ['Invoice_ID', 'Client_Vendor', 'Due_Date', 'Overdue_Days', 'Original_Amt', 'Adjusted_Amt', 'Status', 'Contract_Ref'],
    lastUpdated: '2026-09-26 14:20',
    data: [
      { Invoice_ID: 'INV-9021', Client_Vendor: 'Apex Logix Ltd', Due_Date: '2026-08-15', Overdue_Days: 42, Original_Amt: 14500, Adjusted_Amt: 14500, Status: 'Critical Overdue', Contract_Ref: 'CTR-2025-A9' },
      { Invoice_ID: 'INV-9044', Client_Vendor: 'Vanguard Industrial', Due_Date: '2026-08-28', Overdue_Days: 29, Original_Amt: 28900, Adjusted_Amt: 24565, Status: 'Disputed Terms', Contract_Ref: 'CTR-2025-V2' },
      { Invoice_ID: 'INV-9088', Client_Vendor: 'Nordic Cloud Systems', Due_Date: '2026-09-02', Overdue_Days: 24, Original_Amt: 9800, Adjusted_Amt: 9800, Status: 'Follow-up Sent', Contract_Ref: 'CTR-2026-N1' },
      { Invoice_ID: 'INV-9110', Client_Vendor: 'Solaria Energy Group', Due_Date: '2026-09-05', Overdue_Days: 21, Original_Amt: 42000, Adjusted_Amt: 42000, Status: 'Pending CFO Call', Contract_Ref: 'CTR-2024-S8' },
      { Invoice_ID: 'INV-9132', Client_Vendor: 'Meridian Health Tech', Due_Date: '2026-09-12', Overdue_Days: 14, Original_Amt: 16200, Adjusted_Amt: 16200, Status: 'Reminder Queued', Contract_Ref: 'CTR-2026-M4' },
      { Invoice_ID: 'INV-9155', Client_Vendor: 'Kestrel Logistics', Due_Date: '2026-09-18', Overdue_Days: 8, Original_Amt: 7450, Adjusted_Amt: 7450, Status: 'Grace Period', Contract_Ref: 'CTR-2025-K3' },
      { Invoice_ID: 'INV-9170', Client_Vendor: 'CyberPulse Security', Due_Date: '2026-09-20', Overdue_Days: 6, Original_Amt: 19800, Adjusted_Amt: 19800, Status: 'Grace Period', Contract_Ref: 'CTR-2026-C7' },
      { Invoice_ID: 'INV-9195', Client_Vendor: 'Zion Robotics Corp', Due_Date: '2026-09-22', Overdue_Days: 4, Original_Amt: 33100, Adjusted_Amt: 33100, Status: 'Grace Period', Contract_Ref: 'CTR-2025-Z0' }
    ]
  },
  {
    id: 'sheet-pos-q3',
    title: 'Purchase Orders & Approvals Matrix',
    fileName: 'Vendor_POs_Matrix.xlsx',
    sheetName: 'PO_Reconciliation',
    rowsCount: 5,
    columns: ['PO_Number', 'Supplier', 'Issued_Date', 'PO_Budget', 'Billed_Amount', 'Variance', 'Approval_State'],
    lastUpdated: '2026-09-25 18:00',
    data: [
      { PO_Number: 'PO-8812', Supplier: 'Vanguard Industrial', Issued_Date: '2026-07-20', PO_Budget: 24565, Billed_Amount: 28900, Variance: '+4,335 (Over)', Approval_State: 'Flagged Discrepancy' },
      { PO_Number: 'PO-8830', Supplier: 'Nordic Cloud Systems', Issued_Date: '2026-08-01', PO_Budget: 9800, Billed_Amount: 9800, Variance: '0 (Matched)', Approval_State: 'Pre-Approved' },
      { PO_Number: 'PO-8874', Supplier: 'Apex Logix Ltd', Issued_Date: '2026-08-10', PO_Budget: 14500, Billed_Amount: 14500, Variance: '0 (Matched)', Approval_State: 'Disbursement Ready' },
      { PO_Number: 'PO-8899', Supplier: 'OmniHardware Global', Issued_Date: '2026-08-15', PO_Budget: 11200, Billed_Amount: 11200, Variance: '0 (Matched)', Approval_State: 'Paid' },
      { PO_Number: 'PO-8915', Supplier: 'Solaria Energy Group', Issued_Date: '2026-08-25', PO_Budget: 42000, Billed_Amount: 42000, Variance: '0 (Matched)', Approval_State: 'Executive Signoff' }
    ]
  }
];

export const INITIAL_DOCUMENTS: DocumentData[] = [
  {
    id: 'doc-vanguard-ctr',
    title: 'Master Service Agreement - Vanguard Industrial',
    fileName: 'Service_Agreement_Vanguard_v2.pdf',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-09-20',
    extractedText: `MASTER SERVICE AGREEMENT (MSA)
PARTIES: Takasho Enterprises (Client) and Vanguard Industrial Corp (Vendor).
SECTION 4.2 - VOLUME DISCOUNT & RETENTION: If Client maintains prompt settlement or reaches cumulative quarterly orders exceeding $50,000, a mandatory 15% discount shall apply to all secondary equipment invoices issued in Q3.
SECTION 8.1 - PAYMENT TERMS: Net 30 days from delivery receipt. Late payments after 45 days incur 1.5% interest per month.
SECTION 12.4 - DISPUTE RESOLUTION: Any discrepancy between Purchase Orders and Bill of Lading must be resolved within 10 business days before interest calculation.`,
    summary: 'Master Agreement with Vanguard Industrial confirming a 15% volume discount under Section 4.2 when quarterly threshold is achieved. Explains invoice variance between $28,900 and $24,565.',
    keyEntities: {
      vendor: 'Vanguard Industrial Corp',
      effectiveDate: '2025-01-15',
      expirationDate: '2027-01-14',
      paymentTerms: 'Net 30 days',
      totalObligation: '$50,000 threshold for 15% discount',
      penaltiesClause: '1.5% monthly on undisputed balances > 45 days',
      governingLaw: 'State of California / Delaware Commercial Code'
    }
  },
  {
    id: 'doc-apex-sla',
    title: 'Apex Logix Service Level & Collections Terms',
    fileName: 'Apex_SLA_Terms_2025.docx',
    fileType: 'docx',
    fileSize: '1.1 MB',
    uploadDate: '2026-09-15',
    extractedText: `SERVICE LEVEL AGREEMENT & ESCALATION PROTOCOL
Contract Ref: CTR-2025-A9.
APEX LOGIX LTD obligations: Total outstanding obligations older than 30 days trigger tier-2 formal demand notice before legal referral.
Clause 7: Cure period is 7 calendar days following written notice to apex-billing@apexlogix.io.`,
    summary: 'Apex Logix collections protocol specifying tier-2 escalation after 30 days overdue with 7-day cure window.',
    keyEntities: {
      vendor: 'Apex Logix Ltd',
      effectiveDate: '2025-03-01',
      expirationDate: '2027-02-28',
      paymentTerms: 'Net 15 days',
      penaltiesClause: 'Tier-2 demand notice upon 30 days delinquency',
      governingLaw: 'New York Commercial Uniform Code'
    }
  }
];

export const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: 'email-1',
    from: 'billing@vanguardindustrial.com',
    senderName: 'Vanguard Industrial Accounts',
    to: 'john.doe@takasho-enterprises.com',
    subject: 'URGENT: Outstanding Balance on INV-9044 & Clause 4.2 Discount Clarification',
    date: 'Today, 09:14 AM',
    snippet: 'Regarding INV-9044 ($28,900): As discussed, our invoice did not reflect the 15% discount ($4,335) from Section 4.2. Adjusted balance should be $24,565...',
    body: `Hello John,\n\nWe received your inquiry regarding Invoice INV-9044 billed at $28,900. After cross-referencing our Master Service Agreement (CTR-2025-V2) Section 4.2, we verified that Takasho Enterprises qualifies for the 15% quarterly discount ($4,335.00).\n\nPlease find the revised payable amount of $24,565.00. We kindly request payment confirmation prior to Friday to maintain our preferred freight scheduling.\n\nBest regards,\nElena Rostova\nHead of Accounts | Vanguard Industrial Corp`,
    detectedKeywords: ['URGENT', 'INV-9044', 'DISCOUNT', 'OUTSTANDING', 'OVERDUE'],
    extractedAmount: 24565,
    extractedDeadline: '2026-10-02',
    isRead: false
  },
  {
    id: 'email-2',
    from: 'collections@apexlogix.io',
    senderName: 'Apex Logix Collections',
    to: 'finance@takasho-enterprises.com',
    subject: 'OVERDUE NOTICE: Invoice INV-9021 is 42 Days Past Due ($14,500)',
    date: 'Yesterday, 04:30 PM',
    snippet: 'This is a formal reminder that INV-9021 for $14,500 is 42 days overdue. Please submit wire confirmation to avoid service interruption...',
    body: `Dear Accounts Payable,\n\nOur records show that Invoice INV-9021 for the amount of $14,500.00 remains unpaid after 42 days (due date was 2026-08-15).\nUnder Section 7 of our SLA, account suspension will occur if payment is not initiated within 48 hours.\n\nPlease remit via ACH or respond with payment scheduling.\n\nApex Logix Billing Desk`,
    detectedKeywords: ['OVERDUE', 'INV-9021', 'PAST DUE', 'SUSPENSION', 'WIRE'],
    extractedAmount: 14500,
    extractedDeadline: '2026-09-28',
    isRead: true
  },
  {
    id: 'email-3',
    from: 'david.chen@nordiccloud.com',
    senderName: 'David Chen (Nordic Cloud)',
    to: 'john.doe@takasho-enterprises.com',
    subject: 'Cloud Infrastructure PO-8830 Reconciled & Ready for Final Run',
    date: '2026-09-24, 11:20 AM',
    snippet: 'All compute nodes for August were verified against PO-8830. Total matches $9,800 exactly. Thank you for your business...',
    body: `Hi John,\n\nJust confirming that our usage telemetry for August matches Purchase Order PO-8830 at $9,800.00. Ready for the monthly payment run.\n\nThanks,\nDavid Chen`,
    detectedKeywords: ['PO-8830', 'RECONCILED', 'PAYMENT RUN'],
    extractedAmount: 9800,
    isRead: true
  }
];

export const INITIAL_OUTGOING_INCIDENT_EMAILS: OutgoingIncidentEmail[] = [
  {
    id: 'out-inc-001',
    incidentId: 'INC-2026-8812',
    severity: 'P1 - Critical',
    from: 'incident-response@takasho-enterprises.com',
    to: 'billing@vanguardindustrial.com',
    cc: ['elena.rostova@vanguardindustrial.com', 'sarah.cfo@takasho-enterprises.com'],
    subject: '[INCIDENT-ESCALATION INC-2026-8812] Contract Discrepancy & Section 4.2 Volume Discount Enforcement (INV-9044)',
    timestamp: '2026-09-26 10:14:30',
    status: 'delivered',
    policyTriggered: 'MSA CTR-2025-V2 Section 4.2 (15% Q3 Threshold Enforcement)',
    linkedWorkflowId: 'wf-fin-001',
    smtpStatusCode: 250,
    smtpLog: '250 2.1.5 Recipient OK. Message accepted for delivery (tls=TLSv1.3 queue_id=GMAIL-RELAY-99218)',
    stakeholdersNotified: ['Elena Rostova (Head of Accounts)', 'Sarah Lin (CFO)', 'John Doe (Operations Director)'],
    dispatchedBy: 'Autonomous Incident Dispatcher v3.4',
    body: `ATTENTION: Vanguard Industrial Accounts & Commercial Operations

INCIDENT TRACKING ID: INC-2026-8812
SEVERITY LEVEL: P1 - Critical Commercial Discrepancy
INVOICE REFERENCE: INV-9044 ($28,900.00 Billed)
RECONCILED OBLIGATION: $24,565.00 Net Payable

Dear Elena Rostova,

This automated notification confirms that our autonomous financial audit engine detected a discrepancy on Invoice INV-9044. Under Section 4.2 of our Master Service Agreement (CTR-2025-V2), Takasho Enterprises exceeded the $50,000 Q3 order threshold ($54,200 cumulative spend registered in ERP), qualifying for a mandatory 15% volume discount ($4,335.00).

STATUS UPDATE:
1. Executive supervisor sign-off has been staged for the adjusted amount of $24,565.00.
2. Payment is scheduled for inclusion in this Friday's 14:00 PM bank clearing batch.
3. Outbound ACH wire confirmation will be automatically transmitted upon execution.

Please reply with confirmation of ledger adjustment on your records.

Respectfully,
Flow.io Autonomous Incident Engine
Takasho Enterprises Commercial AP Desk`
  },
  {
    id: 'out-inc-002',
    incidentId: 'INC-2026-9021',
    severity: 'P1 - Critical',
    from: 'incident-response@takasho-enterprises.com',
    to: 'collections@apexlogix.io',
    cc: ['legal@takasho-enterprises.com', 'treasury@takasho-enterprises.com'],
    subject: '[INCIDENT-CURE INC-2026-9021] Formal SLA Clause 7 Cure Response & Installment Remittance for INV-9021 ($14,500)',
    timestamp: '2026-09-26 09:48:12',
    status: 'delivered',
    policyTriggered: 'Apex Logix SLA Terms 2025 Clause 7 (7-Day Cure Window Protocol)',
    linkedWorkflowId: 'wf-proc-002',
    smtpStatusCode: 250,
    smtpLog: '250 2.1.5 Recipient OK. Delivered to MX apexlogix.io (queue_id=SMTP-CURE-1184)',
    stakeholdersNotified: ['Apex Collections Desk', 'Takasho Legal Counsel', 'Treasury Operations'],
    dispatchedBy: 'Autonomous Incident Dispatcher v3.4',
    body: `ATTENTION: Apex Logix Legal & Collections

INCIDENT TRACKING ID: INC-2026-9021
SEVERITY LEVEL: P1 - Delinquency Cure Period Response
CONTRACT REFERENCE: CTR-2025-A9 (SLA Clause 7)
OUTSTANDING BALANCE: $14,500.00 (Overdue: 42 Days)

Dear Collections Desk,

In response to your formal demand notice regarding Invoice INV-9021, Takasho Enterprises hereby submits our remediation schedule under Clause 7 (7-day cure window prior to legal referral).

REMEDIATION ACTIONS INITIATED:
• Emergency CFO review meeting convened for Monday 10:00 AM.
• An immediate initial wire tranche of 50% ($7,250.00) has been authorized for expedited clearance.
• Second installment scheduled to remit within 7 business days.

Account suspension remedies are stayed during the active cure period per Section 7.2.

Sincerely,
Incident Response Desk | Takasho Enterprises`
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEventItem[] = [
  {
    id: 'cal-1',
    title: 'CFO Quarterly Overdue Accounts & Cash Flow Review',
    organizer: 'sarah.cfo@takasho-enterprises.com',
    dateTime: 'Tomorrow, 10:00 AM - 11:00 AM',
    dateString: '2026-09-27',
    timeString: '10:00',
    type: 'meeting',
    description: 'Executive review of all accounts payable > 30 days overdue, Vanguard invoice adjustment, and vendor settlement approvals.',
    attendees: ['john.doe@takasho-enterprises.com', 'sarah.cfo@takasho-enterprises.com', 'treasury@takasho-enterprises.com'],
    relatedContext: 'Governs immediate approval window for INV-9044 and INV-9021',
    relatedWorkflowId: 'wf-fin-001',
    status: 'upcoming',
    severity: 'warning'
  },
  {
    id: 'cal-2',
    title: 'Vendor Payment Batch Cutoff - Week 39',
    organizer: 'treasury@takasho-enterprises.com',
    dateTime: 'Friday, 02:00 PM',
    dateString: '2026-10-02',
    timeString: '14:00',
    type: 'payment_cutoff',
    description: 'Automated bank clearing batch for all approved vouchers. Submissions close at 1:30 PM.',
    attendees: ['john.doe@takasho-enterprises.com', 'treasury@takasho-enterprises.com'],
    relatedContext: 'Workflow deadline for dispatching payment confirmation to Vanguard Industrial',
    relatedWorkflowId: 'wf-fin-001',
    status: 'upcoming',
    severity: 'critical'
  },
  {
    id: 'cal-3',
    title: 'Apex Logix SLA 7-Day Cure Window Expiration',
    organizer: 'collections@apexlogix.io',
    dateTime: 'Monday, 05:00 PM',
    dateString: '2026-09-28',
    timeString: '17:00',
    type: 'cure_deadline',
    description: 'Final deadline to remit installment or submit ACH confirmation before tier-2 legal escalation under Clause 7.',
    attendees: ['john.doe@takasho-enterprises.com', 'legal@takasho-enterprises.com'],
    relatedContext: 'Mandates urgent dispatch of payment plan for INV-9021',
    relatedWorkflowId: 'wf-proc-002',
    status: 'upcoming',
    severity: 'critical'
  },
  {
    id: 'cal-4',
    title: 'Mid-Month ERP General Ledger Reconciliation',
    organizer: 'accounting@takasho-enterprises.com',
    dateTime: 'Wednesday, 03:30 PM',
    dateString: '2026-09-30',
    timeString: '15:30',
    type: 'meeting',
    description: 'Bi-weekly ledger audit comparing QuickBooks posted journals with bank clearing feeds.',
    attendees: ['john.doe@takasho-enterprises.com', 'controller@takasho-enterprises.com'],
    relatedContext: 'Verifies Nordic Cloud and Vanguard ledger updates',
    status: 'upcoming',
    severity: 'normal'
  },
  {
    id: 'cal-5',
    title: 'Nordic Cloud Monthly Infrastructure Billing Review',
    organizer: 'david.chen@nordiccloud.com',
    dateTime: 'Yesterday, 11:00 AM',
    dateString: '2026-09-25',
    timeString: '11:00',
    type: 'sla_review',
    description: 'Usage telemetry audit for August compute nodes. Matched PO-8830 with zero discrepancy.',
    attendees: ['john.doe@takasho-enterprises.com', 'david.chen@nordiccloud.com'],
    relatedContext: 'Satisfied condition for automated $9,800 voucher disbursement',
    relatedWorkflowId: 'wf-rec-003',
    status: 'passed',
    severity: 'normal'
  }
];

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-fin-001',
    title: 'Overdue Financial Obligations & Vendor Settlement',
    objective: 'Identify overdue obligations from Accounts Aging spreadsheet, reconcile discrepancy against contract PDF and Gmail thread, dynamically re-plan upon discount verification, execute database & calendar analysis, and obtain CFO sign-off.',
    category: 'finance',
    priority: 'critical',
    status: 'waiting_approval',
    createdAt: '2026-09-26 09:30',
    updatedAt: '2026-09-26 10:15',
    triggerSource: 'Gmail Ingest + Spreadsheet Scan (Accounts_Aging_Q3.xlsx B4:F18)',
    associatedEntities: {
      vendorOrClient: 'Vanguard Industrial Corp',
      amount: 24565,
      dueDate: '2026-10-02',
      relatedEmailId: 'email-1',
      relatedSpreadsheetRange: 'Accounts_Aging_Q3.xlsx!B4:F18',
      relatedDocId: 'doc-vanguard-ctr'
    },
    currentStepIndex: 4,
    steps: [
      {
        id: 'step-1',
        title: 'Spreadsheet Ingest & Delinquency Filtering',
        description: 'Scan Accounts_Aging_Q3.xlsx cells B4:F18. Filter invoices with Overdue_Days > 25 days.',
        source: 'spreadsheet',
        status: 'completed',
        startedAt: '2026-09-26 09:30:12',
        completedAt: '2026-09-26 09:30:18',
        dataInput: { targetSheet: 'Accounts_Aging_Q3.xlsx', range: 'B4:F18', filterCriteria: 'Overdue_Days > 25' },
        dataOutput: {
          flaggedInvoices: [
            { invoice: 'INV-9021', vendor: 'Apex Logix Ltd', amount: 14500, days: 42 },
            { invoice: 'INV-9044', vendor: 'Vanguard Industrial', amount: 28900, days: 29 }
          ]
        },
        reasoning: 'Extracted 2 critical accounts exceeding 25-day delinquency threshold. INV-9044 has an unresolved discrepancy with PO budget.'
      },
      {
        id: 'step-2',
        title: 'Gmail & Contextual Record Cross-Checking',
        description: 'Query Gmail inbox for keyword threads matching "INV-9044" and "Vanguard Industrial".',
        source: 'gmail',
        status: 'completed',
        startedAt: '2026-09-26 09:31:00',
        completedAt: '2026-09-26 09:31:05',
        dataInput: { query: 'INV-9044 Vanguard Industrial' },
        dataOutput: {
          matchedEmailId: 'email-1',
          sender: 'billing@vanguardindustrial.com',
          claimedDiscount: '15% under Section 4.2',
          revisedPayable: 24565
        },
        reasoning: 'Found fresh email from Vanguard confirming a 15% discount ($4,335) reduction from $28,900 original billing.'
      },
      {
        id: 'step-3',
        title: 'Dynamic Re-Planning: Legal Contract Verification',
        description: 'Conditions changed: Original invoice differed from contract terms. Dynamic re-plan injected document parsing step on Service_Agreement_Vanguard_v2.pdf.',
        source: 'document',
        status: 're_planned',
        startedAt: '2026-09-26 09:32:00',
        completedAt: '2026-09-26 09:32:15',
        dataInput: { document: 'Service_Agreement_Vanguard_v2.pdf', targetClause: 'Section 4.2 Volume Discount' },
        dataOutput: {
          verifiedClause: 'Section 4.2 Volume Discount & Retention',
          termValid: true,
          exactCalculation: '$28,900 * 0.85 = $24,565.00',
          recommendation: 'Adjust voucher to $24,565 and prepare human disbursement approval.'
        },
        reasoning: 'Re-plan validated that client order volume surpassed $50,000 in Q3, confirming legitimate 15% reduction.'
      },
      {
        id: 'step-4',
        title: 'Deep Database Cross-Validation & Calendar Risk Analysis',
        description: 'Query internal relational ERP database (vendors, purchase_orders, tax compliance) and cross-reference Calendar Cutoff window.',
        source: 'analysis',
        status: 'completed',
        startedAt: '2026-09-26 09:33:00',
        completedAt: '2026-09-26 09:33:14',
        dataInput: {
          invoiceId: 'INV-9044',
          vendorId: 'VEND-001',
          poNumber: 'PO-8812',
          targetCalendarEvent: 'cal-2'
        },
        dataOutput: {
          dbVerified: true,
          cumulativeSpend: '$54,200 (Qualifies for Section 4.2 discount)',
          taxId: 'XX-XXX4192 (W-9 on file)',
          calendarDeadline: 'Friday, 14:00 PM (36h remaining)',
          cashflowImpact: 'Approved in weekly cash envelope',
          varianceResolved: true,
          requiresHumanSignoff: true
        },
        analysisData: {
          databaseMatchScore: 99.8,
          cashflowRisk: 'Low',
          calendarDeadlineVarianceHours: 36,
          policyCheckPass: true,
          detectedSavings: 4335,
          sqlQueryExecuted: "SELECT po.approved_budget, v.cumulative_q3_spend FROM purchase_orders po JOIN vendors v ON po.vendor_name = v.vendor_name WHERE po.po_number = 'PO-8812';",
          rulesFired: ['RULE_VOL_DISC_15', 'RULE_ESC_THRESHOLD_10K', 'RULE_CAL_WINDOW_OK', 'RULE_W9_VALIDATED']
        },
        reasoning: 'Relational database query validated PO-8812 against vendor cumulative spend ($54,200). Calendar check confirms 36h before Friday bank cutoff. Financial amount ($24,565) triggers supervisor escalation rule AP-10K.'
      },
      {
        id: 'step-5',
        title: 'Human-in-the-Loop Sign-off & Disbursement Approval',
        description: 'Escalate to Finance Director / CFO for authorization of $24,565 wire payment and dispatch of settlement letter.',
        source: 'human_approval',
        status: 'waiting_approval',
        requiresApproval: true,
        approvalDetails: {
          actionName: 'Authorize Wire & Settlement Dispatch',
          amount: 24565,
          recipient: 'Vanguard Industrial Corp (Accounts)',
          proposedDraft: `Dear Elena,\n\nWe have completed our automated contract verification of Clause 4.2. Takasho Enterprises approves payment of adjusted invoice INV-9044 in the amount of $24,565.00. The wire will execute in Friday's 2:00 PM batch.\n\nSincerely,\nJohn Doe | Operations & Finance`,
          discrepancyNotes: 'Discrepancy resolved: Initial bill $28,900 discounted by $4,335 (15%) under Section 4.2 volume threshold.'
        },
        reasoning: 'Financial transaction > $10,000 threshold strictly requires human supervisor approval per company policy.'
      },
      {
        id: 'step-6',
        title: 'ERP Ledger Update & Confirmation Dispatch',
        description: 'Post disbursement to general ledger, update QuickBooks status to "Disbursed", and send confirmation wire receipt to vendor.',
        source: 'erp',
        status: 'pending'
      }
    ],
    auditTrailIds: ['audit-101', 'audit-102', 'audit-103', 'audit-104']
  },
  {
    id: 'wf-proc-002',
    title: 'Apex Logix Delinquency Cure & Legal SLA Escalation',
    objective: 'Assess 42-day overdue invoice INV-9021 ($14,500), cross-reference SLA notice period, draft cure notice, and prepare payment installment.',
    category: 'compliance',
    priority: 'high',
    status: 'active',
    createdAt: '2026-09-26 08:15',
    updatedAt: '2026-09-26 09:45',
    triggerSource: 'Gmail Inbound Alert (collections@apexlogix.io)',
    associatedEntities: {
      vendorOrClient: 'Apex Logix Ltd',
      amount: 14500,
      dueDate: '2026-08-15',
      relatedEmailId: 'email-2',
      relatedSpreadsheetRange: 'Accounts_Aging_Q3.xlsx!B2:G2',
      relatedDocId: 'doc-apex-sla'
    },
    currentStepIndex: 1,
    steps: [
      {
        id: 'step-apex-1',
        title: 'Scan Overdue Aging & Cure Window',
        description: 'Extract Apex Logix records from Accounts_Aging_Q3.xlsx. Overdue by 42 days.',
        source: 'spreadsheet',
        status: 'completed',
        startedAt: '2026-09-26 08:15:30',
        completedAt: '2026-09-26 08:15:35',
        reasoning: 'Invoice overdue past 30 days requires tier-2 escalation according to SLA Clause 7.'
      },
      {
        id: 'step-apex-2',
        title: 'Parse SLA Document & Formulate Installment Plan',
        description: 'Ingest Apex_SLA_Terms_2025.docx to verify late fee penalties and 7-day cure window.',
        source: 'document',
        status: 'running',
        startedAt: '2026-09-26 09:40:00',
        reasoning: 'System currently extracting SLA Clause 7 cure parameters to determine whether partial split payment avoids account suspension.'
      },
      {
        id: 'step-apex-3',
        title: 'Calendar Check & Meeting Scheduling',
        description: 'Check CFO calendar availability for emergency payment allocation review.',
        source: 'calendar',
        status: 'pending'
      },
      {
        id: 'step-apex-4',
        title: 'Approval & Remediation Dispatch',
        description: 'Human approval for 50% wire release ($7,250) within 24 hours.',
        source: 'human_approval',
        status: 'pending',
        requiresApproval: true
      }
    ],
    auditTrailIds: ['audit-201', 'audit-202']
  },
  {
    id: 'wf-rec-003',
    title: 'Nordic Cloud Automated PO Reconciliation',
    objective: 'Reconcile August compute usage of $9,800 against PO-8830 with zero variance and prepare automated voucher.',
    category: 'procurement',
    priority: 'medium',
    status: 'completed',
    createdAt: '2026-09-25 14:00',
    updatedAt: '2026-09-25 14:22',
    triggerSource: 'Email + Spreadsheet Match',
    associatedEntities: {
      vendorOrClient: 'Nordic Cloud Systems',
      amount: 9800,
      dueDate: '2026-09-02'
    },
    currentStepIndex: 3,
    steps: [
      {
        id: 'step-nordic-1',
        title: 'Extract PO-8830 from Matrix Spreadsheet',
        description: 'Verified budget line of $9,800 in Vendor_POs_Matrix.xlsx!C3:E3.',
        source: 'spreadsheet',
        status: 'completed',
        reasoning: 'PO amount matches approved quarterly infrastructure budget.'
      },
      {
        id: 'step-nordic-2',
        title: 'Email Confirmation Ingestion',
        description: 'Parsed confirmation from David Chen (Nordic Cloud) with identical amount.',
        source: 'gmail',
        status: 'completed',
        reasoning: 'Zero variance detected between billed usage and PO authorization.'
      },
      {
        id: 'step-nordic-3',
        title: 'Auto-Disbursement Execution',
        description: 'Transaction within pre-approved $10,000 threshold. Executed automatically.',
        source: 'erp',
        status: 'completed',
        reasoning: 'Rule: Matched POs under $10k bypass manual review per automated policy #AP-4.'
      }
    ],
    auditTrailIds: ['audit-301', 'audit-302']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-101',
    timestamp: '2026-09-26 09:30:18',
    workflowId: 'wf-fin-001',
    stepId: 'step-1',
    actor: 'Spreadsheet Ingester',
    action: 'Spreadsheet Range Ingestion',
    details: 'Ingested Accounts_Aging_Q3.xlsx range B4:F18. Identified 2 overdue accounts exceeding 25-day threshold.',
    severity: 'info',
    payload: { range: 'B4:F18', flaggedCount: 2, totalOverdueAmount: 43400 }
  },
  {
    id: 'audit-102',
    timestamp: '2026-09-26 09:31:05',
    workflowId: 'wf-fin-001',
    stepId: 'step-2',
    actor: 'Gmail Scanner',
    action: 'Email Keyword Extraction & Inbound Match',
    details: 'Scanned inbox for INV-9044. Matched email from Vanguard Accounts with revised $24,565 claim citing Clause 4.2 discount.',
    severity: 'info',
    payload: { emailId: 'email-1', claimedDiscount: 4335, finalPayable: 24565 }
  },
  {
    id: 'audit-103',
    timestamp: '2026-09-26 09:32:15',
    workflowId: 'wf-fin-001',
    stepId: 'step-3',
    actor: 'Gemini Reasoner',
    action: 'Dynamic Workflow Re-Plan Triggered',
    details: 'Dynamic condition change: PO discrepancy detected. Injected autonomous contract validation on Service_Agreement_Vanguard_v2.pdf. Confirmed Clause 4.2 valid.',
    severity: 'warning',
    payload: { rePlanReason: 'Invoice discrepancy of $4,335', contractVerified: true, savingsRecognized: '$4,335.00' }
  },
  {
    id: 'audit-104',
    timestamp: '2026-09-26 09:32:18',
    workflowId: 'wf-fin-001',
    stepId: 'step-4',
    actor: 'System Engine',
    action: 'Human Escalation Threshold Enforced',
    details: 'Transaction of $24,565 exceeds $10,000 automated ceiling. Workflow transitioned to waiting_approval state.',
    severity: 'warning',
    payload: { policyRule: 'AP-THRESHOLD-10K', approverRequired: 'CFO / John Doe' }
  },
  {
    id: 'audit-201',
    timestamp: '2026-09-26 08:15:35',
    workflowId: 'wf-proc-002',
    stepId: 'step-apex-1',
    actor: 'Gmail Scanner',
    action: 'Delinquency Threat Inbound Filter',
    details: 'Inbound message from collections@apexlogix.io flagged with critical keywords: "OVERDUE", "SUSPENSION".',
    severity: 'critical',
    payload: { keywordMatchCount: 5, urgencyScore: 92 }
  },
  {
    id: 'audit-301',
    timestamp: '2026-09-25 14:22:00',
    workflowId: 'wf-rec-003',
    stepId: 'step-nordic-3',
    actor: 'System Engine',
    action: 'Automated Zero-Variance Settlement',
    details: 'Nordic Cloud usage matched PO-8830 with zero discrepancy. Disbursed $9,800 under Rule #AP-4.',
    severity: 'success',
    payload: { voucherId: 'VCH-9800-NC', matchScore: '100%' }
  }
];
