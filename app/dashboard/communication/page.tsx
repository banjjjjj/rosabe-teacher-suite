'use client';

import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  Save,
  Printer,
  RotateCcw,
  Send,
  Heart,
  CheckCircle2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { ParentCommunication } from '@/types';
import { triggerPrint } from '@/lib/export-utils';
import { saveTeacherResource } from '@/lib/supabase';

const DEFAULT_COMMUNICATION: ParentCommunication = {
  recipient_role: 'Parent / Guardian',
  student_name: 'Mateo Hernandez',
  parent_guardian_name: 'Mr. and Mrs. Hernandez',
  subject_line: 'Celebrating Mateo\'s Growth in Science & Partnering on Organization',
  tone: 'warm',
  type: 'progress_update',
  body: `Dear Mr. and Mrs. Hernandez,

I hope you have had a wonderful week! I am writing to share a brief update regarding Mateo's recent journey in our classroom.

Mateo has shown tremendous curiosity and enthusiastic participation during our Grade 5 Science exploration this past month. He actively contributed during our hands-on ecosystem investigation, and his willingness to collaborate and encourage his group partners was truly commendable.

To build on this positive momentum and support Mateo's continued academic growth, we are working on strengthening his daily organization strategies. Specifically, taking a few extra minutes at the end of each period to write assignments in his agenda and organize his subject folder will ensure all of his wonderful work is turned in on time.

Thank you so much for your ongoing partnership, encouragement, and support at home. Please feel free to reply to this email anytime or let me know if there are questions you'd like to discuss!

Warm regards,
Teacher Albejean I. Rosabe
Grade 5 Educator`,
  created_at: new Date().toISOString(),
};

export default function CommunicationPage() {
  const [comm, setComm] = useState<ParentCommunication>(DEFAULT_COMMUNICATION);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form State
  const [studentName, setStudentName] = useState('Mateo Hernandez');
  const [parentName, setParentName] = useState('Mr. and Mrs. Hernandez');
  const [commType, setCommType] = useState<'progress_update' | 'needs_improvement' | 'attendance_behavior' | 'newsletter' | 'conference_invite'>('progress_update');
  const [tone, setTone] = useState<'warm' | 'soft' | 'direct' | 'celebratory'>('warm');
  const [notes, setNotes] = useState('Great curiosity in science projects; needs reminder to record homework in agenda and keep notebook organized.');

  const handleGenerate = async (selectedTone = tone) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'communication',
          params: {
            student_name: studentName,
            parent_guardian_name: parentName,
            type: commType,
            tone: selectedTone,
            notes,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setComm({
          recipient_role: 'Parent / Guardian',
          student_name: studentName,
          parent_guardian_name: parentName,
          subject_line: data.data.subject_line,
          tone: selectedTone,
          type: commType,
          body: data.data.body,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    const fullText = `Subject: ${comm.subject_line}\n\n${comm.body}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = async () => {
    setSaveStatus('saving');
    const res = await saveTeacherResource({
      teacher_name: 'Teacher Albejean I. Rosabe',
      resource_type: 'email',
      title: comm.subject_line,
      content: comm,
    });
    if (res.success) {
      setSaveStatus(res.source === 'supabase' ? 'Saved to Supabase!' : 'Saved to Local Archive!');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const wordCount = comm.body ? comm.body.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Mail className="w-5 h-5 text-amber-700" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Parent Communication Writer
            </h1>
            <p className="text-xs text-slate-500">
              Teacher Albejean I. Rosabe &bull; Compassionate, Action-Oriented Family Messaging
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerPrint}
            className="text-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Print Note
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </Button>

          {saveStatus && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Communication Settings</CardTitle>
              <CardDescription>Customize recipient, communication goal, and tone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Communication Type
                </label>
                <select
                  value={commType}
                  onChange={(e: any) => setCommType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                >
                  <option value="progress_update">Classroom Progress Update</option>
                  <option value="needs_improvement">Needs Improvement & Academic Partnership</option>
                  <option value="attendance_behavior">Attendance / Behavior Check-in</option>
                  <option value="newsletter">Weekly Classroom Newsletter Highlights</option>
                  <option value="conference_invite">Parent-Teacher Conference Invitation</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-amber-500"
                    placeholder="e.g. Mateo"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Parent/Guardian
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-amber-500"
                    placeholder="e.g. Hernandez Family"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Tone Palette
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setTone('warm')}
                    className={`p-2 rounded-lg border text-left transition-all ${tone === 'warm' ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Warm & Encouraging
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('soft')}
                    className={`p-2 rounded-lg border text-left transition-all ${tone === 'soft' ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Gentle / Soft
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('direct')}
                    className={`p-2 rounded-lg border text-left transition-all ${tone === 'direct' ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Direct & Actionable
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('celebratory')}
                    className={`p-2 rounded-lg border text-left transition-all ${tone === 'celebratory' ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Celebratory
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Specific Observations & Action Notes
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-amber-500"
                  placeholder="Mention specific examples, homework habits, or upcoming assignments..."
                />
              </div>

              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={isGenerating}
                onClick={() => handleGenerate(tone)}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'text-amber-200'}`} />
                {isGenerating ? 'Composing Message...' : 'Compose Parent Email'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Editable Output Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <Badge variant="rose">Live Editable Email Composer</Badge>
                <span className="text-xs text-slate-500 ml-2">Teacher Albejean I. Rosabe</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      Copy Email
                    </>
                  )}
                </Button>

                <Button
                  variant="soft"
                  size="sm"
                  disabled={isGenerating}
                  onClick={() => handleGenerate('soft')}
                  className="text-xs"
                >
                  <RotateCcw className="w-3 h-3 text-emerald-700" />
                  Soft Tone
                </Button>
              </div>
            </div>

            {/* Editable Subject Line */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Email Subject Line (Editable)
              </label>
              <input
                type="text"
                value={comm.subject_line}
                onChange={(e) => setComm({ ...comm, subject_line: e.target.value })}
                className="w-full text-sm font-bold text-slate-900 p-2.5 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-amber-50/20"
              />
            </div>

            {/* Editable Email Body */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Email Message Body (Editable-First)
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {wordCount} words
                </span>
              </div>
              <textarea
                rows={12}
                value={comm.body}
                onChange={(e) => setComm({ ...comm, body: e.target.value })}
                className="w-full text-xs sm:text-sm leading-relaxed p-4 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-slate-800 font-sans shadow-inner"
              />
            </div>

            {/* Footer Sign-off details */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Ready to paste into Gmail, Outlook, or School Portal</span>
              </div>
              <span className="font-semibold text-slate-700">Teacher Albejean I. Rosabe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
