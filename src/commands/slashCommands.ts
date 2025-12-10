import { SlashCommandItem, BlockType } from '../types';

export const SLASH_COMMANDS: SlashCommandItem[] = [
  // Basic text blocks
  {
    id: 'paragraph',
    label: 'Text',
    icon: '📝',
    description: 'Plain text paragraph',
    blockType: 'paragraph',
    category: 'basic',
    keywords: ['text', 'paragraph', 'p'],
  },
  {
    id: 'heading1',
    label: 'Heading 1',
    icon: 'H1',
    description: 'Large heading',
    blockType: 'heading1',
    category: 'basic',
    keywords: ['heading', 'h1', 'title'],
  },
  {
    id: 'heading2',
    label: 'Heading 2',
    icon: 'H2',
    description: 'Medium heading',
    blockType: 'heading2',
    category: 'basic',
    keywords: ['heading', 'h2', 'subtitle'],
  },
  {
    id: 'heading3',
    label: 'Heading 3',
    icon: 'H3',
    description: 'Small heading',
    blockType: 'heading3',
    category: 'basic',
    keywords: ['heading', 'h3'],
  },
  {
    id: 'bulletList',
    label: 'Bullet List',
    icon: '•',
    description: 'Bulleted list',
    blockType: 'bulletList',
    category: 'basic',
    keywords: ['bullet', 'list', 'ul'],
  },
  {
    id: 'numberedList',
    label: 'Numbered List',
    icon: '1.',
    description: 'Numbered list',
    blockType: 'numberedList',
    category: 'basic',
    keywords: ['numbered', 'list', 'ol'],
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    icon: '☑',
    description: 'To-do checkbox',
    blockType: 'checkbox',
    category: 'basic',
    keywords: ['checkbox', 'todo', 'task'],
  },
  {
    id: 'quote',
    label: 'Quote',
    icon: '"',
    description: 'Block quote',
    blockType: 'quote',
    category: 'basic',
    keywords: ['quote', 'blockquote'],
  },
  {
    id: 'divider',
    label: 'Divider',
    icon: '—',
    description: 'Horizontal divider',
    blockType: 'divider',
    category: 'basic',
    keywords: ['divider', 'separator', 'hr'],
  },
  {
    id: 'code',
    label: 'Code',
    icon: '</>',
    description: 'Code block',
    blockType: 'code',
    category: 'basic',
    keywords: ['code', 'pre'],
  },

  // Media blocks
  {
    id: 'image',
    label: 'Image',
    icon: '🖼️',
    description: 'Upload or embed image',
    blockType: 'image',
    category: 'media',
    keywords: ['image', 'img', 'picture', 'photo'],
  },

  // Layout blocks
  {
    id: 'columns',
    label: 'Columns',
    icon: '⫿',
    description: 'Create column layout',
    blockType: 'columns',
    category: 'layout',
    keywords: ['columns', 'layout', 'grid'],
  },
  {
    id: 'grid',
    label: 'Grid',
    icon: '▦',
    description: 'Create grid layout',
    blockType: 'grid',
    category: 'layout',
    keywords: ['grid', 'layout', 'gallery'],
  },

  // Advanced blocks
  {
    id: 'callout',
    label: 'Callout',
    icon: '💡',
    description: 'Highlighted callout box',
    blockType: 'callout',
    category: 'advanced',
    keywords: ['callout', 'note', 'info'],
  },
  {
    id: 'toggle',
    label: 'Toggle',
    icon: '▶',
    description: 'Collapsible toggle list',
    blockType: 'toggle',
    category: 'advanced',
    keywords: ['toggle', 'collapse', 'expand'],
  },
];

/**
 * Filter slash commands based on search query
 */
export function filterCommands(query: string): SlashCommandItem[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return SLASH_COMMANDS;
  }

  return SLASH_COMMANDS.filter(cmd => {
    return (
      cmd.label.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.keywords.some(keyword => keyword.includes(lowerQuery))
    );
  });
}

/**
 * Get command by ID
 */
export function getCommandById(id: string): SlashCommandItem | undefined {
  return SLASH_COMMANDS.find(cmd => cmd.id === id);
}
