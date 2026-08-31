// 主题切换脚本 - 支持深浅双模式切换
(function() {
    'use strict';

    const THEME_KEY = 'blog-theme';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';
    
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');

    // 获取系统偏好
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
    }

    // 获取保存的主题
    function getSavedTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === THEME_LIGHT || saved === THEME_DARK) {
            return saved;
        }
        return null;
    }

    // 应用主题
    function applyTheme(theme) {
        if (theme === THEME_DARK) {
            document.documentElement.setAttribute('data-theme', THEME_DARK);
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            document.documentElement.setAttribute('data-theme', THEME_LIGHT);
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
        
        // 添加平滑过渡
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    // 初始化主题
    function initTheme() {
        const savedTheme = getSavedTheme();
        const systemTheme = getSystemTheme();
        
        applyTheme(savedTheme || systemTheme);
    }

    // 切换主题
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || getSystemTheme();
        const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
    }

    // 监听系统主题变化
    function watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            if (!getSavedTheme()) {
                applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
            }
        });
    }

    // 初始化
    if (themeToggle) {
        initTheme();
        watchSystemTheme();
        
        themeToggle.addEventListener('click', toggleTheme);
    }
})();