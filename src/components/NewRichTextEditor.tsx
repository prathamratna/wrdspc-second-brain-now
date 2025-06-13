import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, ReactNode } from 'react';
import { useEditor, EditorContent, ReactRenderer, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import { Suggestion, SuggestionOptions, SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import tippy, { Instance as TippyInstance, Props as TippyProps } from 'tippy.js';
import { htmlToDocx } from 'html-to-docx';
import TurndownService from 'turndown'; // Added TurndownService import
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon, List, ListOrdered, Indent, Outdent, Share2, Download, Palette, Pilcrow, Heading1, Heading2, Heading3, FileText
} from 'lucide-react'; // Added FileText for potential icon

// We will add other extensions like Highlight later as we build the toolbar.

const commandItems = [
  // Added icons to slash commands for consistency, optional
  { title: 'Heading 1', icon: Heading1, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run() },
  { title: 'Heading 2', icon: Heading2, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run() },
  { title: 'Bullet List', icon: List, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: 'Paragraph', icon: Pilcrow, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run()},
  // Add more commands later
];

interface CommandListRef {
  { title: 'Heading 1', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run() },
  { title: 'Heading 2', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run() },
  { title: 'Bullet List', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  // Add more commands later
];

interface CommandListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const CommandList = React.forwardRef<CommandListRef, SuggestionProps<any>>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item); // Call the command associated with the item
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useLayoutEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
          return true;
        }
        if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % props.items.length);
          return true;
        }
        if (e.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
      }
      return false;
    };
    // Expose the onKeyDown handler to the parent via ref
    if (ref && typeof ref === 'object') {
      (ref as React.MutableRefObject<CommandListRef | null>).current = { onKeyDown };
    }
    return () => {};
  }, [props, selectedIndex, ref, selectItem]);

  return (
    <div className="slash-command-popup">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={`slash-command-item ${index === selectedIndex ? 'is-selected' : ''}`}
            onClick={() => selectItem(index)}
          >
            {item.icon && <item.icon size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />}
            {item.title}
          </button>
        ))
      ) : (
        <div className="slash-command-item">No result</div>
      )}
    </div>
  );
});
CommandList.displayName = "CommandList";

const SlashCommandSuggestion: SuggestionOptions<any> = { // Removed Partial<>
  items: ({ query }) => {
    return commandItems
      .filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5); // Limit results
  },
  render: () => {
    let reactRenderer: ReactRenderer<CommandListRef, SuggestionProps<any>>;
    let popup: TippyInstance<TippyProps>[] | undefined;

    return {
      onStart: props => {
        reactRenderer = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy(document.body, {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },
      onUpdate(props) {
        reactRenderer.updateProps(props);
        if (!props.clientRect) {
          return;
        }
        popup?.forEach(instance =>
          instance.setProps({
            getReferenceClientRect: props.clientRect as () => DOMRect,
          })
        );
      },
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup?.forEach(instance => instance.hide());
          return true;
        }
        if (reactRenderer?.ref?.onKeyDown) {
            return reactRenderer.ref.onKeyDown(props);
        }
        return false;
      },
      onExit() {
        popup?.forEach(instance => instance.destroy());
        if (reactRenderer) { // ensure reactRenderer exists before calling destroy
          reactRenderer.destroy();
        }
      },
    };
  },
  char: '/',
  command: ({ editor, range, props }) => {
    props.command({ editor, range });
  },
  allow: ({ editor, range }) => {
    const $from = editor.state.selection.$from;
    const isAtStart = $from.parentOffset === 0;
    // Check if the character before is a space or if it's the start of a new line in a paragraph
    const textBefore = editor.state.doc.textBetween(Math.max(0, $from.pos - 1), $from.pos, "\n");
    const isAfterSpace = textBefore === ' ';
    // Allow if at the very start of the document or if the slash is for a new node.
    return editor.state.selection.empty && (isAtStart || isAfterSpace || ($from.parent.type.name === 'paragraph' && $from.parentOffset === 0) ) ;
  }
};


interface NewRichTextEditorProps {
  initialContent?: string;
  onUpdate?: (content: string) => void;
  placeholder?: string;
}

const NewRichTextEditor: React.FC<NewRichTextEditorProps> = ({
  initialContent = '',
  onUpdate,
  placeholder = 'Start typing...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit options here if needed
        // TextStyle is needed for FontFamily, Color, and potentially custom font size
        textStyle: {},
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Underline,
      FontFamily,
      TextStyle, // Ensure TextStyle is included
      Color,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Suggestion.configure(SlashCommandSuggestion),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML()); // or editor.getJSON() if you prefer JSON
      }
    },
  });

  if (!editor) {
    return null; // Or a loading state
  }

  return (
    <div className="tiptap-editor-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EditorContent editor={editor} style={{ flexGrow: 1, overflowY: 'auto' }} /> {/* Added style for scrollable content area */}
      <BottomToolbar editor={editor} />
    </div>
  );
};

// Define styles for toolbar and buttons (can be moved to a CSS file later)
const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: '8px 12px',
  backgroundColor: '#f0f0f0',
  borderTop: '1px solid #cccccc',
  // position: 'sticky', // Making it part of flex layout instead of sticky for simplicity now
  // bottom: 0,
  // left: 0,
  // right: 0,
  // zIndex: 10,
};

const buttonStyle: React.CSSProperties = {
  margin: '0 4px',
  padding: '4px 8px',
  border: '1px solid #ccc',
  background: 'white',
  cursor: 'pointer',
};

const selectStyle: React.CSSProperties = {
  margin: '0 4px',
  padding: '4px',
  border: '1px solid #ccc',
  background: 'white',
};


