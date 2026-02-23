# Hugo 博客写作助手 - 使用说明

## 📦 安装与启动

### 方式一：直接运行 Python 脚本

1. **安装依赖**：
   ```bash
   cd d:\blog\hugo_extended_withdeploy_0.148.2_windows-amd64\dev\tools
   pip install -r requirements.txt
   ```

2. **运行程序**：
   ```bash
   python hugo_blog_writer.py
   ```

### 方式二：使用打包后的 exe（推荐）

1. 先按 `BUILD.md` 打包生成 `dist/HugoBlogWriter.exe`
2. 双击 `HugoBlogWriter.exe` 即可运行

---

## 🖥️ 界面介绍

程序窗口包含以下区域：

```
┌─────────────────────────────────────────┐
│  Hugo 博客写作助手                      │
├─────────────────────────────────────────┤
│  文章标题 (Title)                        │
│  [________________输入框________________] │
│                                         │
│  文章分类 (Categories)                  │
│  [▼ 人工智能                    ]      │
│                                         │
│  标签 (Tags)，英文逗号分隔              │
│  [________________输入框________________] │
│                                         │
│  博客根目录                              │
│  [________路径输入框________] [选择目录] │
│                                         │
│  [生成 Markdown 模板] [一键 Push 部署]   │
│                                         │
│  执行日志                                │
│  ┌─────────────────────────────────────┐ │
│  │ 日志输出区域...                    │ │
│  │                                    │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📝 使用流程

### 第一步：选择博客目录（首次使用）

1. 点击 **「选择目录」** 按钮
2. 在弹出的文件夹选择器中，导航到你的 Hugo 博客根目录（例如：`d:\blog\hugo_extended_withdeploy_0.148.2_windows-amd64\dev`）
3. 选择后，路径会自动保存，下次打开程序无需重复选择

### 第二步：填写文章信息

1. **文章标题**：在「文章标题」输入框填写标题
   - 示例：`LSTM 调参实战：从过拟合到泛化`
   - 中文标题会自动转为拼音用于文件名（需安装 `pypinyin`）

2. **文章分类**：从下拉菜单选择分类
   - `人工智能` → 对应专栏「Tech & Engineering」
   - `交易与量化` → 对应专栏「Markets & Quant」
   - `文艺与思考` → 对应专栏「Aesthetics & Words」
   - `技术工程` → 对应专栏「Tech & Engineering」

3. **标签**：在「标签」输入框填写，用**英文逗号**分隔
   - 示例：`机器学习, Python, 量化交易`
   - 多个标签：`深度学习, LSTM, 时间序列, 调参`

### 第三步：生成 Markdown 模板

1. 点击 **「生成 Markdown 模板」** 按钮
2. 程序会：
   - 在 `content/posts/` 下创建文件，命名格式：`YYYY-MM-DD-标题slug.md`
   - 自动填充 Front Matter（标题、日期、分类、标签、series、draft: false）
   - 在日志区显示成功信息
   - **自动用 VS Code 或系统默认编辑器打开文件**，方便你开始写作

3. 示例生成的文件：
   ```markdown
   ---
   title: "LSTM 调参实战：从过拟合到泛化"
   date: 2026-02-22T16:30:00+08:00
   categories: ["人工智能"]
   series: ["Tech & Engineering"]
   tags:
     - "机器学习"
     - "Python"
     - "量化交易"
   draft: false
   ---
   
   ```

### 第四步：编写文章内容

在打开的 Markdown 文件中，在 Front Matter 下方开始写作：

```markdown
---

## 引言

本文记录我在 LSTM 模型调参过程中的经验...

## 一、数据预处理

...

## 二、模型架构

...

## 总结

...
```

### 第五步：一键部署（可选）

1. 文章写完后，回到程序窗口
2. 点击 **「一键 Push 部署」** 按钮
3. 程序会在后台依次执行：
   - `git add .`
   - `git commit -m "Auto deploy: Update posts via GUI tool"`
   - `git push`
4. 执行过程会实时显示在日志区
5. 如果 Git push 成功，你的文章就会自动部署到 GitHub Pages

---

## ⚠️ 注意事项

### 1. 标题不能为空
- 点击「生成 Markdown 模板」前必须填写标题
- 否则会弹出警告并阻止生成

### 2. 博客目录必须有效
- 必须选择包含 `.git` 文件夹的目录（Git 仓库）
- 否则「一键 Push 部署」会失败

### 3. 文件名生成规则
- 格式：`YYYY-MM-DD-标题slug.md`
- 中文标题会转为拼音（需安装 `pypinyin`）
- 示例：
  - 标题「LSTM 调参经验」→ `2026-02-22-lstm-diao-can-jing-yan.md`
  - 标题「My First Post」→ `2026-02-22-my-first-post.md`

### 4. 标签格式
- 必须用**英文逗号**分隔：`标签1, 标签2, 标签3`
- 不要用中文逗号：`标签1，标签2` ❌

### 5. 自动打开文件
- 程序会优先尝试用 VS Code（`code` 命令）打开
- 如果 VS Code 未安装或不在 PATH，会使用系统默认编辑器
- 如果都失败，会在日志区提示手动打开

---

## 🔧 常见问题

### Q: 为什么中文标题没有转成拼音？
**A:** 需要安装 `pypinyin`：
```bash
pip install pypinyin
```
未安装时，文件名可能包含中文字符（Windows 通常支持，但建议安装）。

### Q: 点击「生成 Markdown 模板」后没有自动打开文件？
**A:** 
- 检查是否安装了 VS Code 并配置了 `code` 命令
- 或手动到 `content/posts/` 目录找到生成的文件

### Q: 「一键 Push 部署」失败怎么办？
**A:** 
- 检查博客目录是否正确（必须包含 `.git`）
- 检查 Git 是否已配置（`git config user.name` 和 `user.email`）
- 检查网络连接（GitHub 访问是否正常）
- 查看日志区的错误信息

### Q: 生成的 Front Matter 中 `series` 是什么？
**A:** `series` 对应你博客的专栏系统（Markets & Quant / Tech & Engineering / Aesthetics & Words），用于在首页按专栏分组显示。程序会根据你选择的分类自动设置。

---

## 💡 使用技巧

1. **批量创建草稿**：可以快速生成多个模板，都设为 `draft: false`，写完后再统一部署
2. **目录记忆**：首次选择目录后，配置保存在 `~/.hugo_blog_writer_config.json`，下次打开自动加载
3. **标签复用**：常用标签可以提前准备好，复制粘贴即可
4. **快速部署**：写完文章后，无需手动打开终端，一键完成 Git 操作

---

## 📋 完整使用示例

假设你要写一篇关于「A股止盈策略」的文章：

1. **打开程序** → 双击 `HugoBlogWriter.exe`（或运行 Python 脚本）

2. **选择目录** → 点击「选择目录」，选择 `d:\blog\hugo_extended_withdeploy_0.148.2_windows-amd64\dev`

3. **填写信息**：
   - 标题：`A股周期性止盈策略复盘`
   - 分类：选择「交易与量化」
   - 标签：`A股, 止盈, 量化策略, 复盘`

4. **生成模板** → 点击「生成 Markdown 模板」
   - 文件创建在：`content/posts/2026-02-22-a-gu-zhou-qi-xing-zhi-ying-ce-lue-fu-pan.md`
   - VS Code 自动打开

5. **编写内容** → 在 VS Code 中写文章

6. **部署** → 回到程序，点击「一键 Push 部署」
   - 等待日志显示 `git push` 成功
   - 文章自动发布到 GitHub Pages

完成！🎉
