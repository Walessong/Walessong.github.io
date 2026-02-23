@echo off
chcp 65001 >nul
echo ========================================
echo   Hugo 博客写作助手 - PyInstaller 打包
echo ========================================
echo.

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请先安装并加入 PATH
    pause
    exit /b 1
)

REM 检查依赖
echo [1/4] 检查并安装依赖...
pip install -q pyinstaller customtkinter pypinyin
if errorlevel 1 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)

REM 进入脚本所在目录
cd /d "%~dp0"

REM 使用 spec 打包（推荐，可包含 CustomTkinter 主题资源）
echo.
echo [2/4] 开始打包（单文件 + 无控制台）...
pyinstaller --clean --noconfirm hugo_blog_writer.spec
if errorlevel 1 (
    echo [错误] 打包失败
    pause
    exit /b 1
)

echo.
echo [3/4] 打包完成
echo.
echo 输出位置: dist\HugoBlogWriter.exe
echo.
echo [4/4] 可将 dist\HugoBlogWriter.exe 复制到桌面使用
echo.
pause
