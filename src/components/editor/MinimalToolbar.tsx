
import { TOOLBAR_OPTIONS } from "./toolbar-options";

interface MinimalToolbarProps {
  onFormat: (cmd: string) => void;
}

const MinimalToolbar = ({ onFormat }: MinimalToolbarProps) => {
  return (
    <div className="sticky top-16 z-20 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-lg p-1.5 mb-4 flex flex-wrap gap-1 transition-all">
      {TOOLBAR_OPTIONS.slice(0, 5).map(opt => (
        <button
          key={opt.id}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition-colors"
          onClick={() => onFormat(opt.id)}
          type="button"
          title={opt.label}
        >
          {opt.icon}
        </button>
      ))}
      <div className="h-6 border-r border-border mx-1"></div>
      {TOOLBAR_OPTIONS.slice(5, 8).map(opt => (
        <button
          key={opt.id}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition-colors"
          onClick={() => onFormat(opt.id)}
          type="button"
          title={opt.label}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
};

export default MinimalToolbar;
