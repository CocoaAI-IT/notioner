import { SlashCommandItem } from '../types';
import { filterCommands } from '../commands/slashCommands';

export class SlashMenu {
  private menuEl: HTMLElement;
  private items: SlashCommandItem[] = [];
  private selectedIndex: number = 0;
  private onSelect: (item: SlashCommandItem) => void;
  private onClose: () => void;

  constructor(
    onSelect: (item: SlashCommandItem) => void,
    onClose: () => void
  ) {
    this.onSelect = onSelect;
    this.onClose = onClose;
    this.menuEl = this.createMenuElement();
  }

  private createMenuElement(): HTMLElement {
    const menu = document.createElement('div');
    menu.addClass('notioner-slash-menu');
    menu.style.display = 'none';
    return menu;
  }

  /**
   * Show the menu at specified position
   */
  show(x: number, y: number, query: string = ''): void {
    this.items = filterCommands(query);
    this.selectedIndex = 0;
    this.render();

    this.menuEl.style.left = `${x}px`;
    this.menuEl.style.top = `${y}px`;
    this.menuEl.style.display = 'block';

    document.body.appendChild(this.menuEl);
  }

  /**
   * Hide the menu
   */
  hide(): void {
    this.menuEl.style.display = 'none';
    if (this.menuEl.parentNode) {
      this.menuEl.parentNode.removeChild(this.menuEl);
    }
    this.onClose();
  }

  /**
   * Update menu with search query
   */
  updateQuery(query: string): void {
    this.items = filterCommands(query);
    this.selectedIndex = 0;
    this.render();
  }

  /**
   * Navigate to previous item
   */
  selectPrevious(): void {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
    this.render();
    this.scrollToSelected();
  }

  /**
   * Navigate to next item
   */
  selectNext(): void {
    this.selectedIndex = Math.min(this.items.length - 1, this.selectedIndex + 1);
    this.render();
    this.scrollToSelected();
  }

  /**
   * Select current item
   */
  selectCurrent(): void {
    const selectedItem = this.items[this.selectedIndex];
    if (selectedItem) {
      this.onSelect(selectedItem);
      this.hide();
    }
  }

  /**
   * Render menu items
   */
  private render(): void {
    this.menuEl.empty();

    if (this.items.length === 0) {
      const noResults = document.createElement('div');
      noResults.addClass('slash-menu-no-results');
      noResults.textContent = 'No results found';
      this.menuEl.appendChild(noResults);
      return;
    }

    // Group by category
    const categories = new Map<string, SlashCommandItem[]>();
    this.items.forEach(item => {
      if (!categories.has(item.category)) {
        categories.set(item.category, []);
      }
      categories.get(item.category)!.push(item);
    });

    let globalIndex = 0;
    categories.forEach((items, category) => {
      // Category header
      const categoryHeader = document.createElement('div');
      categoryHeader.addClass('slash-menu-category');
      categoryHeader.textContent = this.getCategoryLabel(category);
      this.menuEl.appendChild(categoryHeader);

      // Category items
      items.forEach(item => {
        const itemEl = this.createMenuItem(item, globalIndex === this.selectedIndex);
        const currentIndex = globalIndex;

        itemEl.addEventListener('click', () => {
          this.onSelect(item);
          this.hide();
        });

        itemEl.addEventListener('mouseenter', () => {
          this.selectedIndex = currentIndex;
          this.render();
        });

        this.menuEl.appendChild(itemEl);
        globalIndex++;
      });
    });
  }

  /**
   * Create a menu item element
   */
  private createMenuItem(item: SlashCommandItem, isSelected: boolean): HTMLElement {
    const itemEl = document.createElement('div');
    itemEl.addClass('slash-menu-item');

    if (isSelected) {
      itemEl.addClass('selected');
    }

    const icon = document.createElement('span');
    icon.addClass('slash-menu-item-icon');
    icon.textContent = item.icon;

    const content = document.createElement('div');
    content.addClass('slash-menu-item-content');

    const label = document.createElement('div');
    label.addClass('slash-menu-item-label');
    label.textContent = item.label;

    const description = document.createElement('div');
    description.addClass('slash-menu-item-description');
    description.textContent = item.description;

    content.appendChild(label);
    content.appendChild(description);

    itemEl.appendChild(icon);
    itemEl.appendChild(content);

    return itemEl;
  }

  /**
   * Scroll to selected item
   */
  private scrollToSelected(): void {
    const selectedEl = this.menuEl.querySelector('.slash-menu-item.selected') as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Get category label
   */
  private getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      basic: 'Basic blocks',
      media: 'Media',
      layout: 'Layout',
      advanced: 'Advanced',
    };
    return labels[category] || category;
  }

  /**
   * Check if menu is visible
   */
  isVisible(): boolean {
    return this.menuEl.style.display !== 'none';
  }
}
