import React, { useState } from 'react';
import { Question, UserAnswers } from '../types';
import { QUESTIONS } from '../constants';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface QuizViewProps {
  onComplete: (answers: UserAnswers) => void;
  userLabel: string; // "Your" or "Partner's"
}

export const QuizView: React.FC<QuizViewProps> = ({ onComplete, userLabel }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  
  const currentQuestion = QUESTIONS[currentQIndex];
  const progress = ((currentQIndex) / QUESTIONS.length) * 100;

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQIndex < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQIndex(prev => prev + 1), 250);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="w-full bg-rose-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-rose-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card>
        <div className="mb-6">
          <span className="text-xs font-bold tracking-wider text-rose-500 uppercase">
            Question {currentQIndex + 1} of {QUESTIONS.length}
          </span>
          <h2 className="text-2xl font-bold mt-2 text-slate-800">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`
                group relative flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200
                ${answers[currentQuestion.id] === opt.value 
                  ? 'border-rose-500 bg-rose-50' 
                  : 'border-slate-100 hover:border-rose-200 hover:bg-white'}
              `}
            >
              <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-200">
                {opt.emoji}
              </span>
              <span className="font-medium text-slate-700 group-hover:text-rose-700">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </Card>
      
      <p className="text-center text-sm text-slate-500">
        Answering for: <span className="font-semibold text-rose-600">{userLabel}</span>
      </p>
    </div>
  );
};