#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hugo 博客文章创建与 Git 部署 GUI 工具
使用 CustomTkinter 实现现代化界面
"""

import os
import re
import sys
import json
import subprocess
import threading
from datetime import datetime
from pathlib import Path

# 尝试导入 pypinyin，若无则使用简化 slug
try:
    from pypinyin import lazy_pinyin, Style
    HAS_PYPINYIN = True
except ImportError:
    HAS_PYPINYIN = False

try:
    import customtkinter as ctk
except ImportError:
    print("请先安装 CustomTkinter: pip install customtkinter")
    sys.exit(1)


# 配置文件路径（用于记忆博客目录）
CONFIG_PATH = Path.home() / ".hugo_blog_writer_config.json"

# 默认分类选项（与博客专栏 series 对应）
DEFAULT_CATEGORIES = ["人工智能", "交易与量化", "文艺与思考", "技术工程"]
CATEGORY_TO_SERIES = {
    "人工智能": "Tech & Engineering",
    "交易与量化": "Markets & Quant",
    "文艺与思考": "Aesthetics & Words",
    "技术工程": "Tech & Engineering",
}


def slugify_title(title: str) -> str:
    """将标题转为用于文件名的 slug（支持中文转拼音）"""
    if not title or not title.strip():
        return ""
    title = title.strip()
    if HAS_PYPINYIN:
        py_list = lazy_pinyin(title, style=Style.NORMAL)
        slug = "-".join(py_list)
    else:
        # 无 pypinyin 时：仅保留英文、数字、中文，其余替换为连字符
        slug = re.sub(r"[^\w\-]", "-", title)
    slug = re.sub(r"-+", "-", slug).strip("-")
    if not slug:
        slug = datetime.now().strftime("%H%M%S")
    return slug[:80]


def get_iso_datetime() -> str:
    """获取当前系统时间，格式 YYYY-MM-DDTHH:MM:SS+08:00"""
    return datetime.now().strftime("%Y-%m-%dT%H:%M:%S+08:00")


def load_config() -> dict:
    """加载配置（博客目录等）"""
    if CONFIG_PATH.exists():
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"blog_path": ""}


def save_config(config: dict) -> None:
    """保存配置"""
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
    except Exception:
        pass


class HugoBlogWriterApp(ctk.CTk):
    """Hugo 博客写作助手主窗口"""

    def __init__(self):
        super().__init__()
        self.title("Hugo 博客写作助手")
        self.geometry("680x580")
        self.minsize(560, 480)

        # 加载配置
        self.config = load_config()
        self.blog_path_var = ctk.StringVar(value=self.config.get("blog_path", ""))

        # 设置主题
        ctk.set_appearance_mode("light")
        ctk.set_default_color_theme("blue")

        self._build_ui()

    def _build_ui(self):
        """构建界面"""
        main_frame = ctk.CTkFrame(self, fg_color="transparent")
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)

        # 标题
        ctk.CTkLabel(main_frame, text="文章标题 (Title)", font=ctk.CTkFont(size=13)).pack(anchor="w")
        self.title_entry = ctk.CTkEntry(main_frame, placeholder_text="请输入文章标题", height=36)
        self.title_entry.pack(fill="x", pady=(4, 12))

        # 分类
        ctk.CTkLabel(main_frame, text="文章分类 (Categories)", font=ctk.CTkFont(size=13)).pack(anchor="w")
        self.category_var = ctk.StringVar(value=DEFAULT_CATEGORIES[0])
        self.category_combo = ctk.CTkComboBox(
            main_frame, values=DEFAULT_CATEGORIES, variable=self.category_var, height=36
        )
        self.category_combo.pack(fill="x", pady=(4, 12))

        # 标签
        ctk.CTkLabel(main_frame, text="标签 (Tags)，英文逗号分隔", font=ctk.CTkFont(size=13)).pack(anchor="w")
        self.tags_entry = ctk.CTkEntry(
            main_frame, placeholder_text="例如: 机器学习, Python, 量化", height=36
        )
        self.tags_entry.pack(fill="x", pady=(4, 12))

        # 博客目录
        dir_frame = ctk.CTkFrame(main_frame, fg_color="transparent")
        dir_frame.pack(fill="x", pady=(4, 12))
        ctk.CTkLabel(dir_frame, text="博客根目录", font=ctk.CTkFont(size=13)).pack(anchor="w")
        path_frame = ctk.CTkFrame(main_frame, fg_color="transparent")
        path_frame.pack(fill="x", pady=(0, 12))
        self.path_entry = ctk.CTkEntry(
            path_frame, textvariable=self.blog_path_var, placeholder_text="选择 Hugo 博客根目录", height=36
        )
        self.path_entry.pack(side="left", fill="x", expand=True, padx=(0, 8))
        ctk.CTkButton(path_frame, text="选择目录", width=100, command=self._on_select_dir).pack(side="right")

        # 按钮区
        btn_frame = ctk.CTkFrame(main_frame, fg_color="transparent")
        btn_frame.pack(fill="x", pady=(8, 12))
        ctk.CTkButton(
            btn_frame, text="生成 Markdown 模板", command=self._on_generate, width=160, height=36
        ).pack(side="left", padx=(0, 12))
        ctk.CTkButton(btn_frame, text="一键 Push 部署", command=self._on_deploy, width=140, height=36).pack(
            side="left"
        )

        # 日志区
        ctk.CTkLabel(main_frame, text="执行日志", font=ctk.CTkFont(size=13)).pack(anchor="w")
        self.log_text = ctk.CTkTextbox(main_frame, height=200, font=ctk.CTkFont(family="Consolas", size=12))
        self.log_text.pack(fill="both", expand=True, pady=(4, 0))

    def _on_select_dir(self):
        """选择博客目录"""
        path = ctk.filedialog.askdirectory(title="选择 Hugo 博客根目录")
        if path:
            self.blog_path_var.set(path)
            self.config["blog_path"] = path
            save_config(self.config)
            self._log(f"已选择目录: {path}\n", "info")

    def _log(self, msg: str, level: str = "info"):
        """输出日志到界面"""
        self.log_text.insert("end", msg)
        self.log_text.see("end")

    def _validate_blog_dir(self) -> bool:
        """校验博客目录是否有效（含 .git）"""
        path = self.blog_path_var.get().strip()
        if not path:
            self._log("[错误] 请先选择博客根目录\n", "error")
            return False
        if not os.path.isdir(path):
            self._log(f"[错误] 目录不存在: {path}\n", "error")
            return False
        if not os.path.isdir(os.path.join(path, ".git")):
            self._log("[错误] 所选目录不是 Git 仓库，缺少 .git 文件夹\n", "error")
            return False
        return True

    def _on_generate(self):
        """生成 Markdown 模板"""
        title = self.title_entry.get().strip()
        if not title:
            self._log("[警告] 标题不能为空，请填写后再试\n", "error")
            return

        blog_path = self.blog_path_var.get().strip()
        if not blog_path or not os.path.isdir(blog_path):
            self._log("[错误] 请先选择有效的博客根目录\n", "error")
            return

        posts_dir = os.path.join(blog_path, "content", "posts")
        if not os.path.isdir(posts_dir):
            os.makedirs(posts_dir, exist_ok=True)

        category = self.category_var.get().strip() or DEFAULT_CATEGORIES[0]
        tags_str = self.tags_entry.get().strip()
        tags = [t.strip() for t in tags_str.split(",") if t.strip()] if tags_str else []

        date_str = datetime.now().strftime("%Y-%m-%d")
        iso_time = get_iso_datetime()
        slug = slugify_title(title)
        filename = f"{date_str}-{slug}.md" if slug else f"{date_str}-post.md"
        filepath = os.path.join(posts_dir, filename)

        # 构建 Front Matter（含 series 以匹配博客专栏）
        tags_lines = "\n  - ".join([f'"{t}"' for t in tags]) if tags else ""
        tags_block = f"tags:\n  - {tags_lines}\n" if tags_lines else "tags: []\n"
        series = CATEGORY_TO_SERIES.get(category, "Tech & Engineering")
        front_matter = f"""---
