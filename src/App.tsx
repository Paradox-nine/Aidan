import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Visualization from './components/Visualization';
import Skills from './components/Skills';
import Leadership from './components/Leadership';
import About from './components/About';

export default function App() {
  return (
    <Layout>
      <Hero />
      <Visualization />
      <Projects />
      <Skills />
      <Leadership />
      <About />
    </Layout>
  );
}