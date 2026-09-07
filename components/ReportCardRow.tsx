'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Save,
  RotateCcw,
  CheckCircle,
  Clock,
  Trash2,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { ReportCardComment } from '@/types';
import { saveReportCardComment } from '@/lib/supabase';

interface ReportCardRowProps {
  commentData: ReportCardComment;
  onUpdate: (updated: ReportCardComment) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export default function ReportCardRow({
  commentData,
  onUpdate,
  onDelete,
  showDelete = false,
}: ReportCardRowProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Active editable comment
  const activeText = commentData.edited_comment ?? commentData.generated_comment;
  const wordCount = activeText ? activeText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeText ? activeText.length : 0;

  const handleGenerate = async (tone = 'standard') => {
    setLoading(true);
    try {
      const strengthsArr = commentData.strengths_summary
        .split('\n')
        .map(s => s.trim().replace(/^[-*•]\s*/, ''))
        .filter(Boolean);

      const needsArr = commentData.needs_improvement_summary
        .split('\n')
        .map(s => s.trim().replace(/^[-*•]\s*/, ''))
        .filter(Boolean);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'report_card',
          params: {
            student_name: commentData.student_name || 'Student',
            pronouns: commentData.pronouns || 'They/Them',
            grade_subject: commentData.grade_subject || 'Grade 5',
            strengths_bullets: strengthsArr,
            needs_improvement_bullets: needsArr,
            tone,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const gen = data.data;
        const updated: ReportCardComment = {
          ...commentData,
          strengths_bullets: strengthsArr,
          needs_improvement_bullets: needsArr,
          strengths_paragraph: gen.strengths_paragraph,
          needs_improvement_paragraph: gen.needs_improvement_paragraph,
          closing_paragraph: gen.closing_paragraph,
          generated_comment: gen.full_combined_comment,
          edited_comment: gen.full_combined_comment,
          word_count: gen.word_count || gen.full_combined_comment.split(/\s+/).length,
          updated_at: new Date().toISOString(),
        };
        onUpdate(updated);
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (newText: string) => {
    const updated: ReportCardComment = {
      ...commentData,
      edited_comment: newText,
      word_count: newText.trim().split(/\s+/).filter(Boolean).length,
      updated_at: new Date().toISOString(),
    };
    onUpdate(updated);
  };

  const handleCopy = async () => {
    if (!activeText) return;
    await navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = async () => {
    setSavedStatus('saving');
    const res = await saveReportCardComment(commentData);
    if (res.success) {
      setSavedStatus(`saved-${res.source}`);
      setTimeout(() => setSavedStatus(null), 3000);
    } else {
      setSavedStatus('error');
    }
  };

  const handleToggleReviewed = () => {
    onUpdate({
      ...commentData,
      is_reviewed: !commentData.is_reviewed,
    });
  };

  // Extract clean bullet lists for badge display
  const strengthsBadges = commentData.strengths_summary
    ? commentData.strengths_summary.split('\n').map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
    : [];

  const needsBadges = commentData.needs_improvement_summary
    ? commentData.needs_improvement_summary.split('\n').map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
    : [];

  return (
    <Card className={`transition-all border-2 ${commentData.is_reviewed ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'}`}>
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Row Header: Student Meta & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {(commentData.student_name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentData.student_name || ''}
                  onChange={(e) => onUpdate({ ...commentData, student_name: e.target.value })}
                  placeholder="Student Name"
                  className="font-bold text-slate-900 text-base border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none px-1 py-0.5"
                />
                <select
                  value={commentData.pronouns || 'They/Them'}
                  onChange={(e) => onUpdate({ ...commentData, pronouns: e.target.value })}
                  className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md border-0 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="They/Them">They/Them</option>
                  <option value="She/Her">She/Her</option>
                  <option value="He/Him">He/Him</option>
                </select>
              </div>
              <input
                type="text"
                value={commentData.grade_subject || ''}
                onChange={(e) => onUpdate({ ...commentData, grade_subject: e.target.value })}
                placeholder="Grade & Subject (e.g. Grade 5 English Language Arts)"
                className="text-xs text-slate-500 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none px-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleReviewed}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                commentData.is_reviewed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${commentData.is_reviewed ? 'text-emerald-600' : 'text-slate-400'}`} />
              {commentData.is_reviewed ? 'Reviewed & Final' : 'Mark as Reviewed'}
            </button>

            {showDelete && onDelete && (
              <button
                onClick={() => onDelete(commentData.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove Student"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dual-Column Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column A: Strengths */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                Column A: Student Strengths & Positives
              </span>
              <span className="text-[11px] font-normal text-slate-400">1 bullet per line</span>
            </label>
            <textarea
              rows={3}
              value={commentData.strengths_summary}
              onChange={(e) => onUpdate({ ...commentData, strengths_summary: e.target.value })}
              placeholder="• Active participant in group discussions&#10;• Creative problem solver in reading comprehension&#10;• Always kind and supportive to classmates"
              className="w-full text-xs p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/20 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          {/* Column B: Needs / Areas to Improve */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-900">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Column B: Needs / Areas to Improve
              </span>
              <span className="text-[11px] font-normal text-slate-400">1 bullet per line</span>
            </label>
            <textarea
              rows={3}
              value={commentData.needs_improvement_summary}
              onChange={(e) => onUpdate({ ...commentData, needs_improvement_summary: e.target.value })}
              placeholder="• Needs to review written work before turning in&#10;• Can lose focus during independent seatwork&#10;• Needs practice following multi-step written directions"
              className="w-full text-xs p-2.5 rounded-lg border border-amber-200 bg-amber-50/20 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800"
            />
          </div>
        </div>

        {/* Generate / Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              disabled={loading}
              onClick={() => handleGenerate('standard')}
            >
              <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'text-amber-300'}`} />
              {loading ? 'Synthesizing...' : 'Generate Balanced Comment'}
            </Button>

            <Button
              variant="soft"
              size="sm"
              disabled={loading}
              onClick={() => handleGenerate('soft')}
              title="Generate with extra gentle, encouraging tone"
            >
              <RotateCcw className="w-3 h-3 text-emerald-700" />
              Regenerate with Soft Tone
            </Button>
          </div>

          <div className="text-xs text-slate-400">
            Teacher Albejean&apos;s 3-Paragraph Growth Framework
          </div>
        </div>

        {/* Side-by-side Badge View of Extracted Focus Points */}
        {(strengthsBadges.length > 0 || needsBadges.length > 0) && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-semibold text-emerald-800 block mb-1.5 text-[11px] uppercase tracking-wider">
                Identified Strengths:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {strengthsBadges.map((str, idx) => (
                  <Badge key={idx} variant="success">
                    ✓ {str}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-amber-800 block mb-1.5 text-[11px] uppercase tracking-wider">
                Identified Areas to Improve:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {needsBadges.map((need, idx) => (
                  <Badge key={idx} variant="warning">
                    ▲ {need}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Output View: Live Editable Rich-Textarea with Word Counter */}
        {activeText ? (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Final Report Card Comment (Editable-First)</span>
                <span className="text-[11px] font-normal text-slate-400">
                  Type or modify directly below
                </span>
              </label>

              <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                  {wordCount} words
                </span>
                <span className="text-slate-400">
                  {charCount} chars
                </span>
              </div>
            </div>

            <textarea
              value={activeText}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={6}
              className="w-full text-sm leading-relaxed p-3.5 rounded-lg border-2 border-emerald-400/50 bg-white hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-slate-800 shadow-inner font-sans transition-all"
              placeholder="Generated comment will appear here and can be edited immediately..."
            />

            {/* Actions: Copy, Save Draft */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
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
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      Copy to Clipboard
                    </>
                  )}
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

                {savedStatus && (
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {savedStatus === 'saved-supabase' ? 'Saved to Supabase!' : 'Saved Locally!'}
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-400 italic">
                Para 1: Strengths &bull; Para 2: Needs &bull; Para 3: Encouraging Close
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
            Click &quot;Generate Balanced Comment&quot; above to synthesize Teacher Albejean&apos;s 3-paragraph comment.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
