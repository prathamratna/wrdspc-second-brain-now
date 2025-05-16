import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import EditorToolbar from "./EditorToolbar";
import SlashCommandMenu from "./SlashCommandMenu";

interface RichTextEditorProps {
  initialContent?: string;
  documentId?: string;
}

const RichTextEditor = ({ initialContent = "", documentId = "default" }: RichTextEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  const [slashQuery, setSlashQuery] = useState("");
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [isEmpty, setIsEmpty] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  // Set document direction to LTR on component mount
  useEffect(() => {
    // Set direction on the document level if needed
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
    document.body.style.direction = 'ltr';
    
    // Force direction on editor
    if (editorRef.current) {
      setupEditorDirection(editorRef.current);
    }

    return () => {
      // Clean up - only if needed when component unmounts
      // You might want to remove this if other components need RTL
      // document.documentElement.removeAttribute('dir');
      // document.body.removeAttribute('dir');
    };
  }, []);

  useEffect(() => {
    const savedContent = localStorage.getItem(`wrdspc-content-${documentId}`);
    if (savedContent) {
      // Process content to ensure LTR direction in all elements
      const processedContent = ensureLTRInHTMLContent(savedContent);
      
      setContent(processedContent);
      setIsEmpty(processedContent.replace(/<[^>]*>/g, '').trim() === '');
      
      if (editorRef.current) {
        editorRef.current.innerHTML = processedContent;
        setupEditorDirection(editorRef.current);
      }
    }
  }, [documentId]);

  const ensureLTRInHTMLContent = (html: string): string => {
    // Add dir="ltr" attribute to all HTML elements in the content
    return html.replace(/<([a-z][a-z0-9]*)\b([^>]*)>/gi, (match, tag, attributes) => {
      // Don't duplicate dir attribute if it already exists
      if (attributes.includes('dir=')) {
        return match.replace(/dir="[^"]*"/g, 'dir="ltr"');
      }
      return `<${tag}${attributes} dir="ltr" style="direction: ltr;">`;
    });
  };

  const setupEditorDirection = (element: HTMLElement) => {
    // Set crucial direction properties
    element.setAttribute('dir', 'ltr');
    element.style.direction = 'ltr';
    element.style.textAlign = 'left';
    element.style.unicodeBidi = 'isolate';
    
    // Add a specific class that can be targeted in CSS
    element.classList.add('force-ltr');
    
    // Force browser to recalculate styles
    element.style.display = 'none';
    setTimeout(() => {
      element.style.display = 'block';
    }, 0);
  };

  useEffect(() => {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    setIsEmpty(cleanContent === '');

    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width > 0) {
          const newTop = rect.top - 40;
          const newLeft = rect.left + rect.width / 2;

          setToolbarPosition({
            top: newTop < 0 ? 5 : newTop,
            left: newLeft
          });
          setShowToolbar(true);
          setShowSlashMenu(false);
        }
      } else {
        setShowToolbar(false);
      }

      if (selection) {
        const formats: string[] = [];
        const parentElement = selection.anchorNode?.parentElement;

        if (parentElement) {
          if (parentElement.tagName === 'B' || parentElement.style.fontWeight === 'bold') {
            formats.push('bold');
          }
          if (parentElement.tagName === 'I' || parentElement.style.fontStyle === 'italic') {
            formats.push('italic');
          }

          const parentList = getParentOfType(parentElement, ['UL', 'OL']);
          if (parentList) {
            formats.push(parentList.tagName === 'UL' ? 'bullet' : 'ordered');
          }

          const parentHeading = getParentOfType(parentElement, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
          if (parentHeading) {
            formats.push(parentHeading.tagName.toLowerCase());
          }
        }

        setActiveFormats(formats);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [content]);

  const getParentOfType = (element: Element, types: string[]): Element | null => {
    let parent = element;
    while (parent) {
      if (types.includes(parent.tagName)) {
        return parent;
      }
      if (parent.parentElement) {
        parent = parent.parentElement;
      } else {
        break;
      }
    }
    return null;
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      // Get content
      let newContent = editorRef.current.innerHTML;
      
      // Ensure direction is preserved in HTML
      newContent = ensureLTRInHTMLContent(newContent);
      
      setContent(newContent);

      const cleanContent = newContent.replace(/<[^>]*>/g, '').trim();
      setIsEmpty(cleanContent === '');

      // Re-apply direction settings
      setupEditorDirection(editorRef.current);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        localStorage.setItem(`wrdspc-content-${documentId}`, newContent);
        toast("Changes saved", {
          duration: 1000,
          position: "bottom-right"
        });
        saveTimeoutRef.current = null;
      }, 1000);
    }
  };

  // Apply LTR direction to all elements in the editor
  const applyLTRDirectionRecursively = () => {
    if (!editorRef.current) return;
    
    const applyToElement = (element: Element) => {
      if (element.nodeType === Node.ELEMENT_NODE) {
        (element as HTMLElement).setAttribute('dir', 'ltr');
        (element as HTMLElement).style.direction = 'ltr';
        (element as HTMLElement).style.textAlign = 'left';
        
        // Process all child elements
        Array.from(element.children).forEach(child => {
          applyToElement(child);
        });
      }
    };
    
    applyToElement(editorRef.current);
  };

  const handleFormatText = (format: string) => {
    if (!editorRef.current) return;

    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'bullet':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'ordered':
        document.execCommand('insertOrderedList', false);
        break;
      case 'table':
        insertTable();
        break;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        formatHeading(format);
        break;
      case 'date':
        insertDate();
        break;
      case 'time':
        insertTime();
        break;
      default:
        break;
    }

    // Apply LTR direction after formatting
    applyLTRDirectionRecursively();
    handleContentChange();
    setShowSlashMenu(false);
    setSlashQuery("");
  };

  const insertTable = () => {
    const table = `
      <table dir="ltr" style="direction: ltr; text-align: left;">
        <tr dir="ltr" style="direction: ltr; text-align: left;">
          <th dir="ltr" style="direction: ltr; text-align: left;">Header 1</th>
          <th dir="ltr" style="direction: ltr; text-align: left;">Header 2</th>
          <th dir="ltr" style="direction: ltr; text-align: left;">Header 3</th>
        </tr>
        <tr dir="ltr" style="direction: ltr; text-align: left;">
          <td dir="ltr" style="direction: ltr; text-align: left;">Row 1, Cell 1</td>
          <td dir="ltr" style="direction: ltr; text-align: left;">Row 1, Cell 2</td>
          <td dir="ltr" style="direction: ltr; text-align: left;">Row 1, Cell 3</td>
        </tr>
        <tr dir="ltr" style="direction: ltr; text-align: left;">
          <td dir="ltr" style="direction: ltr; text-align: left;">Row 2, Cell 1</td>
          <td dir="ltr" style="direction: ltr; text-align: left;">Row 2, Cell 2</td>
          <td dir="ltr" style="direction: ltr; text-align: left;">Row 2, Cell 3</td>
        </tr>
      </table>
    `;
    document.execCommand('insertHTML', false, table);
  };

  const insertDate = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    document.execCommand('insertText', false, formattedDate);
  };

  const insertTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    document.execCommand('insertText', false, formattedTime);
  };

  const formatHeading = (headingType: string) => {
    document.execCommand('formatBlock', false, `<${headingType} dir="ltr" style="direction: ltr; text-align: left;">`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle tab for indentation
    if (event.key === 'Tab') {
      event.preventDefault();
      document.execCommand(event.shiftKey ? 'outdent' : 'indent');
      handleContentChange();
      return;
    }

    if (event.key === '/') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSlashPosition({
          top: rect.bottom + 10,
          left: rect.left
        });
        setShowSlashMenu(true);
        setSlashQuery("");
        setShowToolbar(false);
      }
    } else if (event.key === 'Escape') {
      setShowSlashMenu(false);
      setSlashQuery("");
    } else if (showSlashMenu) {
      if (event.key === 'Enter' && slashQuery) {
        // Prevent default behavior when slash menu is open
        event.preventDefault();
        return;
      }
      
      if (event.key === 'Backspace' && slashQuery.length === 0) {
        setShowSlashMenu(false);
      } else if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        // Only update query for typing characters, not for navigation
        if (event.key !== 'Backspace') {
          setSlashQuery(prev => prev + event.key);
        } else {
          setSlashQuery(prev => prev.slice(0, -1));
        }
      }
    } else {
      setShowSlashMenu(false);
      setSlashQuery("");
    }
    
    // Re-apply direction after typing
    setTimeout(applyLTRDirectionRecursively, 0);
  };

  const handleCommandSelect = (command: string) => {
    handleFormatText(command);
    setShowSlashMenu(false);
    setSlashQuery("");
  };

  return (
    <div className="relative editor-container" dir="ltr">
      {showToolbar && (
        <div
          ref={toolbarRef}
          style={{
            position: 'fixed',
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 50,
          }}
          className="animate-in"
          dir="ltr"
        >
          <EditorToolbar
            onFormatText={handleFormatText}
            activeFormats={activeFormats}
          />
        </div>
      )}

      {showSlashMenu && (
        <SlashCommandMenu
          position={slashPosition}
          query={slashQuery}
          onCommandSelect={handleCommandSelect}
          onClose={() => {
            setShowSlashMenu(false);
            setSlashQuery("");
          }}
        />
      )}

      <div
        ref={editorRef}
        contentEditable={true}
        className="outline-none editor-content min-h-[70vh] py-4 bg-background px-6 text-left force-ltr"
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: content }}
        dir="ltr"
        style={{
          direction: 'ltr', 
          textAlign: 'left',
          unicodeBidi: 'isolate',
          writingMode: 'horizontal-tb', // Forces horizontal left-to-right text
        }}
        lang="en" // Set English language to help enforce LTR
      />

      {isEmpty && (
        <div
          className="absolute top-4 left-6 pointer-events-none text-muted-foreground"
          style={{ zIndex: 5 }}
          dir="ltr"
        >
          Start writing here...
        </div>
      )}
      
      {/* Add a small CSS block to ensure LTR direction */}
      <style jsx>{`
        .force-ltr {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: isolate !important;
        }
        
        .force-ltr * {
          direction: ltr !important;
          text-align: left !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
