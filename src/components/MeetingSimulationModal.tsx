/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Play, 
  Pause, 
  FastForward, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  FileText, 
  Volume2, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  AlertTriangle,
  ArrowRight,
  Database,
  Building2,
  DollarSign,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScheduledMeeting, MeetingSimulationStep, MeetingActionItem } from '../types/workflow';

interface MeetingSimulationModalProps {
  meeting: ScheduledMeeting | null;
  isOpen: boolean;
  onClose: () => void;
  onMeetingCompleted: (completedMeeting: ScheduledMeeting) => void;
}

export const MeetingSimulationModal: React.FC<MeetingSimulationModalProps> = ({
  meeting,
  isOpen,
  onClose,
  onMeetingCompleted
}) => {
  if (!isOpen || !meeting) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [isFinalized, setIsFinalized] = useState(meeting.status === 'completed');
  const [completedAgendaIndices, setCompletedAgendaIndices] = useState<number[]>([]);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);

  // Generate dynamic contextual simulation steps based on the meeting attributes
  const steps: MeetingSimulationStep[] = React.useMemo(() => {
    const isVanguard = meeting.relatedWorkflowId === 'wf-fin-001' || meeting.title.includes('Vanguard') || meeting.title.includes('24,565');
    const isApex = meeting.relatedWorkflowId === 'wf-proc-002' || meeting.title.includes('Apex') || meeting.title.includes('Cure');
    const orgName = meeting.organizer.split('@')[0].replace('.', ' ');

    if (isVanguard) {
      return [
        {
          stepNumber: 1,
          speaker: 'Sarah Lin (CFO)',
          avatarRole: 'Financial Oversight Chair',
          action: 'Quorum Confirmation & Policy AP-10K Gate Call',
          dialogue: `Good morning. We are convening this emergency executive session for Invoice INV-9044 ($28,900 billed). Because the settlement amount exceeds our $10,000 threshold, formal committee sign-off is required under Rule AP-10K.`,
          timestamp: '00:00:20',
          status: 'completed'
        },
        {
          stepNumber: 2,
          speaker: 'Elena Rostova',
          avatarRole: 'Vanguard Industrial Accounts Head',
          action: 'Contract Term & Discount Verification',
          dialogue: `Thank you Sarah, John. On behalf of Vanguard Industrial, we reviewed CTR-2025-V2 Section 4.2. Takasho's cumulative Q3 volume achieved $54,200, unlocking the 15% discount ($4,335). Our revised statement is $24,565.00.`,
          timestamp: '00:06:15',
          status: 'completed'
        },
        {
          stepNumber: 3,
          speaker: 'John Doe',
          avatarRole: 'Director of Finance & Operations',
          action: 'ERP Database & Bank Cutoff Cross-Check',
          dialogue: `I've cross-referenced our SQL general ledger table and purchase order PO-8812. The three-way match reconciles cleanly at $24,565. With the Friday 14:00 PM bank cutoff looming, I move to approve the disbursement immediately.`,
          timestamp: '00:14:40',
          status: 'completed'
        },
        {
          stepNumber: 4,
          speaker: 'Sarah Lin (CFO)',
          avatarRole: 'Sign-off Authority',
          action: 'Executive Roll-Call & Ratification',
          dialogue: `Motion seconded. With unanimous committee consensus, I authorize the $24,565.00 wire instruction. Let's record the journal entry POST-002 and transmit ACH dispatch.`,
          timestamp: '00:21:05',
          status: 'completed'
        },
        {
          stepNumber: 5,
          speaker: 'Flow.io Autonomous Secretary',
          avatarRole: 'AI Compliance Scribe',
          action: 'Database Synchronization & Action Item Logging',
          dialogue: `Consensus ratified. Meeting recorded in corporate database. Status transitioned from Remaining to Done. General Ledger updated.`,
          timestamp: '00:26:30',
          status: 'completed'
        }
      ];
    } else if (isApex) {
      return [
        {
          stepNumber: 1,
          speaker: 'Marcus Vance',
          avatarRole: 'Apex Logix Credit Director',
          action: 'SLA Clause 7 Delinquency Review',
          dialogue: `Opening discussion on Invoice INV-9021 ($14,500). The balance has reached 42 days overdue. Under SLA Clause 7, we initiated the 7-day cure window before mandatory freight referral.`,
          timestamp: '00:00:30',
          status: 'completed'
        },
        {
          stepNumber: 2,
          speaker: 'Rachel Hayes',
          avatarRole: 'Corporate Legal Counsel',
          action: 'Standstill Protocol & Installment Proposal',
          dialogue: `We acknowledge the notice under Clause 7. Takasho is tendering an immediate first wire tranche of 50% ($7,250.00) today, followed by the remaining balance next Wednesday under formal standstill terms.`,
          timestamp: '00:07:50',
          status: 'completed'
        },
        {
          stepNumber: 3,
          speaker: 'John Doe',
          avatarRole: 'Operations Director',
          action: 'Commitment Execution & Wire Release',
          dialogue: `Treasury has staged wire batch tranche A. Marcus, if you confirm standstill on logistics suspension, we will execute the release instantly.`,
          timestamp: '00:15:10',
          status: 'completed'
        },
        {
          stepNumber: 4,
          speaker: 'Marcus Vance',
          avatarRole: 'Apex Logix Credit Director',
          action: 'Remediation Agreement Accepted',
          dialogue: `Terms accepted. The 7-day cure is satisfied upon receipt of Tranche A. Service suspension hold has been lifted on our dispatch portal.`,
          timestamp: '00:22:45',
          status: 'completed'
        },
        {
          stepNumber: 5,
          speaker: 'Flow.io Autonomous Secretary',
          avatarRole: 'System Protocol',
          action: 'Database Action Items Generated',
          dialogue: `Standstill ratified. Tranche A logged in database ledger. Meeting archived as Done.`,
          timestamp: '00:28:10',
          status: 'completed'
        }
      ];
    } else {
      return [
        {
          stepNumber: 1,
          speaker: orgName,
          avatarRole: 'Session Host',
          action: 'Meeting Convocations & Agenda Roll-call',
          dialogue: `Welcome everyone to our scheduled deliberation regarding: "${meeting.title}". All attendees are confirmed present.`,
          timestamp: '00:00:15',
          status: 'completed'
        },
        {
          stepNumber: 2,
          speaker: meeting.attendees[0]?.name || 'John Doe',
          avatarRole: 'Operations Reviewer',
          action: 'Database & Supporting Record Presentation',
          dialogue: `We have pulled the corresponding records from our SQL database. The operational metrics and contracts support our current agenda trajectory.`,
          timestamp: '00:08:20',
          status: 'completed'
        },
        {
          stepNumber: 3,
          speaker: meeting.attendees[1]?.name || 'Sarah Lin (CFO)',
          avatarRole: 'Reviewer',
          action: 'Deliberation & Key Term Ratification',
          dialogue: `I have audited the financial and risk impacts. The resolution aligns with corporate policy and quarterly budget limits.`,
          timestamp: '00:17:45',
          status: 'completed'
        },
        {
          stepNumber: 4,
          speaker: 'Flow.io Autonomous Secretary',
          avatarRole: 'System Protocol',
          action: 'Unanimous Closure & Database State Shift',
          dialogue: `Unanimous agreement reached. All action items assigned and meeting transitioned to Completed / Done status.`,
          timestamp: '00:25:00',
          status: 'completed'
        }
      ];
    }
  }, [meeting]);

  // Handle simulation progression
  useEffect(() => {
    if (!isPlaying || isFinalized) return;

    const intervalTime = (3200 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          const nextIndex = prev + 1;
          // Progress agenda items as well
          const totalAgenda = meeting.agenda.length;
          const targetAgendaIdx = Math.floor((nextIndex / steps.length) * totalAgenda);
          setCompletedAgendaIndices((old) => Array.from(new Set([...old, targetAgendaIdx])));
          return nextIndex;
        } else {
          // Simulation complete
          setIsPlaying(false);
          handleFinalizeMeeting();
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, isFinalized, steps.length]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStepIndex]);

  const handleFinalizeMeeting = async () => {
    setIsFinalized(true);
    setIsPlaying(false);
    setCurrentStepIndex(steps.length - 1);
    setCompletedAgendaIndices(meeting.agenda.map((_, i) => i));

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const outcomes = {
      resolutionSummary: `Consensus achieved: All ${meeting.agenda.length} agenda items resolved with 100% quorum sign-off.`,
      decision: 'approved' as const,
      approvedDisbursement: meeting.relatedWorkflowId === 'wf-fin-001' || meeting.title.includes('24,565') ? 24565 : undefined,
      executedAt: now,
      actionItems: meeting.agenda.map((item, idx) => ({
        id: `act-${meeting.id}-${idx + 1}`,
        task: item,
        assignee: meeting.attendees[idx % meeting.attendees.length]?.name || 'Operations Lead',
        due: meeting.dateString,
        completed: true
      }))
    };

    const updatedMeeting: ScheduledMeeting = {
      ...meeting,
      status: 'completed',
      simulationTranscript: steps,
      outcomes,
      databaseSynced: true
    };

    // Trigger backend simulation endpoint to sync database
    try {
      await fetch(`/api/meetings/${meeting.id}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.warn('Backend sync failed, state kept in local database service:', err);
    }

    onMeetingCompleted(updatedMeeting);
  };

  const handleInstantFinish = () => {
    handleFinalizeMeeting();
  };

  const activeSpeaker = steps[currentStepIndex]?.speaker || '';

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in">
      <div className="bg-[#18181B] text-white rounded-3xl max-w-5xl w-full border border-[#27272A] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Video Conference Bar */}
        <div className="bg-[#121214] px-6 py-3.5 border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-extrabold text-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  {isFinalized ? 'Session Concluded • Minutes Ratified' : 'Live Simulation Session in Progress'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">• Room: FLW-SECURE-{meeting.id.toUpperCase()}</span>
              </div>
              <h3 className="text-sm font-extrabold text-white truncate max-w-lg mt-0.5">
                {meeting.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 font-mono text-zinc-300">
              {steps[currentStepIndex]?.timestamp || '00:00:00'}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center text-xs font-bold transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Meeting Main Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Left Column: Simulated Video / Audio Tiles & Quorum (Col 7) */}
          <div className="lg:col-span-7 p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#27272A] overflow-y-auto space-y-4">
            
            {/* Participants Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {meeting.attendees.map((att, idx) => {
                const isSpeaking = activeSpeaker.toLowerCase().includes(att.name.toLowerCase().split(' ')[0]) ||
                  (activeSpeaker.includes('Sarah') && att.name.includes('Sarah')) ||
                  (activeSpeaker.includes('John') && att.name.includes('John')) ||
                  (activeSpeaker.includes('Elena') && att.name.includes('Elena')) ||
                  (activeSpeaker.includes('Marcus') && att.name.includes('Marcus'));

                return (
                  <div 
                    key={idx}
                    className={`relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between aspect-video sm:aspect-4/3 ${
                      isSpeaking 
                        ? 'bg-zinc-800/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg' 
                        : 'bg-zinc-900/80 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800">
                        {att.role.split(' ')[0]}
                      </span>
                      <div className="flex items-center gap-1">
                        {isSpeaking ? (
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Speaking
                          </div>
                        ) : (
                          <Mic className="w-3 h-3 text-zinc-500" />
                        )}
                      </div>
                    </div>

                    {/* Centered Avatar Icon */}
                    <div className="flex flex-col items-center justify-center my-auto">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                        idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-emerald-600' : 'bg-purple-600'
                      } ${isSpeaking ? 'scale-110 ring-4 ring-amber-400/50 transition-all' : ''}`}>
                        {att.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{att.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{att.role}</p>
                    </div>
                  </div>
                );
              })}

              {/* AI Secretary Tile */}
              <div className={`relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between aspect-video sm:aspect-4/3 ${
                activeSpeaker.includes('Secretary') 
                  ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg' 
                  : 'bg-zinc-900/80 border-zinc-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-300 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800">
                    ERP Scribe
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center font-black">
                    AI
                  </div>
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-amber-200">Flow.io Scribe</p>
                  <p className="text-[10px] text-zinc-400">Database Observer</p>
                </div>
              </div>
            </div>

            {/* Current Active Speaker Bubble */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  Active Audio Feed
                </span>
                <span className="font-extrabold text-amber-400">
                  {steps[currentStepIndex]?.speaker} ({steps[currentStepIndex]?.avatarRole})
                </span>
              </div>
              <p className="text-sm text-zinc-200 italic leading-relaxed">
                "{steps[currentStepIndex]?.dialogue}"
              </p>
            </div>

            {/* Simulation Controls Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isFinalized}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isPlaying 
                      ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' 
                      : 'bg-amber-400 text-black hover:bg-amber-300'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Resume'}</span>
                </button>

                {/* Speed Controls */}
                <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-800 text-xs">
                  {([1, 2, 4] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`px-2 py-1 rounded-lg font-bold font-mono transition-all ${
                        playbackSpeed === s ? 'bg-zinc-700 text-amber-400' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isFinalized && (
                  <button
                    onClick={handleInstantFinish}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-all"
                  >
                    <FastForward className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Finish & Ratify</span>
                  </button>
                )}

                {isFinalized && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Meeting Successfully Ratified!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Transcript & Agenda Checklist (Col 5) */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between bg-zinc-900/50 space-y-4 overflow-y-auto">
            
            {/* Agenda Progress Tracker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300 pb-1 border-b border-zinc-800">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Agenda Deliberation Tracker
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {completedAgendaIndices.length}/{meeting.agenda.length} Resolved
                </span>
              </div>

              <div className="space-y-1.5">
                {meeting.agenda.map((item, idx) => {
                  const isDone = completedAgendaIndices.includes(idx) || isFinalized;
                  return (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-zinc-600"></div>
                        )}
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Synchronized Transcript Feed */}
            <div className="flex-1 space-y-2 min-h-[180px] overflow-y-auto pr-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
                Official Meeting Minutes Transcript
              </span>

              {steps.slice(0, currentStepIndex + 1).map((step, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                    idx === currentStepIndex 
                      ? 'bg-zinc-800/90 border-amber-500/50 shadow-sm' 
                      : 'bg-zinc-900/60 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300">{step.speaker}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{step.timestamp}</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">{step.dialogue}</p>
                </div>
              ))}
              <div ref={transcriptBottomRef} />
            </div>

            {/* Resolution Box if Finalized */}
            {isFinalized && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>State Updated in Relational Database: DONE</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  All action items recorded. Meeting shifted from <strong>Remaining</strong> to <strong>Done</strong>.
                </p>
                <button
                  onClick={onClose}
                  className="w-full mt-1 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Close Session & Return to Meetings Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
