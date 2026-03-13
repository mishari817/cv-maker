import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Undo2, Redo2 } from 'lucide-react';
import { ResumeData } from '../types';
import { processUserMessage } from '../services/geminiService';

interface Props {
  currentData: ResumeData;
  onUpdateData: (newData: ResumeData) => void;
  language: 'ar' | 'en';
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function ChatAssistant({ currentData, onUpdateData, language, onUndo, onRedo, canUndo, canRedo }: Props) {
  const isAr = language === 'ar';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: isAr 
        ? 'أهلاً بك! أنا مساعدك الذكي لبناء السيرة الذاتية. اكتب لي معلوماتك هنا (خبراتك، تعليمك، مهاراتك) وسأقوم بتحديث سيرتك الذاتية فوراً وبطريقة احترافية متوافقة مع أنظمة ATS.'
        : 'Hello! I am your AI Resume Builder. Type your details here (experience, education, skills) and I will update your resume professionally right away.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await processUserMessage(userMsg, currentData);
      
      // Merge the AI's response with the current data to preserve fields not in the schema
      const mergedData = {
        ...currentData,
        ...result.resumeData,
        sectionTitles: currentData.sectionTitles,
        hiddenSections: currentData.hiddenSections
      };
      
      // Ensure arrays exist
      mergedData.experience = mergedData.experience || [];
      mergedData.education = mergedData.education || [];
      mergedData.skills = mergedData.skills || [];
      mergedData.languages = mergedData.languages || [];
      
      // Add IDs if missing
      mergedData.experience = mergedData.experience.map(e => ({ ...e, id: e.id || Date.now().toString() + Math.random() }));
      mergedData.education = mergedData.education.map(e => ({ ...e, id: e.id || Date.now().toString() + Math.random() }));
      
      onUpdateData(mergedData);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: result.reply }]);
    } catch (error: any) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'ai', 
        text: isAr ? `عذراً، حدث خطأ: ${error.message}` : `Sorry, an error occurred: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h2 className="font-semibold">{isAr ? 'المساعد الذكي' : 'AI Assistant'}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onUndo} 
            disabled={!canUndo} 
            className="p-1.5 hover:bg-indigo-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
            title={isAr ? 'تراجع' : 'Undo'}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo} 
            className="p-1.5 hover:bg-indigo-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
            title={isAr ? 'إعادة' : 'Redo'}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? (isAr ? 'flex-row-reverse' : 'flex-row-reverse') : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
              {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tr-none'}`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tr-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm text-gray-500">{isAr ? 'جاري التحديث...' : 'Updating...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isAr ? 'اكتب معلوماتك هنا...' : 'Type your details here...'}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            dir={isAr ? 'rtl' : 'ltr'}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
