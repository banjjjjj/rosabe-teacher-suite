import { LessonPlan, Rubric, ParentCommunication } from '@/types';

export function generateMockReportCard(params: {
  student_name: string;
  pronouns?: string;
  grade_subject: string;
  strengths_bullets: string[];
  needs_improvement_bullets: string[];
  tone?: string;
}) {
  const { student_name, pronouns = 'They/Them', grade_subject, strengths_bullets, needs_improvement_bullets, tone = 'standard' } = params;

  // Determine pronouns
  const isHe = pronouns.toLowerCase().includes('he');
  const isShe = pronouns.toLowerCase().includes('she');
  const subj = isHe ? 'He' : isShe ? 'She' : 'They';
  const obj = isHe ? 'him' : isShe ? 'her' : 'them';
  const pos = isHe ? 'his' : isShe ? 'her' : 'their';
  const posCap = isHe ? 'His' : isShe ? 'Her' : 'Their';
  const verbIs = isHe || isShe ? 'is' : 'are';
  const verbHas = isHe || isShe ? 'has' : 'have';

  const strengthsList = strengths_bullets.length > 0 
    ? strengths_bullets.join(', ') 
    : 'consistent curiosity, enthusiastic participation, and thoughtful contributions';

  const needsList = needs_improvement_bullets.length > 0 
    ? needs_improvement_bullets.join(', ') 
    : 'consistently verifying instructions, managing pacing during independent tasks, and organizing materials';

  const strengths_paragraph = `${student_name} ${verbHas} shown admirable enthusiasm and dedication throughout this grading period in ${grade_subject}. ${subj} consistently demonstrates remarkable strengths in ${strengthsList}. In our classroom, ${student_name} frequently contributes meaningful insights during class discussions and engages cooperatively with peers during group endeavors. ${posCap} positive energy and willingness to learn continue to be an asset to our learning community.`;

  const needs_improvement_paragraph = `To support ${pos} continued academic growth and foster greater independence, our primary focus areas will center on ${needsList}. At times, ${student_name} would benefit from taking a moment to review work thoroughly prior to submission and implementing structured checklists for multi-step assignments. With continued guidance at school and consistent reinforcement at home, I am confident that ${subj.toLowerCase()} will build stronger self-monitoring strategies and executive functioning skills.`;

  const closing_paragraph = `It has been an absolute pleasure teaching ${student_name} this term. I look forward to partnering closely with you as we celebrate ${pos} ongoing accomplishments and guide ${obj} toward reaching ${pos} fullest potential in ${grade_subject}.`;

  const full_combined_comment = `${strengths_paragraph}\n\n${needs_improvement_paragraph}\n\n${closing_paragraph}`;
  const word_count = full_combined_comment.trim().split(/\s+/).length;

  return {
    student_name,
    strengths_paragraph,
    needs_improvement_paragraph,
    closing_paragraph,
    full_combined_comment,
    word_count,
  };
}

export function generateMockLessonPlan(params: {
  subject: string;
  topic: string;
  grade_level: string;
  duration?: string;
}): LessonPlan {
  const { subject, topic, grade_level, duration = '45 Minutes' } = params;

  return {
    title: `${topic} - Master Inquiry & Practice`,
    grade_level: grade_level || 'Grade 5',
    subject: subject || 'General Education',
    duration: duration,
    learning_objectives: [
      `Identify and articulate the foundational principles of ${topic}.`,
      `Apply step-by-step problem solving strategies to analyze examples of ${topic}.`,
      `Demonstrate mastery through guided collaborative inquiry and an independent exit reflection.`
    ],
    materials_needed: [
      'Interactive Whiteboard / Projector',
      'Student Graphic Organizers & Guided Practice Sheets',
      'Manipulatives or Digital Simulation Tool',
      'Quick Exit Ticket Slips'
    ],
    timeline: [
      {
        time_mins: '8',
        phase: 'Warm-up / Hook',
        activity: `Engage students with a real-world scenario or mystery prompt connected to ${topic}. Think-Pair-Share on initial observations.`,
        teacher_action: `Display visual anchor chart; facilitate peer sharing, activate prior schema, and write key vocabulary words on the board.`
      },
      {
        time_mins: '15',
        phase: 'Direct Instruction',
        activity: `Explicit Modeling (I Do / We Do): Breakdown core concepts of ${topic} into sequential, bite-sized visual steps.`,
        teacher_action: `Model think-aloud process; highlight non-examples, check for understanding using quick finger voting (1-5 scale).`
      },
      {
        time_mins: '15',
        phase: 'Guided Practice',
        activity: `Differentiated Paired Task: Students collaborate in study pairs to solve tiered challenges related to ${topic}.`,
        teacher_action: `Circulate the room, provide targeted micro-interventions, conduct guided reading/problem-solving with table groups.`
      },
      {
        time_mins: '7',
        phase: 'Exit Ticket / Closure',
        activity: `Independent synthesis: Students complete a 2-question exit slip and rate their confidence level.`,
        teacher_action: `Collect exit tickets for immediate formative assessment analysis; provide positive whole-class affirmations.`
      }
    ],
    differentiation: {
      support_needed: `Provide sentence stems, illustrated vocabulary cards, and pre-highlighted step sequences. Offer small-group teacher conferencing during guided practice.`,
      advanced_learners: `Encourage students to design their own extension problem or act as peer mentors to explain reasoning using alternative methods.`
    },
    assessment_closure: `Formative evaluation via Exit Ticket responses and observation checklist during paired guided practice.`
  };
}

