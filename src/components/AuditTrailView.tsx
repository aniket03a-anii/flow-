import React, { useState } from 'react';
import { AuditLog } from '../types/workflow';
import { 
  CheckSquare, 
  Search, 
  Download, 
  Filter, 
  ShieldAlert, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  User, 
  Mail, 
  FileSpreadsheet,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLog[];
  workflowIds: string[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs, workflowIds }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical' | 'success'>('all');
  const [workflowFilter, setWorkflowFilter] = useState<string>('all');
  const [selectedPayloadLog, setSelectedPayloadLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesWorkflow = workflowFilter === 'all' || log.workflowId === workflowFilter;

    return matchesSearch && matchesSeverity && matchesWorkflow;
  });

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `flow_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsCSV = () => {
    const headers = ['Timestamp', 'Workflow_ID', 'Actor', 'Action', 'Severity', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.workflowId}"`,
      `"${l.actor}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.severity}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `flow_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActorIcon = (actor: AuditLog['actor']) => {
    switch (actor) {
      case 'System Engine': return <Cpu className="w-3.5 h-3.5 text-gray-700" />;
      case 'Gemini Reasoner': return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case 'Gmail Scanner': return <Mail className="w-3.5 h-3.5 text-rose-500" />;
      case 'Spreadsheet Ingester': return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />;
      case 'John Doe (User)': return <User className="w-3.5 h-3.5 text-[#111111]" />;
      default: return <Cpu className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (sev: AuditLog['severity']) => {
    switch (sev) {
      case 'success':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">SUCCESS</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#854D0E] bg-[#FEF08A] border border-[#FDE047]">WARNING</span>;
      case 'critical':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200">CRITICAL</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200">INFO</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Audit Trail & Traceability</h1>
          <p className="text-xs text-[#888886] mt-0.5">
            Immutable log of all autonomous system actions, model decisions, and human supervisor overrides
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportAsCSV}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F4F4F0] text-[#111111] hover:bg-[#EBEBE6] border border-[#ECECE6] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportAsJSON}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECECE6] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9E9C]" />
          <input
            type="text"
            placeholder="Search action, details, actor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#FAFAF8] border border-[#ECECE6] focus:outline-none focus:ring-2 focus:ring-[#111111]"
          />
        </div>

        {/* Severity and Workflow Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Severity selector */}
          <div className="flex items-center bg-[#F4F4F0] p-1 rounded-xl border border-[#ECECE6]">
            {(['all', 'info', 'warning', 'critical', 'success'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                  severityFilter === sev
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'text-[#666664] hover:text-[#111111]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Workflow dropdown filter */}
          <select
            value={workflowFilter}
            onChange={(e) => setWorkflowFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAFAF8] border border-[#ECECE6] text-[#111111] focus:outline-none"
          >
            <option value="all">All Workflows</option>
            {workflowIds.map((id) => (
              <option key={id} value={id}>Workflow: {id}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-[#ECECE6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F4F4F0] text-[#666664] font-bold border-b border-[#ECECE6]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Workflow ID</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details & Reasoning</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F0]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#777775] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#111111]">
                    {log.workflowId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-semibold text-[#111111]">
                      {getActorIcon(log.actor)}
                      <span>{log.actor}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#111111]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-[#555554] max-w-md line-clamp-2">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4">
                    {getSeverityBadge(log.severity)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {log.payload ? (
                      <button
                        onClick={() => setSelectedPayloadLog(log)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#F4F4F0] hover:bg-[#ECECE6] text-[#111111] transition-colors"
                      >
                        JSON
                      </button>
                    ) : (
                      <span className="text-[#B0B0AE] text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedPayloadLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-[#ECECE6] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECECE6]">
              <div>
                <h3 className="text-base font-extrabold text-[#111111]">Audit Event Payload</h3>
                <p className="text-xs text-[#888886]">{selectedPayloadLog.action} • {selectedPayloadLog.timestamp}</p>
              </div>
              <button
                onClick={() => setSelectedPayloadLog(null)}
                className="w-8 h-8 rounded-full bg-[#F4F4F0] text-[#111111] hover:bg-[#ECECE6] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-[#18181B] text-[#E4E4E7] font-mono text-xs overflow-auto max-h-72">
              {JSON.stringify(selectedPayloadLog.payload, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPayloadLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
