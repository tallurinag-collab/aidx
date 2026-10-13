import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import Workflow from './components/Workflow';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <div className="proof-strip" aria-label="AIDX principles">
          <span>Built around your people</span>
          <span>Designed for real workflows</span>
          <span>Measured by business impact</span>
        </div>
        <Features />
        <Workflow />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