title: "{title}"
date: {iso_time}
categories: ["{category}"]
series: ["{series}"]
{tags_block}draft: false
---

"""
        try:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(front_matter)
            self._log(f"[成功] 已生成: {filepath}\n", "info")

            # 尝试用 VS Code 或系统默认编辑器打开
            self._open_file(filepath)
        except Exception as e:
            self._log(f"[错误] 写入失败: {e}\n", "error")

    def _open_file(self, filepath: str):
        """使用 VS Code 或系统默认程序打开文件"""
        try:
            # 优先尝试 VS Code
            subprocess.Popen(
                ["code", filepath],
                shell=True,
                stdin=subprocess.DEVNULL,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        except Exception:
            try:
                # Windows
                os.startfile(filepath)
            except Exception:
                try:
                    # macOS / Linux
                    subprocess.Popen(["xdg-open", filepath])
                except Exception:
                    self._log("[提示] 请手动打开文件: " + filepath + "\n", "info")

    def _on_deploy(self):
        """一键 Push 部署（在后台线程执行）"""
        if not self._validate_blog_dir():
            return
        path = self.blog_path_var.get().strip()
        threading.Thread(target=self._run_deploy, args=(path,), daemon=True).start()

    def _run_deploy(self, path: str):
        """执行 Git 部署命令"""
        commands = [
            ("git add .", "git add"),
            ('git commit -m "Auto deploy: Update posts via GUI tool"', "git commit"),
            ("git push", "git push"),
        ]
        for cmd, name in commands:
            self._log(f"\n>>> {name}\n", "info")
            try:
                proc = subprocess.Popen(
                    cmd,
                    shell=True,
                    cwd=path,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                )
                for line in proc.stdout:
                    self._log(line, "error" if "error" in line.lower() or "fatal" in line.lower() else "info")
                proc.wait()
                if proc.returncode != 0:
                    self._log(f"[执行失败] 退出码: {proc.returncode}\n", "error")
            except Exception as e:
                self._log(f"[错误] {e}\n", "error")


def main():
    app = HugoBlogWriterApp()
    app.mainloop()


if __name__ == "__main__":
    main()
