/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  Search, 
  LayoutList, 
  Layers, 
  Brain, 
  MessageSquare, 
  RotateCcw,
  Sparkles,
  FileText
} from 'lucide-react';

type StudyState = 'input' | 'processing' | 'hub' | 'quiz';

import QuizModule from './QuizModule';

export default function StudyPage() {
  const [studyState, setStudyState] = useState<StudyState>('input');
  const [topic, setTopic] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const handleStartProcessing = () => {
    if (!topic && !fileName) return;
    setStudyState('processing');
    // Simulate processing time
    setTimeout(() => {
      setStudyState('hub');
    }, 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          setFileContent(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    setStudyState('input');
    setTopic('');
    setFileName(null);
    setFileContent('');
  };

  const inputId = fileContent || topic || '';

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {studyState === 'quiz' && (
          <motion.div key="quiz">
            <QuizModule 
              inputData={inputId} 
              onExit={() => setStudyState('hub')} 
            />
          </motion.div>
        )}

        {studyState === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-display font-bold text-space-deep">Universal Intelligence</h2>
              <p className="text-sm text-gray-500">Upload your data or choose a cosmic topic to begin.</p>
            </div>

            {/* Upload Area */}
            <div className="relative">
              <input
                type="file"
                id="study-upload"
                className="hidden"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="study-upload"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                  fileName ? 'border-cosmic-blue bg-cosmic-blue/5' : 'border-gray-200 hover:border-cosmic-blue hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  {fileName ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-cosmic-blue/20 flex items-center justify-center mb-4">
                        <FileText size={32} className="text-cosmic-blue" />
                      </div>
                      <p className="text-sm font-bold text-space-deep truncate max-w-full italic">{fileName}</p>
                      <p className="text-xs text-gray-400 mt-1">File ready for analysis</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={48} className="text-cosmic-blue/60 mb-4" />
                      <p className="text-sm font-bold text-space-deep">Upload Study Material</p>
                      <p className="text-xs text-gray-400 mt-2">Support for PDF and Text files</p>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">OR SEARCH TOPIC</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Search / Topic Bar */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-cosmic-blue transition-colors" />
                </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter topic (e.g. Pythagoras Theorem)..."
                  className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cosmic-blue/10 focus:border-cosmic-blue transition-all font-medium text-space-deep"
                />
              </div>

              <button
                onClick={handleStartProcessing}
                disabled={!topic && !fileName}
                className="w-full py-4 bg-cosmic-yellow text-space-deep font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-cosmic-yellow/20 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
              >
                <Sparkles size={20} className="group-hover:animate-pulse" />
                Generate Study Plan
              </button>
            </div>
          </motion.div>
        )}

        {studyState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-cosmic-blue/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-dashed border-cosmic-yellow/40 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles size={48} className="text-cosmic-yellow" />
              </motion.div>
            </div>
            <h3 className="text-xl font-display font-bold text-space-deep animate-pulse">Building your Cosmic Curriculum...</h3>
            <p className="text-sm text-gray-400 mt-2 font-medium">Scanning information through the planetary networks</p>
          </motion.div>
        )}

        {studyState === 'hub' && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-space-deep">Learning Hub</h2>
                <p className="text-sm text-gray-500">Navigation ready for {topic || 'uploaded material'}</p>
              </div>
              <button
                onClick={handleReset}
                className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-space-deep transition-all active:rotate-90"
                title="Reset Study Session"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TacticalButton
                label="Quiz"
                description="Test your cosmic knowledge"
                icon={LayoutList}
                delay={0.1}
                onClick={() => setStudyState('quiz')}
              />
              <TacticalButton
                label="FlashCards"
                description="Master binary concepts"
                icon={Layers}
                delay={0.2}
              />
              <TacticalButton
                label="Memorize"
                description="Active recall protocol"
                icon={Brain}
                delay={0.3}
              />
              <TacticalButton
                label="AI Instructor"
                description="Chat with Study AI"
                icon={MessageSquare}
                delay={0.4}
              />
            </div>

            {/* Progress Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mastery Level</span>
                <span className="text-sm font-bold text-cosmic-blue">0% Complete</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  className="h-full bg-cosmic-blue"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TacticalButton({ label, description, icon: Icon, delay, onClick }: any) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="group relative flex flex-col items-start p-6 bg-white border border-gray-100 rounded-3xl text-left transition-all hover:border-cosmic-yellow hover:shadow-xl hover:shadow-cosmic-yellow/10"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-cosmic-yellow group-hover:text-space-deep transition-colors text-cosmic-blue">
        <Icon size={24} />
      </div>
      <h3 className="font-display font-bold text-space-deep text-lg">{label}</h3>
      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
      
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-4 h-4 border-t-2 border-r-2 border-cosmic-yellow rounded-tr-lg" />
      </div>
    </motion.button>
  );
}
