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
  ArrowRight
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

    // Pipeline Step 1: Query -> Supabase Storage & pgvector Vector Search
    setActivePipelineStep('Extracting PDF text chunks & running pgvector cosine similarity search...');

    try {
      // Simulate pipeline progression
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActivePipelineStep('Retrieving top matched relevant chunks...');

      await new Promise((resolve) => setTimeout(resolve, 500));
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Header onNavigate={onNavigate} currentPath={currentPath} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title Banner */}
        <section className="bg-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-yellow-400 space-y-3">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-950 font-black px-4 py-1.5 rounded-full text-base">
            <Sparkles className="w-5 h-5" /> Retrieval-Augmented Generation (RAG)
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            CEIT Official AI Student Assistant
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl font-medium">
            Get instant, verifiable answers generated directly from Official CEIT PDFs stored in Supabase & pgvector.
          </p>
        </section>

        {/* Visual RAG Pipeline Architecture Overview */}
        <section className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-sm overflow-x-auto">
          <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-700" /> Active RAG Pipeline Flow:
          </h3>
          <div className="flex items-center gap-3 min-w-[700px] text-xs font-bold text-slate-800">
            <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 flex items-center gap-2 flex-1">
              <FileText className="w-4 h-4 text-blue-800 flex-shrink-0" />
              <span>1. Official CEIT PDFs</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 flex items-center gap-2 flex-1">
              <Layers className="w-4 h-4 text-emerald-800 flex-shrink-0" />
              <span>2. Text Chunking</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 flex items-center gap-2 flex-1">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>3. 1536d Embeddings</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-purple-700 flex-shrink-0" />
              <span>4. pgvector Search</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="bg-blue-900 text-yellow-300 p-2.5 rounded-xl border border-blue-950 flex items-center gap-2 flex-1">
              <Bot className="w-4 h-4 flex-shrink-0" />
              <span>5. Answer + Sources</span>
            </div>
          </div>
        </section>

        {/* Prompt Suggestions */}
        <section className="space-y-2">
          <p className="text-sm font-black text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-800" /> Click a sample query to ask CEIT AI:
          </p>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="bg-white hover:bg-yellow-100 text-slate-900 font-extrabold text-sm px-4 py-2 rounded-xl border-2 border-slate-300 hover:border-yellow-500 shadow-sm transition cursor-pointer text-left"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </section>

        {/* Chat Window */}
        <section className="bg-white rounded-3xl border-4 border-slate-300 shadow-xl flex flex-col h-[520px] overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-4xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-yellow-400 text-blue-950 border-2 border-yellow-500'
                      : 'bg-blue-900 text-yellow-300 border-2 border-blue-950'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>

                {/* Message Box */}
                <div
                  className={`p-5 rounded-3xl border-2 space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-yellow-50 border-yellow-300 text-slate-900 rounded-tr-none'
                      : 'bg-slate-50 border-slate-300 text-slate-900 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
                    <span className="font-black text-sm text-slate-700">
                      {msg.sender === 'user' ? 'Student Question' : 'CEIT AI Assistant'}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line text-lg font-medium leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Sources Cards */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <p className="text-xs font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-700" /> Verified PDF Sources ({msg.sources.length}):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.storageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white p-3 rounded-xl border border-slate-300 hover:border-blue-600 hover:bg-blue-50 transition text-left group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-extrabold text-sm text-blue-900 group-hover:underline line-clamp-1">
                                📄 {src.title}
                              </span>
                              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-700 flex-shrink-0" />
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-bold">
                              <span>Page {src.page}</span>
                              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-extrabold">
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

            {/* Pipeline Processing Indicator */}
            {isLoading && (
              <div className="flex gap-4 items-center bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 text-blue-900 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-yellow-300 flex items-center justify-center font-black">
                  <Bot className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <p className="font-black text-base">{activePipelineStep || 'Processing RAG Query...'}</p>
                  <p className="text-xs font-bold text-blue-700">Extracting PDF text, executing pgvector cosine search &amp; LLM synthesis</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-slate-100 border-t-2 border-slate-300 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask CEIT AI about courses, admission, grades, policies..."
              disabled={isLoading}
              className="flex-1 text-lg font-bold p-4 rounded-2xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-yellow-300 font-black text-xl px-6 py-4 rounded-2xl border-2 border-blue-950 flex items-center gap-2 cursor-pointer transition focus:ring-4 focus:ring-yellow-300"
            >
              <span>Ask</span>
              <Send className="w-5 h-5" />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
