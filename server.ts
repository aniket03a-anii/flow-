/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory mock database store for API access
  const databaseTables = {
    vendors: [
      { id: 'VEND-001', name: 'Vanguard Industrial Corp', cumulative_spend: 54200, discount_rate: 0.15, tax_id: 'XX-XXX4192', risk: 'Low' },
      { id: 'VEND-002', name: 'Apex Logix Ltd', cumulative_spend: 28400, discount_rate: 0.0, tax_id: 'XX-XXX9921', risk: 'High' },
      { id: 'VEND-003', name: 'Nordic Cloud Systems', cumulative_spend: 39000, discount_rate: 0.0, tax_id: 'XX-XXX1182', risk: 'Low' },
      { id: 'VEND-004', name: 'Solaria Energy Group', cumulative_spend: 120000, discount_rate: 0.10, tax_id: 'XX-XXX7401', risk: 'Medium' }
    ],
    invoices: [
      { invoice_id: 'INV-9044', vendor: 'Vanguard Industrial Corp', po_ref: 'PO-8812', amount: 28900, adjusted: 24565, status: 'Pending Approval' },
      { invoice_id: 'INV-9021', vendor: 'Apex Logix Ltd', po_ref: 'PO-8874', amount: 14500, adjusted: 14500, status: 'Critical Overdue' },
      { invoice_id: 'INV-9088', vendor: 'Nordic Cloud Systems', po_ref: 'PO-8830', amount: 9800, adjusted: 9800, status: 'Disbursed' }
    ],
    purchase_orders: [
      { po_number: 'PO-8812', budget: 24565, status: 'Matched' },
      { po_number: 'PO-8874', budget: 14500, status: 'Open' },
      { po_number: 'PO-8830', budget: 9800, status: 'Matched' }
    ],
    meetings: [
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
    ]
  };

  // API Route: Database inspection
  app.get('/api/database/query', (req, res) => {
    const table = (req.query.table as string) || 'invoices';
    if (table in databaseTables) {
      return res.json({ success: true, table, rows: (databaseTables as any)[table] });
    }
    return res.json({ success: true, tables: Object.keys(databaseTables), data: databaseTables });
  });

  // API Route: Deep multi-dimensional analysis step execution
  app.post('/api/analysis/evaluate', (req, res) => {
    const { invoiceId, vendor, amount, poNumber, calendarCutoff } = req.body;
    
    // Cross-check database
    const matchedVendor = databaseTables.vendors.find(v => v.name.toLowerCase().includes((vendor || '').toLowerCase()) || v.id === vendor);
    const cumulativeSpend = matchedVendor ? matchedVendor.cumulative_spend : 0;
    const qualifiesForVolumeDiscount = cumulativeSpend >= 50000;
    const discountAmount = qualifiesForVolumeDiscount ? (amount || 28900) * 0.15 : 0;
    const netPayable = (amount || 28900) - discountAmount;
    const requiresSignoff = netPayable >= 10000;

    const analysisResult = {
      timestamp: new Date().toISOString(),
      databaseValidation: {
        vendorVerified: Boolean(matchedVendor),
        taxIdVerified: true,
        cumulativeQuarterlySpend: cumulativeSpend,
        qualifiesForVolumeDiscount,
        savingsRecognized: discountAmount
      },
      calendarConstraintAnalysis: {
        cutoffTarget: calendarCutoff || 'Friday 14:00 (Bank Batch Cutoff)',
        status: 'Within execution window',
        estimatedRisk: 'Low'
      },
      reconciliationOutcome: {
        originalBilled: amount || 28900,
        netPayable,
        discrepancyResolved: qualifiesForVolumeDiscount,
        requiresHumanSignoff: requiresSignoff,
        escalationReason: requiresSignoff ? 'Amount exceeds $10k policy ceiling (Rule AP-10K)' : 'Automatic clearance eligible'
      },
      auditDecisionScore: 99.4
    };

    return res.json({ success: true, analysis: analysisResult });
  });

  // API Route: Run full automated pipeline with all steps
  app.post('/api/workflows/run-full-pipeline', (req, res) => {
    const { workflowId } = req.body;
    return res.json({
      success: true,
      message: `Pipeline ${workflowId || 'wf-fin-001'} orchestrated across database, calendar, documents, and ledger.`,
      status: 'waiting_approval',
      currentStep: 4,
      settlementAmount: 24565
    });
  });

  // API Route: Outgoing incident email simulation & SMTP relay
  app.post('/api/incidents/dispatch', (req, res) => {
    const { incidentId, to, subject, severity, policyTriggered } = req.body;
    const queueId = `GMAIL-RELAY-${Math.floor(100000 + Math.random() * 900000)}`;
    return res.json({
      success: true,
      incidentId: incidentId || `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'delivered',
      smtpCode: 250,
      smtpResponse: `250 2.1.5 Recipient OK. Message accepted for delivery via Google Workspace Relay (tls=TLSv1.3 queue_id=${queueId})`,
      timestamp: new Date().toISOString()
    });
  });

  // API Routes: Meeting Scheduling & Simulation attached to database
  app.get('/api/meetings', (req, res) => {
    const filter = req.query.filter as string; // 'all' | 'remaining' | 'done'
    const allMeetings = databaseTables.meetings;
    const remainingMeetings = allMeetings.filter(m => m.status === 'scheduled' || m.status === 'in_progress');
    const doneMeetings = allMeetings.filter(m => m.status === 'completed');

    let result = allMeetings;
    if (filter === 'remaining') result = remainingMeetings;
    else if (filter === 'done') result = doneMeetings;

    return res.json({
      success: true,
      totalCount: allMeetings.length,
      remainingCount: remainingMeetings.length,
      doneCount: doneMeetings.length,
      meetings: result
    });
  });

  app.post('/api/meetings', (req, res) => {
    const data = req.body;
    if (!data.title) {
      return res.status(400).json({ success: false, error: 'Meeting title is required.' });
    }

    const newMeeting = {
      id: data.id || `mtg-${Date.now()}`,
      title: data.title,
      type: data.type || 'executive_review',
      status: data.status || 'scheduled',
      dateString: data.dateString || new Date().toISOString().split('T')[0],
      timeString: data.timeString || '14:00',
      dateTime: data.dateTime || `${data.dateString || 'Today'}, ${data.timeString || '14:00'}`,
      durationMinutes: Number(data.durationMinutes) || 45,
      organizer: data.organizer || 'john.doe@takasho-enterprises.com',
      attendees: data.attendees && data.attendees.length > 0 ? data.attendees : [
        { name: 'John Doe', email: 'john.doe@takasho-enterprises.com', role: 'Operations Director', status: 'confirmed' }
      ],
      agenda: data.agenda && data.agenda.length > 0 ? data.agenda : [
        'Review transaction terms and counterparty obligations',
        'Verify supporting documentation in ERP and General Ledger',
        'Record executive sign-off and assign action items'
      ],
      relatedWorkflowId: data.relatedWorkflowId || undefined,
      relatedVendor: data.relatedVendor || undefined,
      priority: data.priority || 'normal',
      meetingLink: data.meetingLink || `https://meet.google.com/flw-mtg-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: data.notes || 'Automated meeting session synced with Flow.io ERP ledger.',
      databaseSynced: true
    };

    databaseTables.meetings.unshift(newMeeting);

    return res.status(201).json({
      success: true,
      message: `Meeting "${newMeeting.title}" registered in corporate database.`,
      meeting: newMeeting,
      remainingCount: databaseTables.meetings.filter(m => m.status === 'scheduled' || m.status === 'in_progress').length,
      doneCount: databaseTables.meetings.filter(m => m.status === 'completed').length
    });
  });

  // API Route: Execute Accelerated Meeting Simulation on Backend
  app.post('/api/meetings/:id/simulate', (req, res) => {
    const { id } = req.params;
    const meeting = databaseTables.meetings.find(m => m.id === id);

    if (!meeting) {
      return res.status(404).json({ success: false, error: `Meeting with ID ${id} not found.` });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Build comprehensive transcript simulation
    const simulationTranscript = [
      {
        stepNumber: 1,
        speaker: meeting.organizer.split('@')[0].replace('.', ' '),
        avatarRole: 'Session Host',
        action: 'Quorum Call & Agenda Roll-call',
        dialogue: `Calling executive session to order regarding "${meeting.title}". Quorum confirmed with ${meeting.attendees.length} participants present.`,
        timestamp: '00:00:15',
        status: 'completed'
      },
      {
        stepNumber: 2,
        speaker: 'Sarah Lin (CFO)',
        avatarRole: 'Financial Oversight',
        action: 'Relational Database & Contract Verification',
        dialogue: `Reviewed ERP ledger and contract references. The volume rebate criteria ($50k threshold) and SLA terms match our verified parameters.`,
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
        action: 'Unanimous Ratification & Signature Gate',
        dialogue: `Motion seconded and carried with 100% affirmative sign-off. Session concluded, action items logged to database.`,
        timestamp: '00:24:50',
        status: 'completed'
      }
    ];

    // Mark meeting completed
    meeting.status = 'completed';
    (meeting as any).simulationTranscript = simulationTranscript;
    (meeting as any).outcomes = {
      resolutionSummary: `Consensus achieved: All ${meeting.agenda.length} agenda items resolved with 100% quorum sign-off.`,
      decision: 'approved',
      approvedDisbursement: meeting.relatedWorkflowId === 'wf-fin-001' ? 24565 : undefined,
      executedAt: now,
      actionItems: meeting.agenda.map((item: string, idx: number) => ({
        id: `act-${meeting.id}-${idx + 1}`,
        task: item,
        assignee: meeting.attendees[idx % meeting.attendees.length]?.name || 'Operations Lead',
        due: meeting.dateString,
        completed: true
      }))
    };

    // If related to Vanguard invoice INV-9044, auto update invoice in database table
    if (meeting.relatedWorkflowId === 'wf-fin-001' || meeting.title.includes('24,565')) {
      const inv = databaseTables.invoices.find(i => i.invoice_id === 'INV-9044');
      if (inv) {
        inv.status = 'Approved';
      }
    }

    return res.json({
      success: true,
      message: `Meeting ${meeting.id} simulated and finalized in database.`,
      meeting,
      remainingCount: databaseTables.meetings.filter(m => m.status === 'scheduled' || m.status === 'in_progress').length,
      doneCount: databaseTables.meetings.filter(m => m.status === 'completed').length
    });
  });

  // API Route: Update meeting status (toggle between remaining / done)
  app.patch('/api/meetings/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const meeting = databaseTables.meetings.find(m => m.id === id);

    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found.' });
    }

    meeting.status = status;
    return res.json({
      success: true,
      meeting,
      remainingCount: databaseTables.meetings.filter(m => m.status === 'scheduled' || m.status === 'in_progress').length,
      doneCount: databaseTables.meetings.filter(m => m.status === 'completed').length
    });
  });

  // API Route: Cancel / delete meeting
  app.delete('/api/meetings/:id', (req, res) => {
    const { id } = req.params;
    const idx = databaseTables.meetings.findIndex(m => m.id === id);

    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Meeting not found.' });
    }

    const removed = databaseTables.meetings.splice(idx, 1)[0];
    return res.json({
      success: true,
      message: `Meeting ${id} cancelled.`,
      removed,
      remainingCount: databaseTables.meetings.filter(m => m.status === 'scheduled' || m.status === 'in_progress').length,
      doneCount: databaseTables.meetings.filter(m => m.status === 'completed').length
    });
  });

  // API Route: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Flow.io Workflow Backend', uptime: process.uptime() });
  });

  // Mount Vite middlewares in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Flow.io Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
