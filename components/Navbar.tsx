'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  FileText,
  CalendarCheck,
  Table as TableIcon,
  Mail,
  Home,
  CheckCircle2,
  Sparkles,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui';

export default function Navbar() {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/report-cards', label: 'Report Cards (Batch)', icon: FileText },
    { href: '/dashboard/lesson-plans', label: 'Lesson Plans', icon: CalendarCheck },
    { href: '/dashboard/rubrics', label: 'Rubric Builder', icon: TableIcon },
    { href: '/dashboard/communication', label: 'Parent Communication', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm print:hidden">
      {/* Primary Educator Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center border border-emerald-400/40">
              <GraduationCap className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
                Teacher Albejean I. Rosabe&apos;s Dashboard
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-600/60 border border-emerald-400/30 text-emerald-100">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Rosabe AI Teacher Suite
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-100 bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Editable-First Mode Active</span>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-600/50 transition-colors"
              title="System Status & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Settings / System Info Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Settings className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Rosabe AI Suite System Info</h3>
                <p className="text-xs text-slate-500">Educator: Teacher Albejean I. Rosabe</p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">OpenAI API (gpt-4o-mini)</div>
                  <div className="text-xs text-slate-500">Configured via .env.local</div>
                </div>
                <Badge variant="success">Auto-Fallback Ready</Badge>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">Supabase Cloud Database</div>
                  <div className="text-xs text-slate-500">Students, Comments, Resources</div>
                </div>
                <Badge variant="info">Local + Cloud Sync</Badge>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800 leading-relaxed">
                <strong>Editable-First Design Note:</strong> Click or double-click any generated comment, rubric cell, or lesson timeline item to customize it immediately before exporting.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