export function generateMockRubric(params: {
  title: string;
  grade_subject: string;
}): Rubric {
  const { title, grade_subject } = params;

  return {
    title: title || 'Comprehensive Performance Rubric',
    grade_subject: grade_subject || 'All Subjects',
    criteria: [
      {
        id: 'c1',
        criterion: 'Content Mastery & Accuracy',
        weight: '30%',
        exemplary: 'Demonstrates deep, thorough understanding; applies concepts flawlessly with insightful synthesis.',
        proficient: 'Demonstrates clear and accurate understanding of core concepts with minimal minor inaccuracies.',
        developing: 'Demonstrates basic understanding; some conceptual gaps or inaccuracies are evident.',
        beginning: 'Demonstrates limited understanding; significant misconceptions require substantial reteaching.'
      },
      {
        id: 'c2',
        criterion: 'Critical Thinking & Evidence',
        weight: '30%',
        exemplary: 'Justifies all conclusions with compelling evidence, nuanced logic, and original perspective.',
        proficient: 'Supports claims with relevant evidence and sound reasoning throughout.',
        developing: 'Provides partial evidence; connections between reasoning and conclusions are somewhat vague.',
        beginning: 'Little or no evidence provided; claims lack logical rationale or supporting facts.'
      },
      {
        id: 'c3',
        criterion: 'Organization & Structure',
        weight: '20%',
        exemplary: 'Impeccably organized with seamless transitions and coherent logical progression.',
        proficient: 'Well-structured with clear sequencing, introduction, and conclusion.',
        developing: 'Structure is somewhat disorganized; transitions between ideas are abrupt.',
        beginning: 'Lacks clear organization; ideas appear fragmented and difficult to follow.'
      },
      {
        id: 'c4',
        criterion: 'Effort, Mechanics & Presentation',
        weight: '20%',
        exemplary: 'Polished presentation; virtually free of grammatical or mechanical errors; shows exceptional craftsmanship.',
        proficient: 'Neat and clear presentation; minor errors do not interfere with overall comprehension.',
        developing: 'Noticeable errors in grammar, mechanics, or presentation that occasionally distract the reader.',
        beginning: 'Frequent errors significantly impede clarity; presentation appears rushed or incomplete.'
      }
    ]
  };
}

export function generateMockCommunication(params: {
  student_name: string;
  parent_guardian_name?: string;
  type: string;
  tone: string;
  notes?: string;
}): ParentCommunication {
  const { student_name, parent_guardian_name = 'Parent/Guardian', type, tone, notes = '' } = params;
  const parentSalutation = parent_guardian_name ? `Dear ${parent_guardian_name}` : 'Dear Family';

  let subject = `Update regarding ${student_name} in our classroom`;
  let bodyContent = '';

  if (type === 'progress_update') {
    subject = `Classroom Progress Update: Celebrating ${student_name}'s Growth`;
    bodyContent = `${parentSalutation},\n\nI hope you are having a wonderful week! I wanted to take a moment to share a quick update on ${student_name}'s progress in our classroom.\n\n${student_name} has shown remarkable dedication during our recent lessons. ${notes ? `Specifically, ${notes}.` : `Their active curiosity and positive participation have been wonderful to see.`}\n\nThank you so much for your continued partnership and support at home. Please feel free to reach out if you have any questions!\n\nWarm regards,\nTeacher Albejean I. Rosabe`;
  } else if (type === 'needs_improvement') {
    subject = `Partnering for ${student_name}'s Academic Success`;
    bodyContent = `${parentSalutation},\n\nI hope this email finds you well. I am writing to share some observations regarding ${student_name}'s recent learning experiences and to ensure we are collaborating closely to support their success.\n\n${notes ? `Recently, we have noticed areas where ${student_name} could use extra support: ${notes}.` : `We want to ensure ${student_name} stays on track with completing daily class tasks and organizing study materials.`}\n\nIn class, I am implementing structured check-ins and step-by-step guidance. I would love to coordinate with you on simple strategies we can echo at home.\n\nThank you for your warm support. I look forward to working together!\n\nSincerely,\nTeacher Albejean I. Rosabe`;
  } else if (type === 'newsletter') {
    subject = `Teacher Albejean's Weekly Classroom Newsletter & Highlights`;
    bodyContent = `Dear Families,\n\nWelcome to this week's classroom recap! Our students have had an enriching week filled with meaningful discoveries and collaboration.\n\nKey Highlights:\n- Academic Focus: Deep dive into collaborative inquiry and guided problem-solving.\n- Student Spotlight: Celebrating effort, curiosity, and mutual respect among peers.\n${notes ? `- Important Notice: ${notes}\n` : ''}\nReminders:\n- Please check and sign weekly learning logs.\n- Don't hesitate to reach out with any questions or thoughts.\n\nWarmly,\nTeacher Albejean I. Rosabe`;
  } else {
    subject = `Invitation: Parent-Teacher Conference for ${student_name}`;
    bodyContent = `${parentSalutation},\n\nI would like to cordially invite you to our upcoming Parent-Teacher Conference to discuss ${student_name}'s academic journey and celebrate their milestones.\n\n${notes ? `Special focus: ${notes}\n\n` : ''}Please let me know which time slots work best for your schedule. I am eager to share insights and plan our next steps together.\n\nBest regards,\nTeacher Albejean I. Rosabe`;
  }

  return {
    recipient_role: 'Parent / Guardian',
    student_name,
    parent_guardian_name,
    subject_line: subject,
    tone: (tone as any) || 'warm',
    type: (type as any) || 'progress_update',
    body: bodyContent,
    created_at: new Date().toISOString(),
  };
}
