
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignupModal from '../components/SignupModal';

const Index = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme') === 'dark';
      }
      return true; // Default to dark mode
    }
    return true;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleStartWriting = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background transition-colors">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="font-mono text-2xl font-bold select-none tracking-wide text-foreground">WRDSPC</div>
        <button
          onClick={() => setIsDark((d) => !d)}
          className="rounded-full p-2 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle dark mode"
        >
          {isDark ? <span className="inline-block">🌞</span> : <span className="inline-block">🌙</span>}
        </button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 leading-tight text-foreground">
          Your second brain,<br />simplified.
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          A writing space that's lightning fast, distraction-free, and built for people who hate setting up Notion.
        </p>
        <button
          onClick={handleStartWriting}
          className="px-10 py-4 rounded-md bg-primary text-primary-foreground text-xl font-semibold shadow-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Start Writing Now
        </button>
      </main>
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground">
        © 2025 WRDSPC. All rights reserved.
      </footer>
      
      <SignupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
