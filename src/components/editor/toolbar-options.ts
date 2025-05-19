
import { 
  AlignLeft, Bold, Italic, Underline, Code, Link, Image, 
  Heading1, Heading2, Heading3, Heading4, List, ListOrdered, 
  CheckSquare, Text
} from "lucide-react";

export const TOOLBAR_OPTIONS = [
  { id: "normal", label: "Normal Text", icon: <Text size={16} />, style: { fontSize: 16, fontWeight: 'normal' } },
  { id: "h1", label: "Heading 1", icon: <Heading1 size={16} />, style: { fontSize: 32, fontWeight: 700 } },
  { id: "h2", label: "Heading 2", icon: <Heading2 size={16} />, style: { fontSize: 24, fontWeight: 700 } },
  { id: "h3", label: "Heading 3", icon: <Heading3 size={16} />, style: { fontSize: 18, fontWeight: 700 } },
  { id: "h4", label: "Heading 4", icon: <Heading4 size={16} />, style: { fontSize: 16, fontWeight: 700 } },
  { id: "bold", label: "Bold", icon: <Bold size={16} />, style: { fontWeight: 700 } },
  { id: "italic", label: "Italic", icon: <Italic size={16} />, style: { fontStyle: "italic" } },
  { id: "underline", label: "Underline", icon: <Underline size={16} />, style: { textDecoration: "underline" } },
  { id: "code", label: "Code Block", icon: <Code size={16} />, style: {} },
  { id: "link", label: "Link", icon: <Link size={16} />, style: {} },
  { id: "image", label: "Image", icon: <Image size={16} />, style: {} },
  { id: "ordered", label: "Numbered List", icon: <ListOrdered size={16} />, style: {} },
  { id: "bullet", label: "Bulleted List", icon: <List size={16} />, style: {} },
  { id: "checkbox", label: "Checkbox", icon: <CheckSquare size={16} />, style: {} },
];
