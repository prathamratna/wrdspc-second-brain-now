
import { Bold, Italic, List, ListOrdered, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EditorToolbarProps {
  onFormatText: (format: string) => void;
  activeFormats: string[];
}

const EditorToolbar = ({ onFormatText, activeFormats }: EditorToolbarProps) => {
  return (
    <div className="editor-toolbar bg-card/80 backdrop-blur-sm border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText("bold")}
        className={`editor-toolbar-button ${activeFormats.includes("bold") ? "active" : ""}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText("italic")}
        className={`editor-toolbar-button ${activeFormats.includes("italic") ? "active" : ""}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-5" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText("bullet")}
        className={`editor-toolbar-button ${activeFormats.includes("bullet") ? "active" : ""}`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText("ordered")}
        className={`editor-toolbar-button ${activeFormats.includes("ordered") ? "active" : ""}`}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormatText("table")}
        className={`editor-toolbar-button ${activeFormats.includes("table") ? "active" : ""}`}
        title="Insert Table"
      >
        <Table className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="editor-toolbar-button ml-2"
          >
            Heading
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-1">
          <div className="flex flex-col gap-1">
            {[1, 2, 3].map((level) => (
              <Button 
                key={level}
                variant="ghost" 
                className="justify-start h-8"
                onClick={() => onFormatText(`h${level}`)}
              >
                H{level}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EditorToolbar;
