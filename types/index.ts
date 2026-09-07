export interface Student {
  id: string;
  teacher_name: string;
  student_name: string;
  pronouns: string;
  grade_subject: string;
  strengths: string[];
  needs_improvement: string[];
  created_at?: string;
}

export interface ReportCardComment {
  id: string;
  student_id: string;
  student_name?: string;
  pronouns?: string;
  grade_subject?: string;
  strengths_summary: string;
  needs_improvement_summary: string;
  strengths_bullets?: string[];
  needs_improvement_bullets?: string[];
  strengths_paragraph?: string;
  needs_improvement_paragraph?: string;
  closing_paragraph?: string;
  generated_comment: string;
  edited_comment: string;
  word_count: number;
  is_reviewed: boolean;
  updated_at?: string;
}

export interface TimelinePhase {
  id?: string;
  time_mins: string;
  phase: string;
  activity: string;
  teacher_action: string;
}

export interface LessonPlan {
  id?: string;
  title: string;
  grade_level: string;
  subject: string;
  duration?: string;
  learning_objectives: string[];
  materials_needed: string[];
  timeline: TimelinePhase[];
  differentiation: {
    support_needed: string;
    advanced_learners: string;
  };
  assessment_closure?: string;
  created_at?: string;
}

export interface RubricCriterion {
  id: string;
  criterion: string;
  weight: string;
  exemplary: string; // 4 pts / Advanced
  proficient: string; // 3 pts / Proficient
  developing: string; // 2 pts / Developing
  beginning: string; // 1 pt / Emerging
}

export interface Rubric {
  id?: string;
  title: string;
  grade_subject: string;
  scale_type?: string;
  criteria: RubricCriterion[];
  created_at?: string;
}

export interface ParentCommunication {
  id?: string;
  recipient_role: string;
  student_name: string;
  parent_guardian_name?: string;
  subject_line: string;
  tone: 'warm' | 'soft' | 'direct' | 'celebratory';
  type: 'progress_update' | 'needs_improvement' | 'attendance_behavior' | 'newsletter' | 'conference_invite';
  body: string;
  created_at?: string;
}

export interface TeacherResource {
  id?: string;
  teacher_name: string;
  resource_type: 'lesson_plan' | 'rubric' | 'email' | 'report_card';
  title: string;
  content: any;
  created_at?: string;
}

export type GenerateModuleType = 'report_card' | 'lesson_plan' | 'rubric' | 'communication';
