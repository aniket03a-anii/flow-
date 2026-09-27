/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScheduledMeeting, MeetingSimulationStep, MeetingActionItem } from '../types/workflow';

export interface VendorRow {
  vendor_id: string;
  vendor_name: string;
  contract_ref: string;
  payment_terms: string;
  cumulative_q3_spend: number;
  discount_eligible: boolean;
  credit_limit: number;
  tax_id: string;
  w9_verified: boolean;
  risk_score: 'Low' | 'Medium' | 'High';
}

export interface InvoiceRow {
  invoice_id: string;
  vendor_id: string;
  po_number: string;
  billed_amount: number;
  discount_applied: number;
  adjusted_payable: number;
  due_date: string;
  status: 'Critical Overdue' | 'Disputed Terms' | 'Pending Approval' | 'Approved' | 'Disbursed';
  bank_batch_cutoff: string;
}

export interface PurchaseOrderRow {
  po_number: string;
  vendor_name: string;
  approved_budget: number;
  line_item: string;
  fiscal_quarter: string;
  status: 'Open' | 'Matched' | 'Closed';
}

export interface LedgerPostingRow {
  posting_id: string;
  timestamp: string;
  account_code: string;
  debit: number;
  credit: number;
  memo: string;
  authorized_by: string;
}

class RelationalDatabase {
  private vendors: VendorRow[] = [
    {
      vendor_id: 'VEND-001',
      vendor_name: 'Vanguard Industrial Corp',
      contract_ref: 'CTR-2025-V2',
      payment_terms: 'Net 30',
      cumulative_q3_spend: 54200,
      discount_eligible: true,
      credit_limit: 100000,
      tax_id: 'XX-XXX4192',
      w9_verified: true,
      risk_score: 'Low'
    },
    {
      vendor_id: 'VEND-002',
      vendor_name: 'Apex Logix Ltd',
      contract_ref: 'CTR-2025-A9',
      payment_terms: 'Net 15',
      cumulative_q3_spend: 28400,
      discount_eligible: false,
      credit_limit: 50000,
      tax_id: 'XX-XXX9921',
      w9_verified: true,
      risk_score: 'High'
    },
    {
      vendor_id: 'VEND-003',
      vendor_name: 'Nordic Cloud Systems',
      contract_ref: 'CTR-2026-N1',
      payment_terms: 'Net 30',
      cumulative_q3_spend: 39000,
      discount_eligible: false,
      credit_limit: 80000,
      tax_id: 'XX-XXX1182',
      w9_verified: true,
      risk_score: 'Low'
    },
    {
      vendor_id: 'VEND-004',
      vendor_name: 'Solaria Energy Group',
      contract_ref: 'CTR-2024-S8',
      payment_terms: 'Net 30',
      cumulative_q3_spend: 120000,
      discount_eligible: true,
      credit_limit: 250000,
      tax_id: 'XX-XXX7401',
      w9_verified: true,
      risk_score: 'Medium'
    }
  ];

  private invoices: InvoiceRow[] = [
    {
      invoice_id: 'INV-9044',
      vendor_id: 'VEND-001',
      po_number: 'PO-8812',
      billed_amount: 28900,
      discount_applied: 4335,
      adjusted_payable: 24565,
      due_date: '2026-10-02',
      status: 'Pending Approval',
      bank_batch_cutoff: '2026-10-02 14:00'
    },
    {
      invoice_id: 'INV-9021',
      vendor_id: 'VEND-002',
      po_number: 'PO-8874',
      billed_amount: 14500,
      discount_applied: 0,
      adjusted_payable: 14500,
      due_date: '2026-08-15',
      status: 'Critical Overdue',
      bank_batch_cutoff: '2026-09-28 17:00'
    },
    {
      invoice_id: 'INV-9088',
      vendor_id: 'VEND-003',
      po_number: 'PO-8830',
      billed_amount: 9800,
      discount_applied: 0,
      adjusted_payable: 9800,
      due_date: '2026-09-02',
      status: 'Approved',
      bank_batch_cutoff: '2026-09-25 14:00'
    }
  ];

