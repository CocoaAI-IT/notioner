import { App, PluginSettingTab, Setting } from 'obsidian';
import NotionerPlugin from './main';
import { NotionerSettings } from './types';

export class NotionerSettingTab extends PluginSettingTab {
  plugin: NotionerPlugin;

  constructor(app: App, plugin: NotionerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Notioner Settings' });

    new Setting(containerEl)
      .setName('Enable slash command')
      .setDesc('Enable the "/" command menu for inserting blocks')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableSlashCommand)
        .onChange(async (value) => {
          this.plugin.settings.enableSlashCommand = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Enable drag & drop')
      .setDesc('Enable drag and drop for reordering blocks')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableDragDrop)
        .onChange(async (value) => {
          this.plugin.settings.enableDragDrop = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Default font size')
      .setDesc('Default font size for text blocks (in pixels)')
      .addText(text => text
        .setPlaceholder('16')
        .setValue(String(this.plugin.settings.defaultFontSize))
        .onChange(async (value) => {
          const numValue = parseInt(value);
          if (!isNaN(numValue) && numValue > 0) {
            this.plugin.settings.defaultFontSize = numValue;
            await this.plugin.saveSettings();
          }
        }));

    new Setting(containerEl)
      .setName('Maximum image width')
      .setDesc('Maximum width for images in pixels')
      .addText(text => text
        .setPlaceholder('800')
        .setValue(String(this.plugin.settings.imageMaxWidth))
        .onChange(async (value) => {
          const numValue = parseInt(value);
          if (!isNaN(numValue) && numValue > 0) {
            this.plugin.settings.imageMaxWidth = numValue;
            await this.plugin.saveSettings();
          }
        }));
  }
}
