import { Plugin, MarkdownView, Editor, EditorPosition } from 'obsidian';
import { NotionerSettings, DEFAULT_SETTINGS, Block, SlashCommandItem } from './types';
import { NotionerSettingTab } from './settings';
import { BlockManager } from './blocks/blockManager';
import { BlockRenderer } from './blocks/blockRenderer';
import { SlashMenu } from './ui/slashMenu';
import { ImageResizer } from './ui/imageResize';
import { DragDropManager } from './ui/dragDrop';

export default class NotionerPlugin extends Plugin {
  settings: NotionerSettings;
  blockManager: BlockManager;
  blockRenderer: BlockRenderer;
  slashMenu: SlashMenu | null = null;
  dragDropManager: DragDropManager | null = null;
  private slashMenuActive: boolean = false;
  private slashMenuQuery: string = '';
  private currentEditor: Editor | null = null;

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

    // Register editor extension for slash command
    this.setupEditorExtension();

    // Add commands
    this.addCommands();

    // Register events
    this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
      this.handleKeydown(evt);
    });

    console.log('Notioner plugin loaded');
  }

  onunload() {
    console.log('Unloading Notioner plugin');

    if (this.slashMenu) {
      this.slashMenu.hide();
    }

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

  private setupEditorExtension() {
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          this.currentEditor = view.editor;
          this.setupEditorListeners(view.editor);
        }
      })
    );
  }

  private setupEditorListeners(editor: Editor) {
    // Monitor for slash command trigger
    this.registerDomEvent(
      (editor as any).cm.contentDOM,
      'input',
      (evt: InputEvent) => {
        if (!this.settings.enableSlashCommand) return;

        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);
        const beforeCursor = line.substring(0, cursor.ch);

        // Check if user typed '/' at start of line or after space
        if (beforeCursor.endsWith('/') && (beforeCursor.length === 1 || beforeCursor[beforeCursor.length - 2] === ' ')) {
          this.showSlashMenu(editor, cursor);
        } else if (this.slashMenuActive) {
          // Update menu with current query
          const slashIndex = beforeCursor.lastIndexOf('/');
          if (slashIndex !== -1) {
            this.slashMenuQuery = beforeCursor.substring(slashIndex + 1);
            if (this.slashMenu) {
              this.slashMenu.updateQuery(this.slashMenuQuery);
            }
          }
        }
      }
    );
  }

  private showSlashMenu(editor: Editor, cursor: EditorPosition) {
    if (!this.slashMenu) {
      this.slashMenu = new SlashMenu(
        (item: SlashCommandItem) => this.onSlashCommandSelect(item, editor, cursor),
        () => {
          this.slashMenuActive = false;
          this.slashMenuQuery = '';
        }
      );
    }

    // Get cursor position on screen
    const coords = (editor as any).cm.coordsAtPos(editor.posToOffset(cursor));
    if (coords) {
      this.slashMenu.show(coords.left, coords.bottom, '');
      this.slashMenuActive = true;
      this.slashMenuQuery = '';
    }
  }

  private onSlashCommandSelect(item: SlashCommandItem, editor: Editor, cursor: EditorPosition) {
    // Remove the slash command text
    const line = editor.getLine(cursor.line);
    const slashIndex = line.lastIndexOf('/');
    if (slashIndex !== -1) {
      editor.replaceRange(
        '',
        { line: cursor.line, ch: slashIndex },
        { line: cursor.line, ch: cursor.ch }
      );
    }

    // Insert the block
    this.insertBlock(item.blockType, editor, cursor);

    this.slashMenuActive = false;
  }

  private insertBlock(blockType: string, editor: Editor, cursor: EditorPosition) {
    const block = this.blockManager.createBlock(blockType as any);

    // Convert block to markdown
    const markdown = this.blockToMarkdown(block);

    // Insert into editor
    editor.replaceRange(markdown, cursor);

    // Move cursor to end of inserted content
    const newCursor = {
      line: cursor.line,
      ch: cursor.ch + markdown.length,
    };
    editor.setCursor(newCursor);
  }

  private blockToMarkdown(block: Block): string {
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

  private handleKeydown(evt: KeyboardEvent) {
    if (!this.slashMenuActive || !this.slashMenu) return;

    switch (evt.key) {
      case 'ArrowUp':
        evt.preventDefault();
        this.slashMenu.selectPrevious();
        break;
      case 'ArrowDown':
        evt.preventDefault();
        this.slashMenu.selectNext();
        break;
      case 'Enter':
        evt.preventDefault();
        this.slashMenu.selectCurrent();
        break;
      case 'Escape':
        evt.preventDefault();
        this.slashMenu.hide();
        this.slashMenuActive = false;
        break;
    }
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

    // Command to toggle slash menu
    this.addCommand({
      id: 'toggle-slash-menu',
      name: 'Toggle Slash Menu',
      editorCallback: (editor: Editor) => {
        const cursor = editor.getCursor();
        this.showSlashMenu(editor, cursor);
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