  private purchaseOrders: PurchaseOrderRow[] = [
    {
      po_number: 'PO-8812',
      vendor_name: 'Vanguard Industrial Corp',
      approved_budget: 24565,
      line_item: 'Industrial Automation Sensors & Controller Array',
      fiscal_quarter: 'Q3-2026',
      status: 'Matched'
    },
    {
      po_number: 'PO-8874',
      vendor_name: 'Apex Logix Ltd',
      approved_budget: 14500,
      line_item: 'Freight Dispatch & Reverse Logistics SLA',
      fiscal_quarter: 'Q3-2026',
      status: 'Open'
    },
    {
      po_number: 'PO-8830',
      vendor_name: 'Nordic Cloud Systems',
      approved_budget: 9800,
      line_item: 'August Compute Tier 2 Cloud Infrastructure',
      fiscal_quarter: 'Q3-2026',
      status: 'Matched'
    }
  ];

  private ledgerPostings: LedgerPostingRow[] = [
    {
      posting_id: 'POST-001',
      timestamp: '2026-09-25 14:22:10',
      account_code: '2010-AP-VEND',
      debit: 9800,
      credit: 0,
      memo: 'Automated settlement PO-8830 Nordic Cloud (Zero variance rule)',
      authorized_by: 'System Autonomous AP-4'
    }
  ];

