# Notioner - Notion-like Block Editor for Obsidian

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

A powerful Obsidian plugin that brings Notion-like editing experience to your notes with block-based editing, slash commands, resizable images, and flexible grid layouts.

### Features

#### Phase 1 & 2 - Core Features (Implemented)

**✨ Slash Command Menu**
- Type `/` to open an interactive command menu
- Filter blocks by typing keywords
- Navigate with arrow keys and select with Enter
- Categorized block types for easy discovery

**📝 Block Types**
- **Text Blocks**: Headings (H1-H6), Paragraphs, Quotes
- **Lists**: Bullet lists, Numbered lists, Checkboxes
- **Media**: Images with advanced features
- **Layout**: Grid and Column layouts
- **Advanced**: Callouts, Toggles, Code blocks, Dividers

**🖼️ Advanced Image Features**
- **Mouse Resize**: Drag corners and edges to resize images
- **8-Point Resize Handles**: Corner and edge handles for precise control
- **Aspect Ratio**: Maintained automatically during resize
- **Grid Display**: Display multiple images in customizable grids
- **Responsive**: Adapts to screen size

**📐 Grid & Column Layouts**
- **Multi-Column Layouts**: 2, 3, 4, or custom column counts
- **Grid Display**: Perfect for image galleries and content organization
- **Responsive Design**: Automatically adapts to mobile screens
- **Flexible Content**: Any block type can be placed in grid cells

**🎯 Drag & Drop**
- Drag blocks to reorder them
- Visual placeholder shows drop position
- Smooth animations
- Works with all block types

**⌨️ Keyboard Shortcuts**
- `Cmd/Ctrl + /`: Open slash menu
- `↑/↓`: Navigate menu items
- `Enter`: Select item
- `Esc`: Close menu

### Installation

#### From Source

1. Clone this repository:
```bash
git clone https://github.com/yourusername/notioner.git
cd notioner
```

2. Install dependencies:
```bash
npm install
```

3. Build the plugin:
```bash
npm run build
```

4. Copy `main.js`, `styles.css`, and `manifest.json` to your Obsidian vault:
```bash
cp main.js styles.css manifest.json /path/to/your/vault/.obsidian/plugins/notioner/
```

5. Enable the plugin in Obsidian Settings → Community Plugins

### Usage

#### Using Slash Commands

1. In any note, type `/` at the beginning of a line or after a space
2. A menu will appear showing available block types
3. Type to filter, or use arrow keys to navigate
4. Press Enter to insert the selected block

#### Creating Grid Layouts

**Method 1: Slash Command**
```
Type: /grid
Select: Grid or Columns from the menu
```

**Method 2: Command Palette**
```
Cmd/Ctrl + P → "Insert Grid Layout"
```

**Method 3: Manual Markdown**
```html
<div class="notioner-grid" data-columns="3">
  <div class="notioner-grid-column">
    Content 1
  </div>
  <div class="notioner-grid-column">
    Content 2
  </div>
  <div class="notioner-grid-column">
    Content 3
  </div>
</div>
```

#### Resizing Images

1. Insert an image using `![]()` syntax or slash command
2. Hover over the image to see resize handles
3. Click and drag any handle to resize
4. Corner handles resize proportionally
5. Edge handles resize in one direction

#### Drag and Drop

1. Hover over any block to see the drag handle (⋮⋮)
2. Click and hold the drag handle
3. Drag to the desired position
4. Release to drop

### Settings

Access plugin settings in: `Settings → Notioner`

- **Enable slash command**: Toggle `/` command menu
- **Enable drag & drop**: Toggle block reordering
- **Default font size**: Set default text size (pixels)
- **Maximum image width**: Set max image width (pixels)

### Development

```bash
# Install dependencies
npm install

# Development mode (auto-rebuild on changes)
npm run dev

# Production build
npm run build

# Type checking
npm run build
```

### Project Structure

```
notioner/
├── src/
│   ├── main.ts              # Plugin entry point
│   ├── types.ts             # Type definitions
│   ├── settings.ts          # Settings management
│   ├── utils.ts             # Utility functions
│   ├── blocks/
│   │   ├── blockManager.ts  # Block CRUD operations
│   │   └── blockRenderer.ts # Block rendering logic
│   ├── commands/
│   │   └── slashCommands.ts # Slash command definitions
│   └── ui/
│       ├── slashMenu.ts     # Slash menu UI
│       ├── imageResize.ts   # Image resize functionality
│       └── dragDrop.ts      # Drag & drop manager
├── styles.css               # Plugin styles
├── manifest.json            # Plugin manifest
└── package.json             # Dependencies
```

### Roadmap

#### Phase 3 - Advanced Features (Planned)
- [ ] Advanced table features (cell merge, sort, formulas)
- [ ] Database views (Table, Board, List, Gallery)
- [ ] Property types (Select, Multi-select, Date, etc.)
- [ ] More callout styles

#### Phase 4 - Extensions (Planned)
- [ ] Embed blocks (YouTube, Twitter, etc.)
- [ ] Advanced styling options
- [ ] Export/Import functionality
- [ ] Performance optimizations

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### License

MIT License - see LICENSE file for details

---

<a name="japanese"></a>
## 日本語

