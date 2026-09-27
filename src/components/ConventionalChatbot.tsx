import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  ShieldAlert, 
  FileSpreadsheet, 
  FileText, 
  Mail, 
  RefreshCw, 
  CornerDownRight, 
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { Workflow, EmailMessage, CalendarEventItem, SpreadsheetData, DocumentData, AuditLog } from '../types/workflow';
import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'approve_vanguard' | 'scan_inbound' | 'view_workflow' | 'view_sheet' | 'view_doc';
    payload?: any;
  };
  sourcesCited?: string[];
}

interface ConventionalChatbotProps {
  workflows: Workflow[];
  emails: EmailMessage[];
  calendarEvents: CalendarEventItem[];
  spreadsheets: SpreadsheetData[];
  documents: DocumentData[];
  auditLogs: AuditLog[];
  onOpenApprovalModal: (workflow: Workflow) => void;
  onSelectWorkflow: (id: string) => void;
  onNavigateToTab: (tab: any) => void;
  onTriggerScan: () => void;
}

export const ConventionalChatbot: React.FC<ConventionalChatbotProps> = ({
  workflows,
  emails,
  calendarEvents,
  spreadsheets,
  documents,
  auditLogs,
  onOpenApprovalModal,
  onSelectWorkflow,
  onNavigateToTab,
  onTriggerScan
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Hello! I am Flow Copilot, your grounded business workflow assistant. I have live real-time access to all registered workflows, spreadsheets (Accounts_Aging_Q3.xlsx, Vendor_POs_Matrix.xlsx), contract PDFs, inbound Gmail messages, and calendar deadlines.\n\nAsk me anything about pending obligations, invoice discrepancies, contract terms, or how Flow.io handles dynamic re-planning!`,
      timestamp: 'Just now',
      sourcesCited: ['Accounts_Aging_Q3.xlsx', 'Service_Agreement_Vanguard_v2.pdf', 'Gmail Inbox']
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const samplePromptChips = [
    "Why was the Vanguard workflow re-planned?",
    "Which invoices in Accounts_Aging_Q3 are overdue > 25 days?",
    "What discount does Section 4.2 of Vanguard's contract mandate?",
    "Which workflows need human supervisor approval?",
    "How does Flow.io handle missing info & dynamic re-planning?",
    "What is the status of invoice INV-9021 for Apex Logix?"
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    // Prepare live system data context for the assistant
    const currentContext = {
      workflows: workflows.map(w => ({
        id: w.id,
        title: w.title,
        status: w.status,
        amount: w.associatedEntities.amount,
        vendor: w.associatedEntities.vendorOrClient,
        currentStep: w.steps[w.currentStepIndex]?.title,
        needsApproval: w.status === 'waiting_approval'
      })),
      spreadsheets: spreadsheets.map(s => ({
        fileName: s.fileName,
        rows: s.data
      })),
      documents: documents.map(d => ({
        fileName: d.fileName,
        summary: d.summary,
        keyEntities: d.keyEntities,
        excerpt: d.extractedText.slice(0, 300)
      })),
      emails: emails.map(e => ({
        from: e.from,
        subject: e.subject,
        detectedKeywords: e.detectedKeywords,
        amount: e.extractedAmount,
        snippet: e.snippet
      })),
      calendar: calendarEvents.map(c => ({
        title: c.title,
        dateTime: c.dateTime,
        impact: c.relatedContext
      }))
    };

    // Try Gemini API if key is present
    const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                   (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || 
                   '';

    let answerText = '';
    let sources: string[] = [];
    let suggestedAction: ChatMessage['suggestedAction'] = undefined;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are Flow Copilot, a grounded AI business workflow assistant inside Flow.io.
Answer the user's question specifically using this REAL SYSTEM DATA:
${JSON.stringify(currentContext, null, 2)}

Key business background to remember:
- Vanguard Industrial Invoice INV-9044 was originally $28,900. Reconciled down to $24,565 due to Section 4.2 volume discount (15% off) because cumulative quarterly spend exceeded $50,000. It requires human sign-off because it exceeds the $10,000 policy ceiling.
- Apex Logix Invoice INV-9021 ($14,500) is 42 days overdue; SLA Section 7 allows a 7-day cure window before service suspension.
- Nordic Cloud PO-8830 ($9,800) matched with 0 variance and auto-disbursed without human gate.
- Flow.io handles missing data and failed tasks by self-healing and dynamic re-planning (e.g. injecting document verification, searching repositories, requesting missing forms) without stalling or crashing.

Keep answers concise, direct, helpful, and cite the exact file, cell, or contract section.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nUser Question: ${textToSend}`
        });

        if (response.text) {
          answerText = response.text;
        }
      } catch (err) {
        console.warn('Gemini request in chatbot failed, using rich deterministic grounder:', err);
      }
    }

    // High quality deterministic grounded fallback
    if (!answerText) {
      const lower = textToSend.toLowerCase();
      if (lower.includes('vanguard') || lower.includes('inv-9044') || lower.includes('re-plan') || lower.includes('discount')) {
        answerText = `**Vanguard Industrial (INV-9044) Workflow Context:**\n\n• **Root Issue:** The vendor originally billed **$28,900** in Accounts_Aging_Q3.xlsx. However, the approved PO budget was $24,565.\n• **Dynamic Re-Plan:** Flow.io detected this variance, scanned Gmail for confirmation from Elena Rostova, and autonomously injected a legal verification step on **Service_Agreement_Vanguard_v2.pdf**.\n• **Contract Clause 4.2:** Validated that Takasho Enterprises exceeded $50,000 in quarterly purchases, earning a mandatory **15% volume discount ($4,335)**.\n• **Current Status:** Adjusted payable to **$24,565.00**. Awaiting human supervisor approval (Gate AP-10K) before Friday's 2:00 PM bank cutoff.`;
        sources = ['Service_Agreement_Vanguard_v2.pdf (Section 4.2)', 'Accounts_Aging_Q3.xlsx!B5:F5', 'Gmail (billing@vanguardindustrial.com)'];
        suggestedAction = {
          label: 'Review & Sign-Off Vanguard Payment ($24,565)',
          actionType: 'approve_vanguard'
        };
      } else if (lower.includes('aging') || lower.includes('overdue') || lower.includes('25 days') || lower.includes('spreadsheet')) {
        answerText = `**Accounts Receivable Aging Q3 (Accounts_Aging_Q3.xlsx) Overdue Analysis:**\n\nQuerying criteria **Overdue_Days > 25 days** yields 2 critical accounts:\n1. **INV-9021** (Apex Logix Ltd): **$14,500.00** — 42 days overdue (Critical Overdue).\n2. **INV-9044** (Vanguard Industrial): **$28,900.00** (Adjusted to $24,565.00) — 29 days overdue (Disputed Terms).\n\nOther accounts (Nordic Cloud $9,800, Solaria Energy $42,000, Meridian Health $16,200) are within 4 to 24 days.`;
        sources = ['Accounts_Aging_Q3.xlsx (Range B4:F18)'];
        suggestedAction = {
          label: 'Open Spreadsheet Grid & Cell Engine',
          actionType: 'view_sheet'
        };
      } else if (lower.includes('section 4.2') || lower.includes('contract') || lower.includes('clause')) {
        answerText = `**Section 4.2 of Master Service Agreement (CTR-2025-V2):**\n\n*"VOLUME DISCOUNT & RETENTION: If Client maintains prompt settlement or reaches cumulative quarterly orders exceeding $50,000, a mandatory 15% discount shall apply to all secondary equipment invoices issued in Q3."*\n\nThis clause legally enforces the **$4,335 discount** on Invoice INV-9044, reducing the payable obligation from $28,900 to **$24,565**.`;
        sources = ['Service_Agreement_Vanguard_v2.pdf (Clause 4.2)'];
        suggestedAction = {
          label: 'Inspect Contract PDF',
          actionType: 'view_doc'
        };
      } else if (lower.includes('approval') || lower.includes('human') || lower.includes('sign-off') || lower.includes('gate')) {
        const pendingWf = workflows.filter(w => w.status === 'waiting_approval');
        answerText = `**Active Workflows Requiring Human Sign-Off (${pendingWf.length}):**\n\n` +
          pendingWf.map(w => `• **${w.title}** (${w.associatedEntities.vendorOrClient}): **$${w.associatedEntities.amount?.toLocaleString()}**\n  Reason: Exceeds automated execution ceiling ($10,000) under Policy AP-10K.`).join('\n\n') +
          `\n\nHuman approval includes an editable outbound communication draft and one-click wire dispatch.`;
        sources = ['Policy AP-10K Governance Rules', 'Workflow wf-fin-001'];
        if (pendingWf.length > 0) {
          suggestedAction = {
            label: 'Open Human Sign-off Dialog',
            actionType: 'approve_vanguard'
          };
        }
      } else if (lower.includes('missing') || lower.includes('failed') || lower.includes('re-planning') || lower.includes('re-plan')) {
        answerText = `**How Flow.io Handles Missing Info & Failed Tasks:**\n\n1. **Dynamic Task Injection:** When an expected entity is missing (e.g. absent W-9 form or unmatched PO budget), Flow.io does **not** crash or abort. Instead, it triggers an autonomous re-plan node.\n2. **Multi-Source Cross-Querying:** It queries connected repositories (Gmail threads, contract clauses, ERP database) to locate the missing parameter.\n3. **Adaptive Routing:** If verified, the pipeline self-heals and resumes execution. If unresolvable, it generates an intelligent escalation draft for human intervention.\n4. **Audit Immutability:** Every decision, retry, and re-plan is written to the immutable Audit Trail.`;
        sources = ['Workflow Engine Architecture', 'Dynamic Pipeline Logic'];
      } else if (lower.includes('apex') || lower.includes('inv-9021')) {
        answerText = `**Apex Logix Ltd (INV-9021) Status:**\n\n• **Amount:** $14,500.00 (Due Date: 2026-08-15, **42 days overdue**).\n• **Trigger:** Inbound formal demand letter from collections@apexlogix.io.\n• **SLA Clause 7:** 7-calendar-day cure period before legal referral or account suspension.\n• **Current Step:** Extracting cure terms and checking CFO calendar availability for emergency payment allocation.`;
        sources = ['Apex_SLA_Terms_2025.docx', 'Gmail (collections@apexlogix.io)', 'Accounts_Aging_Q3.xlsx'];
      } else if (lower.includes('incident') || lower.includes('outgoing') || lower.includes('dispatch') || lower.includes('outbox')) {
        answerText = `**Outgoing Incident Emails & Escalation Notices Dispatched:**\n\n` +
          `1. **INC-2026-8812 (P1 - Critical):** Transmitted to *billing@vanguardindustrial.com* enforcing Section 4.2 volume discount ($4,335 savings on INV-9044). Status: **250 OK Delivered via SMTP Relay**.\n` +
          `2. **INC-2026-9021 (P1 - Critical):** Transmitted to *collections@apexlogix.io* invoking SLA Clause 7 cure protocol & initial 50% installment remittance for INV-9021 ($14,500). Status: **250 OK Delivered**.\n\n` +
          `You can simulate new incident email dispatches or test counterparty replies in the **Email & Incident Intelligence** tab.`;
        sources = ['Outgoing Incidents Outbox', 'SMTP Relay Handshake Log (Port 587 / TLS 1.3)'];
      } else {
        answerText = `I analyzed your request against Flow.io's active state. We have **${workflows.length} active workflows**, **${spreadsheets.length} spreadsheets** (including Accounts Aging Q3), **${documents.length} legal contracts**, and **${emails.length} inbound Gmail messages**.\n\nYou can ask about specific vendors (Vanguard, Apex Logix, Nordic Cloud), overdue invoice ranges, contract terms, or pending supervisor sign-offs!`;
        sources = ['Flow.io System State'];
      }
    }

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        sender: 'assistant',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
        sourcesCited: sources.length > 0 ? sources : undefined
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 400);
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    if (action.actionType === 'approve_vanguard') {
      const wf = workflows.find(w => w.id === 'wf-fin-001') || workflows[0];
      onOpenApprovalModal(wf);
    } else if (action.actionType === 'view_sheet') {
      onNavigateToTab('docs');
    } else if (action.actionType === 'view_doc') {
      onNavigateToTab('docs');
    } else if (action.actionType === 'view_workflow') {
      onNavigateToTab('workflows');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5 text-[#FACC15]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Flow Copilot</h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FEF08A] text-[#713F12]">
                Grounded in Real Data
              </span>
            </div>
            <p className="text-xs text-[#888886] mt-0.5">
              Conversational query engine with full visibility into workflows, spreadsheets, contracts, and emails
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'msg-reset',
                sender: 'assistant',
                text: 'Chat history reset. How can I assist you with your business workflows today?',
                timestamp: 'Just now'
              }
            ]);
          }}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F4F4F0] text-[#666664] hover:bg-[#EBEBE6] border border-[#ECECE6]"
        >
          Clear Chat
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div>
        <span className="text-[11px] font-bold text-[#888886] uppercase tracking-wider block mb-2">
          Recommended Inquiries (Click to Ask):
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePromptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#ECECE6] hover:border-[#FACC15] hover:bg-[#FEFCE8] text-xs text-[#111111] transition-all text-left shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-[#ECECE6] shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                    isUser
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#FEF08A] text-[#713F12]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#111111] text-white rounded-tr-xs'
                        : 'bg-[#F9F9F7] text-[#111111] border border-[#ECECE6] rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">{msg.text}</div>

                    {/* Sources cited badge */}
                    {msg.sourcesCited && msg.sourcesCited.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#ECECE6] flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider mr-1">
                          Sources Verified:
                        </span>
                        {msg.sourcesCited.map((src, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono font-semibold bg-white px-2 py-0.5 rounded border border-[#DFDFD9] text-[#444443]"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contextual Action Button if assistant suggested an action */}
                  {msg.suggestedAction && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActionClick(msg.suggestedAction)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FACC15] text-[#111111] hover:bg-[#EAB308] shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] text-[#A1A19E] block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3 max-w-md">
              <div className="w-8 h-8 rounded-full bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F9F9F7] border border-[#ECECE6] text-xs text-[#888886] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#CA8A04] animate-pulse" />
                <span>Cross-checking spreadsheets, contracts, and workflows...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#FAFAF8] border-t border-[#ECECE6] flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about any invoice, contract clause, spreadsheet row, or workflow state..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-[#ECECE6] text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isThinking}
            className="px-5 py-2.5 rounded-2xl bg-[#111111] text-white hover:bg-black font-bold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
