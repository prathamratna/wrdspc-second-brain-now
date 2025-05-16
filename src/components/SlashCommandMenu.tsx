
import React, { useEffect, useState, useRef } from 'react';

interface SlashCommandMenuProps {
  position: { top: number; left: number };
  query: string;
  onCommandSelect: (command: string) => void;
  onClose: () => void;
}

const SlashCommandMenu = ({ position, query, onCommandSelect, onClose }: SlashCommandMenuProps) => {
  const allCommands = [
    { id: 'h1', label: 'Heading 1', description: 'Large section heading' },
    { id: 'h2', label: 'Heading 2', description: 'Medium section heading' },
    { id: 'h3', label: 'Heading 3', description: 'Small section heading' },
    { id: 'h4', label: 'Heading 4', description: 'Tiny section heading' },
    { id: 'bullet', label: 'Bullet List', description: 'Create a bulleted list' },
    { id: 'ordered', label: 'Numbered List', description: 'Create a numbered list' },
    { id: 'table', label: 'Table', description: 'Insert a table' },
    { id: 'date', label: 'Date', description: 'Insert current date' },
    { id: 'time', label: 'Time', description: 'Insert current time' },
  ];
  
  const [filteredCommands, setFilteredCommands] = useState(allCommands);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const filtered = allCommands.filter(cmd => 
      cmd.label.toLowerCase().includes(query.toLowerCase()) || 
      cmd.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!filteredCommands.length) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onCommandSelect(filteredCommands[selectedIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, onCommandSelect, onClose]);

  return (
    <div 
      ref={menuRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 50,
      }}
      className="bg-card border shadow-md rounded-md p-2 w-64 animate-in"
    >
      <div className="text-sm font-medium mb-2 text-muted-foreground">Format</div>
      {filteredCommands.length > 0 ? (
        filteredCommands.map((cmd, index) => (
          <button 
            key={cmd.id}
            onClick={() => onCommandSelect(cmd.id)} 
            className={`flex items-center w-full text-left px-2 py-1.5 rounded-sm ${
              index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
            }`}
          >
            <div>
              <div className={cmd.id.startsWith('h') ? "font-bold" : ""}>{cmd.label}</div>
              <div className="text-xs text-muted-foreground">{cmd.description}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="px-2 py-1.5 text-sm text-muted-foreground">No commands found</div>
      )}
    </div>
  );
};

export default SlashCommandMenu;
