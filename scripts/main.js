/* Odemi — comportamento da página. Sem dependências. */
(() => {
  'use strict';

  /* Menu mobile ---------------------------------------------------------- */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle__label').textContent = open ? 'Fechar' : 'Menu';
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    matchMedia('(min-width: 761px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* Seção ativa na navegação -------------------------------------------- */
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* Filetes do processo -------------------------------------------------- */
  const reveal = document.querySelector('[data-reveal]');
  if (reveal) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { reveal.classList.add('is-revealed'); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(reveal);
    } else {
      reveal.classList.add('is-revealed');
    }
  }

  /* Formulário: apenas layout até os canais serem confirmados ------------ */
  const form = document.querySelector('[data-form]');
  const status = document.querySelector('[data-form-status]');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = 'Envio ainda não ativado. Os canais de contato estão em confirmação.';
    });
  }
})();
