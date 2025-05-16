
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const COMMON_EMOJIS = [
  "📝", "📚", "✅", "🎯", "💡", "🔍", "📌", "🗓️", "📊", "🏆",
  "🧠", "💭", "💬", "📬", "🗂️", "⚡", "🌟", "🔖", "📋", "📎"
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji: string;
}

const EmojiPicker = ({ onEmojiSelect, selectedEmoji }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-10 h-10 p-0 text-xl rounded-md border-dashed"
        >
          {selectedEmoji || "📄"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-sm p-2" ref={popoverRef}>
        <div className="text-sm font-medium mb-2">Select icon</div>
        <div className="grid grid-cols-10 gap-1">
          {COMMON_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                onEmojiSelect(emoji);
                setIsOpen(false);
              }}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
