import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import EditorToolbar from "./EditorToolbar";
import SlashCommandMenu from "./SlashCommandMenu";

// Define props for the editor component
interface RichTextEditorProps {
  initialContent?: string; // Starting content (optional, defaults to empty)
  documentId?: string; // ID for saving content to localStorage (optional, defaults to "default")
}

// Main editor component
const RichTextEditor = ({ initialContent = "", documentId = "default" }: RichTextEditorProps) => {
  // State to store the editor's HTML content
  const [content, setContent] = useState(initialContent);
  // Track active formatting (e.g., bold, italic)
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  // Show/hide the formatting toolbar
  const [showToolbar, setShowToolbar] = useState(false);
  // Show/hide the slash command menu
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  // Position for slash menu
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  // Text typed after slash for filtering commands
  const [slashQuery, setSlashQuery] = useState("");
  // Position for toolbar
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  // Check if editor is empty
  const [isEmpty, setIsEmpty] = useState(true);
  // Reference to the editor div
  const editorRef = useRef<HTMLDivElement>(null);
  // Reference to the toolbar div
  const toolbarRef = useRef<HTMLDivElement>(null);
  // Timeout for saving content
  const saveTimeoutRef = useRef<number | null>(null);

  // Load saved content from localStorage when component loads or documentId changes
  useEffect(() => {
    const savedContent = localStorage.getItem(`wrdspc-content-${documentId}`);
    if (savedContent) {
      // Process content to ensure left-to-right direction
      const processedContent = ensureLTRInHTMLContent(savedContent);
      setContent(processedContent); // Update state to display content
      setIsEmpty(processedContent.replace(/<[^>]*>/g, "").trim() === "");
    }
  }, [documentId]);

  // Ensure all HTML elements in content have left-to-right direction
  const ensureLTRInHTMLContent = (html: string): string => {
    return html.replace(/<([a-z][a-z0-9]*)\b([^>]*)>/gi, (match, tag, attributes) => {
      // Replace existing dir attribute or add new one
      if (attributes.includes("dir=")) {
        return match.replace(/dir="[^"]*"/g, 'dir="ltr"');
      }
      return `<${tag}${attributes} dir="ltr" style="direction: ltr; text-align: left;">`;
    });
  };

  // Handle text selection to show toolbar and track formatting
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      // Show toolbar when text is selected
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0) {
          const newTop = rect.top - 40;
          const newLeft = rect.left + rect.width / 2;
          setToolbarPosition({ top: newTop < 0 ? 5 : newTop, left: newLeft });
          setShowToolbar(true);
          setShowSlashMenu(false);
        }
      } else {
        setShowToolbar(false);
      }

      // Track active formats (e.g., bold, italic)
      if (selection) {
        const formats: string[] = [];
        const parentElement = selection.anchorNode?.parentElement;
        if (parentElement) {
          if (parentElement.tagName === "B" || parentElement.style.fontWeight === "bold") {
            formats.push("bold");
          }
          if (parentElement.tagName === "I" || parentElement.style.fontStyle === "italic") {
            formats.push("italic");
          }
          const parentList = getParentOfType(parentElement, ["UL", "OL"]);
          if (parentList) {
            formats.push(parentList.tagName === "UL" ? "bullet" : "ordered");
          }
          const parentHeading = getParentOfType(parentElement, ["H1", "H2", "H3", "H4", "H5", "H6"]);
          if (parentHeading) {
            formats.push(parentHeading.tagName.toLowerCase());
          }
        }
        setActiveFormats(formats);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  // Find parent element of specific tag types (e.g., UL, OL)
  const getParentOfType = (element: Element, types: string[]): Element | null => {
    let parent: Element | null = element;
    while (parent) {
      if (types.includes(parent.tagName)) return parent;
      parent = parent.parentElement;
    }
    return null;
  };

  // Save content to localStorage when it changes
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent); // Update state
      setIsEmpty(newContent.replace(/<[^>]*>/g, "").trim() === "");

      // Save to localStorage after a 1-second delay
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = window.setTimeout(() => {
        localStorage.setItem(`wrdspc-content-${documentId}`, newContent);
        toast("Changes saved", { duration: 1000, position: "bottom-right" });
        saveTimeoutRef.current = null;
      }, 1000);
    }
  };

  // Apply formatting like bold, italic, tables, etc.
  const handleFormatText = (format: string) => {
    if (!editorRef.current) return;
    switch (format) {
      case "bold":
        document.execCommand("bold", false);
        break;
      case "italic":
        document.execCommand("italic", false);
        break;
      case "bullet":
        document.execCommand("insertUnorderedList", false);
        break;
      case "ordered":
        document.execCommand("insertOrderedList", false);
        break;
      case "table":
        document.execCommand(
          "insertHTML",
          false,
          `<table dir="ltr" style="direction: ltr; text-align: left;">
            <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr>
            <tr><td>Row 1, Cell 1</td><td>Row 1, Cell 2</td><td>Row 1, Cell 3</td></tr>
            <tr><td>Row 2, Cell 1</td><td>Row 2, Cell 2</td><td>Row 2, Cell 3</td></tr>
          </table>`
        );
        break;
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        document.execCommand("formatBlock", false, `<${format} dir="ltr" style="direction: ltr; text-align: left;">`);
        break;
      case "date":
        document.execCommand("insertText", false, new Date().toLocaleDateString());
        break;
      case "time":
        document.execCommand("insertText", false, new Date().toLocaleTimeString());
        break;
    }
    handleContentChange();
    setShowSlashMenu(false);
    setSlashQuery("");
  };

  // Handle keyboard inputs (e.g., slash for commands, tab for indent)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      document.execCommand(event.shiftKey ? "outdent" : "indent");
      handleContentChange();
    } else if (event.key === "/") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSlashPosition({ top: rect.bottom + 10, left: rect.left });
        setShowSlashMenu(true);
        setSlashQuery("");
        setShowToolbar(false);
      }
    } else if (event.key === "Escape") {
      setShowSlashMenu(false);
      setSlashQuery("");
    } else if (showSlashMenu) {
      if (event.key === "Enter" && slashQuery) {
        event.preventDefault();
      } else if (event.key === "Backspace" && slashQuery.length === 0) {
        setShowSlashMenu(false);
      } else if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        setSlashQuery((prev) => (event.key === "Backspace" ? prev.slice(0, -1) : prev + event.key));
      }
    } else {
      setShowSlashMenu(false);
      setSlashQuery("");
    }
  };

  // Render the editor
  return (
    <div className="relative editor-container" dir="ltr" style={{ direction: "ltr", textAlign: "left" }}>
      {/* Toolbar for formatting options */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          style={{
            position: "fixed",
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            transform: "translateX(-50%)",
            zIndex: 50,
          }}
          className="animate-in"
          dir="ltr"
        >
          <EditorToolbar onFormatText={handleFormatText} activeFormats={activeFormats} />
        </div>
      )}

      {/* Slash command menu */}
      {showSlashMenu && (
        <SlashCommandMenu
          position={slashPosition}
          query={slashQuery}
          onCommandSelect={handleFormatText}
          onClose={() => {
            setShowSlashMenu(false);
            setSlashQuery("");
          }}
        />
      )}

      {/* Editable content area */}
      <div
        ref={editorRef}
        contentEditable={true}
        className="outline-none editor-content min-h-[70vh] py-4 bg-background px-6 text-left"
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: content }}
        dir="ltr"
        style={{ direction: "ltr", textAlign: "left", unicodeBidi: "isolate" }}
      />

      {/* Placeholder text when editor is empty */}
      {isEmpty && (
        <div
          className="absolute top-4 left-6 pointer-events-none text-muted-foreground"
          style={{ zIndex: 5 }}
          dir="ltr"
        >
          Start writing here...
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