  private meetings: ScheduledMeeting[] = [
    {
      id: 'mtg-001',
      title: 'CFO Emergency Sign-off: Vanguard Discrepancy & $24,565 Payment Batch',
      type: 'executive_review',
      status: 'scheduled',
      dateString: '2026-09-27',
      timeString: '10:00',
      dateTime: 'Tomorrow, 10:00 AM - 10:45 AM',
      durationMinutes: 45,
      organizer: 'sarah.cfo@takasho-enterprises.com',
      relatedWorkflowId: 'wf-fin-001',
      relatedVendor: 'Vanguard Industrial Corp',
      priority: 'critical',
      attendees: [
        { name: 'Sarah Lin', email: 'sarah.cfo@takasho-enterprises.com', role: 'Chief Financial Officer', status: 'confirmed' },
        { name: 'John Doe', email: 'john.doe@takasho-enterprises.com', role: 'Finance & Operations Director', status: 'confirmed' },
        { name: 'Elena Rostova', email: 'billing@vanguardindustrial.com', role: 'Vendor Accounts Lead', status: 'confirmed' }
      ],
      agenda: [
        'Review Master Service Agreement CTR-2025-V2 Section 4.2 volume rebate threshold ($50k)',
        'Verify ERP cumulative Q3 spend ($54,200) qualification for 15% discount ($4,335)',
        'Authorize adjusted net remittance of $24,565.00 before Friday 14:00 PM bank cutoff',
        'Dispatch ACH confirmation and record journal in general ledger'
      ],
      meetingLink: 'https://meet.google.com/flw-exec-9044',
      notes: 'High-stakes executive sign-off required because adjusted amount exceeds $10k policy ceiling (Rule AP-10K).',
      databaseSynced: true
    },
    {
      id: 'mtg-002',
      title: 'Apex Logix SLA Delinquency Cure & Installment Terms Deliberation',
      type: 'vendor_cure',
      status: 'scheduled',
      dateString: '2026-09-28',
      timeString: '14:30',
      dateTime: 'Monday, 02:30 PM - 03:15 PM',
      durationMinutes: 45,
      organizer: 'collections@apexlogix.io',
      relatedWorkflowId: 'wf-proc-002',
      relatedVendor: 'Apex Logix Ltd',
      priority: 'critical',
      attendees: [
        { name: 'Marcus Vance', email: 'collections@apexlogix.io', role: 'Director of Credit & Collections', status: 'confirmed' },
        { name: 'John Doe', email: 'john.doe@takasho-enterprises.com', role: 'Operations Director', status: 'confirmed' },
        { name: 'Rachel Hayes', email: 'legal@takasho-enterprises.com', role: 'Corporate Counsel', status: 'confirmed' }
      ],
      agenda: [
        'Address 42-day delinquency notice on Invoice INV-9021 ($14,500)',
        'Formalize Clause 7 (7-day cure window) remediation terms',
        'Review two-tranche wire installment schedule ($7,250 immediate + $7,250 in 7 days)',
        'Sign joint standstill agreement preventing freight logistics suspension'
      ],
      meetingLink: 'https://meet.google.com/apx-cure-8874',
      notes: 'Delinquency cure session must formalize payment plan prior to legal escalation clock expiration.',
      databaseSynced: true
    },
    {
      id: 'mtg-003',
      title: 'Solaria Energy Q4 Contract Renewal & Megawatt Tier Pricing',
      type: 'quarterly_audit',
      status: 'scheduled',
      dateString: '2026-10-01',
      timeString: '11:00',
      dateTime: 'Thursday, 11:00 AM - 12:00 PM',
      durationMinutes: 60,
      organizer: 'contracts@solariaenergy.com',
      relatedVendor: 'Solaria Energy Group',
      priority: 'high',
      attendees: [
        { name: 'Dr. Aris Thorne', email: 'aris.t@solariaenergy.com', role: 'Key Account Executive', status: 'confirmed' },
        { name: 'John Doe', email: 'john.doe@takasho-enterprises.com', role: 'Operations Director', status: 'confirmed' }
      ],
      agenda: [
        'Review $120,000 annual clean energy throughput across manufacturing plants',
        'Evaluate 10% high-volume tariff rebate for 2027 renewal',
        'Audit renewable energy certificate (REC) verification pipeline'
      ],
      meetingLink: 'https://meet.google.com/sol-tier-7401',
      notes: 'Annual vendor renegotiation targeting $12,000 projected cost savings.',
      databaseSynced: true
    },
    {
      id: 'mtg-004',
      title: 'Nordic Cloud Infrastructure Q3 PO True-Up & Zero-Variance Audit',
      type: 'post_mortem',
      status: 'completed',
      dateString: '2026-09-25',
      timeString: '13:00',
      dateTime: 'Sep 25, 2026, 01:00 PM',
      durationMinutes: 30,
      organizer: 'david.chen@nordiccloud.com',
      relatedWorkflowId: 'wf-rec-003',
      relatedVendor: 'Nordic Cloud Systems',
      priority: 'normal',
      attendees: [
        { name: 'David Chen', email: 'david.chen@nordiccloud.com', role: 'Account Manager', status: 'confirmed' },
        { name: 'John Doe', email: 'john.doe@takasho-enterprises.com', role: 'Finance Director', status: 'confirmed' }
      ],
      agenda: [
        'Confirm August compute cluster invoice INV-9088 ($9,800)',
        '3-way match against purchase order PO-8830 ($9,800 approved budget)',
        'Authorize autonomous ledger disbursement clearance'
      ],
      outcomes: {
        resolutionSummary: 'Verified 100% 3-way match with zero variance between PO-8830, Invoice INV-9088, and cloud consumption telemetry. Autonomous settlement executed.',
        decision: 'approved',
        actionItems: [
          { id: 'act-1', task: 'Disburse $9,800 via automated clearing house', assignee: 'System Autonomous AP-4', due: '2026-09-25', completed: true },
          { id: 'act-2', task: 'Post journal entry POST-001 into General Ledger', assignee: 'Accounting Bot', due: '2026-09-25', completed: true }
        ],
        approvedDisbursement: 9800,
        executedAt: '2026-09-25 14:22:10'
      },
      notes: 'Zero variance meeting closed with full unanimous sign-off.',
      databaseSynced: true
    },
    {
      id: 'mtg-005',
      title: 'Quarterly Vendor Risk Assessment & SOC2 Type II Security Review',
      type: 'quarterly_audit',
      status: 'completed',
      dateString: '2026-09-20',
      timeString: '15:00',
      dateTime: 'Sep 20, 2026, 03:00 PM',
      durationMinutes: 60,
      organizer: 'compliance@takasho-enterprises.com',
      priority: 'normal',
      attendees: [
        { name: 'Rachel Hayes', email: 'legal@takasho-enterprises.com', role: 'Corporate Counsel', status: 'confirmed' },
        { name: 'Sarah Lin', email: 'sarah.cfo@takasho-enterprises.com', role: 'CFO', status: 'confirmed' },
        { name: 'John Doe', email: 'john.doe@takasho-enterprises.com', role: 'Director', status: 'confirmed' }
      ],
      agenda: [
        'Audit 4 core vendors W9 and tax compliance status',
        'Review Vanguard ($100k credit line) and Apex Logix risk tier ranking',
        'Verify encrypted audit logging and human sign-off ceilings'
      ],
      outcomes: {
        resolutionSummary: 'Risk audit certified 4 vendors. Apex Logix flagged High Risk due to past-due invoices; Vanguard and Nordic Cloud certified Low Risk.',
        decision: 'approved',
        actionItems: [
          { id: 'act-3', task: 'Enforce strict 7-day cure requirement on Apex Logix', assignee: 'Rachel Hayes', due: '2026-09-22', completed: true },
          { id: 'act-4', task: 'Re-certify Vanguard $100k credit limit in ERP', assignee: 'John Doe', due: '2026-09-21', completed: true }
        ],
        executedAt: '2026-09-20 16:05:00'
      },
      notes: 'Annual regulatory compliance mandate fulfilled.',
      databaseSynced: true
    }
  ];

