/**
 * Drag and drop functionality for blocks
 */
export class DragDropManager {
  private draggedElement: HTMLElement | null = null;
  private placeholder: HTMLElement | null = null;
  private onDrop?: (draggedId: string, targetId: string, position: 'before' | 'after') => void;

  constructor(
    container: HTMLElement,
    onDrop?: (draggedId: string, targetId: string, position: 'before' | 'after') => void
  ) {
    this.onDrop = onDrop;
    this.setupDragDrop(container);
  }

  private setupDragDrop(container: HTMLElement): void {
    container.addEventListener('dragstart', this.handleDragStart);
    container.addEventListener('dragover', this.handleDragOver);
    container.addEventListener('drop', this.handleDrop);
    container.addEventListener('dragend', this.handleDragEnd);
    container.addEventListener('dragleave', this.handleDragLeave);
  }

  private handleDragStart = (e: DragEvent): void => {
    const target = e.target as HTMLElement;
    const dragHandle = target.closest('.block-drag-handle');

    if (!dragHandle) return;

    const block = dragHandle.closest('.notioner-block') as HTMLElement;
    if (!block) return;

    this.draggedElement = block;
    block.addClass('dragging');

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', block.innerHTML);
    }

    // Create placeholder
    this.placeholder = document.createElement('div');
    this.placeholder.addClass('block-drop-placeholder');
    this.placeholder.style.height = `${block.offsetHeight}px`;
  };

  private handleDragOver = (e: DragEvent): void => {
    e.preventDefault();

    if (!this.draggedElement || !this.placeholder) return;

    const target = e.target as HTMLElement;
    const targetBlock = target.closest('.notioner-block') as HTMLElement;

    if (!targetBlock || targetBlock === this.draggedElement) return;

    const rect = targetBlock.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;

    // Determine if we should place before or after
    if (e.clientY < midpoint) {
      targetBlock.parentNode?.insertBefore(this.placeholder, targetBlock);
    } else {
      targetBlock.parentNode?.insertBefore(this.placeholder, targetBlock.nextSibling);
    }
  };

  private handleDrop = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.draggedElement || !this.placeholder) return;

    // Insert dragged element at placeholder position
    this.placeholder.parentNode?.insertBefore(this.draggedElement, this.placeholder);

    const draggedId = this.draggedElement.getAttribute('data-block-id') || '';
    const targetBlock = this.placeholder.previousElementSibling || this.placeholder.nextElementSibling;
    const targetId = targetBlock?.getAttribute('data-block-id') || '';
    const position: 'before' | 'after' = this.placeholder.previousElementSibling ? 'after' : 'before';

    // Callback
    if (this.onDrop && draggedId && targetId) {
      this.onDrop(draggedId, targetId, position);
    }

    this.cleanup();
  };

  private handleDragEnd = (): void => {
    this.cleanup();
  };

  private handleDragLeave = (e: DragEvent): void => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('notioner-block')) {
      target.removeClass('drag-over');
    }
  };

  private cleanup(): void {
    if (this.draggedElement) {
      this.draggedElement.removeClass('dragging');
      this.draggedElement = null;
    }

    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.removeChild(this.placeholder);
      this.placeholder = null;
    }
  }

  /**
   * Destroy drag drop manager
   */
  destroy(container: HTMLElement): void {
    container.removeEventListener('dragstart', this.handleDragStart);
    container.removeEventListener('dragover', this.handleDragOver);
    container.removeEventListener('drop', this.handleDrop);
    container.removeEventListener('dragend', this.handleDragEnd);
    container.removeEventListener('dragleave', this.handleDragLeave);
    this.cleanup();
  }
}
