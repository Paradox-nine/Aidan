import React, { useState, useRef, useEffect } from 'react';
import { generateCeitAiResponse } from '../lib/ragService';
import Header from './Header';
import {
  Bot,
  User,
  Send,
  FileText,
  ExternalLink,
  Sparkles,
  BookOpen,
  Layers,
  Search,
  Database,
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';

export default function CeitAiAssistant({ onNavigate, currentPath }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Hello! I am CEIT AI, your student assistant. Ask me anything about College of Engineering and Information Technology (CEIT) admission requirements, grading policies, capstone projects, or internships based on official PDFs.",
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState(null);
  const chatEndRef = useRef(null);

  const samplePrompts = [
    'What are the CEIT admission requirements?',
    'Explain the CEIT grading system and attendance policy',
    'What are the capstone project requirements?',
    'How many internship hours are required?'
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryToSend) => {
    const query = queryToSend || inputQuery.trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    setActivePipelineStep('Extracting PDF text chunks & running pgvector cosine similarity search...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setActivePipelineStep('Retrieving top matched relevant chunks...');

      await new Promise((resolve) => setTimeout(resolve, 400));
      setActivePipelineStep('Synthesizing answer with LLM using retrieved context...');

      const result = await generateCeitAiResponse(query);

      const aiMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: result.answer,
        sources: result.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          sender: 'ai',
          text: 'I encountered an error retrieving official CEIT details. Please check your internet connection or try asking again.',
          sources: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
      setActivePipelineStep(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <Header onNavigate={onNavigate} currentPath={currentPath} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Banner Section with Tech/Coding Accents */}
        <section className="bg-slate-900 border border-blue-600/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-blue-500 pointer-events-none">
            <Cpu className="w-64 h-64" />
          </div>

          <div className="relative z-10 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/40 font-mono text-xs sm:text-sm px-3 py-1 rounded-full">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>RAG System v2.0 // pgvector</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              CEIT AI Student Assistant
            </h2>
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl font-normal leading-relaxed">
              Instant, verifiable answers generated directly from Official CEIT PDFs stored in Supabase & pgvector.
            </p>
          </div>
        </section>

        {/* Visual RAG Pipeline Flow Indicator */}
        <section className="bg-slate-900/80 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 shadow-md overflow-x-auto">
          <h3 className="text-xs font-mono font-bold uppercase text-blue-400 tracking-wider mb-2.5 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Pipeline Flow:
          </h3>
          <div className="flex items-center gap-2 min-w-[650px] text-xs font-mono text-slate-300">
            <div className="bg-slate-800/80 p-2 sm:p-2.5 rounded-lg border border-slate-700 flex items-center gap-2 flex-1">
              <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>1. Official PDFs</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <div className="bg-slate-800/80 p-2 sm:p-2.5 rounded-lg border border-slate-700 flex items-center gap-2 flex-1">
              <Layers className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>2. Chunking</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <div className="bg-slate-800/80 p-2 sm:p-2.5 rounded-lg border border-slate-700 flex items-center gap-2 flex-1">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>3. 1536d Vectors</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <div className="bg-slate-800/80 p-2 sm:p-2.5 rounded-lg border border-slate-700 flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>4. pgvector</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <div className="bg-blue-600 text-white p-2 sm:p-2.5 rounded-lg border border-blue-500 flex items-center gap-2 flex-1 font-bold">
              <Bot className="w-4 h-4 flex-shrink-0" />
              <span>5. Answer + Sources</span>
            </div>
          </div>
        </section>

        {/* Prompt Suggestions Chips */}
        <section className="space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-400" /> Tap sample queries:
          </p>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-blue-300 font-medium text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-700 hover:border-blue-500 transition cursor-pointer text-left active:scale-95"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </section>

        {/* Responsive Chat Box Window */}
        <section className="bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col h-[480px] sm:h-[580px] overflow-hidden">
          {/* Chat Message Stream */}
          <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-4 max-w-4xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white border border-blue-400'
                      : 'bg-slate-800 text-blue-400 border border-slate-700'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Body */}
                <div
                  className={`p-3.5 sm:p-5 rounded-2xl border space-y-2.5 sm:space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600/20 border-blue-500/40 text-slate-100 rounded-tr-none'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-700/60 pb-1.5 sm:pb-2">
                    <span className="font-mono text-xs text-blue-400 font-bold">
                      {msg.sender === 'user' ? '> User Student' : '> CEIT AI System'}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line text-xs sm:text-base leading-relaxed font-normal">
                    {msg.text}
                  </div>

                  {/* PDF Citation Source Cards */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 sm:pt-3 border-t border-slate-700/60 space-y-2">
                      <p className="text-[11px] sm:text-xs font-mono uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Verified PDF Sources ({msg.sources.length}):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.storageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition text-left group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-xs sm:text-sm text-blue-300 group-hover:underline line-clamp-1">
                                📄 {src.title}
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 flex-shrink-0" />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
                              <span>Page {src.page}</span>
                              <span className="text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 font-bold">
                                {src.similarity}% Match
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pipeline Loading State */}
            {isLoading && (
              <div className="flex gap-3 items-center bg-blue-950/60 p-3.5 sm:p-4 rounded-xl border border-blue-800 text-blue-200 animate-pulse">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <p className="font-mono text-xs sm:text-sm font-bold text-blue-300">{activePipelineStep || 'Executing RAG query...'}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400">pgvector cosine search &amp; LLM context synthesis</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 sm:gap-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask CEIT AI about courses, admission, grades..."
              disabled={isLoading}
              className="flex-1 text-sm sm:text-base font-medium p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-900 text-white placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-blue-500 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
