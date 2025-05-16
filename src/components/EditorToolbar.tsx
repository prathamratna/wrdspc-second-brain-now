
import { Bold, Italic, List, ListOrdered, Table, Heading1, Heading2, Heading3 } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

interface EditorToolbarProps {
  onFormatText: (format: string) => void;
  activeFormats: string[];
}

const EditorToolbar = ({ onFormatText, activeFormats }: EditorToolbarProps) => {
  return (
    <div className="editor-toolbar bg-card/80 backdrop-blur-sm border px-2 py-1 flex items-center gap-1">
      <Toggle
        size="sm"
        pressed={activeFormats.includes("bold")}
        onPressedChange={() => onFormatText("bold")}
        title="Bold"
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={activeFormats.includes("italic")}
        onPressedChange={() => onFormatText("italic")}
        title="Italic"
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      
      <Separator orientation="vertical" className="mx-1 h-5" />
      
      <Toggle
        size="sm"
        pressed={activeFormats.includes("bullet")}
        onPressedChange={() => onFormatText("bullet")}
        title="Bullet List"
        aria-label="Toggle bullet list"
      >
        <List className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={activeFormats.includes("ordered")}
        onPressedChange={() => onFormatText("ordered")}
        title="Numbered List"
        aria-label="Toggle numbered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={activeFormats.includes("table")}
        onPressedChange={() => onFormatText("table")}
        title="Insert Table"
        aria-label="Insert table"
      >
        <Table className="h-4 w-4" />
      </Toggle>
      
      <Separator orientation="vertical" className="mx-1 h-5" />
      
      <Toggle
        size="sm"
        pressed={activeFormats.includes("h1")}
        onPressedChange={() => onFormatText("h1")}
        title="Heading 1"
        aria-label="Format as heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={activeFormats.includes("h2")}
        onPressedChange={() => onFormatText("h2")}
        title="Heading 2"
        aria-label="Format as heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={activeFormats.includes("h3")}
        onPressedChange={() => onFormatText("h3")}
        title="Heading 3"
        aria-label="Format as heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default EditorToolbar;
