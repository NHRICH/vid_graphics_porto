/**
* Template Name: MyPortfolio
* Template URL: https://bootstrapmade.com/myportfolio-bootstrap-portfolio-website-template/
* Updated: Aug 08 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Configure portfolio Vimeo items with single-player lightbox
   * and thumbnails pulled directly from each video.
   */
  function setupVerticalVimeoPortfolio() {
    const vimeoLinks = document.querySelectorAll('.portfolio .preview-link[href*="player.vimeo.com/video/"]');

    vimeoLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const idMatch = href.match(/video\/(\d+)/);

      if (!idMatch) {
        return;
      }

      const videoId = idMatch[1];
      const title = link.getAttribute('title') || 'Portfolio video';
      const cardImage = link.closest('.portfolio-content')?.querySelector('img');

      link.dataset.type = 'external';
      link.dataset.width = '360px';
      link.dataset.height = '640px';
      link.setAttribute('data-glightbox', 'type: external; width: 360px; height: 640px;');

      if (cardImage) {
        cardImage.src = `https://vumbnail.com/${videoId}.jpg`;
        cardImage.alt = title;
        cardImage.loading = 'lazy';
        cardImage.classList.add('video-thumbnail');
      }
    });
  }

  setupVerticalVimeoPortfolio();

  /**
   * Mix showreel and graphic cards in the default All view
   * while preserving category filters for Isotope.
   */
  function interleavePortfolioItems() {
    document.querySelectorAll('.portfolio .isotope-container').forEach((container) => {
      const items = Array.from(container.querySelectorAll('.portfolio-item'));
      const showreelItems = items.filter((item) => item.classList.contains('filter-showreel'));
      const graphicItems = items.filter((item) => !item.classList.contains('filter-showreel'));

      if (!showreelItems.length || !graphicItems.length) {
        return;
      }

      const mixed = [];
      const maxLen = Math.max(showreelItems.length, graphicItems.length);

      for (let i = 0; i < maxLen; i++) {
        if (showreelItems[i]) {
          mixed.push(showreelItems[i]);
        }
        if (graphicItems[i]) {
          mixed.push(graphicItems[i]);
        }
      }

      const fragment = document.createDocumentFragment();
      mixed.forEach((item) => fragment.appendChild(item));
      container.appendChild(fragment);
    });
  }

  interleavePortfolioItems();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

})();