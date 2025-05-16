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
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [isEmpty, setIsEmpty] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Load content from localStorage on initialization
    const savedContent = localStorage.getItem(`wrdspc-content-${documentId}`);
    if (savedContent) {
      setContent(savedContent);
      setIsEmpty(savedContent.replace(/<[^>]*>/g, '').trim() === '');
      if (editorRef.current) {
        editorRef.current.innerHTML = savedContent;
      }
    }
  }, [documentId]);

  useEffect(() => {
    // Check if content is empty
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    setIsEmpty(cleanContent === '');
    
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        if (rect.width > 0) {
          // Position the toolbar above the selection
          const newTop = rect.top - 40;
          const newLeft = rect.left + rect.width / 2;
          
          setToolbarPosition({
            top: newTop < 0 ? 5 : newTop,
            left: newLeft
          });
          setShowToolbar(true);
          setShowSlashMenu(false); // Hide slash menu when selecting text
        }
      } else {
        setShowToolbar(false);
      }
      
      // Detect active formats
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
          
          // Check list types
          const parentList = getParentOfType(parentElement, ['UL', 'OL']);
          if (parentList) {
            formats.push(parentList.tagName === 'UL' ? 'bullet' : 'ordered');
          }
          
          // Check headings
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
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      
      // Check if empty
      const cleanContent = newContent.replace(/<[^>]*>/g, '').trim();
      setIsEmpty(cleanContent === '');
      
      // Debounce saving to localStorage
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

  const handleFormatText = (format: string) => {
    if (!editorRef.current) return;
    
    // Handle different formatting actions
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
        formatHeading(format);
        break;
      default:
        break;
    }
    
    handleContentChange();
    setShowSlashMenu(false);
  };
  
  const insertTable = () => {
    const table = `
      <table>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
          <th>Header 3</th>
        </tr>
        <tr>
          <td>Row 1, Cell 1</td>
          <td>Row 1, Cell 2</td>
          <td>Row 1, Cell 3</td>
        </tr>
        <tr>
          <td>Row 2, Cell 1</td>
          <td>Row 2, Cell 2</td>
          <td>Row 2, Cell 3</td>
        </tr>
      </table>
    `;
    document.execCommand('insertHTML', false, table);
  };
  
  const formatHeading = (headingType: string) => {
    document.execCommand('formatBlock', false, `<${headingType}>`);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
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
        setShowToolbar(false);
      }
    } else if (event.key === 'Escape') {
      setShowSlashMenu(false);
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleCommandSelect = (command: string) => {
    handleFormatText(command);
    setShowSlashMenu(false);
  };

  return (
    <div className="relative">
      {/* Floating toolbar for text selection */}
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
        >
          <EditorToolbar 
            onFormatText={handleFormatText}
            activeFormats={activeFormats}
          />
        </div>
      )}
      
      {/* Slash command menu */}
      {showSlashMenu && (
        <SlashCommandMenu
          position={slashPosition}
          onCommandSelect={handleCommandSelect}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    
      {/* Editor content */}
      <div 
        ref={editorRef}
        contentEditable={true}
        className="outline-none editor-content min-h-[70vh] py-4 bg-card px-6 rounded-md text-left"
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: content }}
        dir="ltr" 
        style={{ 
          position: 'relative',
          direction: 'ltr', 
          textAlign: 'left'
        }}
      />
      
      {/* Placeholder text when editor is empty */}
      {isEmpty && (
        <div 
          className="absolute top-10 left-6 pointer-events-none text-muted-foreground"
          style={{ zIndex: 5 }}
        >
          Start writing here...
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
