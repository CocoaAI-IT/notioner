import { Block, BlockType, BlockProperties } from '../types';
import { generateId } from '../utils';

export class BlockManager {
  private blocks: Map<string, Block>;

  constructor() {
    this.blocks = new Map();
  }

  /**
   * Create a new block
   */
  createBlock(type: BlockType, content: string = '', properties: BlockProperties = {}): Block {
    const block: Block = {
      id: generateId(),
      type,
      content,
      properties,
      children: [],
    };

    this.blocks.set(block.id, block);
    return block;
  }

  /**
   * Get a block by ID
   */
  getBlock(id: string): Block | undefined {
    return this.blocks.get(id);
  }

  /**
   * Update a block
   */
  updateBlock(id: string, updates: Partial<Block>): boolean {
    const block = this.blocks.get(id);
    if (!block) return false;

    Object.assign(block, updates);
    this.blocks.set(id, block);
    return true;
  }

  /**
   * Delete a block
   */
  deleteBlock(id: string): boolean {
    return this.blocks.delete(id);
  }

  /**
   * Get all blocks
   */
  getAllBlocks(): Block[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Add a child block
   */
  addChild(parentId: string, childBlock: Block): boolean {
    const parent = this.blocks.get(parentId);
    if (!parent) return false;

    if (!parent.children) {
      parent.children = [];
    }

    parent.children.push(childBlock);
    this.blocks.set(childBlock.id, childBlock);
    return true;
  }

  /**
   * Remove a child block
   */
  removeChild(parentId: string, childId: string): boolean {
    const parent = this.blocks.get(parentId);
    if (!parent || !parent.children) return false;

    const index = parent.children.findIndex(child => child.id === childId);
    if (index === -1) return false;

    parent.children.splice(index, 1);
    return true;
  }

  /**
   * Move a block to a new position
   */
  moveBlock(blockId: string, newParentId: string, position: number): boolean {
    const block = this.blocks.get(blockId);
    const newParent = this.blocks.get(newParentId);

    if (!block || !newParent) return false;

    if (!newParent.children) {
      newParent.children = [];
    }

    // Remove from old position (if exists)
    this.blocks.forEach(b => {
      if (b.children) {
        const index = b.children.findIndex(child => child.id === blockId);
        if (index !== -1) {
          b.children.splice(index, 1);
        }
      }
    });

    // Add to new position
    newParent.children.splice(position, 0, block);
    return true;
  }

  /**
   * Clear all blocks
   */
  clear(): void {
    this.blocks.clear();
  }

  /**
   * Serialize blocks to JSON
   */
  serialize(): string {
    const blocksArray = Array.from(this.blocks.values());
    return JSON.stringify(blocksArray, null, 2);
  }

  /**
   * Deserialize blocks from JSON
   */
  deserialize(json: string): boolean {
    try {
      const blocksArray: Block[] = JSON.parse(json);
      this.blocks.clear();

      blocksArray.forEach(block => {
        this.blocks.set(block.id, block);
      });

      return true;
    } catch (error) {
      console.error('Failed to deserialize blocks:', error);
      return false;
    }
  }
}
