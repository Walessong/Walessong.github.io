// 滚动触发动画脚本
(function() {
    'use strict';

    const SCROLL_REVEAL_CLASS = 'scroll-reveal';
    const REVEALED_CLASS = 'revealed';
    const REVEAL_THRESHOLD = 0.1;

    function initScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: REVEAL_THRESHOLD
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(REVEALED_CLASS);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 观察所有带有 scroll-reveal 类的元素
        const elements = document.querySelectorAll(`.${SCROLL_REVEAL_CLASS}`);
        elements.forEach(element => {
            observer.observe(element);
        });
    }

    // 为文章卡片自动添加滚动动画类
    function addScrollAnimations() {
        const postItems = document.querySelectorAll('.post-item');
        postItems.forEach((item, index) => {
            item.classList.add(SCROLL_REVEAL_CLASS);
            // 添加延迟类
            if (index % 3 === 0) {
                item.classList.add('scroll-reveal-delay-1');
            } else if (index % 3 === 1) {
                item.classList.add('scroll-reveal-delay-2');
            } else {
                item.classList.add('scroll-reveal-delay-3');
            }
        });

        // 为其他元素添加动画
        const animatedElements = document.querySelectorAll('.home-section, .hero-glass-card');
        animatedElements.forEach((element, index) => {
            element.classList.add(SCROLL_REVEAL_CLASS);
            if (index > 0) {
                element.classList.add('scroll-reveal-delay-1');
            }
        });
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addScrollAnimations();
            initScrollReveal();
        });
    } else {
        addScrollAnimations();
        initScrollReveal();
    }
})();