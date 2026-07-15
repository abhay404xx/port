/* ============================================================
   ABHAY ELITES — SCRIPT
   Plain JS, no dependencies. Everything editable lives in the
   PROJECTS array below — add a new object to add a new card.
   ============================================================ */
(() => {
  'use strict';

  /* ----------------------------------------------------------
     PORTFOLIO DATA
     - category   : must match a data-filter value in index.html
     - type       : "video" shows the video in the modal, "image"
                    (used for Banners) shows the full image instead
     - image      : thumbnail shown on the card + modal poster
     - video      : only needed when type is "video"
     To add another project: copy an object below, drop the new
     PNG/MP4 into images/ or videos/, and update the paths.
  ---------------------------------------------------------- */
  const PROJECTS = [
    {
      title: 'Wedding Films',
      category: 'wedding',
      categoryLabel: 'Wedding Videos',
      image: 'images/wedding1.png',
      video: 'videos/wedding.mp4',
      type: 'video',
    },
    {
      title: 'Promotional Video',
      category: 'promo',
      categoryLabel: 'Promotional Videos',
      image: 'images/promo1.png',
      video: 'lv_0_20260715085802 (1).mp4',
      type: 'video',
    },
    {
      title: 'Banner Design',
      category: 'banner',
      categoryLabel: 'Banners',
      image: 'images/banner1.png',
      video: '',
      type: 'image',
    },
    {
      title: 'Invitation Film',
      category: 'invitation',
      categoryLabel: 'Invitation Videos',
      image: 'images/invitation1.png',
      video: 'videos/invitation.mp4',
      type: 'video',
    },
    {
      title: 'Social Content',
      category: 'social',
      categoryLabel: 'Social Content',
      image: 'images/social1.png',
      video: 'videos/social.mp4',
      type: 'video',
    },
  ];

  /* Inline icons kept tiny and stroke-only to match the flat, minimal theme */
  const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_VIEW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5"/></svg>';

  /* ----------------------------------------------------------
     RENDER PORTFOLIO GRID
  ---------------------------------------------------------- */
  function renderGrid(){
    const grid = document.getElementById('grid');
    grid.innerHTML = PROJECTS.map((p, i) => `
      <article class="card reveal" data-category="${p.category}" data-index="${i}" tabindex="0" role="button"
                aria-label="Preview ${p.title}">
        <div class="card__thumb">
          <img src="${p.image}" alt="${p.title} — ${p.categoryLabel}" loading="lazy" decoding="async" width="900" height="1125">
          <span class="card__icon ${p.type === 'video' ? 'card__icon--play' : ''}" aria-hidden="true">
            ${p.type === 'video' ? ICON_PLAY : ICON_VIEW}
          </span>
        </div>
        <div class="card__meta">
          <span class="card__cat">${p.categoryLabel}</span>
          <h3 class="card__title">${p.title}</h3>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => openModal(PROJECTS[card.dataset.index]));
      card.addEventListener('keypress', e => {
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openModal(PROJECTS[card.dataset.index]);
        }
      });
    });

    // newly injected cards need to be watched by the reveal observer
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     CATEGORY FILTERS
  ---------------------------------------------------------- */
  function initFilters(){
    const buttons = document.querySelectorAll('.filter');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.card').forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ----------------------------------------------------------
     PROJECT MODAL
  ---------------------------------------------------------- */
  function openModal(project){
    const modal = document.getElementById('modal');
    const media = document.getElementById('modalMedia');

    document.getElementById('modalCategory').textContent = project.categoryLabel;
    document.getElementById('modalTitle').textContent = project.title;

    if (project.type === 'video'){
      media.innerHTML = `
        <video controls playsinline preload="metadata"
               poster="${project.image}" src="${project.video}">
        </video>`;
    } else {
      media.innerHTML = `<img src="${project.image}" alt="${project.title}">`;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    const modal = document.getElementById('modal');
    const media = document.getElementById('modalMedia');
    const video = media.querySelector('video');
    if (video) video.pause();

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { media.innerHTML = ''; }, 400); // wait for the close transition
  }

  function initModal(){
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalBackdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL — smooth fade + rise, plays once per element
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  function initReveals(){
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     NAV — solid background once the page scrolls past the hero
  ---------------------------------------------------------- */
  function initNavScroll(){
    const nav = document.getElementById('nav');
    let ticking = false;
    function update(){
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking){
        requestAnimationFrame(update);
        ticking = true;
      }
    });
    update();
  }

  /* ----------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------- */
  function initMobileMenu(){
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('mobileMenu');

    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  renderGrid();
  initFilters();
  initModal();
  initReveals();
  initNavScroll();
  initMobileMenu();
})();
