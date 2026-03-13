export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  coverLetterBody?: string;
  sectionTitles?: {
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
    languages?: string;
  };
  hiddenSections?: string[];
}
