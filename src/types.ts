export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'image'
  | 'grid'
  | 'columns'
  | 'bulletList'
  | 'numberedList'
  | 'checkbox'
  | 'quote'
  | 'divider'
  | 'code'
  | 'callout'
  | 'toggle';

export interface BlockProperties {
  color?: string;
  backgroundColor?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  width?: string | number;
  height?: string | number;
  columns?: number;
  columnRatio?: number[];
  [key: string]: any;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  properties: BlockProperties;
  children?: Block[];
}

export interface SlashCommandItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  blockType: BlockType;
  category: 'basic' | 'media' | 'layout' | 'advanced';
  keywords: string[];
}

export interface NotionerSettings {
  defaultFontSize: number;
  enableSlashCommand: boolean;
  enableDragDrop: boolean;
  imageMaxWidth: number;
}

export const DEFAULT_SETTINGS: NotionerSettings = {
  defaultFontSize: 16,
  enableSlashCommand: true,
  enableDragDrop: true,
  imageMaxWidth: 800,
};