Notionのような編集体験をObsidianにもたらす強力なプラグインです。ブロックベースの編集、スラッシュコマンド、リサイズ可能な画像、柔軟なグリッドレイアウトを提供します。

### 機能

#### Phase 1 & 2 - コア機能（実装済み）

**✨ スラッシュコマンドメニュー**
- `/`を入力してインタラクティブなコマンドメニューを開く
- キーワードでブロックをフィルタリング
- 矢印キーでナビゲート、Enterで選択
- カテゴリー分けされたブロックタイプで簡単に発見

**📝 ブロックタイプ**
- **テキストブロック**: 見出し（H1-H6）、段落、引用
- **リスト**: 箇条書き、番号付きリスト、チェックボックス
- **メディア**: 高度な機能を持つ画像
- **レイアウト**: グリッドとカラムレイアウト
- **高度**: コールアウト、トグル、コードブロック、区切り線

**🖼️ 高度な画像機能**
- **マウスでリサイズ**: 角や辺をドラッグして画像をリサイズ
- **8点のリサイズハンドル**: 角と辺のハンドルで精密な制御
- **アスペクト比**: リサイズ中に自動的に維持
- **グリッド表示**: カスタマイズ可能なグリッドで複数の画像を表示
- **レスポンシブ**: 画面サイズに適応

**📐 グリッド＆カラムレイアウト**
- **マルチカラムレイアウト**: 2、3、4列、またはカスタム列数
- **グリッド表示**: 画像ギャラリーやコンテンツ整理に最適
- **レスポンシブデザイン**: モバイル画面に自動適応
- **柔軟なコンテンツ**: 任意のブロックタイプをグリッドセルに配置可能

**🎯 ドラッグ＆ドロップ**
- ブロックをドラッグして並び替え
- ドロップ位置を視覚的なプレースホルダーで表示
- スムーズなアニメーション
- すべてのブロックタイプで動作

**⌨️ キーボードショートカット**
- `Cmd/Ctrl + /`: スラッシュメニューを開く
- `↑/↓`: メニュー項目をナビゲート
- `Enter`: 項目を選択
- `Esc`: メニューを閉じる

### インストール

#### ソースから

1. このリポジトリをクローン:
```bash
git clone https://github.com/yourusername/notioner.git
cd notioner
```

2. 依存関係をインストール:
```bash
npm install
```

3. プラグインをビルド:
```bash
npm run build
```

4. `main.js`、`styles.css`、`manifest.json`をObsidianのvaultにコピー:
```bash
cp main.js styles.css manifest.json /path/to/your/vault/.obsidian/plugins/notioner/
```

5. Obsidianの設定 → コミュニティプラグインでプラグインを有効化

### 使い方

#### スラッシュコマンドの使用

1. 任意のノートで、行の最初またはスペースの後に`/`を入力
2. 利用可能なブロックタイプを表示するメニューが表示されます
3. 入力してフィルタリング、または矢印キーでナビゲート
4. Enterを押して選択したブロックを挿入

#### グリッドレイアウトの作成

**方法1: スラッシュコマンド**
```
入力: /grid
選択: メニューから「Grid」または「Columns」を選択
```

**方法2: コマンドパレット**
```
Cmd/Ctrl + P → "Insert Grid Layout"
```

**方法3: 手動でMarkdown**
```html
<div class="notioner-grid" data-columns="3">
  <div class="notioner-grid-column">
    コンテンツ1
  </div>
  <div class="notioner-grid-column">
    コンテンツ2
  </div>
  <div class="notioner-grid-column">
    コンテンツ3
  </div>
</div>
```

#### 画像のリサイズ

1. `![]()`構文またはスラッシュコマンドで画像を挿入
2. 画像にホバーするとリサイズハンドルが表示されます
3. 任意のハンドルをクリックしてドラッグしてリサイズ
4. 角のハンドルは比率を保ってリサイズ
5. 辺のハンドルは一方向にリサイズ

#### ドラッグ＆ドロップ

1. 任意のブロックにホバーしてドラッグハンドル（⋮⋮）を表示
2. ドラッグハンドルをクリックして保持
3. 希望の位置にドラッグ
4. リリースしてドロップ

### 設定

プラグイン設定にアクセス: `設定 → Notioner`

- **スラッシュコマンドを有効化**: `/`コマンドメニューの切り替え
- **ドラッグ＆ドロップを有効化**: ブロックの並び替えの切り替え
- **デフォルトフォントサイズ**: デフォルトのテキストサイズを設定（ピクセル）
- **画像の最大幅**: 画像の最大幅を設定（ピクセル）

### ロードマップ

#### Phase 3 - 高度な機能（予定）
- [ ] 高度な表機能（セル結合、ソート、数式）
- [ ] データベースビュー（テーブル、ボード、リスト、ギャラリー）
- [ ] プロパティタイプ（セレクト、マルチセレクト、日付など）
- [ ] より多くのコールアウトスタイル

#### Phase 4 - 拡張機能（予定）
- [ ] 埋め込みブロック（YouTube、Twitterなど）
- [ ] 高度なスタイリングオプション
- [ ] エクスポート/インポート機能
- [ ] パフォーマンス最適化

### ライセンス

MIT License
