import { Block, BlockType } from '../types';

export class BlockRenderer {
  /**
   * Render a block to HTML element
   */
  renderBlock(block: Block): HTMLElement {
    const container = document.createElement('div');
    container.addClass('notioner-block');
    container.setAttribute('data-block-id', block.id);
    container.setAttribute('data-block-type', block.type);

    // Apply block properties
    this.applyBlockStyles(container, block);

    // Render based on block type
    const content = this.renderBlockContent(block);
    container.appendChild(content);

    // Add block controls
    this.addBlockControls(container, block);

    return container;
  }

  /**
   * Render block content based on type
   */
  private renderBlockContent(block: Block): HTMLElement {
    switch (block.type) {
      case 'paragraph':
        return this.renderParagraph(block);
      case 'heading1':
      case 'heading2':
      case 'heading3':
      case 'heading4':
      case 'heading5':
      case 'heading6':
        return this.renderHeading(block);
      case 'image':
        return this.renderImage(block);
      case 'grid':
      case 'columns':
        return this.renderGrid(block);
      case 'bulletList':
        return this.renderBulletList(block);
      case 'numberedList':
        return this.renderNumberedList(block);
      case 'checkbox':
        return this.renderCheckbox(block);
      case 'quote':
        return this.renderQuote(block);
      case 'divider':
        return this.renderDivider(block);
      case 'code':
        return this.renderCode(block);
      case 'callout':
        return this.renderCallout(block);
      case 'toggle':
        return this.renderToggle(block);
      default:
        return this.renderParagraph(block);
    }
  }

  private renderParagraph(block: Block): HTMLElement {
    const p = document.createElement('p');
    p.addClass('notioner-paragraph');
    p.contentEditable = 'true';
    p.textContent = block.content;
    return p;
  }

  private renderHeading(block: Block): HTMLElement {
    const level = parseInt(block.type.replace('heading', ''));
    const heading = document.createElement(`h${level}`) as HTMLHeadingElement;
    heading.addClass('notioner-heading');
    heading.contentEditable = 'true';
    heading.textContent = block.content;
    return heading;
  }

  private renderImage(block: Block): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.addClass('notioner-image-wrapper');

    const img = document.createElement('img');
    img.addClass('notioner-image');
    img.src = block.content;
    img.alt = block.properties.alt || '';

    if (block.properties.width) {
      img.style.width = typeof block.properties.width === 'number'
        ? `${block.properties.width}px`
        : block.properties.width;
    }
    if (block.properties.height) {
      img.style.height = typeof block.properties.height === 'number'
        ? `${block.properties.height}px`
        : block.properties.height;
    }

    // Add resize handles
    this.addResizeHandles(wrapper, img);

    wrapper.appendChild(img);
    return wrapper;
  }

  private renderGrid(block: Block): HTMLElement {
    const grid = document.createElement('div');
    grid.addClass('notioner-grid');

    const columns = block.properties.columns || 2;
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    if (block.children && block.children.length > 0) {
      block.children.forEach(child => {
        const childElement = this.renderBlock(child);
        grid.appendChild(childElement);
      });
    } else {
      // Add placeholder columns
      for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.addClass('notioner-grid-column');
        column.textContent = 'Column ' + (i + 1);
        grid.appendChild(column);
      }
    }

    return grid;
  }

  private renderBulletList(block: Block): HTMLElement {
    const li = document.createElement('li');
    li.addClass('notioner-bullet-list');
    li.contentEditable = 'true';
    li.textContent = block.content;
    return li;
  }

  private renderNumberedList(block: Block): HTMLElement {
    const li = document.createElement('li');
    li.addClass('notioner-numbered-list');
    li.contentEditable = 'true';
    li.textContent = block.content;
    return li;
  }

  private renderCheckbox(block: Block): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.addClass('notioner-checkbox');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = block.properties.checked || false;

    const label = document.createElement('span');
    label.contentEditable = 'true';
    label.textContent = block.content;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    return wrapper;
  }

  private renderQuote(block: Block): HTMLElement {
    const blockquote = document.createElement('blockquote');
    blockquote.addClass('notioner-quote');
    blockquote.contentEditable = 'true';
    blockquote.textContent = block.content;
    return blockquote;
  }

  private renderDivider(block: Block): HTMLElement {
    const hr = document.createElement('hr');
    hr.addClass('notioner-divider');
    return hr;
  }

  private renderCode(block: Block): HTMLElement {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.addClass('notioner-code');
    code.contentEditable = 'true';
    code.textContent = block.content;
    pre.appendChild(code);
    return pre;
  }

  private renderCallout(block: Block): HTMLElement {
    const callout = document.createElement('div');
    callout.addClass('notioner-callout');
    callout.contentEditable = 'true';
    callout.textContent = block.content;

    const type = block.properties.calloutType || 'info';
    callout.addClass(`callout-${type}`);

    return callout;
  }

  private renderToggle(block: Block): HTMLElement {
    const toggle = document.createElement('details');
    toggle.addClass('notioner-toggle');

    const summary = document.createElement('summary');
    summary.textContent = block.content || 'Toggle';

    const content = document.createElement('div');
    content.addClass('toggle-content');

    if (block.children && block.children.length > 0) {
      block.children.forEach(child => {
        content.appendChild(this.renderBlock(child));
      });
    }

    toggle.appendChild(summary);
    toggle.appendChild(content);
    return toggle;
  }

  /**
   * Apply styles based on block properties
   */
  private applyBlockStyles(element: HTMLElement, block: Block): void {
    if (block.properties.color) {
      element.style.color = block.properties.color;
    }
    if (block.properties.backgroundColor) {
      element.style.backgroundColor = block.properties.backgroundColor;
    }
    if (block.properties.align) {
      element.style.textAlign = block.properties.align;
    }
  }

  /**
   * Add block control buttons (drag handle, menu, etc.)
   */
  private addBlockControls(container: HTMLElement, block: Block): void {
    const controls = document.createElement('div');
    controls.addClass('notioner-block-controls');

    // Drag handle
    const dragHandle = document.createElement('div');
    dragHandle.addClass('block-drag-handle');
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.setAttribute('draggable', 'true');
    controls.appendChild(dragHandle);

    container.prepend(controls);
  }

  /**
   * Add resize handles to image
   */
  private addResizeHandles(wrapper: HTMLElement, img: HTMLImageElement): void {
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];

    handles.forEach(handle => {
      const resizeHandle = document.createElement('div');
      resizeHandle.addClass('resize-handle');
      resizeHandle.addClass(`resize-handle-${handle}`);
      resizeHandle.setAttribute('data-direction', handle);
      wrapper.appendChild(resizeHandle);
    });
  }
}
