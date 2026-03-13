import React from 'react';
import { ResumeData } from '../types';
import EditableText from './EditableText';

interface Props {
  data: ResumeData;
  language: 'ar' | 'en';
  onUpdate: (newData: ResumeData) => void;
}

export default function CoverLetterPreview({ data, language, onUpdate }: Props) {
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const t = {
    date: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    hiringManager: isAr ? 'مدير التوظيف المحترم،' : 'Dear Hiring Manager,',
    sincerely: isAr ? 'وتفضلوا بقبول فائق الاحترام،' : 'Sincerely,',
    placeholder: isAr
      ? 'هنا سيتم كتابة خطاب التوظيف المخصص بناءً على خبراتك والوظيفة المستهدفة. يرجى تزويدي بالبيانات في المحادثة لأقوم بصياغته لك بشكل احترافي.'
      : 'Here the tailored cover letter will be written based on your experience and target job. Please provide me with the details in the chat so I can craft it professionally for you.',
  };

  const updateField = (field: keyof ResumeData, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div
      className="bg-white text-black p-6 @xl:p-12 mx-auto shadow-lg print:shadow-none print:p-0 font-sans w-full max-w-[210mm] @container"
      style={{ minHeight: '297mm', direction: dir }}
    >
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-6 mb-10">
        <EditableText
          as="h1"
          value={data.fullName}
          onChange={(val) => updateField('fullName', val)}
          className="text-2xl @xl:text-4xl font-bold uppercase tracking-wider text-gray-900 mb-2 block"
          placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
        />
        <EditableText
          as="h2"
          value={data.jobTitle}
          onChange={(val) => updateField('jobTitle', val)}
          className="text-lg @xl:text-xl text-gray-600 font-medium mb-4 block"
          placeholder={isAr ? 'المسمى الوظيفي' : 'Job Title'}
        />
        <div className="flex flex-col @xl:flex-row @xl:flex-wrap gap-2 @xl:gap-4 text-sm text-gray-600">
          <EditableText value={data.email} onChange={(val) => updateField('email', val)} placeholder="Email" />
          <EditableText value={data.phone} onChange={(val) => updateField('phone', val)} placeholder="Phone" />
          <EditableText value={data.location} onChange={(val) => updateField('location', val)} placeholder="Location" />
          <EditableText value={data.linkedin} onChange={(val) => updateField('linkedin', val)} placeholder="LinkedIn" />
        </div>
      </header>

      {/* Date */}
      <div className="mb-8 text-gray-800">
        {t.date}
      </div>

      {/* Salutation */}
      <div className="mb-6 text-gray-900 font-medium">
        {t.hiringManager}
      </div>

      {/* Body */}
      <div className="mb-12">
        <EditableText
          as="div"
          multiline
          value={data.coverLetterBody || ''}
          onChange={(val) => updateField('coverLetterBody', val)}
          className="text-gray-800 leading-relaxed space-y-4 whitespace-pre-wrap block"
          placeholder={t.placeholder}
        />
      </div>

      {/* Sign-off */}
      <div className="text-gray-900">
        <div className="mb-4">{t.sincerely}</div>
        <EditableText
          as="div"
          value={data.fullName}
          onChange={(val) => updateField('fullName', val)}
          className="font-bold block"
          placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
        />
      </div>
    </div>
  );
}
