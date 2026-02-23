# Hugo 博客写作助手 - Windows 打包说明

## 一、环境准备

1. 安装 Python 3.8+（确保已加入 PATH）
2. 安装依赖：

```bash
cd d:\blog\hugo_extended_withdeploy_0.148.2_windows-amd64\dev\tools
pip install -r requirements.txt
pip install pyinstaller
```

## 二、打包方式

### 方式 A：使用批处理（推荐）

双击运行 `build_exe.bat`，或在终端执行：

```bash
cd d:\blog\hugo_extended_withdeploy_0.148.2_windows-amd64\dev\tools
build_exe.bat
```

### 方式 B：手动命令

```bash
cd d:\blog\hugo_extended_withdeploy_0.148.2_windows-amd64\dev\tools

# 1. 安装依赖
pip install customtkinter pypinyin pyinstaller

# 2. 使用 spec 打包（自动包含 CustomTkinter themes）
pyinstaller --clean --noconfirm hugo_blog_writer.spec
```

### 方式 C：纯命令行（不推荐，可能漏掉主题资源）

```bash
pyinstaller -F -w ^
  --add-data "%(python -c "import customtkinter; import os; print(os.path.join(os.path.dirname(customtkinter.__file__), 'assets') + ';customtkinter/assets'")")%" ^
  -i icon.ico ^
  hugo_blog_writer.py
```

推荐使用 spec 文件，因为 `get_customtkinter_datas()` 会自动定位并打包 `customtkinter/assets`（含 themes 主题）。

## 三、添加自定义图标

1. 准备一个 `.ico` 图标文件（如 `icon.ico`），放在 `tools` 目录下。

2. 编辑 `hugo_blog_writer.spec`，找到：

```python
# icon='icon.ico',
```

改为（取消注释，路径可为相对或绝对）：

```python
icon='icon.ico',
```

或使用绝对路径：

```python
icon=r'd:\blog\dev\tools\icon.ico',
```

3. 重新执行打包命令。

## 四、输出说明

- 打包完成后，可执行文件位于：`dist/HugoBlogWriter.exe`
- 单文件模式：只有一个 exe，无需附带其他文件
- 无控制台：运行时不会出现黑色命令行窗口

## 五、常见问题

### 1. 运行报错「找不到外观主题」

- 原因：CustomTkinter 的 `assets/themes` 未被打包进去。
- 解决：使用 `hugo_blog_writer.spec` 打包，其中的 `get_customtkinter_datas()` 会正确包含主题资源。

### 2. 杀毒软件误报

- 现象：Windows Defender 或第三方杀毒可能将 PyInstaller 打包的 exe 报为威胁。
- 应对：
  - 添加排除项：将 `dist/HugoBlogWriter.exe` 或整个 `dist` 目录加入杀毒软件白名单。
  - 使用代码签名：对 exe 进行数字签名（需购买证书）可减少误报。
  - 使用 `--noupx`：在 spec 的 `EXE()` 中设置 `upx=False`，有时可降低误报率。

### 3. 打包体积偏大

- 正常：单文件 exe 会包含 Python 运行时和依赖，约 30–60 MB。
- 若需缩小：改用目录模式（去掉 `-F`），在 spec 中调整 `EXE()` 参数，输出为文件夹，体积会小一些。

## 六、参数速查

| 参数 | 说明 |
|------|------|
| `-F` / `--onefile` | 单文件输出 |
| `-w` / `--windowed` | 无控制台（GUI 程序） |
| `--clean` | 清理临时文件后再打包 |
| `--noconfirm` | 覆盖输出目录时不询问 |
| `-i icon.ico` | 指定 exe 图标 |
