
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmojiPicker from "@/components/EmojiPicker";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Tag } from "lucide-react";

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
  if (!data) return [];
  
  const pages = JSON.parse(data);
  
  // Ensure all pages have createdAt and updatedAt
  return pages.map((page: Page) => ({
    ...page,
    createdAt: page.createdAt || Date.now(),
    updatedAt: page.updatedAt || Date.now(),
    tags: page.tags || []
  }));
};

const savePages = (pages: Page[]) => {
  localStorage.setItem("pages", JSON.stringify(pages));
};

const Home = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("📝");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
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
    
    const now = Date.now();
    const id = now.toString();
    
    const page = { 
      id, 
      title: newTitle, 
      emoji: newEmoji,
      tags: [],
      createdAt: now,
      updatedAt: now
    };
    
    const updated = [...pages, page];
    setPages(updated);
    savePages(updated);
    setShowNew(false);
    setNewTitle("");
    setNewEmoji("📝");
    navigate(`/page/${id}`);
  };

  // Get all unique tags from all pages
  const allTags = Array.from(
    new Set(pages.flatMap(page => page.tags || []))
  ).sort();

  // Filter pages based on search query and selected tag
  const filteredPages = pages.filter(page => {
    const matchesSearch = !searchQuery || 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (page.content && page.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = !selectedTag || 
      (page.tags && page.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  // Sort pages by updated date (newest first)
  const sortedPages = [...filteredPages].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="w-full min-h-screen bg-background font-sans transition-colors" style={{ paddingTop: '2.5vh' }}>
      <header className="flex items-center justify-between px-8 py-2">
        <h1 className="font-sans text-2xl font-semibold select-none h-12 flex items-center text-foreground">Your Pages</h1>
        <button
          onClick={() => setIsDark((d) => !d)}
          className="rounded-full p-2 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle dark mode"
        >
          {isDark ? <span className="inline-block">🌞</span> : <span className="inline-block">🌙</span>}
        </button>
      </header>
      <div className="max-w-xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 w-full bg-background text-foreground"
            />
          </div>
          <Button onClick={() => setShowNew((v) => !v)} className="flex items-center gap-2">
            <PlusCircle size={18} />
            New Page
          </Button>
        </div>
        
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Tag size={14} />
                <span>Filter:</span>
              </span>
              
              <div
                className={`text-sm px-2 py-1 rounded-md cursor-pointer transition-colors ${
                  !selectedTag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
                onClick={() => setSelectedTag(null)}
              >
                All
              </div>
              
              {allTags.map(tag => (
                <div 
                  key={tag} 
                  className={`text-sm px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                >
                  #{tag}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showNew && (
          <Card className="mb-6 p-4 flex items-center gap-2">
            <EmojiPicker selectedEmoji={newEmoji} onEmojiSelect={setNewEmoji} />
            <Input
              className="flex-1 bg-background text-foreground border-border"
              placeholder="Page title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
            />
            <Button onClick={handleCreate} disabled={!newTitle.trim()}>
              Create
            </Button>
          </Card>
        )}
        <div className="space-y-2">
          {sortedPages.length === 0 && searchQuery && (
            <div className="text-muted-foreground text-center py-8">
              No pages match your search.
            </div>
          )}
          {sortedPages.length === 0 && !searchQuery && (
            <div className="text-muted-foreground text-center py-8">
              No pages yet. Click "New Page" to get started.
            </div>
          )}
          {sortedPages.map((page) => (
            <Card
              key={page.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate(`/page/${page.id}`)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{page.emoji}</span>
                <span className="font-medium text-foreground">{page.title}</span>
              </div>
              
              {/* Show tags if they exist */}
              {page.tags && page.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {page.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(tag === selectedTag ? null : tag);
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Show updated at date */}
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(page.updatedAt).toLocaleDateString()} 
                {" • "}
                {new Date(page.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
