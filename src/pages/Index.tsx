
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignupModal from '../components/SignupModal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, ChevronDown, MessageSquare, Edit, Globe } from 'lucide-react';

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
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
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

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border flex items-center justify-between px-4 md:px-8 py-4">
        <div className="font-mono text-2xl font-bold select-none tracking-wide text-foreground">WRDSPC</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark((d) => !d)}
            className="rounded-full p-2 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle dark mode"
          >
            {isDark ? <span className="inline-block">🌞</span> : <span className="inline-block">🌙</span>}
          </button>
          <Button 
            variant="outline" 
            className="hidden sm:flex" 
            onClick={() => navigate('/home')}
          >
            Dashboard
          </Button>
          <Button 
            onClick={handleStartWriting}
            className="hidden sm:flex"
          >
            Start Writing <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-16 landing-gradient">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 leading-tight text-foreground animate-slide-up">
            Your second brain,<br />simplified.
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: "0.2s"}}>
            A writing space that's lightning fast, distraction-free, and built for people who hate setting up Notion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{animationDelay: "0.4s"}}>
            <Button
              onClick={handleStartWriting}
              size="lg"
              className="px-10 py-6 text-xl"
            >
              Start Writing Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
            <ChevronDown className="h-8 w-8 text-muted-foreground" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-accent/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Features that simplify your writing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <Edit className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Distraction-Free Editor</h3>
                <p className="text-muted-foreground">Focus solely on your thoughts with our clean, minimal interface designed to keep you in the flow state.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Access Anywhere</h3>
                <p className="text-muted-foreground">Your notes sync automatically and are available on any device with a web browser.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Simple Organization</h3>
                <p className="text-muted-foreground">Organize with tags instead of complex folder structures. Find what you need instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How WRDSPC Works</h2>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Sign up in seconds</h3>
                  <p className="text-muted-foreground">No complex onboarding. Just create an account and start writing immediately.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Create your first page</h3>
                  <p className="text-muted-foreground">Add a title, pick an emoji, and start typing. It's that simple.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Organize with tags</h3>
                  <p className="text-muted-foreground">Add tags to your pages to keep them organized and easily searchable.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-accent/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="border border-border rounded-lg overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 text-left font-medium text-foreground hover:bg-accent/50 transition-colors focus:outline-none"
                  onClick={() => toggleAccordion('faq-1')}
                >
                  Is WRDSPC free to use?
                  <ChevronDown className={`h-5 w-5 transform transition-transform ${activeAccordion === 'faq-1' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'faq-1' && (
                  <div className="p-4 bg-card border-t border-border">
                    <p className="text-muted-foreground">Yes, WRDSPC is completely free for personal use. We offer all core features without any limitations.</p>
                  </div>
                )}
              </div>
              
              {/* FAQ Item 2 */}
              <div className="border border-border rounded-lg overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 text-left font-medium text-foreground hover:bg-accent/50 transition-colors focus:outline-none"
                  onClick={() => toggleAccordion('faq-2')}
                >
                  Can I export my notes?
                  <ChevronDown className={`h-5 w-5 transform transition-transform ${activeAccordion === 'faq-2' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'faq-2' && (
                  <div className="p-4 bg-card border-t border-border">
                    <p className="text-muted-foreground">Yes, you can export your notes in various formats including plain text, HTML, and Markdown.</p>
                  </div>
                )}
              </div>
              
              {/* FAQ Item 3 */}
              <div className="border border-border rounded-lg overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 text-left font-medium text-foreground hover:bg-accent/50 transition-colors focus:outline-none"
                  onClick={() => toggleAccordion('faq-3')}
                >
                  Is my data secure?
                  <ChevronDown className={`h-5 w-5 transform transition-transform ${activeAccordion === 'faq-3' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'faq-3' && (
                  <div className="p-4 bg-card border-t border-border">
                    <p className="text-muted-foreground">We take data security very seriously. Your notes are securely stored and only accessible to you. We use encryption to protect your information.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start writing?</h2>
            <p className="text-xl text-muted-foreground mb-10">Join thousands of writers who are already using WRDSPC to capture their thoughts.</p>
            <Button
              onClick={handleStartWriting}
              size="lg"
              className="px-10 py-6 text-xl"
            >
              Start Writing Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <div className="font-mono text-2xl font-bold mb-4 text-foreground">WRDSPC</div>
              <p className="text-muted-foreground mb-4">Your second brain, simplified.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Column 2 */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Updates</a></li>
              </ul>
            </div>
            
            {/* Column 3 */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            {/* Column 4 */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} WRDSPC. All rights reserved.
          </div>
        </div>
      </footer>
      
      <SignupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
