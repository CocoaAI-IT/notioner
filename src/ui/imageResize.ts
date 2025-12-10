/**
 * Image resize functionality
 */
export class ImageResizer {
  private img: HTMLImageElement;
  private wrapper: HTMLElement;
  private isResizing: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private startWidth: number = 0;
  private startHeight: number = 0;
  private currentHandle: string = '';
  private aspectRatio: number = 1;
  private onResize?: (width: number, height: number) => void;

  constructor(
    wrapper: HTMLElement,
    img: HTMLImageElement,
    onResize?: (width: number, height: number) => void
  ) {
    this.wrapper = wrapper;
    this.img = img;
    this.onResize = onResize;
    this.aspectRatio = img.naturalWidth / img.naturalHeight;
    this.setupResizeHandles();
  }

  private setupResizeHandles(): void {
    const handles = this.wrapper.querySelectorAll('.resize-handle');

    handles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => this.startResize(e as MouseEvent));
    });
  }

  private startResize(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    this.currentHandle = target.getAttribute('data-direction') || '';

    this.isResizing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startWidth = this.img.offsetWidth;
    this.startHeight = this.img.offsetHeight;

    document.addEventListener('mousemove', this.resize);
    document.addEventListener('mouseup', this.stopResize);

    this.wrapper.addClass('resizing');
  }

  private resize = (e: MouseEvent): void => {
    if (!this.isResizing) return;

    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    // Calculate new dimensions based on handle direction
    switch (this.currentHandle) {
      case 'e':
      case 'ne':
      case 'se':
        newWidth = this.startWidth + deltaX;
        newHeight = newWidth / this.aspectRatio;
        break;
      case 'w':
      case 'nw':
      case 'sw':
        newWidth = this.startWidth - deltaX;
        newHeight = newWidth / this.aspectRatio;
        break;
      case 's':
        newHeight = this.startHeight + deltaY;
        newWidth = newHeight * this.aspectRatio;
        break;
      case 'n':
        newHeight = this.startHeight - deltaY;
        newWidth = newHeight * this.aspectRatio;
        break;
    }

    // Apply minimum size constraints
    const minWidth = 100;
    const minHeight = 100;

    newWidth = Math.max(minWidth, newWidth);
    newHeight = Math.max(minHeight, newHeight);

    // Apply new dimensions
    this.img.style.width = `${newWidth}px`;
    this.img.style.height = `${newHeight}px`;

    if (this.onResize) {
      this.onResize(newWidth, newHeight);
    }
  };

  private stopResize = (): void => {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.stopResize);
    this.wrapper.removeClass('resizing');
  };

  /**
   * Destroy the resizer
   */
  destroy(): void {
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.stopResize);
  }
}
