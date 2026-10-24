import React from 'react';
import { Hero } from './components/Hero';
import { InvitationForm } from './components/InvitationForm';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
        <Hero />
        <InvitationForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;
