
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Index = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleStartWriting = () => {
    setShowSignup(true);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate account creation/login
    setTimeout(() => {
      toast.success("Welcome to WRDSPC!");
      navigate("/editor");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col landing-gradient">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="font-mono text-xl font-bold">
            WRDSPC
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Your second brain,{" "}
            <span className="text-primary">simplified.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A writing space that's lightning fast, distraction-free, and built for people 
            who hate setting up Notion.
          </p>

          {!showSignup ? (
            <Button 
              onClick={handleStartWriting} 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg animate-in"
            >
              Start Writing Now
            </Button>
          ) : (
            <Card className="p-6 max-w-md mx-auto animate-fade-in">
              <form onSubmit={handleSignup} className="space-y-4">
                <h2 className="text-xl font-medium mb-4">Create your writing space</h2>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full h-12" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating your space..." : "Continue →"}
                </Button>
                <p className="text-xs text-center text-muted-foreground pt-2">
                  We'll send you a magic link to sign in.
                </p>
              </form>
            </Card>
          )}
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
        <p>© 2025 WRDSPC. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