  // SQL-like query interface
  public executeQuery(query: string): { columns: string[]; rows: any[]; count: number } {
    const q = query.trim().toUpperCase();

    if (q.includes('FROM VENDORS')) {
      return {
        columns: ['vendor_id', 'vendor_name', 'contract_ref', 'payment_terms', 'cumulative_q3_spend', 'discount_eligible', 'risk_score'],
        rows: this.vendors,
        count: this.vendors.length
      };
    }

    if (q.includes('FROM INVOICES')) {
      return {
        columns: ['invoice_id', 'vendor_id', 'po_number', 'billed_amount', 'discount_applied', 'adjusted_payable', 'due_date', 'status'],
        rows: this.invoices,
        count: this.invoices.length
      };
    }

    if (q.includes('FROM PURCHASE_ORDERS') || q.includes('FROM POS')) {
      return {
        columns: ['po_number', 'vendor_name', 'approved_budget', 'line_item', 'status'],
        rows: this.purchaseOrders,
        count: this.purchaseOrders.length
      };
    }

    if (q.includes('FROM GENERAL_LEDGER') || q.includes('FROM LEDGER')) {
      return {
        columns: ['posting_id', 'timestamp', 'account_code', 'debit', 'credit', 'memo', 'authorized_by'],
        rows: this.ledgerPostings,
        count: this.ledgerPostings.length
      };
    }

    if (q.includes('FROM MEETINGS')) {
      return {
        columns: ['id', 'title', 'type', 'status', 'dateString', 'timeString', 'organizer', 'priority', 'relatedWorkflowId'],
        rows: this.meetings.map(m => ({
          id: m.id,
          title: m.title,
          type: m.type,
          status: m.status,
          dateString: m.dateString,
          timeString: m.timeString,
          organizer: m.organizer,
          priority: m.priority,
          relatedWorkflowId: m.relatedWorkflowId || 'None'
        })),
        count: this.meetings.length
      };
    }

    // Default join representation for cross-checking
    const crossCheckResult = this.invoices.map(inv => {
      const vend = this.vendors.find(v => v.vendor_id === inv.vendor_id);
      const po = this.purchaseOrders.find(p => p.po_number === inv.po_number);
      return {
        invoice_id: inv.invoice_id,
        vendor: vend?.vendor_name || 'Unknown',
        po_number: inv.po_number,
        po_budget: po?.approved_budget || 0,
        billed: inv.billed_amount,
        discount: inv.discount_applied,
        net_payable: inv.adjusted_payable,
        variance: inv.billed_amount - (po?.approved_budget || 0),
        status: inv.status
      };
    });

    return {
      columns: ['invoice_id', 'vendor', 'po_number', 'po_budget', 'billed', 'discount', 'net_payable', 'variance', 'status'],
      rows: crossCheckResult,
      count: crossCheckResult.length
    };
  }

