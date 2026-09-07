-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS ""uuid-ossp"";

-- Table: Students Roster
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_name VARCHAR(255) DEFAULT 'Teacher Albejean I. Rosabe',
    student_name VARCHAR(255) NOT NULL,
    pronouns VARCHAR(50) DEFAULT 'They/Them',
    grade_subject VARCHAR(100) NOT NULL,
    strengths TEXT[],
    needs_improvement TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Generated Report Card Comments
CREATE TABLE IF NOT EXISTS report_card_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    strengths_summary TEXT NOT NULL,
    needs_improvement_summary TEXT NOT NULL,
    generated_comment TEXT NOT NULL,
    edited_comment TEXT, -- Editable field for Teacher Albejean to modify
    is_reviewed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Saved Lessons & Rubrics
CREATE TABLE IF NOT EXISTS teacher_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_name VARCHAR(255) DEFAULT 'Teacher Albejean I. Rosabe',
    resource_type VARCHAR(50) NOT NULL, -- 'lesson_plan', 'rubric', 'email'
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL, -- Flexible editable JSON block
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (Optional: Enable if auth is strictly configured)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_card_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_resources ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo teacher if anonymous key is used
CREATE POLICY ""Allow all for anon on students"" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY ""Allow all for anon on report_card_comments"" ON report_card_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY ""Allow all for anon on teacher_resources"" ON teacher_resources FOR ALL USING (true) WITH CHECK (true);
