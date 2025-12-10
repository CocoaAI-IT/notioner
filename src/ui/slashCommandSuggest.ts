import { EditorSuggest, EditorPosition, EditorSuggestTriggerInfo, EditorSuggestContext, TFile, Editor } from 'obsidian';
import NotionerPlugin from '../main';
import { SlashCommandItem } from '../types';
import { SLASH_COMMANDS, filterCommands } from '../commands/slashCommands';

export class SlashCommandSuggest extends EditorSuggest<SlashCommandItem> {
  plugin: NotionerPlugin;

  constructor(plugin: NotionerPlugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  onTrigger(cursor: EditorPosition, editor: Editor, file: TFile): EditorSuggestTriggerInfo | null {
    if (!this.plugin.settings.enableSlashCommand) {
      return null;
    }

    const line = editor.getLine(cursor.line);
    const textBeforeCursor = line.substring(0, cursor.ch);

    // Check if we have a slash command trigger
    const match = textBeforeCursor.match(/(?:^|\s)\/(\w*)$/);

    if (match) {
      console.log('Notioner: Slash command triggered with query:', match[1]);
      return {
        start: { line: cursor.line, ch: cursor.ch - match[0].length },
        end: cursor,
        query: match[1] || '',
      };
    }

    return null;
  }

  getSuggestions(context: EditorSuggestContext): SlashCommandItem[] {
    const query = context.query || '';
    console.log('Notioner: Getting suggestions for query:', query);
    const suggestions = filterCommands(query);
    console.log('Notioner: Found suggestions:', suggestions.length);
    return suggestions;
  }

  renderSuggestion(item: SlashCommandItem, el: HTMLElement): void {
    const container = el.createDiv({ cls: 'notioner-suggestion-item' });

    const icon = container.createSpan({ cls: 'notioner-suggestion-icon' });
    icon.setText(item.icon);

    const content = container.createDiv({ cls: 'notioner-suggestion-content' });

    const title = content.createDiv({ cls: 'notioner-suggestion-title' });
    title.setText(item.label);

    const description = content.createDiv({ cls: 'notioner-suggestion-description' });
    description.setText(item.description);
  }

  selectSuggestion(item: SlashCommandItem, evt: MouseEvent | KeyboardEvent): void {
    if (!this.context) return;

    const editor = this.context.editor;
    const start = this.context.start;
    const end = this.context.end;

    console.log('Notioner: Selecting suggestion:', item.label);

    // Replace the slash command with the block
    const markdown = this.plugin.blockToMarkdown(this.plugin.blockManager.createBlock(item.blockType as any));

    editor.replaceRange(markdown, start, end);

    // Move cursor appropriately
    const newCursor = {
      line: start.line,
      ch: start.ch + markdown.length,
    };
    editor.setCursor(newCursor);
  }
}
