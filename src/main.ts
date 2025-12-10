import { Plugin, MarkdownView, Editor, EditorPosition } from 'obsidian';
import { NotionerSettings, DEFAULT_SETTINGS, Block, BlockType } from './types';
import { NotionerSettingTab } from './settings';
import { BlockManager } from './blocks/blockManager';
import { BlockRenderer } from './blocks/blockRenderer';
import { ImageResizer } from './ui/imageResize';
import { DragDropManager } from './ui/dragDrop';
import { SlashCommandSuggest } from './ui/slashCommandSuggest';

export default class NotionerPlugin extends Plugin {
  settings: NotionerSettings;
  blockManager: BlockManager;
  blockRenderer: BlockRenderer;
  dragDropManager: DragDropManager | null = null;

  async onload() {
    console.log('Loading Notioner plugin');

    await this.loadSettings();

    // Initialize managers
    this.blockManager = new BlockManager();
    this.blockRenderer = new BlockRenderer();

    // Add settings tab
    this.addSettingTab(new NotionerSettingTab(this.app, this));

    // Register markdown post processor
    this.registerMarkdownPostProcessor((element, context) => {
      this.processNotionerBlocks(element, context);
    });

    // Register slash command suggest
    console.log('Notioner: Registering EditorSuggest for slash commands');
    this.registerEditorSuggest(new SlashCommandSuggest(this));

    // Add commands
    this.addCommands();

    console.log('Notioner plugin loaded');
  }

  onunload() {
    console.log('Unloading Notioner plugin');

    if (this.dragDropManager) {
      const container = document.querySelector('.notioner-container');
      if (container) {
        this.dragDropManager.destroy(container as HTMLElement);
      }
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  /**
   * Convert block to markdown syntax
   */
  blockToMarkdown(block: Block): string {
    switch (block.type) {
      case 'heading1':
        return '# ';
      case 'heading2':
        return '## ';
      case 'heading3':
        return '### ';
      case 'heading4':
        return '#### ';
      case 'heading5':
        return '##### ';
      case 'heading6':
        return '###### ';
      case 'bulletList':
        return '- ';
      case 'numberedList':
        return '1. ';
      case 'checkbox':
        return '- [ ] ';
      case 'quote':
        return '> ';
      case 'divider':
        return '\n---\n';
      case 'code':
        return '```\n\n```';
      case 'image':
        return '![]()';
      case 'grid':
      case 'columns':
        return this.createGridMarkdown(block);
      case 'callout':
        return '> [!info]\n> ';
      case 'toggle':
        return '<details>\n<summary>Toggle</summary>\n\n</details>';
      default:
        return '';
    }
  }

  private createGridMarkdown(block: Block): string {
    const columns = block.properties.columns || 2;
    let markdown = `\n<div class="notioner-grid" data-columns="${columns}">\n`;

    for (let i = 0; i < columns; i++) {
      markdown += `<div class="notioner-grid-column">\n\nColumn ${i + 1}\n\n</div>\n`;
    }

    markdown += '</div>\n';
    return markdown;
  }

  private processNotionerBlocks(element: HTMLElement, context: any) {
    // Process grid blocks
    const grids = element.querySelectorAll('.notioner-grid');
    grids.forEach(grid => {
      this.setupGridBlock(grid as HTMLElement);
    });

    // Process images
    const images = element.querySelectorAll('img');
    images.forEach(img => {
      this.setupImageResize(img as HTMLImageElement);
    });

    // Setup drag and drop for blocks
    if (this.settings.enableDragDrop) {
      const container = element.querySelector('.notioner-container');
      if (container) {
        this.dragDropManager = new DragDropManager(
          container as HTMLElement,
          (draggedId, targetId, position) => {
            console.log(`Moving block ${draggedId} ${position} ${targetId}`);
            // Handle block reordering
          }
        );
      }
    }
  }

  private setupGridBlock(grid: HTMLElement) {
    const columns = parseInt(grid.getAttribute('data-columns') || '2');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    grid.style.gap = '1rem';
  }

  private setupImageResize(img: HTMLImageElement) {
    // Wrap image in resizable container
    if (img.parentElement?.classList.contains('notioner-image-wrapper')) {
      return; // Already wrapped
    }

    const wrapper = document.createElement('div');
    wrapper.addClass('notioner-image-wrapper');

    img.parentNode?.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Add resize handles
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
    handles.forEach(handle => {
      const resizeHandle = document.createElement('div');
      resizeHandle.addClass('resize-handle');
      resizeHandle.addClass(`resize-handle-${handle}`);
      resizeHandle.setAttribute('data-direction', handle);
      wrapper.appendChild(resizeHandle);
    });

    // Initialize resizer
    new ImageResizer(wrapper, img, (width, height) => {
      console.log(`Image resized to ${width}x${height}`);
    });
  }

  private addCommands() {
    // Command to insert grid
    this.addCommand({
      id: 'insert-grid',
      name: 'Insert Grid Layout',
      editorCallback: (editor: Editor) => {
        const cursor = editor.getCursor();
        const block = this.blockManager.createBlock('grid', '', { columns: 2 });
        const markdown = this.blockToMarkdown(block);
        editor.replaceRange(markdown, cursor);
      },
    });

    // Command to insert image
    this.addCommand({
      id: 'insert-image',
      name: 'Insert Image',
      editorCallback: (editor: Editor) => {
        const cursor = editor.getCursor();
        const block = this.blockManager.createBlock('image');
        const markdown = this.blockToMarkdown(block);
        editor.replaceRange(markdown, cursor);
      },
    });

    // Command to trigger slash menu
    this.addCommand({
      id: 'trigger-slash-menu',
      name: 'Trigger Slash Menu',
      editorCallback: (editor: Editor) => {
        // Simply insert a slash, EditorSuggest will handle the rest
        editor.replaceSelection('/');
      },
      hotkeys: [
        {
          modifiers: ['Mod'],
          key: '/',
        },
      ],
    });
  }
}
