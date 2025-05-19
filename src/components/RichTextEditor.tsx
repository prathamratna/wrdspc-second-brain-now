
import { useRef, useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { getToolbarPosition, formatContent } from "./editor/editor-utils";
import TagSystem from "./editor/TagSystem";
import MinimalToolbar from "./editor/MinimalToolbar";
import FloatingToolbar from "./editor/FloatingToolbar";
import LinkDialog from "./editor/LinkDialog";
import ImageDialog from "./editor/ImageDialog";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

const RichTextEditor = ({ value, onChange, tags = [], onTagsChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<{ top: number; left: number } | null>(null);
  const [showSlash, setShowSlash] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showMinimalToolbar, setShowMinimalToolbar] = useState(false);

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
        const range = sel.getRangeAt(0);
        setSelectedText(range.toString());
      } else {
        setToolbar(null);
      }
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  // Add keyboard shortcut handling
  useEffect(() => {
    if (!editorRef.current) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Enter key to reset formatting after headings
      if (e.key === 'Enter') {
        const selection = window.getSelection();
        if (!selection) return;
        
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        
        // Check if we're in a heading element
        let headingElement = null;
        let currentNode: Node | null = node;
        
        while (currentNode && currentNode !== editorRef.current) {
          if (currentNode.nodeName.match(/^H[1-6]$/)) {
            headingElement = currentNode;
            break;
          }
          currentNode = currentNode.parentNode;
        }
        
        if (headingElement) {
          // Let the default Enter behavior happen first
          setTimeout(() => {
            // After the browser has created a new line, apply normal formatting
            document.execCommand('formatBlock', false, 'p');
          }, 0);
        }
      }
      
      // Keyboard shortcuts for common formatting
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            format('bold');
            break;
          case 'i':
            e.preventDefault();
            format('italic');
            break;
          case 'u':
            e.preventDefault();
            format('underline');
            break;
          case '1':
            if (e.altKey) {
              e.preventDefault();
              format('h1');
            }
            break;
          case '2':
            if (e.altKey) {
              e.preventDefault();
              format('h2');
            }
            break;
          case '3':
            if (e.altKey) {
              e.preventDefault();
              format('h3');
            }
            break;
          case '4':
            if (e.altKey) {
              e.preventDefault();
              format('h4');
            }
            break;
        }
      }
      
      // Show minimal toolbar when user types content
      setShowMinimalToolbar(true);
      
      // Reset formatting when content is empty
      if (editorRef.current && (editorRef.current.innerText.trim() === '' || e.key === 'Escape')) {
        document.execCommand('formatBlock', false, 'p');
      }
    };
    
    editorRef.current.addEventListener('keydown', handleKeyDown);
    return () => {
      editorRef.current?.removeEventListener('keydown', handleKeyDown);
    };
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
      
      // Reset to normal text when everything is deleted
      if (content === "" || content === "<br>") {
        document.execCommand('formatBlock', false, 'p');
      }
    }
  };

  const insertLink = (url: string) => {
    document.execCommand("createLink", false, url);
    const selection = window.getSelection();
    if (selection && selection.anchorNode) {
      // Find the closest A element
      let node = selection.anchorNode;
      while (node && node.nodeName !== "A") {
        node = node.parentNode;
      }
      
      if (node) {
        // Cast to HTMLElement to access setAttribute
        const linkElement = node as HTMLElement;
        linkElement.setAttribute("href", url);
        linkElement.setAttribute("target", "_blank");
        linkElement.setAttribute("rel", "noopener noreferrer");
      }
    }
    
    setShowLinkDialog(false);
    handleInput();
  };

  const insertImage = (url: string) => {
    document.execCommand("insertHTML", false, `<img src="${url}" alt="Inserted image" style="max-width: 100%; margin: 10px 0;" />`);
    setShowImageDialog(false);
    handleInput();
  };

  const format = (cmd: string) => {
    if (!editorRef.current) return;
    
    // Focus on editor
    editorRef.current.focus();
    
    // Remove the slash character
    if (showSlash) {
      const text = editorRef.current.innerText;
      if (text.trimEnd().endsWith("/")) {
        // Create a range to delete the slash
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.setStart(range.startContainer, range.startOffset - 1);
          range.deleteContents();
        }
      }
    }
    
    // Apply formatting
    const result = formatContent(cmd, selectedText);
    
    if (result === "link") {
      setShowLinkDialog(true);
    } else if (result === "image") {
      setShowImageDialog(true);
    }
    
    handleInput();
    setToolbar(null);
    setShowSlash(false);
    setHasContent(true); // After formatting, we definitely have content
  };

  const handleTagsChange = (newTags: string[]) => {
    if (onTagsChange) {
      onTagsChange(newTags);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] py-6 font-sans transition-colors relative">
      {/* Tag system */}
      {onTagsChange && (
        <TagSystem tags={tags} onTagsChange={handleTagsChange} />
      )}

      <div className="editor-container w-full max-w-4xl mx-auto h-full relative">
        {/* Persistent minimal toolbar */}
        {showMinimalToolbar && (
          <MinimalToolbar onFormat={format} />
        )}
        
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

      {/* Floating Toolbar */}
      <FloatingToolbar 
        position={(toolbar || showSlash) ? (toolbar ?? { top: 60, left: 32 }) : null} 
        onFormat={format} 
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <LinkDialog
          onClose={() => setShowLinkDialog(false)}
          onInsert={insertLink}
        />
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <ImageDialog
          onClose={() => setShowImageDialog(false)}
          onInsert={insertImage}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
