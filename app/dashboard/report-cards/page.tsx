'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Download,
  Sparkles,
  CheckCircle2,
  Users,
  Layers,
  ArrowDownToLine,
  RefreshCw,
  Info
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import ReportCardRow from '@/components/ReportCardRow';
import { ReportCardComment } from '@/types';
import { exportCommentsToCSV } from '@/lib/export-utils';

const INITIAL_DEMO_STUDENTS: ReportCardComment[] = [
  {
    id: 'student-1',
    student_id: 's-1',
    student_name: 'Liam Vance',
    pronouns: 'He/Him',
    grade_subject: 'Grade 5 English Language Arts',
    strengths_summary: '• Outstanding vocabulary and expressive creative writing\n• Always raises hand to share thoughtful story interpretations\n• Cooperates well in group literary discussions',
    needs_improvement_summary: '• Frequently rushes through written homework without reviewing\n• Struggles with punctuation consistency\n• Can get distracted during independent seatwork transitions',
    generated_comment: 'Liam has demonstrated remarkable enthusiasm and creative talent in Grade 5 English Language Arts this grading period. He consistently displays an outstanding vocabulary, shares thoughtful story interpretations during class discussions, and works cooperatively in group literature circles.\n\nTo support Liam’s continued academic growth, our primary focus will be on slowing down to review written work thoroughly prior to submission. Practicing self-editing checklists will help improve his punctuation consistency and maintain focus during independent transitions.\n\nIt is truly a delight having Liam in our class. With consistent encouragement at home and structured guidance at school, I am confident he will continue to thrive and reach his highest potential.',
    edited_comment: 'Liam has demonstrated remarkable enthusiasm and creative talent in Grade 5 English Language Arts this grading period. He consistently displays an outstanding vocabulary, shares thoughtful story interpretations during class discussions, and works cooperatively in group literature circles.\n\nTo support Liam’s continued academic growth, our primary focus will be on slowing down to review written work thoroughly prior to submission. Practicing self-editing checklists will help improve his punctuation consistency and maintain focus during independent transitions.\n\nIt is truly a delight having Liam in our class. With consistent encouragement at home and structured guidance at school, I am confident he will continue to thrive and reach his highest potential.',
    word_count: 125,
    is_reviewed: false,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'student-2',
    student_id: 's-2',
    student_name: 'Sophia Chen',
    pronouns: 'She/Her',
    grade_subject: 'Grade 5 Mathematics',
    strengths_summary: '• High precision in mental math calculations\n• Shows perseverance when tackling complex multi-step fractions\n• Generously assists peers when they need extra explanation',
    needs_improvement_summary: '• Hesitant to show step-by-step written work in math notebooks\n• Occasionally feels anxious when timed math drills are announced',
    generated_comment: 'Sophia has had an exceptional term in Grade 5 Mathematics, demonstrating high precision in mental math calculations and admirable perseverance when tackling multi-step fractions. She is also a compassionate peer who generously assists classmates during problem-solving activities.\n\nMoving forward, our goal is to build Sophia’s confidence in documenting all written calculation steps in her math journal, which will solidify her reasoning and reduce anxiety during timed check-ins.\n\nI am incredibly proud of Sophia’s dedication and look forward to watching her mathematical problem-solving skills flourish even further.',
    edited_comment: 'Sophia has had an exceptional term in Grade 5 Mathematics, demonstrating high precision in mental math calculations and admirable perseverance when tackling multi-step fractions. She is also a compassionate peer who generously assists classmates during problem-solving activities.\n\nMoving forward, our goal is to build Sophia’s confidence in documenting all written calculation steps in her math journal, which will solidify her reasoning and reduce anxiety during timed check-ins.\n\nI am incredibly proud of Sophia’s dedication and look forward to watching her mathematical problem-solving skills flourish even further.',
    word_count: 118,
    is_reviewed: true,
    updated_at: new Date().toISOString(),
  }
];

