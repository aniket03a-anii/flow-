/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ExternalLink, 
  Filter, 
  Users, 
  CalendarDays,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  RefreshCw
} from 'lucide-react';
import { CalendarEventItem, CalendarEventType } from '../types/workflow';

interface CalendarViewProps {
  events: CalendarEventItem[];
  onSelectWorkflow: (workflowId: string) => void;
  onAddEvent: (event: CalendarEventItem) => void;
  onSyncCalendar: () => void;
  isSyncing: boolean;
  onNavigateToMeetings?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onSelectWorkflow,
  onAddEvent,
  onSyncCalendar,
  isSyncing,
  onNavigateToMeetings
}) => {
  const [activeView, setActiveView] = useState<'month' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(events[0] || null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-10-02');
  const [newTime, setNewTime] = useState('14:00');
  const [newType, setNewType] = useState<CalendarEventType>('payment_cutoff');
  const [newDescription, setNewDescription] = useState('');
  const [newWorkflowId, setNewWorkflowId] = useState('wf-fin-001');

  // Days in September / October 2026 for demonstration
  const calendarDays = [
    { day: 24, month: 'Sep', inMonth: true, hasEvents: [] },
    { day: 25, month: 'Sep', inMonth: true, hasEvents: events.filter(e => e.dateString === '2026-09-25') },
    { day: 26, month: 'Sep', inMonth: true, hasEvents: [] },
    { day: 27, month: 'Sep', inMonth: true, hasEvents: events.filter(e => e.dateString === '2026-09-27') },
    { day: 28, month: 'Sep', inMonth: true, hasEvents: events.filter(e => e.dateString === '2026-09-28') },
    { day: 29, month: 'Sep', inMonth: true, hasEvents: [] },
    { day: 30, month: 'Sep', inMonth: true, hasEvents: events.filter(e => e.dateString === '2026-09-30') },
    { day: 1, month: 'Oct', inMonth: true, hasEvents: [] },
    { day: 2, month: 'Oct', inMonth: true, hasEvents: events.filter(e => e.dateString === '2026-10-02') },
    { day: 3, month: 'Oct', inMonth: true, hasEvents: [] },
    { day: 4, month: 'Oct', inMonth: true, hasEvents: [] },
    { day: 5, month: 'Oct', inMonth: true, hasEvents: [] },
    { day: 6, month: 'Oct', inMonth: true, hasEvents: [] },
    { day: 7, month: 'Oct', inMonth: true, hasEvents: [] },
  ];

  const filteredEvents = events.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: CalendarEventItem = {
      id: `cal-${Date.now()}`,
      title: newTitle,
      organizer: 'john.doe@takasho-enterprises.com',
      dateTime: `${newDate}, ${newTime}`,
      dateString: newDate,
      timeString: newTime,
      type: newType,
      description: newDescription || 'Scheduled milestone governing automated workflow execution window.',
      attendees: ['john.doe@takasho-enterprises.com'],
      relatedContext: 'Synchronized with Flow.io automated decision gates',
      relatedWorkflowId: newWorkflowId,
      status: 'upcoming',
      severity: newType === 'payment_cutoff' ? 'critical' : 'normal'
    };

    onAddEvent(item);
    setSelectedEvent(item);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const getTypeBadge = (type: CalendarEventType) => {
    switch (type) {
      case 'payment_cutoff':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">Bank Cutoff</span>;
      case 'cure_deadline':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200">SLA Cure Window</span>;
      case 'meeting':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">Executive Review</span>;
      case 'sla_review':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Telemetry Audit</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gray-50 text-gray-700">General</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4 text-[#A16207]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Business Calendar & Deadlines</h1>
              <p className="text-xs text-[#888886]">
                Bank batch cutoffs, cure periods, and executive reviews that constrain automated workflows
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {onNavigateToMeetings && (
            <button
              onClick={onNavigateToMeetings}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Users className="w-3.5 h-3.5 text-[#A16207]" />
              <span>Meetings & Live Simulation</span>
            </button>
          )}

          <button
            onClick={onSyncCalendar}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E2DC] hover:bg-[#F9F9F7] text-[#111111] flex items-center gap-2 shadow-2xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#111111] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Google Calendar API'}</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>Schedule Milestone</span>
          </button>
        </div>
      </div>

      {/* Filter and View Toggle bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E2DC] shadow-2xs">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-[#888886] uppercase tracking-wider text-[10px] px-2">Type:</span>
          {[
            { id: 'all', label: 'All Milestones' },
            { id: 'payment_cutoff', label: 'Payment Cutoffs' },
            { id: 'meeting', label: 'Executive Reviews' },
            { id: 'cure_deadline', label: 'Cure Windows' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterType === f.id
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#666664] hover:text-[#111111] hover:bg-[#F4F4F0]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-[#F4F4F0] p-1 rounded-xl border border-[#ECECE6]">
          <button
            onClick={() => setActiveView('month')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeView === 'month' ? 'bg-[#18181B] text-white' : 'text-[#666664] hover:text-[#111111]'
            }`}
          >
            Month Grid
          </button>
          <button
            onClick={() => setActiveView('agenda')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeView === 'agenda' ? 'bg-[#18181B] text-white' : 'text-[#666664] hover:text-[#111111]'
            }`}
          >
            Agenda List ({filteredEvents.length})
          </button>
        </div>
      </div>

      {/* Main Calendar Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive Calendar Matrix (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E2E2DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F0]">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#CA8A04]" />
              <h2 className="text-base font-extrabold text-[#111111]">
                September – October 2026 Fiscal Cycle
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#888886] font-medium">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Cutoff</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> SLA Cure</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Review</span>
            </div>
          </div>

          {activeView === 'month' ? (
            <div className="grid grid-cols-7 gap-2.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => (
                <div key={w} className="text-center text-[11px] font-bold text-[#888886] uppercase tracking-wider py-1">
                  {w}
                </div>
              ))}

              {calendarDays.map((d, idx) => {
                const isSelected = selectedEvent && selectedEvent.dateString.endsWith(String(d.day).padStart(2, '0'));
                const hasCutoff = d.hasEvents.some(e => e.type === 'payment_cutoff');
                const hasCure = d.hasEvents.some(e => e.type === 'cure_deadline');
                const hasReview = d.hasEvents.some(e => e.type === 'meeting');

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (d.hasEvents.length > 0) {
                        setSelectedEvent(d.hasEvents[0]);
                      }
                    }}
                    className={`min-h-[96px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#111111] bg-[#FAFAF8] ring-2 ring-[#111111]/15 shadow-xs'
                        : d.hasEvents.length > 0
                        ? 'border-[#ECECE6] bg-[#FEFCE8]/40 hover:bg-[#FEFCE8]'
                        : 'border-[#F4F4F0] bg-white hover:bg-[#FAFAF8]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={`${isSelected ? 'text-[#111111] font-extrabold' : 'text-[#777775]'}`}>
                        {d.day}
                      </span>
                      <span className="text-[10px] text-[#A1A19E] font-medium">{d.month}</span>
                    </div>

                    <div className="space-y-1">
                      {d.hasEvents.map(e => (
                        <div
                          key={e.id}
                          className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold truncate leading-tight ${
                            e.type === 'payment_cutoff'
                              ? 'bg-rose-100 text-rose-800'
                              : e.type === 'cure_deadline'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {e.timeString} • {e.title.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredEvents.map(e => (
                <div
                  key={e.id}
                  onClick={() => setSelectedEvent(e)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedEvent?.id === e.id
                      ? 'border-[#111111] bg-[#FAFAF8] ring-2 ring-[#111111]/10'
                      : 'border-[#ECECE6] bg-white hover:bg-[#FAFAF8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F4F4F0] border border-[#ECECE6] flex flex-col items-center justify-center font-mono">
                      <span className="text-[10px] text-[#888886] uppercase font-bold">{e.dateString.slice(5, 7) === '10' ? 'OCT' : 'SEP'}</span>
                      <span className="text-base font-extrabold text-[#111111] leading-none">{e.dateString.slice(8, 10)}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#111111]">{e.title}</h4>
                      <p className="text-[11px] text-[#888886] mt-0.5">{e.dateTime} • {e.organizer}</p>
                    </div>
                  </div>
                  <div>{getTypeBadge(e.type)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Workflow integration banner */}
          <div className="pt-3 border-t border-[#F4F4F0] flex items-center justify-between text-xs text-[#888886]">
            <span>Automated cross-check: Calendar deadlines determine <strong>Risk Assessment</strong> in workflows</span>
            <button
              onClick={() => onSelectWorkflow('wf-fin-001')}
              className="font-bold text-[#111111] hover:underline flex items-center gap-1"
            >
              Inspect Constrained Workflow <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Selected Event Inspector & Workflow Linking (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedEvent ? (
            <div className="bg-white rounded-3xl p-6 border border-[#E2E2DC] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F0]">
                {getTypeBadge(selectedEvent.type)}
                <span className="text-[11px] font-mono font-bold text-[#888886]">{selectedEvent.timeString}</span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#111111] leading-snug">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-[#666664] mt-2 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Event Timing & Impact Box */}
              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#ECECE6] space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block">Scheduled Window</span>
                  <span className="font-extrabold text-[#111111] font-mono">{selectedEvent.dateTime}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block">Workflow Impact</span>
                  <span className="text-[#333332] font-medium">{selectedEvent.relatedContext}</span>
                </div>
              </div>

              {/* Linked Workflow Pill */}
              {selectedEvent.relatedWorkflowId && (
                <div className="p-3.5 rounded-2xl bg-[#FEFCE8] border border-[#FDE047] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#854D0E] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#CA8A04]" />
                      Linked Workflow
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#713F12]">
                      {selectedEvent.relatedWorkflowId}
                    </span>
                  </div>
                  <p className="text-xs text-[#713F12]">
                    This calendar deadline directly constrains the settlement authorization gate.
                  </p>
                  <button
                    onClick={() => onSelectWorkflow(selectedEvent.relatedWorkflowId!)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>Open Linked Workflow Visualizer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FACC15]" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-[#E2E2DC] text-center text-xs text-[#888886]">
              Select a calendar day or milestone to inspect constraints
            </div>
          )}

          {/* Quick Stats Widget */}
          <div className="bg-[#111111] text-white rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A1A1AA] uppercase font-bold tracking-wider text-[10px]">Upcoming Bank Batch</span>
              <span className="text-[#FACC15] font-mono font-bold">Cutoff: 36h</span>
            </div>
            <h4 className="text-lg font-extrabold text-white">Friday 14:00 PM Clearing</h4>
            <p className="text-xs text-[#D4D4D8] leading-relaxed">
              All vouchers requiring supervisor sign-off must execute before 1:30 PM to clear without rollover fee.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Milestone Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E2E2DC] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECECE6]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4 text-[#A16207]" />
                </div>
                <h3 className="text-base font-extrabold text-[#111111]">Schedule Milestone</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F4F0] text-[#111111] hover:bg-[#ECECE6] flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#111111] block mb-1">Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Disbursement Batch Approval"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:ring-2 focus:ring-[#111111] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111111] block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111111] block mb-1">Cutoff Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111111] block mb-1">Milestone Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as CalendarEventType)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-bold focus:outline-none"
                >
                  <option value="payment_cutoff">Bank Payment Batch Cutoff</option>
                  <option value="meeting">Executive Review Meeting</option>
                  <option value="cure_deadline">SLA Cure Window Expiration</option>
                  <option value="sla_review">Telemetry / Contract Review</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#111111] block mb-1">Linked Workflow</label>
                <select
                  value={newWorkflowId}
                  onChange={(e) => setNewWorkflowId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                >
                  <option value="wf-fin-001">wf-fin-001: Vanguard Industrial Overdue Settlement</option>
                  <option value="wf-proc-002">wf-proc-002: Apex Logix Delinquency Cure</option>
                  <option value="wf-rec-003">wf-rec-003: Nordic Cloud PO Reconciliation</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#111111] block mb-1">Description & Constraints</label>
                <textarea
                  rows={2}
                  placeholder="Governs the final deadline for supervisor sign-off..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:ring-2 focus:ring-[#111111] focus:outline-none leading-relaxed resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F4F4F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#666664] hover:bg-[#F4F4F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>Add to Calendar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
