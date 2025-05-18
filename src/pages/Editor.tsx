
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "@/components/EmojiPicker";
import RichTextEditor from "@/components/RichTextEditor";
import { ChevronLeft } from "lucide-react";

interface Page {
  id: string;
  title: string;
  emoji: string;
  content?: string;
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
    const updated = { ...page, ...updates };
    setPage(updated);
    const pages = getPages();
    const idx = pages.findIndex((p) => p.id === page.id);
    if (idx !== -1) {
      pages[idx] = updated;
      savePages(pages);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page not found</h1>
          <Button onClick={() => navigate("/home")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen w-full bg-background font-sans transition-colors relative">
      <header className="flex items-center justify-between px-8 py-3 border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft size={18} />
            <span>Back</span>
          </Button>
          <EmojiPicker
            selectedEmoji={page.emoji}
            onEmojiSelect={(emoji) => updatePage({ emoji })}
          />
          <Input
            value={page.title}
            onChange={(e) => updatePage({ title: e.target.value })}
            className="font-bold text-xl border-none focus-visible:ring-0 px-0 bg-background text-foreground tracking-tight leading-snug max-w-[320px] sm:max-w-xs placeholder:text-muted-foreground"
            placeholder="Untitled Document"
          />
        </div>
        <button
          onClick={() => setIsDark((d) => !d)}
          className="rounded-full p-2 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle dark mode"
        >
          {isDark ? <span className="inline-block">🌞</span> : <span className="inline-block">🌙</span>}
        </button>
      </header>
      <RichTextEditor
        value={page.content || ""}
        onChange={(content: string) => updatePage({ content })}
      />
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-border rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 text-foreground animate-in">
          <span className="text-xl">✔️</span>
          <span className="font-medium">Welcome to WRDSPC!</span>
        </div>
      )}
    </div>
  );
};

export default Editor;
