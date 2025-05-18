
import { useRef, useEffect, useState } from "react";
import EmojiPicker from "./EmojiPicker";

const TOOLBAR_OPTIONS = [
  { id: "h1", label: "Heading 1", icon: "H1", style: { fontSize: 32, fontWeight: 700 } },
  { id: "h2", label: "Heading 2", icon: "H2", style: { fontSize: 24, fontWeight: 700 } },
  { id: "h3", label: "Heading 3", icon: "H3", style: { fontSize: 18, fontWeight: 700 } },
  { id: "h4", label: "Heading 4", icon: "H4", style: { fontSize: 16, fontWeight: 700 } },
  { id: "bold", label: "Bold", icon: "B", style: { fontWeight: 700 } },
  { id: "italic", label: "Italic", icon: "I", style: { fontStyle: "italic" } },
  { id: "ordered", label: "Numbered List", icon: "1.", style: {} },
  { id: "bullet", label: "Bulleted List", icon: "•", style: {} },
  { id: "checkbox", label: "Checkbox", icon: "☐", style: {} },
];

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const getToolbarPosition = () => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount) {
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    return {
      top: rect.top + window.scrollY + 30,
      left: rect.left + window.scrollX,
    };
  }
  return null;
};

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<{ top: number; left: number } | null>(null);
  const [showSlash, setShowSlash] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Show toolbar on selection or on '/'
  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount && !sel.isCollapsed && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
        setToolbar(getToolbarPosition());
      } else {
        setToolbar(null);
      }
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  const handleInput = (e?: any) => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      // Show slash menu if last char is '/'
      const text = editorRef.current.innerText;
      setShowSlash(text.endsWith("/"));
      if (text.endsWith("/")) {
        setToolbar(getToolbarPosition());
      }
    }
  };

  const format = (cmd: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    switch (cmd) {
      case "bold":
        document.execCommand("bold");
        break;
      case "italic":
        document.execCommand("italic");
        break;
      case "h1":
        document.execCommand("formatBlock", false, "H1");
        setTimeout(() => {
          document.execCommand("fontSize", false, "7");
          const sel = window.getSelection();
          if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
            sel.anchorNode.parentElement.style.fontSize = "32px";
            sel.anchorNode.parentElement.style.fontWeight = "bold";
          }
        }, 0);
        break;
      case "h2":
        document.execCommand("formatBlock", false, "H2");
        setTimeout(() => {
          document.execCommand("fontSize", false, "6");
          const sel = window.getSelection();
          if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
            sel.anchorNode.parentElement.style.fontSize = "24px";
            sel.anchorNode.parentElement.style.fontWeight = "bold";
          }
        }, 0);
        break;
      case "h3":
        document.execCommand("formatBlock", false, "H3");
        setTimeout(() => {
          document.execCommand("fontSize", false, "5");
          const sel = window.getSelection();
          if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
            sel.anchorNode.parentElement.style.fontSize = "18px";
            sel.anchorNode.parentElement.style.fontWeight = "bold";
          }
        }, 0);
        break;
      case "h4":
        document.execCommand("formatBlock", false, "H4");
        setTimeout(() => {
          document.execCommand("fontSize", false, "4");
          const sel = window.getSelection();
          if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
            sel.anchorNode.parentElement.style.fontSize = "16px";
            sel.anchorNode.parentElement.style.fontWeight = "bold";
          }
        }, 0);
        break;
      case "ordered":
        document.execCommand("insertOrderedList");
        break;
      case "bullet":
        document.execCommand("insertUnorderedList");
        break;
      case "checkbox":
        document.execCommand("insertHTML", false, '<input type="checkbox" style="margin-right:8px;" />');
        break;
    }
    handleInput();
    setToolbar(null);
    setShowSlash(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] max-w-4xl mx-auto px-4 sm:px-8 pt-6 pb-16 font-sans bg-background transition-colors relative flex flex-col items-center">
      <div className="w-full bg-background px-0 sm:px-4 py-4 min-h-[300px] relative">
        {(!value || value === "<br>") && (
          <div
            className="absolute text-muted-foreground pointer-events-none select-none"
            style={{ top: '2rem', left: '2rem', zIndex: 1 }}
          >
            Start writing here... or type / for commands.
          </div>
        )}
        <div
          ref={editorRef}
          className="w-full min-h-[300px] outline-none bg-transparent text-base text-foreground transition-all"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ 
            minHeight: 300, 
            fontFamily: 'Inter, sans-serif', 
            padding: '2rem',
            outline: 'none', 
            margin: 0, 
            border: 'none' 
          }}
        />
      </div>
      {(toolbar || showSlash) && (
        <div
          className="absolute z-50 flex flex-col gap-2 bg-card rounded-lg shadow-lg p-2 border border-border transition-all"
          style={{ top: (toolbar?.top ?? 60), left: (toolbar?.left ?? 32), minWidth: 220, fontFamily: 'Inter, sans-serif' }}
        >
          {TOOLBAR_OPTIONS.map(opt => (
            <button
              key={opt.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              onMouseDown={e => { e.preventDefault(); format(opt.id); }}
              type="button"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-secondary font-bold text-lg text-foreground">
                {opt.icon}
              </span>
              <span className="text-foreground text-base font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
