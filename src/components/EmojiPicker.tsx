
import { useRef, useState, useEffect } from "react";

const EMOJIS = [
  "📝", "📚", "✅", "🎯", "💡", "🔍", "📌", "🗓️", "📊", "🏆",
  "🧠", "💭", "💬", "📬", "🗂️", "⚡", "🌟", "🔖", "📋", "📎",
  "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊",
  "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗",
  "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥",
  "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜",
  "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️",
  "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨",
  "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵",
  "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇"
];

export default function EmojiPicker({ onEmojiSelect, selectedEmoji }: { onEmojiSelect: (e: string) => void, selectedEmoji: string }) {
  const [open, setOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="relative inline-block" style={{ fontFamily: 'Inter, sans-serif' }}>
      <button
        ref={iconRef}
        className="text-2xl bg-transparent border-none outline-none p-0 m-0 hover:opacity-80 transition-opacity"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select emoji"
        type="button"
      >
        {selectedEmoji || "🙂"}
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-3 z-50 bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-lg p-3"
          style={{ minWidth: 240, maxHeight: 240 }}
        >
          <div className="grid grid-cols-5 gap-3 no-scrollbar overflow-y-auto" style={{ maxHeight: 200 }}>
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="text-2xl bg-transparent hover:bg-accent p-1.5 rounded-md transition-colors flex items-center justify-center"
                onClick={() => {
                  onEmojiSelect(emoji);
                  setOpen(false);
                }}
                type="button"
                aria-label={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
