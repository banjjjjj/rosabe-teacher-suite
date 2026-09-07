'use client';

import React, { useState } from 'react';
import {
  Table as TableIcon,
  Sparkles,
  Download,
  Printer,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import EditableText from '@/components/EditableText';
import { Rubric, RubricCriterion } from '@/types';
import { exportRubricToCSV, exportRubricToWord, triggerPrint } from '@/lib/export-utils';
import { saveTeacherResource } from '@/lib/supabase';

const DEFAULT_RUBRIC: Rubric = {
  title: 'Informational & Explanatory Essay Rubric',
  grade_subject: 'Grade 5 English Language Arts',
  scale_type: '4-Point Analytical Scale',
  criteria: [
    {
      id: 'c-1',
      criterion: 'Focus & Main Idea',
      weight: '25%',
      exemplary: 'Topic is clearly introduced with a captivating thesis. Central focus is maintained flawlessly throughout the work.',
      proficient: 'Topic and main idea are clearly stated with a logical focus maintained across most paragraphs.',
      developing: 'Topic is identified, but thesis is somewhat vague. Focus drifts in one or two sections.',
      beginning: 'Main idea is unclear or missing. Essay lacks a central unifying focus.'
    },
    {
      id: 'c-2',
      criterion: 'Evidence & Textual Support',
      weight: '30%',
      exemplary: 'Skillfully integrates relevant, concrete facts, definitions, and quoted evidence with clear citations.',
      proficient: 'Includes sufficient facts and details that accurately support the main topic.',
      developing: 'Provides limited evidence; some facts are inaccurate or lack sufficient explanation.',
      beginning: 'Very little or no supporting evidence provided. Relies almost entirely on unsupported claims.'
    },
    {
      id: 'c-3',
      criterion: 'Organization & Flow',
      weight: '25%',
      exemplary: 'Clear, purposeful structure with logical sequencing, varied transition words, and an insightful conclusion.',
      proficient: 'Logical organizational structure with appropriate transitions and a complete conclusion.',
      developing: 'Basic structure is present, but transitions are repetitive and paragraph flow feels disjointed.',
      beginning: 'Disorganized structure makes ideas difficult to follow. Missing a proper introduction or conclusion.'
    },
    {
      id: 'c-4',
      criterion: 'Language Conventions & Mechanics',
      weight: '20%',
      exemplary: 'Demonstrates outstanding command of Grade 5 grammar, capitalization, punctuation, and academic vocabulary.',
      proficient: 'Demonstrates good control of grammar and mechanics with few minor errors that do not hinder understanding.',
      developing: 'Frequent errors in spelling, punctuation, or sentence formation that occasionally distract the reader.',
      beginning: 'Pervasive grammatical and mechanical errors significantly obscure the author’s meaning.'
    }
  ]
};

export default function RubricsPage() {
  const [rubric, setRubric] = useState<Rubric>(DEFAULT_RUBRIC);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: 'Science Inquiry Lab Report Rubric',
    grade_subject: 'Grade 5 Integrated Science',
    criteria_count: 4,
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'rubric',
          params: formData,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setRubric(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateCriterionCell = (index: number, field: keyof RubricCriterion, value: string) => {
    const updated = [...rubric.criteria];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setRubric({ ...rubric, criteria: updated });
  };

  const handleAddCriterion = () => {
    const newCriterion: RubricCriterion = {
      id: 'c-' + Date.now(),
      criterion: 'New Evaluation Criterion',
      weight: '20%',
      exemplary: 'Outstanding performance exceeding standard expectation.',
      proficient: 'Consistent performance meeting grade-level standards.',
      developing: 'Partial performance; needs targeted reinforcement.',
      beginning: 'Limited performance; requires substantial teacher scaffolding.'
    };
    setRubric({ ...rubric, criteria: [...rubric.criteria, newCriterion] });
  };

  const handleDeleteCriterion = (index: number) => {
    setRubric({
      ...rubric,
      criteria: rubric.criteria.filter((_, i) => i !== index),
    });
  };

  const handleSaveDraft = async () => {
    setSaveStatus('saving');
    const res = await saveTeacherResource({
      teacher_name: 'Teacher Albejean I. Rosabe',
      resource_type: 'rubric',
      title: rubric.title,
      content: rubric,
    });
    if (res.success) {
      setSaveStatus(res.source === 'supabase' ? 'Saved to Supabase!' : 'Saved to Local Archive!');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
            <TableIcon className="w-5 h-5 text-indigo-700" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Interactive Rubric Generator
            </h1>
            <p className="text-xs text-slate-500">
              Teacher Albejean I. Rosabe &bull; 4-Level Analytical Matrix with Direct Cell Editing
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
            onClick={() => exportRubricToCSV(rubric)}
            className="text-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportRubricToWord(rubric)}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export Word (.doc)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            Save Rubric
          </Button>

          {saveStatus && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          )}
        </div>
      </div>

      {/* Generator Form */}
      <Card className="print:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Configure Rubric Assessment</CardTitle>
          <CardDescription>
            Specify your assessment topic and subject to create a tiered 4-level evaluation table
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Narrative Writing / Science Lab"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Subject & Grade Level
              </label>
              <input
                type="text"
                value={formData.grade_subject}
                onChange={(e) => setFormData({ ...formData, grade_subject: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Grade 5 Social Studies"
                required
              />
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isGenerating}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'text-amber-300'}`} />
                {isGenerating ? 'Synthesizing Rubric...' : 'Generate Rubric'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Interactive Rubric Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Rubric Meta */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="info">Editable 4-Level Performance Matrix</Badge>
            <div className="text-xs text-slate-500">
              Evaluator: <strong>Teacher Albejean I. Rosabe</strong>
            </div>
          </div>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Rubric Title (Click to Edit)
          </span>
          <EditableText
            value={rubric.title}
            onChange={(val) => setRubric({ ...rubric, title: val })}
            tag="h1"
            className="text-xl sm:text-2xl font-extrabold text-slate-900"
          />

          <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
            <strong>Target Grade / Subject:</strong>
            <EditableText
              value={rubric.grade_subject}
              onChange={(val) => setRubric({ ...rubric, grade_subject: val })}
              tag="span"
              className="font-medium"
            />
          </div>
        </div>

        {/* Action button to add criteria */}
        <div className="flex items-center justify-between print:hidden">
          <p className="text-xs text-slate-500">
            Click or double-click any cell in the table below to customize the descriptor or weight.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCriterion}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-indigo-600" />
            Add Criterion Row
          </Button>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-3 w-40 sm:w-48">Criterion & Weight</th>
                <th className="p-3 bg-emerald-50 text-emerald-900 border-l border-slate-200">
                  Exemplary (4 pts)
                </th>
                <th className="p-3 bg-blue-50 text-blue-900 border-l border-slate-200">
                  Proficient (3 pts)
                </th>
                <th className="p-3 bg-amber-50 text-amber-900 border-l border-slate-200">
                  Developing (2 pts)
                </th>
                <th className="p-3 bg-rose-50 text-rose-900 border-l border-slate-200">
                  Beginning (1 pt)
                </th>
                <th className="p-3 w-10 print:hidden text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rubric.criteria.map((crit, idx) => (
                <tr key={crit.id || idx} className="hover:bg-slate-50/70 transition-colors group/crit">
                  {/* Criterion Title & Weight */}
                  <td className="p-3 align-top bg-slate-50/40">
                    <EditableText
                      value={crit.criterion}
                      onChange={(val) => handleUpdateCriterionCell(idx, 'criterion', val)}
                      className="font-bold text-slate-900 text-xs mb-1"
                    />
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <span>Weight:</span>
                      <EditableText
                        value={crit.weight}
                        onChange={(val) => handleUpdateCriterionCell(idx, 'weight', val)}
                        className="font-semibold text-indigo-700"
                      />
                    </div>
                  </td>

                  {/* Level 4: Exemplary */}
                  <td className="p-3 align-top border-l border-slate-100 text-slate-800">
                    <EditableText
                      value={crit.exemplary}
                      onChange={(val) => handleUpdateCriterionCell(idx, 'exemplary', val)}
                      multiline
                      className="text-xs leading-relaxed"
                    />
                  </td>

                  {/* Level 3: Proficient */}
                  <td className="p-3 align-top border-l border-slate-100 text-slate-800">
                    <EditableText
                      value={crit.proficient}
                      onChange={(val) => handleUpdateCriterionCell(idx, 'proficient', val)}
                      multiline
                      className="text-xs leading-relaxed"
                    />
                  </td>

                  {/* Level 2: Developing */}
                  <td className="p-3 align-top border-l border-slate-100 text-slate-800">
                    <EditableText
                      value={crit.developing}
                      onChange={(val) => handleUpdateCriterionCell(idx, 'developing', val)}
                      multiline
                      className="text-xs leading-relaxed"
                    />
                  </td>

                  {/* Level 1: Beginning */}
                  <td className="p-3 align-top border-l border-slate-100 text-slate-800">
                    <EditableText
                      value={crit.beginning}
                      onChange={(val) => handleUpdateCriterionCell(idx, 'beginning', val)}
                      multiline
                      className="text-xs leading-relaxed"
                    />
                  </td>

                  {/* Delete button */}
                  <td className="p-3 align-top print:hidden text-center">
                    {rubric.criteria.length > 1 && (
                      <button
                        onClick={() => handleDeleteCriterion(idx)}
                        className="opacity-0 group-hover/crit:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1"
                        title="Delete criterion"
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

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Created for <strong>Teacher Albejean I. Rosabe</strong> &bull; Total Standards Evaluated: {rubric.criteria.length}
          </div>
          <div className="font-mono text-slate-400">
            Export Format: CSV, DOCX, Printable Sheet
          </div>
        </div>
      </div>
    </div>
  );
}
