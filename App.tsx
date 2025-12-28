import React, { useState, useEffect } from 'react';
import { AppStep, UserAnswers, CompatibilityResult } from './types';
import { QUESTIONS } from './constants';
import { analyzeCompatibility } from './services/geminiService';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Icon } from './components/Icon';
import { QuizView } from './views/QuizView';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [answersA, setAnswersA] = useState<UserAnswers | null>(null);
  const [answersB, setAnswersB] = useState<UserAnswers | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [discordCopySuccess, setDiscordCopySuccess] = useState(false);
  const [isBlobUrl, setIsBlobUrl] = useState(false);

  // API Key State
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('loveship_api_key') || '';
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(() => {
    return !localStorage.getItem('loveship_api_key');
  });

  // Parse URL on mount to check for incoming "Ship" requests
  useEffect(() => {
    if (window.location.protocol === 'blob:') {
      setIsBlobUrl(true);
    }

    const hash = window.location.hash;
    
    // Check for shared RESULTS
    if (hash.includes('share=')) {
      try {
        const params = new URLSearchParams(hash.substring(1));
        const encodedShare = params.get('share');
        if (encodedShare) {
          const decodedResult = JSON.parse(atob(encodedShare));
          if (decodedResult && decodedResult.score !== undefined) {
             setResult(decodedResult);
             setStep(AppStep.RESULTS);
             return; // Stop processing other hashes
          }
        }
      } catch (e) {
        console.error("Failed to parse share data", e);
      }
    }

    // Check for incoming SHIP invites
    if (hash.includes('data=')) {
      try {
        const params = new URLSearchParams(hash.substring(1)); // remove #
        const encodedData = params.get('data');
        if (encodedData) {
          const decoded = JSON.parse(atob(encodedData));
          if (decoded && Object.keys(decoded).length === QUESTIONS.length) {
            setAnswersA(decoded);
            setStep(AppStep.WELCOME_B);
          }
        }
      } catch (e) {
        console.error("Failed to parse incoming ship data", e);
        setStep(AppStep.WELCOME);
      }
    }
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('loveship_api_key', key);
    setCustomApiKey(key);
    setIsKeyModalOpen(false);
  };

  const handleStartQuizA = () => setStep(AppStep.QUIZ_A);

  const handleCompleteQuizA = (answers: UserAnswers) => {
    setAnswersA(answers);
    setStep(AppStep.SHARE_LINK);
  };

  const handleStartQuizB = () => setStep(AppStep.QUIZ_B);

  const handleCompleteQuizB = async (answers: UserAnswers) => {
    setAnswersB(answers);
    setStep(AppStep.ANALYZING);
    
    try {
      if (!answersA) throw new Error("Partner answers missing");
      const analysis = await analyzeCompatibility(answersA, answers, customApiKey);
      setResult(analysis);
      setStep(AppStep.RESULTS);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
      setStep(AppStep.ERROR);
    }
  };

  const getBaseUrl = () => {
    let baseUrl = window.location.href.split('#')[0];
    if (window.location.pathname.startsWith('http')) {
       baseUrl = window.location.pathname;
    }
    const lastHttps = baseUrl.lastIndexOf('https://');
    if (lastHttps > 0) {
      baseUrl = baseUrl.substring(lastHttps);
    }
    return baseUrl;
  };

  const getShareLink = () => {
    if (!answersA) return '';
    const encoded = btoa(JSON.stringify(answersA));
    return `${getBaseUrl()}#data=${encoded}`;
  };

  const getResultLink = () => {
    if (!result) return '';
    const encoded = btoa(JSON.stringify(result));
    return `${getBaseUrl()}#share=${encoded}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareLink());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCopyResultLink = () => {
    navigator.clipboard.writeText(getResultLink());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCopyDiscord = () => {
    if (!result) return;
    
    // Create a visual bar using block characters
    const filled = Math.round(result.score / 10);
    const empty = 10 - filled;
    const bar = '▓'.repeat(filled) + '░'.repeat(empty);

    const text = `>>> # 💘 LoveShip Compatibility Report
**Score:** \`${result.score}%\` ${result.score > 80 ? '🔥' : result.score > 50 ? '✨' : '💀'}
\`[${bar}]\`

*"${result.forecast}"*

**✨ Strengths**
${result.strengths.map(s => `• ${s}`).join('\n')}

**🔧 Challenges**
${result.challenges.map(c => `• ${c}`).join('\n')}

👀 **View Full Report:**
${getResultLink()}`;
    
    navigator.clipboard.writeText(text);
    setDiscordCopySuccess(true);
    setTimeout(() => setDiscordCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-md shadow-2xl relative">
            {customApiKey && (
               <button 
                 onClick={() => setIsKeyModalOpen(false)}
                 className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
               >
                 <Icon name="check" className="w-5 h-5 rotate-45" /> {/* Close X-ish */}
               </button>
            )}

            <div className="flex items-center gap-2 mb-4">
               <Icon name="key" className="w-6 h-6 text-rose-500" />
               <h2 className="text-xl font-bold text-slate-800">Setup API Key</h2>
            </div>
            
            <p className="text-slate-600 text-sm mb-6">
              To use LoveShip without limits, please provide your own Google Gemini API Key. 
              It is stored locally on your device.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSaveKey(formData.get('apiKey') as string);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Gemini API Key
                </label>
                <input 
                  name="apiKey"
                  defaultValue={customApiKey}
                  type="password"
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono text-sm"
                  autoFocus
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                {customApiKey && (
                  <button
                    type="button"
                    onClick={() => handleSaveKey('')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-1"
                  >
                    <Icon name="trash" className="w-4 h-4" /> Clear
                  </button>
                )}
                <Button type="submit" className="flex-1" icon="check">
                  Save Key
                </Button>
              </div>
            </form>
            
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-rose-500 hover:text-rose-600 underline"
              >
                Get a free Gemini API key here
              </a>
            </div>
          </Card>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float -z-10" style={{ animationDelay: '2s' }}></div>

      <header className="mb-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-white/50 backdrop-blur rounded-2xl shadow-sm mb-4 cursor-pointer" onClick={() => setStep(AppStep.WELCOME)}>
          <Icon name="heart" className="w-8 h-8 text-rose-500 mr-2" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600">
            LoveShip
          </h1>
        </div>
        <p className="text-slate-600 font-medium">AI-Powered Compatibility Calculator</p>
        
        <button 
          onClick={() => setIsKeyModalOpen(true)}
          className="mt-4 text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center justify-center gap-1 mx-auto transition-colors"
        >
          <Icon name="key" className="w-3 h-3" />
          {customApiKey ? 'Configure Key' : 'Set API Key'}
        </button>
      </header>

      <main className="w-full max-w-2xl z-10">
        
        {step === AppStep.WELCOME && (
          <Card className="text-center space-y-6">
            <div className="py-6">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Are you compatible?</h2>
              <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                Take the 10-question psychological survey, invite your partner, and let our AI predict your romantic future.
              </p>
              <Button onClick={handleStartQuizA} icon="arrow-right" className="text-lg px-8 py-4">
                Start New Ship
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-8">
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="text-2xl mb-2 block">🧠</span>
                <h3 className="font-bold text-sm text-slate-800">Psychology Based</h3>
                <p className="text-xs text-slate-500">Analysis based on real relationship traits.</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="text-2xl mb-2 block">🤖</span>
                <h3 className="font-bold text-sm text-slate-800">AI Powered</h3>
                <p className="text-xs text-slate-500">Deep insights powered by Gemini.</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="text-2xl mb-2 block">🔒</span>
                <h3 className="font-bold text-sm text-slate-800">Private</h3>
                <p className="text-xs text-slate-500">No login required. Data stays in the URL.</p>
              </div>
            </div>
          </Card>
        )}

        {step === AppStep.QUIZ_A && (
          <QuizView userLabel="You (User A)" onComplete={handleCompleteQuizA} />
        )}

        {step === AppStep.SHARE_LINK && (
          <Card className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="check" className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your part is done!</h2>
            <p className="text-slate-600">
              Share this unique link with your partner. Once they finish, the AI will reveal your compatibility.
            </p>

            {isBlobUrl && (
              <div className="bg-amber-100 border border-amber-200 text-amber-900 p-4 rounded-xl text-left text-sm mb-4">
                <div className="flex items-start gap-2">
                  <Icon name="alert" className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong>Preview Mode Detected:</strong> You seem to be running this app in a preview environment (Blob URL). 
                    The link generated below might not work for others. 
                    <br /><br />
                    Please open this app in a <strong>new browser tab</strong> or deploy it to get a shareable public link.
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-between gap-3 mt-4 border border-slate-200">
              <code className="text-sm text-slate-600 truncate flex-1 text-left select-all">
                {getShareLink()}
              </code>
              <Button 
                variant="secondary" 
                onClick={handleCopyLink} 
                icon={copySuccess ? "check" : "copy"}
                className="shrink-0"
              >
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
            </div>
            
            <p className="text-xs text-slate-500 mt-4">
              Tip: You can act as your partner by opening this link in an Incognito window to test it yourself!
            </p>
          </Card>
        )}

        {step === AppStep.WELCOME_B && (
          <Card className="text-center space-y-6">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Icon name="heart" className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">You've been invited!</h2>
            <p className="text-slate-600 text-lg">
              Your partner has already answered their questions. Now it's your turn to see if you're a match.
            </p>
            <div className="pt-4">
               <Button onClick={handleStartQuizB} icon="arrow-right" className="w-full md:w-auto">
                Accept Challenge
              </Button>
            </div>
          </Card>
        )}

        {step === AppStep.QUIZ_B && (
          <QuizView userLabel="You (User B)" onComplete={handleCompleteQuizB} />
        )}

        {step === AppStep.ANALYZING && (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-rose-500 rounded-full animate-ping opacity-20 absolute top-0 left-0"></div>
                <Icon name="sparkles" className="w-16 h-16 text-rose-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Compatibility...</h2>
            <p className="text-slate-500">Consulting the digital stars & psychology models.</p>
          </Card>
        )}

        {step === AppStep.RESULTS && result && (
          <div className="space-y-6 animate-fade-in">
            {/* Score Card */}
            <Card className="text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-purple-500"></div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Compatibility Score</h3>
               <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-600 to-purple-600 mb-4">
                 {result.score}%
               </div>
               <p className="text-xl font-medium text-slate-700 italic">"{result.forecast}"</p>
            </Card>

            {/* Summary */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📋</span> The Verdict
              </h3>
              <p className="text-slate-600 leading-relaxed">{result.summary}</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="bg-green-50/50 border-green-100">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">✨</span> Strengths
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-green-900 text-sm">
                       <Icon name="check" className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                       {s}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Challenges */}
              <Card className="bg-orange-50/50 border-orange-100">
                <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                   <span className="text-xl">🔧</span> To Work On
                </h3>
                <ul className="space-y-3">
                  {result.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-orange-900 text-sm">
                       <Icon name="alert" className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                       {c}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Sharing Options */}
            <Card className="bg-indigo-50 border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-4">Share Results</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleCopyResultLink}
                  icon={copySuccess ? "check" : "share"}
                  className="flex-1"
                >
                  {copySuccess ? "Link Copied!" : "Copy Result Link"}
                </Button>
                <Button 
                  onClick={handleCopyDiscord}
                  variant="secondary"
                  icon={discordCopySuccess ? "check" : "discord"}
                  className="flex-1"
                >
                   {discordCopySuccess ? "Copied for Discord!" : "Copy Discord Embed"}
                </Button>
              </div>
            </Card>

            <div className="text-center pt-8">
              <Button variant="outline" onClick={() => window.location.href = window.location.pathname}>
                Start Over
              </Button>
            </div>
          </div>
        )}

        {step === AppStep.ERROR && (
          <Card className="text-center border-red-200 bg-red-50">
             <Icon name="alert" className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-red-800 mb-2">Oh no!</h2>
             <p className="text-red-600 mb-6">{error || "An unknown error occurred."}</p>
             <div className="flex gap-2 justify-center">
               <Button onClick={() => setIsKeyModalOpen(true)} variant="outline">Check API Key</Button>
               <Button onClick={() => window.location.reload()}>Try Again</Button>
             </div>
          </Card>
        )}
      </main>
      
      <footer className="mt-12 text-slate-400 text-sm font-medium">
        LoveShip &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
