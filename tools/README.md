# Hugo 博客写作助手

本地桌面 GUI 工具，用于自动化 Hugo 博客的文章创建与 Git 部署。

## 安装依赖

```bash
pip install -r requirements.txt
```

## 运行

```bash
python hugo_blog_writer.py
```

## 功能

- **生成 Markdown 模板**：填写标题、分类、标签后，在 `content/posts/` 下创建带 Front Matter 的 md 文件，并自动用 VS Code 或系统默认编辑器打开
- **一键 Push 部署**：在博客目录执行 `git add .` → `git commit` → `git push`
- **目录记忆**：首次选择博客根目录后，配置会保存到 `~/.hugo_blog_writer_config.json`，下次打开无需重复选择

## 分类与专栏对应

| 分类         | 博客专栏 (series)    |
| ------------ | -------------------- |
| 人工智能     | Tech & Engineering   |
| 交易与量化   | Markets & Quant      |
| 文艺与思考   | Aesthetics & Words   |
| 技术工程     | Tech & Engineering   |
