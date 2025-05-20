
import { 
  AlignLeft, Bold, Italic, Underline, Code, Link, Image, 
  Heading1, Heading2, Heading3, Heading4, List, ListOrdered, 
  CheckSquare, Text
} from "lucide-react";

export const TOOLBAR_OPTIONS = [
  { id: "normal", label: "Normal Text", icon: Text, style: { fontSize: 16, fontWeight: 'normal' } },
  { id: "h1", label: "Heading 1", icon: Heading1, style: { fontSize: 32, fontWeight: 700 } },
  { id: "h2", label: "Heading 2", icon: Heading2, style: { fontSize: 24, fontWeight: 700 } },
  { id: "h3", label: "Heading 3", icon: Heading3, style: { fontSize: 18, fontWeight: 700 } },
  { id: "h4", label: "Heading 4", icon: Heading4, style: { fontSize: 16, fontWeight: 700 } },
  { id: "bold", label: "Bold", icon: Bold, style: { fontWeight: 700 } },
  { id: "italic", label: "Italic", icon: Italic, style: { fontStyle: "italic" } },
  { id: "underline", label: "Underline", icon: Underline, style: { textDecoration: "underline" } },
  { id: "code", label: "Code Block", icon: Code, style: {} },
  { id: "link", label: "Link", icon: Link, style: {} },
  { id: "image", label: "Image", icon: Image, style: {} },
  { id: "ordered", label: "Numbered List", icon: ListOrdered, style: {} },
  { id: "bullet", label: "Bulleted List", icon: List, style: {} },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare, style: {} },
];
