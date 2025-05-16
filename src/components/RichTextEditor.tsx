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
  const [slashQuery, setSlashQuery] = useState("");
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [isEmpty, setIsEmpty] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`wrdspc-content-${documentId}`);
    if (saved) {
      setContent(saved);
      setIsEmpty(saved.replace(/<[^>]+>/g, '').trim() === "");
      if (editorRef.current) editorRef.current.innerHTML = saved;
    }
  }, [documentId]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (!selection.isCollapsed && rect.width > 0) {
        setToolbarPosition({ top: Math.max(rect.top - 40, 5), left: rect.left + rect.width / 2 });
        setShowToolbar(true);
        setShowSlashMenu(false);
      } else {
        setShowToolbar(false);
      }

      const formats: string[] = [];
      const parent = selection.anchorNode?.parentElement;
      if (parent) {
        if (parent.tagName === 'B' || parent.style.fontWeight === 'bold') formats.push('bold');
        if (parent.tagName === 'I' || parent.style.fontStyle === 'italic') formats.push('italic');

        const list = getAncestor(parent, ['UL', 'OL']);
        if (list) formats.push(list.tagName === 'UL' ? 'bullet' : 'ordered');

        const heading = getAncestor(parent, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
        if (heading) formats.push(heading.tagName.toLowerCase());
      }

      setActiveFormats(formats);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [content]);

  const getAncestor = (el: Element, tags: string[]): Element | null => {
    while (el) {
      if (tags.includes(el.tagName)) return el;
      if (!el.parentElement) break;
      el = el.parentElement;
    }
    return null;
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setContent(html);
    setIsEmpty(html.replace(/<[^>]+>/g, '').trim() === "");

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = window.setTimeout(() => {
      localStorage.setItem(`wrdspc-content-${documentId}`, html);
      toast("Changes saved", { duration: 1000, position: "bottom-right" });
      saveTimeoutRef.current = null;
    }, 1000);
  };

  const handleFormatText = (format: string) => {
    const cmd = {
      bold: () => document.execCommand('bold'),
      italic: () => document.execCommand('italic'),
      bullet: () => document.execCommand('insertUnorderedList'),
      ordered: () => document.execCommand('insertOrderedList'),
      date: () => document.execCommand('insertText', false, new Date().toLocaleDateString()),
      time: () => document.execCommand('insertText', false, new Date().toLocaleTimeString()),
      table: insertTable,
    };

    if (format.startsWith('h')) {
      document.execCommand('formatBlock', false, `<${format}>`);
    } else {
      cmd[format as keyof typeof cmd]?.();
    }

    handleContentChange();
    setShowSlashMenu(false);
    setSlashQuery("");
  };

  const insertTable = () => {
    const html = `
      <table>
        <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr>
        <tr><td>Row 1, Cell 1</td><td>Row 1, Cell 2</td><td>Row 1, Cell 3</td></tr>
        <tr><td>Row 2, Cell 1</td><td>Row 2, Cell 2</td><td>Row 2, Cell 3</td></tr>
      </table>
    `;
    document.execCommand('insertHTML', false, html);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand(e.shiftKey ? 'outdent' : 'indent');
      handleContentChange();
    } else if (e.key === '/') {
      const sel = window.getSelection();
      if (sel?.rangeCount) {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setSlashPosition({ top: rect.bottom + 10, left: rect.left });
        setShowSlashMenu(true);
        setSlashQuery("");
        setShowToolbar(false);
      }
    } else if (e.key === 'Escape') {
      setShowSlashMenu(false);
      setSlashQuery("");
    } else if (showSlashMenu) {
      if (e.key === 'Enter' && slashQuery) {
        e.preventDefault();
      } else if (e.key === 'Backspace' && !slashQuery) {
        setShowSlashMenu(false);
      } else if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setSlashQuery(prev => e.key === 'Backspace' ? prev.slice(0, -1) : prev + e.key);
      }
    }
  };

  const handleCommandSelect = (cmd: string) => {
    handleFormatText(cmd);
    setShowSlashMenu(false);
    setSlashQuery("");
  };

  return (
    <div className="relative">
      {showToolbar && (
        <div
          style={{ position: 'fixed', top: toolbarPosition.top, left: toolbarPosition.left, transform: 'translateX(-50%)', zIndex: 50 }}
          className="animate-in"
        >
          <EditorToolbar onFormatText={handleFormatText} activeFormats={activeFormats} />
        </div>
      )}

      {showSlashMenu && (
        <SlashCommandMenu
          position={slashPosition}
          query={slashQuery}
          onCommandSelect={handleCommandSelect}
          onClose={() => { setShowSlashMenu(false); setSlashQuery(""); }}
        />
      )}

      <div
        ref={editorRef}
        contentEditable
        className="outline-none editor-content min-h-[70vh] py-4 bg-background px-6 text-left"
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ direction: 'ltr', textAlign: 'left' }}
      />

      {isEmpty && (
        <div className="absolute top-4 left-6 pointer-events-none text-muted-foreground" style={{ zIndex: 5 }}>
          Start writing here...
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
