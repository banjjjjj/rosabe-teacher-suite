'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  FileText,
  CalendarCheck,
  Table as TableIcon,
  Mail,
  Plus,
  ArrowRight,
  Clock,
  Download,
  FolderOpen,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { TeacherResource } from '@/types';
import { getSavedResources } from '@/lib/supabase';

export default function DashboardOverviewPage() {
  const [resources, setResources] = useState<TeacherResource[]>([]);
  const [stats, setStats] = useState({
    commentsCount: 3,
    lessonsCount: 2,
    rubricsCount: 1,
    parentEmailsCount: 4,
  });

  useEffect(() => {
    async function load() {
      const data = await getSavedResources();
      setResources(data);
      if (typeof window !== 'undefined') {
        const comments = JSON.parse(localStorage.getItem('rosabe_comments_v1') || '[]');
        if (comments.length > 0) {
          setStats(prev => ({ ...prev, commentsCount: comments.length }));
        }
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Teacher Assistant Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, Teacher Albejean I. Rosabe
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Your personalized teaching cockpit is ready. Generate balanced report card comments, build structured 45-minute lesson plans with editable timetable grids, or draft compassionate parent communications.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link href="/dashboard/report-cards">
            <Button variant="secondary" size="md" className="bg-white text-slate-900 hover:bg-emerald-50">
              <Plus className="w-4 h-4 mr-1 text-emerald-600" />
              New Report Card
            </Button>
          </Link>
          <Link href="/dashboard/lesson-plans">
            <Button variant="outline" size="md" className="bg-emerald-900/40 text-white border-emerald-400/40 hover:bg-emerald-800">
              <Plus className="w-4 h-4 mr-1" />
              Plan Lesson
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Cards</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.commentsCount}</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Strengths + Needs
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson Plans</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.lessonsCount}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">45-min Timetables</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rubrics</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <TableIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.rubricsCount}</div>
          <div className="text-xs text-indigo-600 mt-1 font-medium">4-Tier Scoring</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parent Emails</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.parentEmailsCount}</div>
          <div className="text-xs text-amber-600 mt-1 font-medium">Warm & Constructive</div>
        </div>
      </div>

      {/* Feature Modules Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1 Card */}
        <Card className="hover:border-emerald-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Report Card Comment Generator</CardTitle>
              <CardDescription>Batch comment synthesizer with strengths and growth areas</CardDescription>
            </div>
            <Badge variant="success">Crucial Module</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides the dual-column bullet inputs for <em>Column A: Strengths & Positives</em> and <em>Column B: Needs / Areas to Improve</em>. Generates balanced 3-paragraph comments with live word counting, soft tone adjustments, and CSV export.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Batch Roster Mode</span>
              <Link href="/dashboard/report-cards">
                <Button variant="primary" size="sm">
                  Launch Report Cards <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Module 2 Card */}
        <Card className="hover:border-blue-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>45-Min Lesson Plan Builder</CardTitle>
              <CardDescription>Structured 4-phase timeline with double-click inline cell edits</CardDescription>
            </div>
            <Badge variant="purple">Editable Grid</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates complete 45-minute lesson plans with learning objectives, materials, and a timetable grid (Warm-up, Direct Instruction, Guided Practice, Exit Ticket). Double-click any cell to adjust and export directly to Word (.doc) or PDF.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Word / PDF Export</span>
              <Link href="/dashboard/lesson-plans">
                <Button variant="secondary" size="sm">
                  Launch Lesson Planner <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Module 3 Card */}
        <Card className="hover:border-indigo-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Interactive Rubric Generator</CardTitle>
              <CardDescription>4-level performance matrix with inline cell editing</CardDescription>
            </div>
            <Badge variant="info">Matrix Builder</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Build custom rubrics across Exemplary (4 pts), Proficient (3 pts), Developing (2 pts), and Beginning (1 pt) standards. Edit criteria weights, descriptions, and download as CSV or Word.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">CSV & Word Export</span>
              <Link href="/dashboard/rubrics">
                <Button variant="outline" size="sm">
                  Launch Rubric Builder <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Module 4 Card */}
        <Card className="hover:border-amber-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Parent Communication Writer</CardTitle>
              <CardDescription>Warm, constructive family notes, newsletters & updates</CardDescription>
            </div>
            <Badge variant="rose">Tone Controls</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Compose progress reports, gentle needs notices, and weekly newsletters. Tailor tone from warm to direct, then copy straight to your clipboard with one click.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">1-Click Clipboard</span>
              <Link href="/dashboard/communication">
                <Button variant="outline" size="sm">
                  Launch Communication <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Resources / Cloud Sync Notice */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-700" />
            <div>
              <CardTitle>Saved Resources & Archive</CardTitle>
              <CardDescription>Saved lesson plans, rubrics, and comments synced to Supabase / Local Storage</CardDescription>
            </div>
          </div>
          <Badge variant="default">Auto-Synced</Badge>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {resources.map((res, i) => (
                <div key={res.id || i} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{res.title}</span>
                    <span className="ml-2 text-slate-400 uppercase font-mono">[{res.resource_type}]</span>
                  </div>
                  <span className="text-slate-400">
                    {res.created_at ? new Date(res.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No custom saved resources yet. Use any module to generate and click &quot;Save Draft&quot; to archive resources under Teacher Albejean I. Rosabe.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