interface BottomToolbarProps {
  editor: Editor | null;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Determine current heading value for the select
  let currentHeadingValue = 'p';
  if (editor.isActive('heading', { level: 1 })) currentHeadingValue = 'h1';
  else if (editor.isActive('heading', { level: 2 })) currentHeadingValue = 'h2';
  else if (editor.isActive('heading', { level: 3 })) currentHeadingValue = 'h3';

  // Callback to force re-render when selection changes, to update active states
  // This is a common pattern but can be performance-intensive.
  // A more optimized way might involve specific event listeners or a state management library.
  const [, setForceUpdate] = useState({});
  useEffect(() => {
    if (editor) {
      const updateHandler = () => setForceUpdate({});
      editor.on('transaction', updateHandler);
      editor.on('selectionUpdate', updateHandler);
      return () => {
        editor.off('transaction', updateHandler);
        editor.off('selectionUpdate', updateHandler);
      };
    }
  }, [editor]);


  // Apply a base class for all toolbar buttons for easier global styling if needed
  const baseButtonStyle = "editor-toolbar-button"; // This is the class from index.css

  return (
    <div style={toolbarStyle} className="bottom-toolbar-container"> {/* Added className */}
      <select
        style={selectStyle}
        className={baseButtonStyle}
        value={editor.getAttributes('textStyle').fontFamily || ''}
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
      >
        <option value="">Default Family</option>
        <option value="Inter, sans-serif">Inter</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
        <option value="cursive">Cursive</option>
      </select>
      <select
        style={selectStyle}
        className={baseButtonStyle} // Added base class
        value={editor.getAttributes('textStyle').fontSize || 'Default'}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'Default') {
            // Unsetting a specific attribute from textStyle is tricky.
            // This might remove all textStyle marks if not handled carefully.
            // For now, this might not perfectly revert to a "default" if other textStyles (like color) are applied.
            editor.chain().focus().unsetMark('textStyle', { attributes: { fontSize: editor.getAttributes('textStyle').fontSize } }).run();
          } else {
            editor.chain().focus().setMark('textStyle', { fontSize: value }).run();
          }
        }}
      >
        <option value="Default">Default Size</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px (Default)</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
      </select>
      <select
        style={selectStyle}
        className={baseButtonStyle} // Added base class
        value={currentHeadingValue}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'p') editor.chain().focus().setParagraph().run();
          else if (value === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
          else if (value === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
          else if (value === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      <input
        type="color"
        style={{...buttonStyle, padding: '0px 2px', width: '30px', height: '30px', marginLeft: '4px', marginRight: '4px'}} // Keep some specific styles
        className={baseButtonStyle} // Added base class
        value={editor.getAttributes('textStyle').color || '#000000'}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      />
      <button
        style={buttonStyle}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${baseButtonStyle} ${editor.isActive('bold') ? 'active' : ''}`}
      ><Bold size={18} /></button>
      <button
        style={buttonStyle}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${baseButtonStyle} ${editor.isActive('italic') ? 'active' : ''}`}
      ><Italic size={18} /></button>
      <button
        style={buttonStyle}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${baseButtonStyle} ${editor.isActive('underline') ? 'active' : ''}`}
      ><UnderlineIcon size={18} /></button>
      <button
        style={buttonStyle}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${baseButtonStyle} ${editor.isActive('strike') ? 'active' : ''}`}
      ><Strikethrough size={18} /></button>
      <button
        style={buttonStyle}
        onClick={() => {
          if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }
        }}
        className={`${baseButtonStyle} ${editor.isActive('link') ? 'active' : ''}`}
      ><LinkIcon size={18} /></button>
      <button
        style={buttonStyle}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${baseButtonStyle} ${editor.isActive('bulletList') ? 'active' : ''}`}
      ><List size={18} /></button>
      <button
        style={buttonStyle}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${baseButtonStyle} ${editor.isActive('orderedList') ? 'active' : ''}`}
      ><ListOrdered size={18} /></button>
      <button
        style={buttonStyle}
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
        className={baseButtonStyle} // Added base class
      ><Outdent size={18} /></button>
      <button
        style={buttonStyle}
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
        className={baseButtonStyle} // Added base class
      ><Indent size={18} /></button>
      <span style={{ marginLeft: 'auto' }}>
        <button
          style={buttonStyle}
          className={baseButtonStyle}
          onClick={() => {
            if (!editor) return;
            const htmlContent = editor.getHTML();
            navigator.clipboard.writeText(htmlContent)
              .then(() => {
                alert('Content copied to clipboard as HTML!');
              })
              .catch(err => {
                console.error('Failed to copy HTML to clipboard:', err);
                alert('Failed to copy content. Please try again or copy manually.');
              });
          }}
        >
          <Share2 size={18} />
        </button>
        <button
          style={buttonStyle}
          className={baseButtonStyle}
          onClick={() => {
            if (!editor) return;
            const turndownService = new TurndownService();
            const htmlContent = editor.getHTML();
            const markdownContent = turndownService.turndown(htmlContent);
            navigator.clipboard.writeText(markdownContent)
              .then(() => {
                alert('Content copied to clipboard as Markdown!');
              })
              .catch(err => {
                console.error('Failed to copy Markdown to clipboard:', err);
                alert('Failed to copy content as Markdown. Please try again or copy manually.');
              });
          }}
        >
          Copy MD {/* Using text label as FileText might be ambiguous */}
        </button>
        <button
          style={buttonStyle}
          className={baseButtonStyle}
          onClick={() => { // Changed onClick for PDF print
            if (!editor) return;
            // Consider adding a brief message:
            // alert("Your document will be prepared for printing as a PDF. Please use your browser's 'Save as PDF' option.");
            window.print();
          }}
        >
          <Download size={18} />
        </button>
      </span>
    </div>
  );
};

export default NewRichTextEditor;
