/* ============================================================
   高数期末复习站 — 共享脚本
   ============================================================ */

(function() {
  'use strict';

  /* ---------- 1. 主题切换 ---------- */
  function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  /* ---------- 2. 导航高亮 ---------- */
  function highlightNav() {
    const path = location.pathname;
    const filename = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.topnav a.item').forEach(a => {
      const href = a.getAttribute('href');
      if (href && (path.includes(href) || href === filename)) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  /* ---------- 3. 阅读进度条 ---------- */
  function initProgress() {
    const bar = document.querySelector('.reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ---------- 4. 回到顶部 ---------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 5. 可折叠步骤 ---------- */
  function initCollapsible() {
    document.querySelectorAll('.step.collapsible').forEach(step => {
      const header = step.querySelector('.step-header') || step;
      const toggle = step.querySelector('.step-toggle');
      if (toggle) {
        header.addEventListener('click', () => step.classList.toggle('open'));
      }
    });
  }

  /* ---------- 6. 页内TOC高亮 ---------- */
  function initTocHighlight() {
    const tocLinks = document.querySelectorAll('.inpage-toc a[href^="#"]');
    if (!tocLinks.length) return;
    const sections = Array.from(tocLinks).map(a => {
      const id = a.getAttribute('href').slice(1);
      return { link: a, el: document.getElementById(id) };
    }).filter(s => s.el);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sec = sections.find(s => s.el === entry.target);
          if (sec) {
            sections.forEach(s => s.link.classList.remove('active'));
            sec.link.classList.add('active');
          }
        }
      });
    }, { rootMargin: '-10% 0px -70% 0px' });

    sections.forEach(s => observer.observe(s.el));
  }

  /* ---------- 7. 移动端下拉菜单点击 ---------- */
  function initDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const dd = btn.closest('.dropdown');
        dd.classList.toggle('open');
        document.querySelectorAll('.dropdown.open').forEach(d => {
          if (d !== dd) d.classList.remove('open');
        });
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    });
  }

  /* ---------- 初始化 ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    highlightNav();
    initProgress();
    initBackToTop();
    initCollapsible();
    initTocHighlight();
    initDropdowns();

    // 主题按钮绑定
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  });

})();
