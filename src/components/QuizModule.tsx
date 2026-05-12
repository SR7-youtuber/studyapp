/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Timer, 
  AlertTriangle,
  RotateCcw,
  Trophy,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { generateQuestionsFromAIService } from '../services/geminiService';

type QuizState = 'ANALYZING' | 'OVERLOAD_WARNING' | 'QUIZ_ACTIVE' | 'RESULTS';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizModuleProps {
  inputData: string;
  onExit: () => void;
}

export default function QuizModule({ inputData, onExit }: QuizModuleProps) {
  const [state, setState] = useState<QuizState>('ANALYZING');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Derived broadness check
  const isBroad = useMemo(() => {
    const broadTopics = ['biology', 'physics', 'math', 'history', 'science', 'chemistry'];
    return broadTopics.includes(inputData.toLowerCase().trim()) || inputData.length > 2000;
  }, [inputData]);

  // Simulation of question generation and broadness check
  useEffect(() => {
    let isMounted = true;

    const startAnalysis = async () => {
      if (state !== 'ANALYZING') return;

      // Start progress animation
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => (prev < 90 ? prev + 2 : prev));
      }, 100);

      try {
        if (isBroad) {
          clearInterval(progressInterval);
          setAnalysisProgress(100);
          if (isMounted) setState('OVERLOAD_WARNING');
          return;
        }

        // Call Gemini AI
        const generated = await generateQuestionsFromAIService(inputData);
        
        if (isMounted) {
          setQuestions(generated.map((q: any, i: number) => ({ ...q, id: i })));
          setAnalysisProgress(100);
          clearInterval(progressInterval);
          
          // Small delay for smooth transition
          setTimeout(() => {
            if (isMounted) setState('QUIZ_ACTIVE');
          }, 500);
        }
      } catch (error) {
        console.error("AI Generation failed, falling back to local logic:", error);
        generateQuestionsFromText(inputData);
        setAnalysisProgress(100);
        clearInterval(progressInterval);
        if (isMounted) setState('QUIZ_ACTIVE');
      }
    };

    startAnalysis();

    return () => {
      isMounted = false;
    };
  }, [state, isBroad, inputData]);

  // Timer logic
  useEffect(() => {
    if (state === 'QUIZ_ACTIVE') {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state]);

  const generateQuestionsFromText = (text: string) => {
    // Basic "NLP" splitting and sanitization
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const wordsPool = text.toLowerCase().match(/\b(\w{5,})\b/g) || [];
    const significantWords = Array.from(new Set(wordsPool)).filter(w => 
      !['always', 'should', 'would', 'could', 'their', 'there', 'those', 'where'].includes(w)
    );
    
    const generated: Question[] = [];
    
    // Determine step size to cover the whole document spread
    const targetCount = 15;
    const step = Math.max(1, Math.floor(sentences.length / targetCount));
    
    for (let i = 0; i < sentences.length && generated.length < targetCount; i += step) {
      const sentence = sentences[i].trim();
      if (sentence.length < 20) continue;

      // Type 1: Definition Pattern (Term is/are X)
      const defMatch = sentence.match(/^([A-Z][a-zA-Z\s]+)\s+(is|are)\s+(.+)$/i);
      if (defMatch) {
        const term = defMatch[1].trim();
        const definition = defMatch[3].split(/[.!?]/)[0].trim();
        
        // Find other definitions or significant phrases for distractors
        const distractors = sentences
          .filter((_, idx) => idx !== i)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(s => s.trim().split(' ').slice(0, 10).join(' ') + '...');

        const options = shuffleArray([definition, ...distractors]);
        generated.push({
          id: generated.length,
          question: `According to the source material, what is the best definition for "${term}"?`,
          options,
          correctAnswer: options.indexOf(definition)
        });
      } else {
        // Type 2: Cloze Deletion (Fill in the blank)
        const words = sentence.split(' ');
        // Find a word in the sentence that is in our significantWords pool
        const targetIdx = words.findIndex(w => significantWords.includes(w.toLowerCase().replace(/[.,!?]/g, '')));
        
        if (targetIdx !== -1) {
          const word = words[targetIdx].replace(/[.,!?]/g, '');
          const clozed = words.map((w, idx) => idx === targetIdx ? '______' : w).join(' ');
          
          // Generate distractors from the significantWords pool
          const distractors = significantWords
            .filter(w => w !== word.toLowerCase())
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1));

          const options = shuffleArray([word, ...distractors]);
          generated.push({
            id: generated.length,
            question: `Complete the following statement based on the text:\n\n"${clozed}"`,
            options,
            correctAnswer: options.indexOf(word)
          });
        }
      }
    }

    // Fallback if the text was too thin for real parsing
    if (generated.length < 5) {
       const academicTopics = ["Principles", "Concepts", "Function", "Theory", "Application"];
       while(generated.length < 10) {
          const aspect = academicTopics[generated.length % academicTopics.length];
          const options = shuffleArray([
            `It represents the primary ${aspect.toLowerCase()} of the subject.`,
            `It is an secondary ${aspect.toLowerCase()} mentioned in the text.`,
            `It contradicts the initial ${aspect.toLowerCase()} provided.`,
            `It is unrelated to the core ${aspect.toLowerCase()}.`
          ]);
          generated.push({
            id: generated.length,
            question: `In the context of ${inputData.slice(0, 30)}, what is noted about its ${aspect}?`,
            options,
            correctAnswer: options.indexOf(`It represents the primary ${aspect.toLowerCase()} of the subject.`)
          });
       }
    }

    setQuestions(shuffleArray(generated));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const generateQuestions = async () => {
    setState('ANALYZING');
    setAnalysisProgress(0);
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setState('RESULTS');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full relative min-h-[400px]">
      <AnimatePresence mode="wait">
        {state === 'ANALYZING' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative w-20 h-20 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-cosmic-blue/30 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center text-cosmic-yellow"
              >
                <Sparkles size={32} />
              </motion.div>
            </div>
            <div className="w-full max-w-xs bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-cosmic-blue"
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
              />
            </div>
            <p className="text-sm font-bold text-space-deep uppercase tracking-widest">
              Analyzing Cosmic Data: {analysisProgress}% Complete
            </p>
          </motion.div>
        )}

        {state === 'OVERLOAD_WARNING' && (
          <motion.div
            key="overload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[110] flex items-center justify-center px-6"
          >
            <div className="absolute inset-0 bg-space-deep/60 backdrop-blur-md" />
            <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white/50 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-xl font-display font-bold text-space-deep mb-4 leading-tight">
                Material Volume Exceeds Optimal Learning Threshold
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                The content provided is too vast for a single session. To ensure maximum retention, would you like to segment this data?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    generateQuestions();
                    setState('QUIZ_ACTIVE');
                  }}
                  className="w-full py-4 bg-cosmic-yellow text-space-deep font-bold rounded-2xl shadow-lg shadow-cosmic-yellow/20 hover:brightness-105 transition-all"
                >
                  Segment into Study Sessions
                </button>
                <button
                  onClick={onExit}
                  className="w-full py-4 bg-transparent border border-gray-200 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                >
                  Cancel and Return to Hub
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {state === 'QUIZ_ACTIVE' && questions.length > 0 && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Quiz Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex gap-1 mt-2">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full flex-1 transition-all ${
                        i === currentQuestionIndex ? 'bg-cosmic-blue w-6' : 
                        i < currentQuestionIndex ? 'bg-cosmic-blue/30' : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                <Timer size={14} className="text-cosmic-blue" />
                <span className="text-xs font-mono font-bold text-space-deep">
                  {formatTime(timer)}
                </span>
              </div>
            </div>

            {/* Question */}
            <div className="min-h-[100px]">
              <h3 className="text-xl font-display font-medium text-space-deep leading-relaxed">
                {questions[currentQuestionIndex].question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestionIndex].options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
                const showFeedback = selectedAnswer !== null;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`
                      w-full p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between group
                      ${!showFeedback ? 'border-gray-100 hover:border-cosmic-blue hover:bg-cosmic-blue/5' : 
                        isSelected ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') :
                        isCorrect ? 'border-green-500/30 bg-green-50/20' : 'border-gray-50 opacity-50'}
                      ${isSelected && !showFeedback ? 'bg-cosmic-yellow/10 border-cosmic-yellow' : ''}
                    `}
                  >
                    <span className={`font-medium ${isSelected ? 'text-space-deep' : 'text-gray-600'}`}>
                      {option}
                    </span>
                    {showFeedback && isCorrect && <CheckCircle2 size={18} className="text-green-500 shrink-0" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle size={18} className="text-red-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="px-8 py-4 bg-cosmic-blue text-white font-bold rounded-2xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cosmic-blue/20"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {state === 'RESULTS' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-24 h-24 bg-cosmic-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={48} className="text-cosmic-yellow" />
            </div>
            <h2 className="text-3xl font-display font-bold text-space-deep mb-2">Quiz Concluded</h2>
            <p className="text-gray-500 mb-8">Mission success! Your cognitive sync is rising.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 bg-gray-50 rounded-3xl">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Score Accuracy</span>
                <span className="text-2xl font-display font-bold text-space-deep">
                  {Math.round((score / questions.length) * 100)}%
                </span>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Time</span>
                <span className="text-2xl font-display font-bold text-space-deep">{formatTime(timer)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onExit}
                className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Return to Hub
              </button>
              <button
                onClick={() => {
                  setScore(0);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setTimer(0);
                  setState('QUIZ_ACTIVE');
                }}
                className="flex-1 py-4 bg-cosmic-yellow text-space-deep font-bold rounded-2xl hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cosmic-yellow/20"
              >
                Try Again
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
