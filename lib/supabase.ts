import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Student, ReportCardComment, TeacherResource } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage Persistence Fallback Helper
const LOCAL_STORAGE_KEYS = {
  STUDENTS: 'rosabe_students_v1',
  COMMENTS: 'rosabe_comments_v1',
  RESOURCES: 'rosabe_resources_v1',
};

export async function saveReportCardComment(comment: ReportCardComment): Promise<{ success: boolean; id: string; source: 'supabase' | 'local' }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('report_card_comments')
        .upsert({
          id: comment.id,
          student_id: comment.student_id,
          strengths_summary: comment.strengths_summary,
          needs_improvement_summary: comment.needs_improvement_summary,
          generated_comment: comment.generated_comment,
          edited_comment: comment.edited_comment,
          is_reviewed: comment.is_reviewed,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, id: data?.id || comment.id, source: 'supabase' };
    } catch (err) {
      console.warn('Supabase save failed, falling back to local storage:', err);
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.COMMENTS) || '[]');
    const index = existing.findIndex((c: ReportCardComment) => c.id === comment.id);
    if (index >= 0) {
      existing[index] = comment;
    } else {
      existing.unshift(comment);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMMENTS, JSON.stringify(existing));
  }
  return { success: true, id: comment.id, source: 'local' };
}

export async function saveTeacherResource(resource: TeacherResource): Promise<{ success: boolean; id: string; source: 'supabase' | 'local' }> {
  const resourceId = resource.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'res-' + Date.now());
  const payload = {
    ...resource,
    id: resourceId,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('teacher_resources')
        .insert({
          id: payload.id,
          teacher_name: payload.teacher_name,
          resource_type: payload.resource_type,
          title: payload.title,
          content: payload.content,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, id: data?.id || resourceId, source: 'supabase' };
    } catch (err) {
      console.warn('Supabase save resource failed, saving locally:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.RESOURCES) || '[]');
    existing.unshift(payload);
    localStorage.setItem(LOCAL_STORAGE_KEYS.RESOURCES, JSON.stringify(existing));
  }
  return { success: true, id: resourceId, source: 'local' };
}

export async function getSavedResources(): Promise<TeacherResource[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('teacher_resources')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as TeacherResource[];
    } catch (err) {
      console.warn('Supabase get error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.RESOURCES) || '[]');
  }
  return [];
}
