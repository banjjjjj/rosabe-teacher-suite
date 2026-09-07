'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  Sparkles,
  Download,
  Printer,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import EditableText from '@/components/EditableText';
import { LessonPlan, TimelinePhase } from '@/types';
import { exportLessonPlanToWord, triggerPrint } from '@/lib/export-utils';
import { saveTeacherResource } from '@/lib/supabase';

const DEFAULT_LESSON_PLAN: LessonPlan = {
  title: 'Analyzing Character Motivations & Inferences',
  grade_level: 'Grade 5',
  subject: 'English Language Arts',
  duration: '45 Minutes',
  learning_objectives: [
    'Infer character traits and emotional motivation using textual evidence.',
    'Explain how character choices influence the plot during a collaborative read-aloud.',
    'Demonstrate comprehension by completing a Character Detective graphic organizer and exit ticket.'
  ],
  materials_needed: [
    'Mentor Text: "The Empty Pot" by Demi',
    'Student Character Detective charts & sticky notes',
    'Highlighters and Sentence Stem anchor cards',
    '3-2-1 Formative Exit Ticket slips'
  ],
  timeline: [
    {
      time_mins: '8',
      phase: 'Warm-up / Hook',
      activity: 'Mystery Quote Challenge: Display an anonymous dialogue quote. Students do a 1-minute Think-Pair-Share to infer the speaker\'s personality and motives.',
      teacher_action: 'Display visual quote on board; activate prior schema regarding character voice, record student hypotheses on chart paper.'
    },
    {
      time_mins: '15',
      phase: 'Direct Instruction',
      activity: 'Explicit Modeling (I Do / We Do): Read excerpt from mentor text. Model the "Quote + Reasoning = Inference" formula using a think-aloud strategy.',
      teacher_action: 'Annotate text digitally under document camera; pause to ask targeted scaffolding questions and check for understanding.'
    },
    {
      time_mins: '15',
      phase: 'Guided Practice',
      activity: 'Paired Character Investigation: In study pairs, students analyze an assigned scene and fill out their Character Detective graphic organizer with cited evidence.',
      teacher_action: 'Circulate around tables, facilitate guided conferences with struggling readers, offer differentiated prompt cards.'
    },
    {
      time_mins: '7',
      phase: 'Exit Ticket / Closure',
      activity: 'Independent Closure: Students complete a 2-question Exit Slip explaining how the protagonist\'s main choice impacted the story resolution.',
      teacher_action: 'Collect exit slips for immediate formative assessment; deliver whole-class affirmation on evidence citation.'
    }
  ],
  differentiation: {
    support_needed: 'Provide sentence starters ("I infer the character feels ____ because the text states ____") and highlighted mentor text passages with vocabulary glossaries.',
    advanced_learners: 'Challenge students to compare two characters with conflicting motivations and write an alternative dialogue exchange justifying their choices.'
  },
  assessment_closure: 'Formative assessment of paired graphic organizers and review of individual Exit Slip responses against Grade 5 ELA standards.'
};

