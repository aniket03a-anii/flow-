/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Play, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  ExternalLink, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Building2, 
  DollarSign, 
  CheckSquare, 
  RotateCcw, 
  Trash2, 
  Database,
  FileText,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { ScheduledMeeting, MeetingType, MeetingStatus, MeetingAttendee } from '../types/workflow';
import { MeetingSimulationModal } from './MeetingSimulationModal';

interface MeetingSchedulerViewProps {
  meetings: ScheduledMeeting[];
  onAddMeeting: (meeting: Partial<ScheduledMeeting>) => void;
  onUpdateMeetingStatus: (id: string, status: MeetingStatus, outcomes?: any) => void;
  onDeleteMeeting: (id: string) => void;
  onSelectWorkflow: (workflowId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const MeetingSchedulerView: React.FC<MeetingSchedulerViewProps> = ({
  meetings,
  onAddMeeting,
  onUpdateMeetingStatus,
  onDeleteMeeting,
  onSelectWorkflow,
  onNavigateToTab
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'remaining' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [simulatingMeeting, setSimulatingMeeting] = useState<ScheduledMeeting | null>(null);

  // Form State for Scheduling New Meeting
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MeetingType>('executive_review');
  const [newDate, setNewDate] = useState('2026-10-02');
  const [newTime, setNewTime] = useState('11:00');
  const [newDuration, setNewDuration] = useState(45);
  const [newVendor, setNewVendor] = useState('Vanguard Industrial Corp');
  const [newWorkflowId, setNewWorkflowId] = useState('wf-fin-001');
  const [newPriority, setNewPriority] = useState<'critical' | 'high' | 'normal'>('critical');
  const [newNotes, setNewNotes] = useState('');
  const [agendaList, setAgendaList] = useState<string[]>([
    'Review contractual payment terms and volume discount eligibility',
    'Verify supporting ERP ledger and PO matching reconciliation',
    'Authorize bank batch wire release and sign committee resolution'
  ]);
  const [newAgendaItem, setNewAgendaItem] = useState('');

  // Counts
  const remainingMeetings = useMemo(() => meetings.filter(m => m.status === 'scheduled' || m.status === 'in_progress'), [meetings]);
  const doneMeetings = useMemo(() => meetings.filter(m => m.status === 'completed'), [meetings]);

  // Filtering
  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      // Tab filter
      if (activeTab === 'remaining' && m.status === 'completed') return false;
      if (activeTab === 'done' && m.status !== 'completed') return false;

      // Type filter
      if (selectedType !== 'all' && m.type !== selectedType) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(query);
        const matchesVendor = (m.relatedVendor || '').toLowerCase().includes(query);
        const matchesWorkflow = (m.relatedWorkflowId || '').toLowerCase().includes(query);
        const matchesAttendees = m.attendees.some(a => a.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesVendor && !matchesWorkflow && !matchesAttendees) return false;
      }

      return true;
    });
  }, [meetings, activeTab, selectedType, searchQuery]);

  const handleAddAgendaItem = () => {
    if (!newAgendaItem.trim()) return;
    setAgendaList([...agendaList, newAgendaItem.trim()]);
    setNewAgendaItem('');
  };

  const handleRemoveAgendaItem = (idx: number) => {
    setAgendaList(agendaList.filter((_, i) => i !== idx));
  };

  const handleCreateSubmit = (e: React.FormEvent, simulateImmediately: boolean = false) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMtg: Partial<ScheduledMeeting> = {
      id: `mtg-${Date.now()}`,
      title: newTitle,
      type: newType,
      status: 'scheduled',
      dateString: newDate,
      timeString: newTime,
      dateTime: `${newDate}, ${newTime}`,
      durationMinutes: newDuration,
      organizer: 'john.doe@takasho-enterprises.com',
      relatedVendor: newVendor,
      relatedWorkflowId: newWorkflowId,
      priority: newPriority,
      notes: newNotes || 'Deliberation session linked with Flow.io ERP automation.',
      agenda: agendaList.length > 0 ? agendaList : ['Review transaction terms and record executive sign-off.'],
      attendees: [
        { name: 'Sarah Lin', email: 'sarah.cfo@takasho-enterprises.com', role: 'Chief Financial Officer', status: 'confirmed' },
        { name: 'John Doe', email: 'john.doe@takasho-enterprises.com', role: 'Operations Director', status: 'confirmed' },
        { name: `${newVendor.split(' ')[0]} Accounts Lead`, email: `accounts@${newVendor.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`, role: 'Vendor Counterparty', status: 'confirmed' }
      ],
      meetingLink: `https://meet.google.com/flw-${Math.floor(1000 + Math.random() * 9000)}`,
      databaseSynced: true
    };

    onAddMeeting(newMtg);
    setIsCreateModalOpen(false);

    if (simulateImmediately) {
      setSimulatingMeeting(newMtg as ScheduledMeeting);
    }

    // Reset Form
    setNewTitle('');
    setNewNotes('');
  };

  const getTypeBadge = (type: MeetingType) => {
    switch (type) {
      case 'executive_review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">Executive Review</span>;
      case 'vendor_cure':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200">Vendor SLA Cure</span>;
      case 'dispute_resolution':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">Dispute Resolution</span>;
      case 'post_mortem':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">Post-Mortem / Audit</span>;
      case 'quarterly_audit':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Quarterly Audit</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gray-50 text-gray-700 border border-gray-200">General Deliberation</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold shadow-xs">
              <Users className="w-5 h-5 text-[#A16207]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Meeting Scheduling & Simulation Hub</h1>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                  <Database className="w-3 h-3 text-emerald-600" />
                  Synced with SQL DB
                </span>
              </div>
              <p className="text-xs text-[#888886] mt-0.5">
                Executive committee reviews, vendor SLA cure sessions, and live multi-agent simulation attached to backend ERP ledger
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateToTab('database')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E2DC] hover:bg-[#F9F9F7] text-[#111111] flex items-center gap-2 shadow-2xs transition-all"
          >
            <Database className="w-3.5 h-3.5 text-[#111111]" />
            <span>Inspect DB Explorer</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Showing Remaining Meetings vs Done Meetings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Meetings Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#E2E2DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#888886] uppercase tracking-wider block">Total Database Records</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#111111] font-mono">{meetings.length}</span>
              <span className="text-xs text-[#888886]">Meetings</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#F4F4F0] flex items-center justify-center text-[#111111]">
            <Calendar className="w-5 h-5 text-[#666664]" />
          </div>
        </div>

        {/* Remaining Meetings Card (Prominent Glowing Indicator) */}
        <div 
          onClick={() => setActiveTab('remaining')}
          className={`p-4 rounded-3xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            activeTab === 'remaining' 
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40' 
              : 'bg-white border-[#E2E2DC] hover:border-amber-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Remaining Meetings</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-900 font-mono">{remainingMeetings.length}</span>
              <span className="text-xs text-amber-700 font-semibold">Pending Simulation</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Clock className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        {/* Done Meetings Card (Green Checkmark Indicator) */}
        <div 
          onClick={() => setActiveTab('done')}
          className={`p-4 rounded-3xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            activeTab === 'done' 
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/40' 
              : 'bg-white border-[#E2E2DC] hover:border-emerald-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Done Meetings</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-900 font-mono">{doneMeetings.length}</span>
              <span className="text-xs text-emerald-700 font-semibold">Ratified & Settled</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        {/* Quorum Clearance Metric */}
        <div className="p-4 rounded-3xl bg-white border border-[#E2E2DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#888886] uppercase tracking-wider block">Consensus Success Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#111111] font-mono">100%</span>
              <span className="text-xs text-emerald-600 font-bold">Policy AP-10K</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs and Search / Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E2E2DC] shadow-2xs">
        
        {/* Remaining / Done / All Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F4F4F0] p-1 rounded-xl border border-[#ECECE6]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#666664] hover:text-[#111111]'
            }`}
          >
            All Meetings ({meetings.length})
          </button>

          <button
            onClick={() => setActiveTab('remaining')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'remaining' 
                ? 'bg-amber-400 text-black shadow-xs font-extrabold' 
                : 'text-amber-800 hover:text-black hover:bg-amber-100/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>Remaining ({remainingMeetings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('done')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'done' 
                ? 'bg-emerald-600 text-white shadow-xs font-extrabold' 
                : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Done ({doneMeetings.length})</span>
          </button>
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#888886] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, vendor, attendee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:ring-2 focus:ring-[#111111] focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-1.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-bold text-[#111111] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="executive_review">Executive Review</option>
            <option value="vendor_cure">Vendor SLA Cure</option>
            <option value="quarterly_audit">Quarterly Audit</option>
            <option value="post_mortem">Post-Mortem / Reconcile</option>
          </select>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E2DC] shadow-2xs">
            <Users className="w-8 h-8 text-[#A1A19E] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#111111]">No meetings found</h3>
            <p className="text-xs text-[#888886] mt-1">Try adjusting your search criteria or schedule a new meeting session.</p>
          </div>
        ) : (
          filteredMeetings.map((mtg) => {
            const isDone = mtg.status === 'completed';
            const isRemaining = !isDone;

            return (
              <div
                key={mtg.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all shadow-xs flex flex-col justify-between gap-4 ${
                  isRemaining
                    ? 'bg-white border-[#E2E2DC] hover:border-amber-300 ring-1 ring-black/5'
                    : 'bg-[#FAFAF8] border-emerald-200/80 hover:border-emerald-300'
                }`}
              >
                {/* Meeting Card Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4F4F0]">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    {isRemaining ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                        Remaining (Upcoming)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        Done (Completed)
                      </span>
                    )}

                    {getTypeBadge(mtg.type)}

                    {mtg.priority === 'critical' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Critical Priority
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-[#888886]">• ID: {mtg.id}</span>
                  </div>

                  {/* Timing & Duration */}
                  <div className="flex items-center gap-3 text-xs text-[#666664]">
                    <div className="flex items-center gap-1 font-mono font-bold text-[#111111]">
                      <Calendar className="w-3.5 h-3.5 text-[#A16207]" />
                      <span>{mtg.dateTime}</span>
                    </div>
                    <span className="text-[#A1A19E]">({mtg.durationMinutes} mins)</span>
                  </div>
                </div>

                {/* Meeting Card Body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left Column: Title, Notes, Agenda (Col 8) */}
                  <div className="lg:col-span-8 space-y-3">
                    <h3 className="text-base font-extrabold text-[#111111] leading-snug">
                      {mtg.title}
                    </h3>
                    
                    {mtg.notes && (
                      <p className="text-xs text-[#666664] leading-relaxed">
                        {mtg.notes}
                      </p>
                    )}

                    {/* Agenda items preview */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block">
                        Deliberation Agenda ({mtg.agenda.length} items):
                      </span>
                      <div className="space-y-1">
                        {mtg.agenda.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#333332]">
                            <div className="mt-1 shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                              )}
                            </div>
                            <span className="leading-snug">{item}</span>
                          </div>
                        ))}
                        {mtg.agenda.length > 3 && (
                          <span className="text-[11px] text-[#888886] font-medium pl-3.5 block">
                            +{mtg.agenda.length - 3} more agenda clauses...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Linked Entities Pill */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {mtg.relatedVendor && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-semibold text-[#111111]">
                          <Building2 className="w-3.5 h-3.5 text-[#888886]" />
                          <span>{mtg.relatedVendor}</span>
                        </div>
                      )}

                      {mtg.relatedWorkflowId && (
                        <button
                          onClick={() => onSelectWorkflow(mtg.relatedWorkflowId!)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEFCE8] border border-[#FDE047] text-xs font-bold text-[#854D0E] hover:bg-[#FEF08A] transition-all"
                        >
                          <Zap className="w-3.5 h-3.5 text-[#CA8A04]" />
                          <span>Linked: {mtg.relatedWorkflowId}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Attendees & Done Outcomes (Col 4) */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-3 bg-[#FAFAF8] p-4 rounded-2xl border border-[#ECECE6]">
                    <div>
                      <span className="text-[10px] font-bold text-[#888886] uppercase tracking-wider block mb-2">
                        Attendees ({mtg.attendees.length})
                      </span>
                      <div className="space-y-1.5">
                        {mtg.attendees.map((att, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <div className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[9px] font-bold">
                                {att.name[0]}
                              </div>
                              <span className="font-semibold text-[#111111] truncate">{att.name}</span>
                            </div>
                            <span className="text-[10px] text-[#888886]">{att.role.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* If Done: Display Resolution Summary */}
                    {isDone && mtg.outcomes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            Quorum Resolution
                          </span>
                          {mtg.outcomes.approvedDisbursement && (
                            <span className="font-mono font-black text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded">
                              ${mtg.outcomes.approvedDisbursement.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-900 leading-tight">
                          {mtg.outcomes.resolutionSummary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Meeting Card Action Footer */}
                <div className="pt-3 border-t border-[#F4F4F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#888886]">
                    <span className="flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      Persistent in SQL DB
                    </span>
                    <span>•</span>
                    <a 
                      href={mtg.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      Google Meet Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Action Buttons based on Remaining vs Done */}
                  <div className="flex items-center gap-2">
                    {isRemaining ? (
                      <>
                        <button
                          onClick={() => onDeleteMeeting(mtg.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#888886] hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onUpdateMeetingStatus(mtg.id, 'completed', {
                            resolutionSummary: 'Quick completed manually by user.',
                            decision: 'approved',
                            executedAt: new Date().toISOString()
                          })}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E2DC] hover:bg-[#F4F4F0] text-[#111111] transition-all"
                        >
                          Quick Mark as Done
                        </button>

                        <button
                          onClick={() => setSimulatingMeeting(mtg)}
                          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-2 transition-all"
                        >
                          <Play className="w-3.5 h-3.5 text-[#FACC15] fill-current" />
                          <span>Run Live Simulation</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onUpdateMeetingStatus(mtg.id, 'scheduled')}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#888886] hover:text-[#111111] hover:bg-[#F4F4F0] flex items-center gap-1.5 transition-all"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Re-open to Remaining</span>
                        </button>

                        <button
                          onClick={() => setSimulatingMeeting(mtg)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#18181B] text-white hover:bg-black shadow-2xs flex items-center gap-2 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Inspect Minutes & Transcript</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule New Meeting Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-[#E2E2DC] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECECE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4 text-[#A16207]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#111111]">Schedule Deliberation Meeting</h3>
                  <p className="text-[11px] text-[#888886]">Attached directly to SQL database & workflow engine</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F4F0] text-[#111111] hover:bg-[#ECECE6] flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#111111] block mb-1">Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Sign-off: Vanguard Net Payment ($24,565)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:ring-2 focus:ring-[#111111] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111111] block mb-1">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MeetingType)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-bold focus:outline-none"
                  >
                    <option value="executive_review">Executive Review (AP-10K Gate)</option>
                    <option value="vendor_cure">Vendor SLA Delinquency Cure</option>
                    <option value="dispute_resolution">Dispute Resolution Session</option>
                    <option value="quarterly_audit">Quarterly Risk & Spend Audit</option>
                    <option value="post_mortem">PO Reconciliation Post-Mortem</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#111111] block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-bold focus:outline-none"
                  >
                    <option value="critical">Critical (Mandatory Sign-off)</option>
                    <option value="high">High Priority</option>
                    <option value="normal">Standard Routine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#111111] block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111111] block mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111111] block mb-1">Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:outline-none"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111111] block mb-1">Counterparty / Vendor</label>
                  <select
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:outline-none"
                  >
                    <option value="Vanguard Industrial Corp">Vanguard Industrial Corp</option>
                    <option value="Apex Logix Ltd">Apex Logix Ltd</option>
                    <option value="Nordic Cloud Systems">Nordic Cloud Systems</option>
                    <option value="Solaria Energy Group">Solaria Energy Group</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#111111] block mb-1">Linked Workflow</label>
                  <select
                    value={newWorkflowId}
                    onChange={(e) => setNewWorkflowId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs font-mono focus:outline-none"
                  >
                    <option value="wf-fin-001">wf-fin-001 (Vanguard Settlement)</option>
                    <option value="wf-proc-002">wf-proc-002 (Apex Logix Delinquency)</option>
                    <option value="wf-rec-003">wf-rec-003 (Nordic Cloud PO Match)</option>
                  </select>
                </div>
              </div>

              {/* Agenda Items Builder */}
              <div>
                <label className="font-bold text-[#111111] block mb-1">Agenda Items</label>
                <div className="space-y-1.5 mb-2">
                  {agendaList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs">
                      <span className="truncate pr-2">{idx + 1}. {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAgendaItem(idx)}
                        className="text-rose-500 hover:text-rose-700 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add agenda clause..."
                    value={newAgendaItem}
                    onChange={(e) => setNewAgendaItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAgendaItem();
                      }
                    }}
                    className="flex-1 p-2 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddAgendaItem}
                    className="px-3 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111111] block mb-1">Executive Notes & Constraints</label>
                <textarea
                  rows={2}
                  placeholder="Additional context governing quorum and bank cutoff..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-[#ECECE6] text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#F4F4F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#666664] hover:bg-[#F4F4F0]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={(e) => handleCreateSubmit(e, false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#111111] text-white hover:bg-black shadow-xs flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save to Database</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleCreateSubmit(e, true)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#FACC15] text-[#111111] hover:bg-[#EAB308] shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Save & Simulate Immediately</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Simulation Modal */}
      {simulatingMeeting && (
        <MeetingSimulationModal
          meeting={simulatingMeeting}
          isOpen={Boolean(simulatingMeeting)}
          onClose={() => setSimulatingMeeting(null)}
          onMeetingCompleted={(completedMtg) => {
            onUpdateMeetingStatus(completedMtg.id, 'completed', completedMtg.outcomes);
            setSimulatingMeeting(null);
          }}
        />
      )}
    </div>
  );
};