export default function ReportCardsPage() {
  const [comments, setComments] = useState<ReportCardComment[]>([]);
  const [filterReviewed, setFilterReviewed] = useState<'all' | 'reviewed' | 'pending'>('all');
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rosabe_comments_v1');
      if (saved) {
        try {
          setComments(JSON.parse(saved));
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }
    setComments(INITIAL_DEMO_STUDENTS);
  }, []);

  const saveToStorage = (newList: ReportCardComment[]) => {
    setComments(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rosabe_comments_v1', JSON.stringify(newList));
    }
  };

  const handleUpdateStudent = (updated: ReportCardComment) => {
    const updatedList = comments.map(c => c.id === updated.id ? updated : c);
    saveToStorage(updatedList);
  };

  const handleDeleteStudent = (id: string) => {
    const updatedList = comments.filter(c => c.id !== id);
    saveToStorage(updatedList);
  };

  const handleAddNewStudent = () => {
    const newId = 'student-' + Date.now();
    const newEntry: ReportCardComment = {
      id: newId,
      student_id: newId,
      student_name: 'New Student',
      pronouns: 'They/Them',
      grade_subject: 'Grade 5',
      strengths_summary: '• Enthusiastic learner\n• Helpful classroom partner',
      needs_improvement_summary: '• Practice following multi-step directions\n• Review work before submitting',
      generated_comment: '',
      edited_comment: '',
      word_count: 0,
      is_reviewed: false,
      updated_at: new Date().toISOString(),
    };
    saveToStorage([newEntry, ...comments]);
  };

  const handleBulkGenerate = async () => {
    setIsBulkGenerating(true);
    const updated = [...comments];
    for (let i = 0; i < updated.length; i++) {
      const c = updated[i];
      if (!c.generated_comment || c.generated_comment.trim() === '') {
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              module: 'report_card',
              params: {
                student_name: c.student_name,
                pronouns: c.pronouns,
                grade_subject: c.grade_subject,
                strengths_bullets: c.strengths_summary.split('\n').filter(Boolean),
                needs_improvement_bullets: c.needs_improvement_summary.split('\n').filter(Boolean),
                tone: 'standard',
              },
            }),
          });
          const data = await res.json();
          if (data.success && data.data) {
            updated[i] = {
              ...c,
              generated_comment: data.data.full_combined_comment,
              edited_comment: data.data.full_combined_comment,
              word_count: data.data.word_count || data.data.full_combined_comment.split(/\s+/).length,
            };
          }
        } catch (e) {
          console.error('Bulk item error:', e);
        }
      }
    }
    saveToStorage(updated);
    setIsBulkGenerating(false);
  };

  const filteredComments = comments.filter(c => {
    if (filterReviewed === 'reviewed') return c.is_reviewed;
    if (filterReviewed === 'pending') return !c.is_reviewed;
    return true;
  });

  const reviewedCount = comments.filter(c => c.is_reviewed).length;
  const totalWords = comments.reduce((acc, curr) => acc + (curr.word_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <FileText className="w-5 h-5 text-emerald-700" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Report Card Comments (Batch Mode)
              </h1>
              <p className="text-xs text-slate-500">
                Teacher Albejean I. Rosabe &bull; Balanced Strengths + &quot;Needs Improvement&quot; Framework
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCommentsToCSV(comments)}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export All as CSV
          </Button>

          <Button
            variant="soft"
            size="sm"
            disabled={isBulkGenerating}
            onClick={handleBulkGenerate}
            className="text-xs"
          >
            <Sparkles className={`w-3.5 h-3.5 text-emerald-700 ${isBulkGenerating ? 'animate-spin' : ''}`} />
            {isBulkGenerating ? 'Synthesizing All...' : 'Batch Generate Pending'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddNewStudent}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Student Row
          </Button>
        </div>
      </div>

      {/* Roster Metrics & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Total Students: <strong>{comments.length}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Reviewed: <strong>{reviewedCount}/{comments.length}</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-mono">
            <span>{totalWords} total words</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setFilterReviewed('all')}
            className={`px-3 py-1 rounded-md transition-colors ${filterReviewed === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'}`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setFilterReviewed('pending')}
            className={`px-3 py-1 rounded-md transition-colors ${filterReviewed === 'pending' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'}`}
          >
            Pending ({comments.length - reviewedCount})
          </button>
          <button
            onClick={() => setFilterReviewed('reviewed')}
            className={`px-3 py-1 rounded-md transition-colors ${filterReviewed === 'reviewed' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'}`}
          >
            Reviewed ({reviewedCount})
          </button>
        </div>
      </div>

      {/* Instructions Note */}
      <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Teacher Albejean&apos;s 3-Paragraph Growth Framework:</strong> Paragraph 1 celebrates strengths and classroom contributions &bull; Paragraph 2 provides constructive action steps for areas needing improvement &bull; Paragraph 3 offers a warm, encouraging closing statement. <strong>Every output field is editable live</strong>.
        </p>
      </div>

      {/* Student Rows List */}
      <div className="space-y-6">
        {filteredComments.length > 0 ? (
          filteredComments.map((studentComment) => (
            <ReportCardRow
              key={studentComment.id}
              commentData={studentComment}
              onUpdate={handleUpdateStudent}
              onDelete={handleDeleteStudent}
              showDelete={comments.length > 1}
            />
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">No students match current filter</h3>
            <p className="text-xs text-slate-400 mt-1">Try switching to &quot;All&quot; or add a new student row.</p>
          </div>
        )}
      </div>
    </div>
  );
}
