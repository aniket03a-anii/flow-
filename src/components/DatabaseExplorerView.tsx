/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  FileCode, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { dbService, VendorRow, InvoiceRow, PurchaseOrderRow, LedgerPostingRow } from '../db/databaseService';

interface DatabaseExplorerViewProps {
  onSelectWorkflow: (workflowId: string) => void;
}

export const DatabaseExplorerView: React.FC<DatabaseExplorerViewProps> = ({
  onSelectWorkflow
}) => {
  const [activeTable, setActiveTable] = useState<'vendors' | 'invoices' | 'purchase_orders' | 'ledger' | 'meetings'>('invoices');
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT * FROM invoices WHERE status = 'Critical Overdue' OR status = 'Pending Approval';");
  const [queryResult, setQueryResult] = useState<{ columns: string[]; rows: any[]; count: number } | null>(null);
  const [queryLatency, setQueryLatency] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Preset SQL Queries
  const PRESET_QUERIES = [
    {
      label: 'Scheduled & Done Meetings',
      query: "SELECT id, title, type, status, dateString, timeString, organizer, priority FROM meetings ORDER BY dateString ASC;"
    },
    {
      label: 'Critical Overdue & Pending',
      query: "SELECT * FROM invoices WHERE status = 'Critical Overdue' OR status = 'Pending Approval';"
    },
    {
      label: 'Cross-Table PO Variance Join',
      query: "SELECT i.invoice_id, v.vendor_name, i.billed_amount, po.approved_budget, (i.billed_amount - po.approved_budget) AS variance FROM invoices i JOIN vendors v JOIN purchase_orders po;"
    },
    {
      label: 'Q3 Volume Spend & Discount Qualification',
      query: "SELECT vendor_name, cumulative_q3_spend, discount_eligible, risk_score FROM vendors WHERE cumulative_q3_spend > 50000;"
    },
    {
      label: 'General Ledger Audit Entries',
      query: "SELECT * FROM general_ledger ORDER BY timestamp DESC;"
    }
  ];

  const handleRunQuery = (customSql?: string) => {
    const sqlToRun = customSql || sqlQuery;
    setIsExecuting(true);
    const start = performance.now();

    setTimeout(() => {
      try {
        const res = dbService.executeQuery(sqlToRun);
        setQueryResult(res);
        setQueryLatency(Number((performance.now() - start).toFixed(2)));
      } catch (err) {
        console.error(err);
      } finally {
        setIsExecuting(false);
      }
    }, 180);
  };

  // Run initial query on mount if empty
  React.useEffect(() => {
    handleRunQuery(sqlQuery);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-bold shadow-xs">
            <Database className="w-5 h-5 text-[#FACC15]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Relational Database & ERP Engine</h1>
            <p className="text-xs text-[#888886] mt-0.5">
              Live SQL storage, vendor accounts, purchase orders, and audit trail ledger queried by autonomous workflow steps
            </p>
          </div>
        </div>

        {/* Backend health status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E2DC] text-xs font-semibold text-[#111111] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>PostgreSQL / In-Memory Mock Active</span>
          <span className="text-[10px] font-mono text-[#888886] bg-[#F4F4F0] px-1.5 py-0.5 rounded">PORT 3000</span>
        </div>
      </div>

      {/* Interactive SQL Console & Presets */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E2DC] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4F4F0]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
            <Terminal className="w-4 h-4 text-[#CA8A04]" />
            <span>Interactive SQL Query Console</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#888886] uppercase mr-1">Presets:</span>
            {PRESET_QUERIES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSqlQuery(p.query);
                  handleRunQuery(p.query);
                }}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#F4F4F0] text-[#333332] hover:bg-[#111111] hover:text-white transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* SQL Input Area */}
        <div className="relative">
          <textarea
            rows={2}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full font-mono text-xs bg-[#18181B] text-[#F4F4F5] p-3.5 rounded-2xl border border-black/20 focus:ring-2 focus:ring-[#FACC15] focus:outline-none resize-none leading-relaxed"
            placeholder="SELECT * FROM invoices..."
          />
          <button
            onClick={() => handleRunQuery()}
            disabled={isExecuting}
            className="absolute right-3.5 bottom-3.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FACC15] text-[#111111] hover:bg-[#EAB308] shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Play className={`w-3 h-3 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
          </button>
        </div>

        {/* Query Stats Bar */}
        {queryResult && (
          <div className="flex items-center justify-between text-xs text-[#888886] pt-1">
            <div className="flex items-center gap-3">
              <span>Returned: <strong className="text-[#111111] font-mono">{queryResult.count} rows</strong></span>
              <span>•</span>
              <span>Execution Time: <strong className="text-emerald-600 font-mono">{queryLatency ?? 0.8} ms</strong></span>
            </div>
            <span className="text-[11px] font-mono text-[#777775]">Query Engine: RelationalSQL v2.4</span>
          </div>
        )}

        {/* Results Table */}
        {queryResult && (
          <div className="overflow-x-auto rounded-2xl border border-[#ECECE6]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F8F6] border-b border-[#ECECE6]">
                  {queryResult.columns.map((col) => (
                    <th key={col} className="px-3.5 py-2.5 font-bold uppercase text-[10px] tracking-wider text-[#666664] font-mono">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F0] font-mono">
                {queryResult.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#FEFCE8]/50 transition-colors">
                    {queryResult.columns.map((col) => {
                      const val = row[col];
                      const isStatus = col === 'status';
                      const isAmount = col.includes('amount') || col.includes('payable') || col.includes('budget') || col.includes('spend') || col.includes('billed') || col.includes('discount') || col.includes('variance') || col.includes('debit');

                      return (
                        <td key={col} className="px-3.5 py-2.5 text-[#111111] whitespace-nowrap">
                          {isStatus ? (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              val === 'Critical Overdue' ? 'bg-rose-100 text-rose-800' :
                              val === 'Pending Approval' ? 'bg-amber-100 text-amber-900' :
                              val === 'Approved' || val === 'Matched' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {String(val)}
                            </span>
                          ) : isAmount && typeof val === 'number' ? (
                            <span className="font-bold">
                              ${val.toLocaleString()}
                            </span>
                          ) : typeof val === 'boolean' ? (
                            <span className={val ? 'text-emerald-600 font-bold' : 'text-gray-400 font-bold'}>
                              {val ? 'TRUE' : 'FALSE'}
                            </span>
                          ) : (
                            String(val ?? '-')
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Relational Table Selector & Live Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Schema and Table Explorer (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E2E2DC] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4F4F0]">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-[#CA8A04]" />
              <h2 className="text-base font-extrabold text-[#111111]">Database Tables & Schema</h2>
            </div>

            {/* Table Tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-[#F4F4F0] p-1 rounded-xl border border-[#ECECE6]">
              {[
                { id: 'invoices', label: 'Invoices' },
                { id: 'vendors', label: 'Vendors' },
                { id: 'purchase_orders', label: 'Purchase Orders' },
                { id: 'ledger', label: 'General Ledger' },
                { id: 'meetings', label: 'Meetings & Deliberations' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTable(t.id as any);
                    handleRunQuery(`SELECT * FROM ${t.id === 'ledger' ? 'general_ledger' : t.id};`);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTable === t.id ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#666664] hover:text-[#111111]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cross-Verification Workflow Banner */}
          <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-[#FDE047] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-4 h-4 text-[#A16207]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#713F12]">Integrated with Workflow Analysis Step</h4>
                <p className="text-[11px] text-[#854D0E] mt-0.5">
                  Workflow <strong>wf-fin-001 (Overdue Financial Obligations)</strong> runs Step 4 against these tables to calculate volume discounts and detect $4,335 in savings.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectWorkflow('wf-fin-001')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>Inspect Step 4 in Visualizer</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FACC15]" />
            </button>
          </div>

          <div className="text-xs text-[#888886] flex items-center justify-between pt-2">
            <span>Primary Keys & Foreign Keys indexed for sub-millisecond multi-source cross validation</span>
            <span className="font-mono text-[11px]">Total Schemas: 4 | Constraints: Enforced</span>
          </div>
        </div>

        {/* Right Column: Schema Relationships & Verification Rules (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E2E2DC] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F4F4F0]">
              <Layers className="w-4 h-4 text-[#CA8A04]" />
              <h3 className="text-sm font-extrabold text-[#111111]">Automated Database Rules</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6]">
                <div className="flex items-center justify-between font-bold text-[#111111] mb-1">
                  <span>RULE_VOL_DISC_15</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Active</span>
                </div>
                <p className="text-[11px] text-[#666664]">
                  If <code>vendors.cumulative_q3_spend &gt;= 50000</code>, apply 15% discount to Q3 secondary equipment vouchers.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6]">
                <div className="flex items-center justify-between font-bold text-[#111111] mb-1">
                  <span>RULE_ESC_THRESHOLD_10K</span>
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Human Gate</span>
                </div>
                <p className="text-[11px] text-[#666664]">
                  Any invoice with <code>net_payable &gt;= $10,000</code> mandates supervisor sign-off before ERP posting.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6]">
                <div className="flex items-center justify-between font-bold text-[#111111] mb-1">
                  <span>RULE_CAL_WINDOW_OK</span>
                  <span className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">Temporal Gate</span>
                </div>
                <p className="text-[11px] text-[#666664]">
                  Cross-checks upcoming bank clearing batch in <code>calendar_events</code>. Flags items &lt; 24h from cutoff.
                </p>
              </div>
            </div>
          </div>

          {/* Quick ERP Connection Card */}
          <div className="bg-[#111111] text-white rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A1A1AA] uppercase font-bold tracking-wider text-[10px]">ERP Integration</span>
              <span className="text-[#FACC15] font-mono font-bold">Synchronized</span>
            </div>
            <h4 className="text-base font-extrabold text-white">QuickBooks & NetSuite Sync</h4>
            <p className="text-xs text-[#D4D4D8] leading-relaxed">
              When workflows finish, approved payments post directly to the General Ledger with verified audit trails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
