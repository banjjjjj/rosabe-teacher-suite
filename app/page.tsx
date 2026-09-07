import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  FileText,
  CalendarCheck,
  Table as TableIcon,
  Mail,
  ArrowRight,
  CheckCircle2,
  Download,
  Edit3,
  Sliders,
  Database
} from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';

export default function HomePage() {
  const modules = [
    {
      title: 'Report Card Comments',
      subtitle: 'Batch Mode with Dual-Column Strengths & Needs',
      description: 'Turn student strengths and areas for improvement into warm, constructive, 3-paragraph comments. Includes live word-counter and one-click CSV export.',
      href: '/dashboard/report-cards',
      icon: FileText,
      badge: 'Most Popular',
      badgeColor: 'success' as const,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: '45-Min Lesson Plan Builder',
      subtitle: 'Structured Timetable with Interactive Grid',
      description: 'Generate 4-phase structured lesson plans (Warm-up, Direct Instruction, Guided Practice, Exit Ticket). Double-click any cell to customize, then export to Word or PDF.',
      href: '/dashboard/lesson-plans',
      icon: CalendarCheck,
      badge: 'Editable Timetable',
      badgeColor: 'purple' as const,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Interactive Rubric Generator',
      subtitle: '4-Level Matrix with Inline Cell Editing',
      description: 'Create assessment rubrics with Exemplary, Proficient, Developing, and Beginning tiers. Click any cell to modify criteria or weights directly.',
      href: '/dashboard/rubrics',
      icon: TableIcon,
      badge: 'Export to CSV & DOCX',
      badgeColor: 'info' as const,
      color: 'from-teal-500 to-emerald-600',
    },
    {
      title: 'Parent Communication Writer',
      subtitle: 'Progress Updates, Newsletters & Conference Invites',
      description: 'Compose empathetic, professional emails and weekly newsletters in seconds. Tailor the tone (warm, soft, direct) and copy directly to your email client.',
      href: '/dashboard/communication',
      icon: Mail,
      badge: 'Tone Selector',
      badgeColor: 'rose' as const,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-8 sm:p-12 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Dedicated Suite for Teacher Albejean I. Rosabe
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Rosabe AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
              Teacher Assistant Suite
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            Built upon our <strong>Editable-First Philosophy</strong>. Every lesson plan, rubric, parent email, and report card comment renders into live, inline-editable text fields and interactive tables ready for immediate customization and export.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="shadow-lg shadow-emerald-900/40">
                Launch Teacher Dashboard
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            <Link href="/dashboard/report-cards">
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                Batch Report Cards
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background badges */}
        <div className="absolute right-4 bottom-4 sm:right-12 sm:bottom-12 opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-emerald-400" />
        </div>
      </div>

      {/* Core Philosophy Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Edit3 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Editable-First Design</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              No locked AI outputs. Double-click any table cell, objective, or comment paragraph to refine the wording to your authentic teacher voice.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Universal Export Engine</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Export completed items to CSV rosters, native Microsoft Word (.doc/.docx) files, or formatted printable PDF sheets in one click.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Supabase & Offline Sync</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Connect seamlessly with your Supabase cloud database, or work offline with automated local storage caching.
            </p>
          </div>
        </div>
      </div>

      {/* Module Launcher Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Teacher Assistant Modules</h2>
            <p className="text-xs text-slate-500">Select a tool to launch and begin editing</p>
          </div>
          <Link href="/dashboard" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            View All in Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={m.badgeColor}>{m.badge}</Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mb-2">{m.subtitle}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600">
                    Editable-First UI
                  </span>
                  <Link href={m.href}>
                    <Button variant="primary" size="sm">
                      Open Module <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
