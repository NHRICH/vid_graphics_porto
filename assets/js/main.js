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
        const originalSrc = cardImage.getAttribute('src');
        if (originalSrc) {
          cardImage.dataset.originalSrc = originalSrc;
        }

        cardImage.onerror = function onThumbnailError() {
          if (this.dataset.originalSrc) {
            this.src = this.dataset.originalSrc;
          }
        };

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
    const pinnedStartSequence = [
      {
        type: 'video',
        keywords: ['abu anhna']
      },
      {
        type: 'graphic',
        keywords: ['av media instagram ad']
      },
      {
        type: 'video',
        keywords: ['regalia', 'av digital marketing']
      },
      {
        type: 'graphic',
        keywords: ['sun dental happy christmas', 'sun dental happy ester', 'sun dental easter']
      },
      {
        type: 'graphic',
        keywords: ['bz instagram branding screenshot']
      }
    ];

    const companyPriorityKeywords = [
      'regalia',
      'abu anhna',
      'av media instagram ad',
      'sun dental happy christmas',
      'sun dental happy ester',
      'sun dental easter',
      'bz instagram branding screenshot',
      'bz furniture',
      'sun dental',
      'ic software',
      'ic softwere',
      'hospital',
      'av events'
    ];

    const fallbackCompanyKeywords = [
      'av gym',
      'av media',
      'clinic',
      'furniture'
    ];

    function getItemSearchText(item) {
      const title = item.querySelector('h4')?.textContent ?? '';
      const alt = item.querySelector('img')?.getAttribute('alt') ?? '';
      return `${title} ${alt}`.toLowerCase();
    }

    function getItemPriorityScore(item) {
      const text = getItemSearchText(item);

      const explicitMatchIndex = companyPriorityKeywords.findIndex((keyword) => text.includes(keyword));
      if (explicitMatchIndex !== -1) {
        return explicitMatchIndex;
      }

      if (fallbackCompanyKeywords.some((keyword) => text.includes(keyword))) {
        return companyPriorityKeywords.length;
      }

      if (text.includes('personal brand')) {
        return companyPriorityKeywords.length + fallbackCompanyKeywords.length + 10;
      }

      return companyPriorityKeywords.length + fallbackCompanyKeywords.length + 1;
    }

    function sortByCompanyPriority(items) {
      return items
        .map((item, index) => ({
          item,
          index,
          score: getItemPriorityScore(item)
        }))
        .sort((a, b) => (a.score - b.score) || (a.index - b.index))
        .map((entry) => entry.item);
    }

    function pullFirstMatch(items, keywords) {
      const matchIndex = items.findIndex((item) => {
        const text = getItemSearchText(item);
        return keywords.some((keyword) => text.includes(keyword));
      });

      if (matchIndex === -1) {
        return null;
      }

      return items.splice(matchIndex, 1)[0];
    }

    document.querySelectorAll('.portfolio .isotope-container').forEach((container) => {
      const items = Array.from(container.querySelectorAll('.portfolio-item'));
      const showreelItems = items.filter((item) => item.classList.contains('filter-showreel'));
      const graphicItems = items.filter((item) => !item.classList.contains('filter-showreel'));

      if (!showreelItems.length || !graphicItems.length) {
        return;
      }

      const mixed = [];

      pinnedStartSequence.forEach((entry) => {
        const sourceItems = entry.type === 'video' ? showreelItems : graphicItems;
        const pinnedItem = pullFirstMatch(sourceItems, entry.keywords);

        if (pinnedItem) {
          mixed.push(pinnedItem);
        }
      });

      const prioritizedShowreelItems = sortByCompanyPriority(showreelItems);
      const prioritizedGraphicItems = sortByCompanyPriority(graphicItems);
      const maxLen = Math.max(prioritizedShowreelItems.length, prioritizedGraphicItems.length);

      for (let i = 0; i < maxLen; i++) {
        if (prioritizedShowreelItems[i]) {
          mixed.push(prioritizedShowreelItems[i]);
        }
        if (prioritizedGraphicItems[i]) {
          mixed.push(prioritizedGraphicItems[i]);
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