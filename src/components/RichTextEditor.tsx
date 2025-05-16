
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import EditorToolbar from "./EditorToolbar";

interface RichTextEditorProps {
  initialContent?: string;
  documentId?: string;
}

const RichTextEditor = ({ initialContent = "", documentId = "default" }: RichTextEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Load content from localStorage on initialization
    const savedContent = localStorage.getItem(`wrdspc-content-${documentId}`);
    if (savedContent) {
      setContent(savedContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = savedContent;
      }
    }
  }, [documentId]);

  useEffect(() => {
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
  }, []);

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
  
  const handleSlashCommands = (event: React.KeyboardEvent) => {
    if (event.key === '/' && editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        
        if (cursorPosition === 0 || isStartOfLine()) {
          // We'll implement this feature in a future update
          toast("Slash commands coming soon!", {
            position: "bottom-center"
          });
        }
      }
    }
  };
  
  const isStartOfLine = (): boolean => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(range.startContainer);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      return preCaretRange.toString().trim().length === 0;
    }
    return false;
  };

  return (
    <div className="relative">
      {/* Floating toolbar */}
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
          className="animate-fade-in"
        >
          <EditorToolbar 
            onFormatText={handleFormatText}
            activeFormats={activeFormats}
          />
        </div>
      )}
    
      {/* Editor content */}
      <div 
        ref={editorRef}
        contentEditable={true}
        className="outline-none editor-content min-h-[70vh] py-4"
        onInput={handleContentChange}
        onKeyDown={handleSlashCommands}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default RichTextEditor;
