
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "@/components/EmojiPicker";
import RichTextEditor from "@/components/RichTextEditor";
import { ChevronLeft, Search } from "lucide-react";

interface Page {
  id: string;
  title: string;
  emoji: string;
  content?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

const getPages = (): Page[] => {
  const data = localStorage.getItem("pages");
  return data ? JSON.parse(data) : [];
};

const savePages = (pages: Page[]) => {
  localStorage.setItem("pages", JSON.stringify(pages));
};

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme') === 'dark';
      }
      return true; // Default to dark mode
    }
    return true;
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Welcome to WRDSPC!");

  useEffect(() => {
    const pages = getPages();
    const found = pages.find((p) => p.id === id);
    if (!found) {
      setNotFound(true);
      return;
    }
    setPage(found);
  }, [id]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const updatePage = (updates: Partial<Page>) => {
    if (!page) return;

    const now = Date.now();
    const updated = { 
      ...page, 
      ...updates,
      updatedAt: now 
    };
    
    setPage(updated);
    
    const pages = getPages();
    const idx = pages.findIndex((p) => p.id === page.id);
    if (idx !== -1) {
      pages[idx] = updated;
      savePages(pages);
      setToastMessage("Changes saved");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleTagsChange = (tags: string[]) => {
    updatePage({ tags });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Save with Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      setToastMessage("Changes saved");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page not found</h1>
          <Button onClick={() => navigate("/home")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans transition-colors relative">
      <header className="flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
          <Button
            onClick={() => navigate("/home")}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <EmojiPicker
            selectedEmoji={page.emoji}
            onEmojiSelect={(emoji) => updatePage({ emoji })}
          />
          <Input
            value={page.title}
            onChange={(e) => updatePage({ title: e.target.value })}
            className="font-bold text-lg sm:text-xl border-none focus-visible:ring-0 px-0 bg-background text-foreground tracking-tight leading-snug max-w-[140px] sm:max-w-[320px] placeholder:text-muted-foreground"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark((d) => !d)}
            className="rounded-full p-2 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle dark mode"
          >
            {isDark ? <span className="inline-block">🌞</span> : <span className="inline-block">🌙</span>}
          </button>
        </div>
      </header>
      <div className="px-4 sm:px-8 pt-4">
        <RichTextEditor
          value={page.content || ""}
          onChange={(content: string) => updatePage({ content })}
          tags={page.tags || []}
          onTagsChange={handleTagsChange}
        />
      </div>
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 text-foreground animate-in fade-in">
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Editor;
