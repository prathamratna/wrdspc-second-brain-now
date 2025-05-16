
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

  useEffect(() => {
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
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);

      const cleanContent = newContent.replace(/<[^>]*>/g, '').trim();
      setIsEmpty(cleanContent === '');

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

    handleContentChange();
    setShowSlashMenu(false);
    setSlashQuery("");
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
    document.execCommand('formatBlock', false, `<${headingType}>`);
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
  };

  const handleCommandSelect = (command: string) => {
    handleFormatText(command);
    setShowSlashMenu(false);
    setSlashQuery("");
  };

  return (
    <div className="relative">
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
        className="outline-none editor-content min-h-[70vh] py-4 bg-background px-6 text-left"
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: content }}
        dir="ltr"
        style={{
          direction: 'ltr',
          unicodeBidi: 'plaintext',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      />

      {isEmpty && (
        <div
          className="absolute top-4 left-6 pointer-events-none text-muted-foreground"
          style={{ zIndex: 5 }}
        >
          Start writing here...
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
