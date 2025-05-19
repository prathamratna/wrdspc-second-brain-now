
import { TOOLBAR_OPTIONS } from "./toolbar-options";

interface FloatingToolbarProps {
  position: { top: number; left: number } | null;
  onFormat: (cmd: string) => void;
}

const FloatingToolbar = ({ position, onFormat }: FloatingToolbarProps) => {
  if (!position) return null;
  
  return (
    <div
      className="absolute z-50 flex flex-col gap-1 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg p-1.5 border border-border transition-all"
      style={{ top: position.top, left: position.left, minWidth: 220, fontFamily: 'Inter, sans-serif' }}
    >
      {TOOLBAR_OPTIONS.map(opt => (
        <button
          key={opt.id}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
          onMouseDown={e => { e.preventDefault(); onFormat(opt.id); }}
          type="button"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-secondary text-foreground">
            {opt.icon}
          </span>
          <span className="text-foreground text-sm font-medium">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FloatingToolbar;