  // Cross-check specific invoice against PO and Vendor
  public runRelationalAnalysis(invoiceId: string): {
    matched: boolean;
    invoice?: InvoiceRow;
    vendor?: VendorRow;
    po?: PurchaseOrderRow;
    variance: number;
    discountEligible: boolean;
    recommendedPayable: number;
    riskScore: 'Low' | 'Medium' | 'High';
    policyPassed: boolean;
  } {
    const invoice = this.invoices.find(i => i.invoice_id === invoiceId) || this.invoices[0];
    const vendor = this.vendors.find(v => v.vendor_id === invoice.vendor_id);
    const po = this.purchaseOrders.find(p => p.po_number === invoice.po_number);

    const variance = invoice.billed_amount - (po?.approved_budget || invoice.billed_amount);
    const discountEligible = vendor?.cumulative_q3_spend ? vendor.cumulative_q3_spend >= 50000 : false;
    const recommendedPayable = discountEligible ? Math.round(invoice.billed_amount * 0.85) : invoice.billed_amount;

    return {
      matched: true,
      invoice,
      vendor,
      po,
      variance,
      discountEligible,
      recommendedPayable,
      riskScore: vendor?.risk_score || 'Low',
      policyPassed: true
    };
  }

  // Record an authorized disbursement posting
  public postDisbursement(invoiceId: string, amount: number, authorizedBy: string, memo: string) {
    const inv = this.invoices.find(i => i.invoice_id === invoiceId);
    if (inv) {
      inv.status = 'Disbursed';
    }
    const newPosting: LedgerPostingRow = {
      posting_id: `POST-00${this.ledgerPostings.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      account_code: '2010-AP-VEND',
      debit: amount,
      credit: 0,
      memo,
      authorized_by: authorizedBy
    };
    this.ledgerPostings.unshift(newPosting);
    return newPosting;
  }

  // Meeting Management & Simulation Methods
  public getMeetings(filter?: 'all' | 'remaining' | 'done'): ScheduledMeeting[] {
    if (filter === 'remaining') {
      return this.meetings.filter(m => m.status === 'scheduled' || m.status === 'in_progress');
    }
    if (filter === 'done') {
      return this.meetings.filter(m => m.status === 'completed');
    }
    return this.meetings;
  }

  public getMeetingById(id: string): ScheduledMeeting | undefined {
    return this.meetings.find(m => m.id === id);
  }

  public addMeeting(newMeeting: Partial<ScheduledMeeting>): ScheduledMeeting {
    const meeting: ScheduledMeeting = {
      id: newMeeting.id || `mtg-${Date.now()}`,
      title: newMeeting.title || 'Scheduled Deliberation',
      type: newMeeting.type || 'executive_review',
      status: newMeeting.status || 'scheduled',
      dateString: newMeeting.dateString || new Date().toISOString().split('T')[0],
      timeString: newMeeting.timeString || '14:00',
      dateTime: newMeeting.dateTime || `${newMeeting.dateString || 'Today'}, ${newMeeting.timeString || '14:00'}`,
      durationMinutes: newMeeting.durationMinutes || 45,
      organizer: newMeeting.organizer || 'john.doe@takasho-enterprises.com',
      attendees: newMeeting.attendees && newMeeting.attendees.length > 0 ? newMeeting.attendees : [
        { name: 'John Doe', email: 'john.doe@takasho-enterprises.com', role: 'Operations Director', status: 'confirmed' }
      ],
      agenda: newMeeting.agenda && newMeeting.agenda.length > 0 ? newMeeting.agenda : [
        'Review transaction terms and counterparty obligations',
        'Verify supporting documentation in ERP and General Ledger',
        'Record executive sign-off and assign action items'
      ],
      relatedWorkflowId: newMeeting.relatedWorkflowId,
      relatedVendor: newMeeting.relatedVendor,
      priority: newMeeting.priority || 'normal',
      meetingLink: newMeeting.meetingLink || `https://meet.google.com/flw-mtg-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: newMeeting.notes || 'Automated meeting session synced with Flow.io ERP ledger.',
      databaseSynced: true
    };

    this.meetings.unshift(meeting);
    return meeting;
  }