export default function LessonPlansPage() {
  const [plan, setPlan] = useState<LessonPlan>(DEFAULT_LESSON_PLAN);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form Inputs
  const [formData, setFormData] = useState({
    subject: 'English Language Arts',
    topic: 'Fractions & Real-World Problem Solving',
    grade_level: 'Grade 5',
    duration: '45 Minutes',
    focus: 'Inquiry-based collaborative learning',
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'lesson_plan',
          params: formData,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setPlan(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateTimelineCell = (index: number, field: keyof TimelinePhase, value: string) => {
    const updated = [...plan.timeline];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setPlan({ ...plan, timeline: updated });
  };

  const handleAddTimelineRow = () => {
    const newRow: TimelinePhase = {
      time_mins: '5',
      phase: 'Additional Phase',
      activity: 'Describe student activity here...',
      teacher_action: 'Describe teacher action and facilitation here...',
    };
    setPlan({ ...plan, timeline: [...plan.timeline, newRow] });
  };

  const handleDeleteTimelineRow = (index: number) => {
    const updated = plan.timeline.filter((_, i) => i !== index);
    setPlan({ ...plan, timeline: updated });
  };

  const handleAddObjective = () => {
    setPlan({
      ...plan,
      learning_objectives: [...plan.learning_objectives, 'New learning objective...'],
    });
  };

  const handleUpdateObjective = (index: number, val: string) => {
    const updated = [...plan.learning_objectives];
    updated[index] = val;
    setPlan({ ...plan, learning_objectives: updated });
  };

  const handleDeleteObjective = (index: number) => {
    setPlan({
      ...plan,
      learning_objectives: plan.learning_objectives.filter((_, i) => i !== index),
    });
  };

  const handleAddMaterial = () => {
    setPlan({
      ...plan,
      materials_needed: [...plan.materials_needed, 'New learning material...'],
    });
  };

  const handleUpdateMaterial = (index: number, val: string) => {
    const updated = [...plan.materials_needed];
    updated[index] = val;
    setPlan({ ...plan, materials_needed: updated });
  };

  const handleDeleteMaterial = (index: number) => {
    setPlan({
      ...plan,
      materials_needed: plan.materials_needed.filter((_, i) => i !== index),
    });
  };

  const handleSaveToCloud = async () => {
    setSaveStatus('saving');
    const res = await saveTeacherResource({
      teacher_name: 'Teacher Albejean I. Rosabe',
      resource_type: 'lesson_plan',
      title: plan.title,
      content: plan,
    });
    if (res.success) {
      setSaveStatus(res.source === 'supabase' ? 'Saved to Supabase!' : 'Saved to Local Archive!');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
            <CalendarCheck className="w-5 h-5 text-blue-700" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              45-Minute Lesson Plan Builder
            </h1>
            <p className="text-xs text-slate-500">
              Interactive Timetable Grid &bull; Double-Click Any Cell to Edit &bull; Export to Word & PDF
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
            Print / PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportLessonPlanToWord(plan)}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export to Word (.doc)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveToCloud}
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

      {/* Generator Input Card */}
      <Card className="print:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Configure Lesson Parameters</CardTitle>
          <CardDescription>
            Teacher Albejean I. Rosabe will generate a 4-phase structured timetable ready for inline modification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Mathematics, ELA, Science"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Topic / Concept
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Adding Dissimilar Fractions"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Grade Level
              </label>
              <input
                type="text"
                value={formData.grade_level}
                onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Grade 5"
                required
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isGenerating}
                className="w-full"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'text-amber-300'}`} />
                {isGenerating ? 'Building Lesson...' : 'Generate 45-Min Plan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Interactive Editable Lesson Plan View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Header Section */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <Badge variant="purple" className="text-xs">
              Structured 45-Minute Lesson
            </Badge>
            <div className="text-xs text-slate-500">
              Instructor: <strong>Teacher Albejean I. Rosabe</strong>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Lesson Title (Click to Edit)
            </span>
            <EditableText
              value={plan.title}
              onChange={(val) => setPlan({ ...plan, title: val })}
              tag="h1"
              className="text-xl sm:text-2xl font-extrabold text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
            <div className="flex items-center gap-1.5">
              <strong className="text-slate-900">Subject:</strong>
              <EditableText
                value={plan.subject}
                onChange={(val) => setPlan({ ...plan, subject: val })}
                tag="span"
                className="font-medium"
              />
            </div>
            <span className="text-slate-300">&bull;</span>
            <div className="flex items-center gap-1.5">
              <strong className="text-slate-900">Grade Level:</strong>
              <EditableText
                value={plan.grade_level}
                onChange={(val) => setPlan({ ...plan, grade_level: val })}
                tag="span"
                className="font-medium"
              />
            </div>
            <span className="text-slate-300">&bull;</span>
            <div className="flex items-center gap-1.5">
              <strong className="text-slate-900">Duration:</strong>
              <EditableText
                value={plan.duration || '45 Minutes'}
                onChange={(val) => setPlan({ ...plan, duration: val })}
                tag="span"
                className="font-medium"
              />
            </div>
          </div>
        </div>

        {/* 1. Learning Objectives */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              1. Learning Objectives (Bloom&apos;s Aligned)
            </h3>
            <button
              onClick={handleAddObjective}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 print:hidden"
            >
              <Plus className="w-3.5 h-3.5" /> Add Objective
            </button>
          </div>

          <div className="space-y-2">
            {plan.learning_objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2 group/obj">
                <span className="text-xs font-bold text-emerald-700 mt-1">&bull;</span>
                <div className="flex-1">
                  <EditableText
                    value={obj}
                    onChange={(val) => handleUpdateObjective(i, val)}
                    multiline
                    className="text-xs text-slate-800"
                  />
                </div>
                {plan.learning_objectives.length > 1 && (
                  <button
                    onClick={() => handleDeleteObjective(i)}
                    className="opacity-0 group-hover/obj:opacity-100 text-slate-400 hover:text-rose-600 p-1 print:hidden transition-opacity"
                    title="Delete objective"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Materials Needed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              2. Materials & Educational Resources
            </h3>
            <button
              onClick={handleAddMaterial}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 print:hidden"
            >
              <Plus className="w-3.5 h-3.5" /> Add Material
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plan.materials_needed.map((mat, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 group/mat">
                <div className="flex-1">
                  <EditableText
                    value={mat}
                    onChange={(val) => handleUpdateMaterial(i, val)}
                    className="text-xs text-slate-800 font-medium"
                  />
                </div>
                {plan.materials_needed.length > 1 && (
                  <button
                    onClick={() => handleDeleteMaterial(i)}
                    className="opacity-0 group-hover/mat:opacity-100 text-slate-400 hover:text-rose-600 p-1 print:hidden transition-opacity"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Interactive Timetable Grid */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-indigo-600" />
                3. Interactive 45-Min Timetable Grid
              </h3>
              <p className="text-[11px] text-slate-500">
                Double-click or click any cell below to edit time, phase, student activity, or teacher action.
              </p>
            </div>

            <button
              onClick={handleAddTimelineRow}
              className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 print:hidden"
            >
              <Plus className="w-3.5 h-3.5" /> Add Phase Row
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3 w-16 sm:w-20">Time</th>
                  <th className="p-3 w-32 sm:w-44">Phase</th>
                  <th className="p-3">Student Activity</th>
                  <th className="p-3">Teacher Facilitation / Action</th>
                  <th className="p-3 w-10 print:hidden text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {plan.timeline.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors group/row">
                    {/* Time Column */}
                    <td className="p-3 align-top font-bold text-indigo-900 whitespace-nowrap bg-indigo-50/30">
                      <EditableText
                        value={row.time_mins}
                        onChange={(val) => handleUpdateTimelineCell(idx, 'time_mins', val)}
                        className="text-xs font-mono font-bold"
                        badgeLabel="min"
                      />
                    </td>

                    {/* Phase Column */}
                    <td className="p-3 align-top font-semibold text-slate-900">
                      <EditableText
                        value={row.phase}
                        onChange={(val) => handleUpdateTimelineCell(idx, 'phase', val)}
                        className="text-xs font-bold"
                      />
                    </td>

                    {/* Student Activity */}
                    <td className="p-3 align-top text-slate-800">
                      <EditableText
                        value={row.activity}
                        onChange={(val) => handleUpdateTimelineCell(idx, 'activity', val)}
                        multiline
                        className="text-xs leading-relaxed"
                      />
                    </td>

                    {/* Teacher Action */}
                    <td className="p-3 align-top text-slate-700 bg-slate-50/40">
                      <EditableText
                        value={row.teacher_action}
                        onChange={(val) => handleUpdateTimelineCell(idx, 'teacher_action', val)}
                        multiline
                        className="text-xs leading-relaxed"
                      />
                    </td>

                    {/* Delete row */}
                    <td className="p-3 align-top print:hidden text-center">
                      {plan.timeline.length > 1 && (
                        <button
                          onClick={() => handleDeleteTimelineRow(idx)}
                          className="opacity-0 group-hover/row:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Differentiation Strategies */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            4. Differentiation Strategies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Support Needed (Scaffolding & Accommodations)
              </span>
              <EditableText
                value={plan.differentiation.support_needed}
                onChange={(val) => setPlan({
                  ...plan,
                  differentiation: { ...plan.differentiation, support_needed: val }
                })}
                multiline
                className="text-xs text-slate-800 leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-1.5">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                Advanced Learners (Extensions & Enrichment)
              </span>
              <EditableText
                value={plan.differentiation.advanced_learners}
                onChange={(val) => setPlan({
                  ...plan,
                  differentiation: { ...plan.differentiation, advanced_learners: val }
                })}
                multiline
                className="text-xs text-slate-800 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 5. Assessment & Closure */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            5. Formative Assessment & Closure Method
          </span>
          <EditableText
            value={plan.assessment_closure || 'Formative assessment through active monitoring, student responses, and Exit Ticket check.'}
            onChange={(val) => setPlan({ ...plan, assessment_closure: val })}
            multiline
            className="text-xs text-slate-800 leading-relaxed"
          />
        </div>

        {/* Signature Box for Teacher Albejean */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Prepared by: <strong>Teacher Albejean I. Rosabe</strong> &bull; Rosabe AI Suite
          </div>
          <div>
            Status: <span className="text-emerald-700 font-semibold">Ready for Classroom Execution</span>
          </div>
        </div>
      </div>
    </div>
  );
}
