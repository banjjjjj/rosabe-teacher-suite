import { ReportCardComment, LessonPlan, Rubric, ParentCommunication } from '@/types';

// CSV Export for Report Card Comments
export function exportCommentsToCSV(comments: ReportCardComment[], filename = 'Teacher_Albejean_Report_Card_Comments.csv') {
  if (!comments || comments.length === 0) {
    alert('No comments to export.');
    return;
  }

  const headers = ['Student Name', 'Pronouns', 'Grade/Subject', 'Strengths', 'Needs Improvement', 'Final Comment', 'Word Count', 'Reviewed'];
  const rows = comments.map(c => [
    `"${(c.student_name || 'Student').replace(/"/g, '""')}"`,
    `"${(c.pronouns || 'They/Them').replace(/"/g, '""')}"`,
    `"${(c.grade_subject || 'General').replace(/"/g, '""')}"`,
    `"${(c.strengths_summary || '').replace(/"/g, '""')}"`,
    `"${(c.needs_improvement_summary || '').replace(/"/g, '""')}"`,
    `"${(c.edited_comment || c.generated_comment || '').replace(/"/g, '""')}"`,
    c.word_count || 0,
    c.is_reviewed ? 'Yes' : 'No'
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

// CSV Export for Rubrics
export function exportRubricToCSV(rubric: Rubric, filename = 'Teacher_Albejean_Rubric.csv') {
  const headers = ['Criterion', 'Weight', 'Exemplary (4 pts)', 'Proficient (3 pts)', 'Developing (2 pts)', 'Beginning (1 pt)'];
  const rows = rubric.criteria.map(c => [
    `"${c.criterion.replace(/"/g, '""')}"`,
    `"${c.weight.replace(/"/g, '""')}"`,
    `"${c.exemplary.replace(/"/g, '""')}"`,
    `"${c.proficient.replace(/"/g, '""')}"`,
    `"${c.developing.replace(/"/g, '""')}"`,
    `"${c.beginning.replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [
    `"Rubric Title: ${rubric.title.replace(/"/g, '""')}"`,
    `"Grade/Subject: ${rubric.grade_subject.replace(/"/g, '""')}"`,
    '',
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

// Word (.doc / .docx compatible) Export for Lesson Plan
export function exportLessonPlanToWord(plan: LessonPlan) {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${escapeXml(plan.title)}</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; padding: 20px; }
        h1 { font-size: 18pt; color: #15803d; border-bottom: 2px solid #16a34a; padding-bottom: 6px; margin-bottom: 4px; }
        .meta { color: #475569; font-size: 10pt; margin-bottom: 20px; }
        h2 { font-size: 13pt; color: #0f172a; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
        th, td { border: 1px solid #94a3b8; padding: 8px 10px; text-align: left; vertical-align: top; }
        th { background-color: #f1f5f9; font-weight: bold; }
        ul { margin-top: 4px; margin-bottom: 10px; padding-left: 20px; }
        li { margin-bottom: 4px; }
        .footer { margin-top: 30px; font-size: 9pt; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 8px; }
      </style>
    </head>
    <body>
      <h1>${escapeXml(plan.title)}</h1>
      <div class="meta">
        <strong>Teacher:</strong> Teacher Albejean I. Rosabe &nbsp;|&nbsp;
        <strong>Subject:</strong> ${escapeXml(plan.subject)} &nbsp;|&nbsp;
        <strong>Grade:</strong> ${escapeXml(plan.grade_level)} &nbsp;|&nbsp;
        <strong>Duration:</strong> ${escapeXml(plan.duration || '45 Minutes')}
      </div>

      <h2>1. Learning Objectives</h2>
      <ul>
        ${plan.learning_objectives.map(obj => `<li>${escapeXml(obj)}</li>`).join('')}
      </ul>

      <h2>2. Materials Needed</h2>
      <ul>
        ${plan.materials_needed.map(mat => `<li>${escapeXml(mat)}</li>`).join('')}
      </ul>

      <h2>3. 45-Minute Lesson Timeline & Activities</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 12%;">Time</th>
            <th style="width: 22%;">Phase</th>
            <th style="width: 38%;">Student Activity</th>
            <th style="width: 28%;">Teacher Action</th>
          </tr>
        </thead>
        <tbody>
          ${plan.timeline.map(row => `
            <tr>
              <td><strong>${escapeXml(row.time_mins)} min</strong></td>
              <td><strong>${escapeXml(row.phase)}</strong></td>
              <td>${escapeXml(row.activity)}</td>
              <td>${escapeXml(row.teacher_action)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>4. Differentiation Strategies</h2>
      <p><strong>Support Needed:</strong> ${escapeXml(plan.differentiation.support_needed)}</p>
      <p><strong>Advanced Learners:</strong> ${escapeXml(plan.differentiation.advanced_learners)}</p>

      ${plan.assessment_closure ? `<h2>5. Assessment & Closure</h2><p>${escapeXml(plan.assessment_closure)}</p>` : ''}

      <div class="footer">
        Prepared by Teacher Albejean I. Rosabe &bull; Rosabe AI – Teacher Assistant Suite &bull; Exported on ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;

  downloadBlob(htmlContent, `${plan.title.replace(/\s+/g, '_')}_LessonPlan.doc`, 'application/msword;charset=utf-8');
}

// Word (.doc) Export for Rubric
export function exportRubricToWord(rubric: Rubric) {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${escapeXml(rubric.title)}</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 10pt; color: #1e293b; padding: 20px; }
        h1 { font-size: 16pt; color: #15803d; margin-bottom: 4px; }
        .meta { color: #475569; font-size: 10pt; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; vertical-align: top; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .footer { margin-top: 24px; font-size: 9pt; color: #64748b; }
      </style>
    </head>
    <body>
      <h1>${escapeXml(rubric.title)}</h1>
      <div class="meta">
        <strong>Teacher:</strong> Teacher Albejean I. Rosabe &nbsp;|&nbsp;
        <strong>Subject/Grade:</strong> ${escapeXml(rubric.grade_subject)}
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 18%;">Criterion (Weight)</th>
            <th style="width: 20.5%;">Exemplary (4 pts)</th>
            <th style="width: 20.5%;">Proficient (3 pts)</th>
            <th style="width: 20.5%;">Developing (2 pts)</th>
            <th style="width: 20.5%;">Beginning (1 pt)</th>
          </tr>
        </thead>
        <tbody>
          ${rubric.criteria.map(row => `
            <tr>
              <td><strong>${escapeXml(row.criterion)}</strong><br/><span style="color:#64748b; font-size:9pt;">(${escapeXml(row.weight)})</span></td>
              <td>${escapeXml(row.exemplary)}</td>
              <td>${escapeXml(row.proficient)}</td>
              <td>${escapeXml(row.developing)}</td>
              <td>${escapeXml(row.beginning)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        Prepared by Teacher Albejean I. Rosabe &bull; Rosabe AI – Teacher Assistant Suite
      </div>
    </body>
    </html>
  `;

  downloadBlob(htmlContent, `${rubric.title.replace(/\s+/g, '_')}_Rubric.doc`, 'application/msword;charset=utf-8');
}

// Print / PDF Trigger helper
export function triggerPrint() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}

// Download Helper
function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe: string) {
  return (unsafe || '').replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