  public updateMeetingStatus(id: string, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled', outcomes?: any): ScheduledMeeting | undefined {
    const meeting = this.meetings.find(m => m.id === id);
    if (!meeting) return undefined;

    meeting.status = status;
    if (outcomes) {
      meeting.outcomes = outcomes;
    }
    return meeting;
  }

  public simulateMeetingRun(id: string): { meeting: ScheduledMeeting; auditMemo: string; disbursementPosting?: LedgerPostingRow } {
    const meeting = this.meetings.find(m => m.id === id);
    if (!meeting) throw new Error(`Meeting ${id} not found in database.`);

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // Build simulated transcript
    const transcript: MeetingSimulationStep[] = [
      {
        stepNumber: 1,
        speaker: meeting.organizer.split('@')[0].replace('.', ' '),
        avatarRole: 'Session Host',
        action: 'Quorum Call & Agenda Presentation',
        dialogue: `Calling session to order regarding: "${meeting.title}". Quorum confirmed with ${meeting.attendees.length} participants present.`,
        timestamp: '00:00:15',
        status: 'completed'
      },
      {
        stepNumber: 2,
        speaker: 'Sarah Lin (CFO)',
        avatarRole: 'Financial Oversight',
        action: 'Cross-Database Verification',
        dialogue: `Reviewed ERP ledger and contract references. The volume rebate criteria and SLA thresholds match our verified parameters.`,
        timestamp: '00:08:40',
        status: 'completed'
      },
      {
        stepNumber: 3,
        speaker: meeting.attendees[0]?.name || 'John Doe',
        avatarRole: 'Operations Lead',
        action: 'Motion for Approval',
        dialogue: `I move to ratify the proposed resolution, authorize necessary ledger adjustment, and complete the action items before bank batch clearing.`,
        timestamp: '00:18:22',
        status: 'completed'
      },
      {
        stepNumber: 4,
        speaker: 'Flow.io Autonomous Secretary',
        avatarRole: 'System Protocol',
        action: 'Unanimous Ratification & Signature',
        dialogue: `Motion seconded and carried with 100% affirmative sign-off. Session concluded, action items logged to database.`,
        timestamp: '00:24:50',
        status: 'completed'
      }
    ];

    meeting.status = 'completed';
    meeting.simulationTranscript = transcript;

    let disbursementPosting: LedgerPostingRow | undefined;
    if (meeting.relatedWorkflowId === 'wf-fin-001' || meeting.title.includes('24,565')) {
      disbursementPosting = this.postDisbursement(
        'INV-9044',
        24565,
        'Executive Committee (Simulated Meeting Quorum)',
        `Ratified in meeting ${meeting.title} - 15% discount applied per Section 4.2`
      );
    }

    meeting.outcomes = {
      resolutionSummary: `Formal consensus reached. All ${meeting.agenda.length} agenda items resolved with 100% quorum sign-off.`,
      decision: 'approved',
      approvedDisbursement: meeting.relatedWorkflowId === 'wf-fin-001' ? 24565 : undefined,
      executedAt: now,
      actionItems: meeting.agenda.map((item, idx) => ({
        id: `act-${meeting.id}-${idx + 1}`,
        task: item,
        assignee: meeting.attendees[idx % meeting.attendees.length]?.name || 'Operations Lead',
        due: meeting.dateString,
        completed: true
      }))
    };

    return {
      meeting,
      auditMemo: `Meeting "${meeting.title}" simulated successfully. Status changed to COMPLETED with 100% quorum sign-off.`,
      disbursementPosting
    };
  }

  public deleteMeeting(id: string): boolean {
    const idx = this.meetings.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.meetings.splice(idx, 1);
      return true;
    }
    return false;
  }
}

export const dbService = new RelationalDatabase();
