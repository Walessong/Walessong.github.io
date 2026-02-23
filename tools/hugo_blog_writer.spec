# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for Hugo 博客写作助手
# 用法: pyinstaller hugo_blog_writer.spec

import os
import sys

# 获取 CustomTkinter 的安装路径，确保 themes 等资源被打包
def get_customtkinter_datas():
    try:
        import customtkinter as ctk
        ctk_path = os.path.dirname(ctk.__file__)
        assets_path = os.path.join(ctk_path, 'assets')
        if os.path.isdir(assets_path):
            # 将 customtkinter/assets 整个目录加入
            return [(assets_path, os.path.join('customtkinter', 'assets'))]
        themes_path = os.path.join(ctk_path, 'themes')
        if os.path.isdir(themes_path):
            return [(themes_path, os.path.join('customtkinter', 'themes'))]
    except Exception:
        pass
    return []

block_cipher = None

a = Analysis(
    ['hugo_blog_writer.py'],
    pathex=[],
    binaries=[],
    datas=get_customtkinter_datas(),
    hiddenimports=['customtkinter'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='HugoBlogWriter',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,   # 不显示控制台窗口
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    # 自定义图标：取消下行注释并替换为你的 .ico 路径
    # icon='icon.ico',
)
