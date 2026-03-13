import { GoogleGenAI, Type } from '@google/genai';
import { ResumeData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processUserMessage(
  message: string,
  currentData: ResumeData
): Promise<{ reply: string; resumeData: ResumeData }> {
  const prompt = `
    You are an expert ATS resume builder and career consultant.
    The user is providing information to build or update their resume.
    
    Current resume data:
    ${JSON.stringify(currentData)}
    
    User message:
    ${message}
    
    Task:
    1. Update the current resume data with the new information provided by the user.
    2. If the user provides work experience, rewrite the description using the STAR method (Situation, Task, Action, Result) and ATS-friendly keywords. Make it professional.
    3. Provide a friendly conversational reply acknowledging the updates, and ask for any missing information if necessary.
    4. Respond in the same language the user used in their message (Arabic or English).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: {
            type: Type.STRING,
            description: 'A friendly, professional response to the user in their language.',
          },
          resumeData: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              jobTitle: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              summary: { type: Type.STRING },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                },
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    year: { type: Type.STRING },
                  },
                },
              },
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              languages: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              coverLetterBody: { type: Type.STRING },
            },
          },
        },
        required: ['reply', 'resumeData'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from AI');
  
  return JSON.parse(text);
}
