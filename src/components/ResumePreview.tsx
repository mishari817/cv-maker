import React from 'react';
import { ResumeData } from '../types';
import EditableText from './EditableText';
import { Trash2 } from 'lucide-react';

interface Props {
  data: ResumeData;
  language: 'ar' | 'en';
  onUpdate: (newData: ResumeData) => void;
}

export default function ResumePreview({ data, language, onUpdate }: Props) {
  const isAr = language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const defaultTitles = {
    summary: isAr ? 'الملخص المهني' : 'Professional Summary',
    experience: isAr ? 'الخبرة العملية' : 'Experience',
    education: isAr ? 'التعليم' : 'Education',
    skills: isAr ? 'المهارات' : 'Skills',
    languages: isAr ? 'اللغات' : 'Languages',
  };

  const getTitle = (key: keyof typeof defaultTitles) => {
    return data.sectionTitles?.[key] || defaultTitles[key];
  };

  const updateTitle = (key: keyof typeof defaultTitles, value: string) => {
    onUpdate({
      ...data,
      sectionTitles: {
        ...(data.sectionTitles || {}),
        [key]: value
      }
    });
  };

  const hideSection = (key: string) => {
    onUpdate({
      ...data,
      hiddenSections: [...(data.hiddenSections || []), key]
    });
  };

  const isHidden = (key: string) => {
    return data.hiddenSections?.includes(key);
  };

  const updateField = (field: keyof ResumeData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const updateArrayItem = (field: 'experience' | 'education', index: number, itemField: string, value: string) => {
    const newArray = [...data[field]] as any[];
    newArray[index] = { ...newArray[index], [itemField]: value };
    updateField(field, newArray);
  };

  const deleteArrayItem = (field: keyof ResumeData, index: number) => {
    const newArray = [...(data[field] as any[])];
    newArray.splice(index, 1);
    updateField(field, newArray);
  };

  const updateStringArrayItem = (field: 'skills' | 'languages', index: number, value: string) => {
    const newArray = [...data[field]];
    newArray[index] = value;
    updateField(field, newArray);
  };

  return (
    <div
      className="bg-white text-black p-6 @xl:p-8 mx-auto shadow-lg print:shadow-none print:p-0 font-sans w-full max-w-[210mm] @container"
      style={{ minHeight: '297mm', direction: dir }}
    >
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-4 mb-6 relative group">
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
          className="text-lg @xl:text-xl text-gray-600 font-medium mb-3 block"
          placeholder={isAr ? 'المسمى الوظيفي' : 'Job Title'}
        />
        <div className="flex flex-wrap gap-3 @xl:gap-4 text-sm text-gray-600">
          <EditableText value={data.email} onChange={(val) => updateField('email', val)} placeholder="Email" />
          <EditableText value={data.phone} onChange={(val) => updateField('phone', val)} placeholder="Phone" />
          <EditableText value={data.location} onChange={(val) => updateField('location', val)} placeholder="Location" />
          <EditableText value={data.linkedin} onChange={(val) => updateField('linkedin', val)} placeholder="LinkedIn" />
        </div>
      </header>

      {/* Summary */}
      {!isHidden('summary') && (
        <section className="mb-6 relative group">
          <button
            onClick={() => hideSection('summary')}
            className="absolute -right-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-1 hover:bg-red-50 rounded"
            title={isAr ? 'حذف القسم' : 'Delete Section'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <EditableText
            as="h3"
            value={getTitle('summary')}
            onChange={(val) => updateTitle('summary', val)}
            className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3 block"
          />
          <EditableText
            as="p"
            multiline
            value={data.summary}
            onChange={(val) => updateField('summary', val)}
            className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap block"
            placeholder={isAr ? 'أضف ملخصك المهني هنا...' : 'Add your professional summary here...'}
          />
        </section>
      )}

      {/* Experience */}
      {!isHidden('experience') && (
        <section className="mb-6 relative group">
          <button
            onClick={() => hideSection('experience')}
            className="absolute -right-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-1 hover:bg-red-50 rounded"
            title={isAr ? 'حذف القسم' : 'Delete Section'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <EditableText
            as="h3"
            value={getTitle('experience')}
            onChange={(val) => updateTitle('experience', val)}
            className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3 block"
          />
          <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              <button
                onClick={() => deleteArrayItem('experience', idx)}
                className="absolute -right-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-1 hover:bg-red-50 rounded"
                title={isAr ? 'حذف' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex flex-col @sm:flex-row @sm:justify-between @sm:items-baseline mb-1 gap-1 @sm:gap-0">
                <EditableText
                  as="h4"
                  value={exp.title}
                  onChange={(val) => updateArrayItem('experience', idx, 'title', val)}
                  className="text-md font-bold text-gray-900 block"
                  placeholder="Job Title"
                />
                <div className="text-sm text-gray-600 font-medium flex gap-1">
                  <EditableText value={exp.startDate} onChange={(val) => updateArrayItem('experience', idx, 'startDate', val)} placeholder="Start" />
                  <span>-</span>
                  <EditableText value={exp.endDate} onChange={(val) => updateArrayItem('experience', idx, 'endDate', val)} placeholder="End" />
                </div>
              </div>
              <EditableText
                as="div"
                value={exp.company}
                onChange={(val) => updateArrayItem('experience', idx, 'company', val)}
                className="text-sm font-medium text-gray-700 mb-2 block"
                placeholder="Company Name"
              />
              <EditableText
                as="div"
                multiline
                value={exp.description}
                onChange={(val) => updateArrayItem('experience', idx, 'description', val)}
                className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed block"
                placeholder="Description"
              />
            </div>
          ))}
        </div>
        </section>
      )}

      {/* Education */}
      {!isHidden('education') && (
        <section className="mb-6 relative group">
          <button
            onClick={() => hideSection('education')}
            className="absolute -right-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-1 hover:bg-red-50 rounded"
            title={isAr ? 'حذف القسم' : 'Delete Section'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <EditableText
            as="h3"
            value={getTitle('education')}
            onChange={(val) => updateTitle('education', val)}
            className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3 block"
          />
          <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={edu.id} className="flex flex-col @sm:flex-row @sm:justify-between @sm:items-baseline relative group gap-1 @sm:gap-0">
              <button
                onClick={() => deleteArrayItem('education', idx)}
                className="absolute -right-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-1 hover:bg-red-50 rounded"
                title={isAr ? 'حذف' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <EditableText
                  as="h4"
                  value={edu.degree}
                  onChange={(val) => updateArrayItem('education', idx, 'degree', val)}
                  className="text-md font-bold text-gray-900 block"
                  placeholder="Degree"
                />
                <EditableText
                  as="div"
                  value={edu.institution}
                  onChange={(val) => updateArrayItem('education', idx, 'institution', val)}
                  className="text-sm text-gray-700 block"
                  placeholder="Institution"
                />
              </div>
              <EditableText
                value={edu.year}
                onChange={(val) => updateArrayItem('education', idx, 'year', val)}
                className="text-sm text-gray-600 font-medium"
                placeholder="Year"
              />
            </div>
          ))}
        </div>
        </section>
      )}

      {/* Skills & Languages */}
      <div className="grid grid-cols-1 @xl:grid-cols-2 gap-6">
        {!isHidden('skills') && (
          <section className="relative group">
            <button
              onClick={() => hideSection('skills')}
              className="absolute -right-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-1 hover:bg-red-50 rounded"
              title={isAr ? 'حذف القسم' : 'Delete Section'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <EditableText
              as="h3"
              value={getTitle('skills')}
              onChange={(val) => updateTitle('skills', val)}
              className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3 block"
            />
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {data.skills.map((skill, idx) => (
              <li key={idx} className="relative group">
                <button
                  onClick={() => deleteArrayItem('skills', idx)}
                  className="absolute -right-6 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-0.5 hover:bg-red-50 rounded"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <EditableText
                  value={skill}
                  onChange={(val) => updateStringArrayItem('skills', idx, val)}
                  placeholder="Skill"
                />
              </li>
            ))}
          </ul>
          </section>
        )}

        {!isHidden('languages') && (
          <section className="relative group">
            <button
              onClick={() => hideSection('languages')}
              className="absolute -right-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-1 hover:bg-red-50 rounded"
              title={isAr ? 'حذف القسم' : 'Delete Section'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <EditableText
              as="h3"
              value={getTitle('languages')}
              onChange={(val) => updateTitle('languages', val)}
              className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-1 mb-3 block"
            />
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {data.languages.map((lang, idx) => (
              <li key={idx} className="relative group">
                <button
                  onClick={() => deleteArrayItem('languages', idx)}
                  className="absolute -right-6 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print p-0.5 hover:bg-red-50 rounded"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <EditableText
                  value={lang}
                  onChange={(val) => updateStringArrayItem('languages', idx, val)}
                  placeholder="Language"
                />
              </li>
            ))}
          </ul>
          </section>
        )}
      </div>
    </div>
  );
}
