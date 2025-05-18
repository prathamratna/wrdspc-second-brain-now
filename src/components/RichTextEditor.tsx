
import { useRef, useEffect, useState } from "react";
import { AlignLeft, Bold, Italic, Heading1, Heading2, Heading3, Heading4, List, ListOrdered, CheckSquare } from "lucide-react";

const TOOLBAR_OPTIONS = [
  { id: "h1", label: "Heading 1", icon: <Heading1 size={16} />, style: { fontSize: 32, fontWeight: 700 } },
  { id: "h2", label: "Heading 2", icon: <Heading2 size={16} />, style: { fontSize: 24, fontWeight: 700 } },
  { id: "h3", label: "Heading 3", icon: <Heading3 size={16} />, style: { fontSize: 18, fontWeight: 700 } },
  { id: "h4", label: "Heading 4", icon: <Heading4 size={16} />, style: { fontSize: 16, fontWeight: 700 } },
  { id: "bold", label: "Bold", icon: <Bold size={16} />, style: { fontWeight: 700 } },
  { id: "italic", label: "Italic", icon: <Italic size={16} />, style: { fontStyle: "italic" } },
  { id: "ordered", label: "Numbered List", icon: <ListOrdered size={16} />, style: {} },
  { id: "bullet", label: "Bulleted List", icon: <List size={16} />, style: {} },
  { id: "checkbox", label: "Checkbox", icon: <CheckSquare size={16} />, style: {} },
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
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      // Check if there's actual content
      setHasContent(value && value !== "<br>" && value !== "");
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
      const content = editorRef.current.innerHTML;
      onChange(content);
      
      // Check if there's actual content to hide placeholder
      setHasContent(content && content !== "<br>" && content !== "");
      
      // Show slash menu if last char is '/'
      const text = editorRef.current.innerText;
      const endsWithSlash = text.trimEnd().endsWith("/");
      setShowSlash(endsWithSlash);
      
      if (endsWithSlash) {
        setToolbar(getToolbarPosition());
      }
    }
  };

  const format = (cmd: string) => {
    if (!editorRef.current) return;
    
    // Get current selection and range
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // Focus on editor
    editorRef.current.focus();
    
    // Remove the slash character
    if (showSlash) {
      const text = editorRef.current.innerText;
      if (text.trimEnd().endsWith("/")) {
        // Create a range to delete the slash
        const range = selection.getRangeAt(0);
        range.setStart(range.startContainer, range.startOffset - 1);
        range.deleteContents();
      }
    }
    
    // Apply formatting
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
    setHasContent(true); // After formatting, we definitely have content
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] px-4 sm:px-8 py-6 font-sans transition-colors relative">
      <div className="editor-container w-full max-w-4xl mx-auto h-full relative">
        <div className="relative w-full min-h-[calc(100vh-100px)]">
          {(!hasContent) && (
            <div
              className="absolute pointer-events-none text-muted-foreground"
              style={{ 
                top: '0.5rem', 
                left: '0.5rem', 
                zIndex: 1 
              }}
            >
              Start writing here... or type / for commands.
            </div>
          )}
          <div
            ref={editorRef}
            className="w-full h-full outline-none bg-transparent text-foreground transition-all editor-content"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ 
              minHeight: "calc(100vh - 100px)",
              fontFamily: 'Inter, sans-serif', 
              padding: '0.5rem',
              outline: 'none', 
              margin: 0, 
              border: 'none',
              lineHeight: 1.5
            }}
          />
        </div>
      </div>

      {(toolbar || showSlash) && (
        <div
          className="absolute z-50 flex flex-col gap-1 bg-card rounded-lg shadow-lg p-1.5 border border-border transition-all"
          style={{ top: (toolbar?.top ?? 60), left: (toolbar?.left ?? 32), minWidth: 220, fontFamily: 'Inter, sans-serif' }}
        >
          {TOOLBAR_OPTIONS.map(opt => (
            <button
              key={opt.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
              onMouseDown={e => { e.preventDefault(); format(opt.id); }}
              type="button"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-secondary text-foreground">
                {opt.icon}
              </span>
              <span className="text-foreground text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
