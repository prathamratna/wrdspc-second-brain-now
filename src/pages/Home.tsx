
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmojiPicker from "@/components/EmojiPicker";
import { Input } from "@/components/ui/input";

interface Page {
  id: string;
  title: string;
  emoji: string;
}

const getPages = (): Page[] => {
  const data = localStorage.getItem("pages");
  return data ? JSON.parse(data) : [];
};

const savePages = (pages: Page[]) => {
  localStorage.setItem("pages", JSON.stringify(pages));
};

const Home = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("📝");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme') === 'dark';
      }
      return true; // Default to dark mode
    }
    return true;
  });
  const navigate = useNavigate();

  useEffect(() => {
    setPages(getPages());
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const id = Date.now().toString();
    const page = { id, title: newTitle, emoji: newEmoji };
    const updated = [...pages, page];
    setPages(updated);
    savePages(updated);
    setShowNew(false);
    setNewTitle("");
    setNewEmoji("📝");
    navigate(`/page/${id}`);
  };

  return (
    <div className="w-full min-h-screen bg-background font-sans transition-colors" style={{ paddingTop: '2.5vh' }}>
      <header className="flex items-center justify-between px-8 py-2">
        <h1 className="font-mono text-2xl font-bold select-none tracking-wide h-12 flex items-center text-foreground">Your Pages</h1>
        <button
          onClick={() => setIsDark((d) => !d)}
          className="rounded-full p-2 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle dark mode"
        >
          {isDark ? <span className="inline-block">🌞</span> : <span className="inline-block">🌙</span>}
        </button>
      </header>
      <div className="max-w-xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <span />
          <Button onClick={() => setShowNew((v) => !v)}>
            New Page
          </Button>
        </div>
        {showNew && (
          <Card className="mb-6 p-4 flex items-center gap-2">
            <EmojiPicker selectedEmoji={newEmoji} onEmojiSelect={setNewEmoji} />
            <Input
              className="flex-1 bg-background text-foreground border-border focus:ring-primary"
              placeholder="Page title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <Button onClick={handleCreate} disabled={!newTitle.trim()}>
              Create
            </Button>
          </Card>
        )}
        <div className="space-y-2">
          {pages.length === 0 && (
            <div className="text-muted-foreground text-center py-8">
              No pages yet. Click "New Page" to get started.
            </div>
          )}
          {pages.map((page) => (
            <Card
              key={page.id}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate(`/page/${page.id}`)}
            >
              <span className="text-2xl">{page.emoji}</span>
              <span className="font-medium text-foreground">{page.title}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
