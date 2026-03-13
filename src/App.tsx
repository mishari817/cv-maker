import React, { useState, useRef } from 'react';
import { initialData } from './data';
import { ResumeData } from './types';
import ResumePreview from './components/ResumePreview';
import CoverLetterPreview from './components/CoverLetterPreview';
import ChatAssistant from './components/ChatAssistant';
import { FileText, Mail, Printer, Languages, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function App() {
  const [history, setHistory] = useState<ResumeData[]>([initialData]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>('resume');
  const [isDownloading, setIsDownloading] = useState(false);

  const resumeRef = useRef<HTMLDivElement>(null);
  const coverLetterRef = useRef<HTMLDivElement>(null);

  const data = history[currentIndex];

  const handleUpdateData = (newData: ResumeData) => {
    const newHistory = history.slice(0, currentIndex + 1);
    setHistory([...newHistory, newData]);
    setCurrentIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleDownloadPDFs = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const generatePDF = async (element: HTMLElement, filename: string) => {
        // Wait a bit for any pending renders and fonts
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Temporarily add a class to hide interactive elements
        element.classList.add('pdf-exporting');
        
        try {
          // Use html-to-image which handles RTL and Arabic shaping much better than html2canvas
          const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            style: {
              transform: 'scale(1)',
              direction: language === 'ar' ? 'rtl' : 'ltr'
            }
          });
          
          element.classList.remove('pdf-exporting');
          
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          
          // Create a temporary image to get dimensions
          const img = new Image();
          img.src = dataUrl;
          await new Promise((resolve) => (img.onload = resolve));
          
          const pdfHeight = (img.height * pdfWidth) / img.width;
          
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(filename);
        } catch (err) {
          element.classList.remove('pdf-exporting');
          throw err;
        }
      };

      if (resumeRef.current) {
        await generatePDF(resumeRef.current, `${data.fullName || 'Resume'}_Resume.pdf`);
      }
      
      if (coverLetterRef.current) {
        await generatePDF(coverLetterRef.current, `${data.fullName || 'Cover_Letter'}_CoverLetter.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDFs:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء تحميل الملفات. يرجى المحاولة مرة أخرى.' : 'An error occurred while downloading files. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Navigation - Hidden when printing */}
      <nav className="no-print bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-xl font-bold text-gray-800">
                {isAr ? 'منشئ السيرة الذاتية ATS' : 'ATS Resume Builder'}
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setActiveTab('resume')}
                className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'resume' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden xs:inline">{isAr ? 'السيرة' : 'Resume'}</span>
              </button>
              <button
                onClick={() => setActiveTab('coverLetter')}
                className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'coverLetter' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="hidden xs:inline">{isAr ? 'الخطاب' : 'Cover Letter'}</span>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1 sm:mx-2"></div>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <Languages className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'English' : 'العربية'}</span>
              </button>
              <button
                onClick={handleDownloadPDFs}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-sm"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span className="hidden xs:inline">
                  {isDownloading 
                    ? (isAr ? 'جاري...' : 'Downloading...') 
                    : (isAr ? 'تحميل' : 'Download')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chat Assistant - Hidden on print */}
          <div className="w-full lg:w-[400px] shrink-0 no-print">
            <ChatAssistant 
              currentData={data} 
              onUpdateData={handleUpdateData} 
              language={language}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={currentIndex > 0}
              canRedo={currentIndex < history.length - 1}
            />
          </div>

          {/* Preview Area */}
          <div className="flex-1 print:w-full flex justify-center overflow-x-hidden pb-8">
            <div className="print-only w-full max-w-[210mm] origin-top transition-transform duration-300 sm:scale-100 scale-[0.45] xs:scale-[0.6] md:scale-[0.85] lg:scale-100">
              {activeTab === 'resume' ? (
                <ResumePreview data={data} language={language} onUpdate={handleUpdateData} />
              ) : (
                <CoverLetterPreview data={data} language={language} onUpdate={handleUpdateData} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Hidden container for PDF generation */}
      <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none opacity-0 z-[-1]" dir={isAr ? 'rtl' : 'ltr'}>
        <div ref={resumeRef} className="w-[210mm] bg-white font-sans">
          <ResumePreview data={data} language={language} onUpdate={handleUpdateData} />
        </div>
        <div ref={coverLetterRef} className="w-[210mm] bg-white font-sans">
          <CoverLetterPreview data={data} language={language} onUpdate={handleUpdateData} />
        </div>
      </div>
    </div>
  );
}
