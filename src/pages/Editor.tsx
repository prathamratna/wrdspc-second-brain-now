
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";
import EmojiPicker from "@/components/EmojiPicker";
import RichTextEditor from "@/components/RichTextEditor";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Editor = () => {
  const navigate = useNavigate();
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [documentIcon, setDocumentIcon] = useState("📄");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load document metadata from localStorage
    const savedTitle = localStorage.getItem("wrdspc-title-default");
    const savedIcon = localStorage.getItem("wrdspc-icon-default");
    
    if (savedTitle) setDocumentTitle(savedTitle);
    if (savedIcon) setDocumentIcon(savedIcon);
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Save title changes to localStorage
    if (isInitialized) {
      localStorage.setItem("wrdspc-title-default", documentTitle);
    }
  }, [documentTitle, isInitialized]);

  useEffect(() => {
    // Save icon changes to localStorage
    if (isInitialized) {
      localStorage.setItem("wrdspc-icon-default", documentIcon);
    }
  }, [documentIcon, isInitialized]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setDocumentIcon(emoji);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
              title="Back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <EmojiPicker 
                onEmojiSelect={handleEmojiSelect}
                selectedEmoji={documentIcon} 
              />
              
              <Input
                value={documentTitle}
                onChange={handleTitleChange}
                className="font-medium text-lg border-none focus-visible:ring-0 px-0 max-w-[200px] sm:max-w-xs"
              />
            </div>
          </div>
          
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 sm:px-6 py-6 max-w-4xl mx-auto">
        <RichTextEditor />
      </main>
    </div>
  );
};

export default Editor;
