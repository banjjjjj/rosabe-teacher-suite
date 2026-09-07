import { NextRequest, NextResponse } from 'next/server';
import {
  REPORT_CARD_SYSTEM_PROMPT,
  LESSON_PLAN_SYSTEM_PROMPT,
  RUBRIC_SYSTEM_PROMPT,
  COMMUNICATION_SYSTEM_PROMPT,
} from '@/lib/prompts';
import {
  generateMockReportCard,
  generateMockLessonPlan,
  generateMockRubric,
  generateMockCommunication,
} from '@/lib/mock-generators';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { module, params } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    // If OpenAI key is available, call gpt-4o-mini
    if (apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_openai_api_key')) {
      try {
        let systemPrompt = '';
        let userPrompt = '';

        if (module === 'report_card') {
          systemPrompt = REPORT_CARD_SYSTEM_PROMPT;
          userPrompt = `Generate a balanced report card comment for:
Teacher: Teacher Albejean I. Rosabe
Student Name: ${params.student_name}
Pronouns: ${params.pronouns || 'They/Them'}
Subject/Grade: ${params.grade_subject}
Strengths: ${Array.isArray(params.strengths_bullets) ? params.strengths_bullets.join(', ') : params.strengths_bullets}
Needs Improvement: ${Array.isArray(params.needs_improvement_bullets) ? params.needs_improvement_bullets.join(', ') : params.needs_improvement_bullets}
Tone: ${params.tone || 'encouraging, warm, and objective'}`;
        } else if (module === 'lesson_plan') {
          systemPrompt = LESSON_PLAN_SYSTEM_PROMPT;
          userPrompt = `Generate a structured 45-minute lesson plan for:
Teacher: Teacher Albejean I. Rosabe
Subject: ${params.subject}
Topic: ${params.topic}
Grade Level: ${params.grade_level}
Duration: ${params.duration || '45 Minutes'}
Special Focus: ${params.focus || 'Active student engagement, differentiated instruction'}`;
        } else if (module === 'rubric') {
          systemPrompt = RUBRIC_SYSTEM_PROMPT;
          userPrompt = `Generate a 4-level scoring rubric for:
Teacher: Teacher Albejean I. Rosabe
Assignment Title: ${params.title}
Grade/Subject: ${params.grade_subject}
Number of Criteria: ${params.criteria_count || 4}`;
        } else if (module === 'communication') {
          systemPrompt = COMMUNICATION_SYSTEM_PROMPT;
          userPrompt = `Draft an email/communication for Teacher Albejean I. Rosabe:
Recipient Role: ${params.recipient_role || 'Parent / Guardian'}
Student Name: ${params.student_name}
Parent Name: ${params.parent_guardian_name || 'Parent/Guardian'}
Communication Type: ${params.type}
Tone: ${params.tone}
Specific Notes/Points: ${params.notes || 'General progress'}`;
        }

        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
          }),
        });

        if (openAiRes.ok) {
          const aiJson = await openAiRes.json();
          const parsedContent = JSON.parse(aiJson.choices[0].message.content);
          return NextResponse.json({
            success: true,
            source: 'openai-gpt-4o-mini',
            data: parsedContent,
          });
        } else {
          console.warn('OpenAI API returned non-ok status, using fallback:', openAiRes.status);
        }
      } catch (openAiError) {
        console.warn('OpenAI call failed, seamlessly using built-in generator:', openAiError);
      }
    }

    // High-Fidelity Pedagogical Fallback Generator
    let fallbackData: any;
    if (module === 'report_card') {
      const strengthsArr = Array.isArray(params.strengths_bullets)
        ? params.strengths_bullets
        : (params.strengths_bullets || '').split('\n').filter((s: string) => s.trim().length > 0);
      const needsArr = Array.isArray(params.needs_improvement_bullets)
        ? params.needs_improvement_bullets
        : (params.needs_improvement_bullets || '').split('\n').filter((s: string) => s.trim().length > 0);

      fallbackData = generateMockReportCard({
        student_name: params.student_name || 'Student',
        pronouns: params.pronouns || 'They/Them',
        grade_subject: params.grade_subject || 'Grade 5 Subject',
        strengths_bullets: strengthsArr,
        needs_improvement_bullets: needsArr,
        tone: params.tone || 'standard',
      });
    } else if (module === 'lesson_plan') {
      fallbackData = generateMockLessonPlan({
        subject: params.subject || 'English Language Arts',
        topic: params.topic || 'Reading Comprehension & Inferences',
        grade_level: params.grade_level || 'Grade 5',
        duration: params.duration || '45 Minutes',
      });
    } else if (module === 'rubric') {
      fallbackData = generateMockRubric({
        title: params.title || 'Informative Writing Assessment Rubric',
        grade_subject: params.grade_subject || 'Grade 5 English',
      });
    } else if (module === 'communication') {
      fallbackData = generateMockCommunication({
        student_name: params.student_name || 'Student',
        parent_guardian_name: params.parent_guardian_name || 'Parent/Guardian',
        type: params.type || 'progress_update',
        tone: params.tone || 'warm',
        notes: params.notes || '',
      });
    } else {
      return NextResponse.json({ success: false, error: 'Unknown module' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      source: 'pedagogical-engine-local',
      data: fallbackData,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
