
import { useState } from "react";

interface TagSystemProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagSystem = ({ tags, onTagsChange }: TagSystemProps) => {
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      onTagsChange(updatedTags);
      setNewTag("");
    }
    setShowTagInput(false);
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    onTagsChange(updatedTags);
  };

  return (
    <div className="mb-3 flex flex-wrap gap-2 items-center">
      {tags.map(tag => (
        <div key={tag} className="bg-secondary text-secondary-foreground text-sm px-2 py-1 rounded-md flex items-center gap-1">
          <span>#{tag}</span>
          <button 
            onClick={() => removeTag(tag)}
            className="hover:text-destructive focus:outline-none"
          >
            ×
          </button>
        </div>
      ))}
      
      {showTagInput ? (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">#</span>
          <input
            autoFocus
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTag();
              } else if (e.key === 'Escape') {
                setShowTagInput(false);
              }
            }}
            onBlur={addTag}
            className="border-none bg-transparent outline-none focus:ring-0 text-sm"
            placeholder="Enter tag..."
          />
        </div>
      ) : (
        <button
          onClick={() => setShowTagInput(true)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <span>+</span>
          <span>Add tag</span>
        </button>
      )}
    </div>
  );
};

export default TagSystem;
