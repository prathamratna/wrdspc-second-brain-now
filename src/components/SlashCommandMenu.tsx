
import React from 'react';

interface SlashCommandMenuProps {
  position: { top: number; left: number };
  onCommandSelect: (command: string) => void;
  onClose: () => void;
}

const SlashCommandMenu = ({ position, onCommandSelect, onClose }: SlashCommandMenuProps) => {
  const commands = [
    { id: 'h1', label: 'Heading 1', description: 'Large section heading' },
    { id: 'h2', label: 'Heading 2', description: 'Medium section heading' },
    { id: 'h3', label: 'Heading 3', description: 'Small section heading' },
    { id: 'bullet', label: 'Bullet List', description: 'Create a bulleted list' },
    { id: 'ordered', label: 'Numbered List', description: 'Create a numbered list' },
    { id: 'table', label: 'Table', description: 'Insert a table' },
  ];

  return (
    <div 
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 50,
      }}
      className="bg-card border shadow-md rounded-md p-2 w-64 animate-fade-in"
    >
      <div className="text-sm font-medium mb-2 text-muted-foreground">Format</div>
      {commands.map(cmd => (
        <button 
          key={cmd.id}
          onClick={() => onCommandSelect(cmd.id)} 
          className="flex items-center w-full text-left px-2 py-1.5 hover:bg-accent rounded-sm"
        >
          <div>
            <div className={cmd.id.startsWith('h') ? "font-bold" : ""}>{cmd.label}</div>
            <div className="text-xs text-muted-foreground">{cmd.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SlashCommandMenu;
