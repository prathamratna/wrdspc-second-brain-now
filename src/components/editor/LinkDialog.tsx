
import { useState } from "react";

interface LinkDialogProps {
  onClose: () => void;
  onInsert: (url: string) => void;
}

const LinkDialog = ({ onClose, onInsert }: LinkDialogProps) => {
  const [linkUrl, setLinkUrl] = useState("");

  const handleInsert = () => {
    if (!linkUrl.trim()) {
      onClose();
      return;
    }
    onInsert(linkUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-card p-4 rounded-md shadow-lg w-full max-w-md mx-4">
        <h3 className="font-bold mb-4 text-foreground">Insert Link</h3>
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mb-4"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button 
            onClick={handleInsert}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkDialog;
