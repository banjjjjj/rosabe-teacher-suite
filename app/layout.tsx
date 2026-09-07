import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: "Teacher Albejean I. Rosabe's Dashboard - Rosabe AI Suite",
  description: "Editable-First Teacher Productivity Platform: Report Card Comments, 45-Min Lesson Plans, Rubrics, and Parent Communications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              &copy; {new Date().getFullYear()} <strong>Rosabe AI Assistant</strong> &bull; Personalized for <strong>Teacher Albejean I. Rosabe</strong>
            </p>
            <p className="text-slate-400">
              Editable-First Architecture &bull; Next.js 14 &bull; Supabase Ready
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
