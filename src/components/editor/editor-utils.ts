
export const getToolbarPosition = () => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount) {
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    return {
      top: rect.top + window.scrollY + 30,
      left: rect.left + window.scrollX,
    };
  }
  return null;
};

export const formatContent = (cmd: string, selectedText: string = '') => {
  if (!document) return;

  // Apply formatting
  switch (cmd) {
    case "normal":
      document.execCommand("formatBlock", false, "p");
      break;
    case "link":
      return "link";
    case "image":
      return "image";
    case "code":
      if (selectedText) {
        document.execCommand("insertHTML", false, `<pre style="background: hsl(var(--muted)); padding: 0.75rem; border-radius: 0.375rem; overflow-x: auto;"><code>${selectedText}</code></pre>`);
      } else {
        document.execCommand("insertHTML", false, `<pre style="background: hsl(var(--muted)); padding: 0.75rem; border-radius: 0.375rem; overflow-x: auto;"><code>Code block</code></pre>`);
      }
      break;
    case "underline":
      document.execCommand("underline");
      break;
    case "bold":
      document.execCommand("bold");
      break;
    case "italic":
      document.execCommand("italic");
      break;
    case "h1":
      document.execCommand("formatBlock", false, "H1");
      setTimeout(() => {
        document.execCommand("fontSize", false, "7");
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.style.fontSize = "32px";
          sel.anchorNode.parentElement.style.fontWeight = "bold";
        }
      }, 0);
      break;
    case "h2":
      document.execCommand("formatBlock", false, "H2");
      setTimeout(() => {
        document.execCommand("fontSize", false, "6");
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.style.fontSize = "24px";
          sel.anchorNode.parentElement.style.fontWeight = "bold";
        }
      }, 0);
      break;
    case "h3":
      document.execCommand("formatBlock", false, "H3");
      setTimeout(() => {
        document.execCommand("fontSize", false, "5");
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.style.fontSize = "18px";
          sel.anchorNode.parentElement.style.fontWeight = "bold";
        }
      }, 0);
      break;
    case "h4":
      document.execCommand("formatBlock", false, "H4");
      setTimeout(() => {
        document.execCommand("fontSize", false, "4");
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentElement) {
          sel.anchorNode.parentElement.style.fontSize = "16px";
          sel.anchorNode.parentElement.style.fontWeight = "bold";
        }
      }, 0);
      break;
    case "ordered":
      document.execCommand("insertOrderedList");
      break;
    case "bullet":
      document.execCommand("insertUnorderedList");
      break;
    case "checkbox":
      document.execCommand("insertHTML", false, '<input type="checkbox" style="margin-right:8px;" />');
      break;
  }
  
  return null;
};
