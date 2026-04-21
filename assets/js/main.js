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

  function slugify(value) {
    return (value || '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function titleCaseFilter(filterSlug) {
    const labels = {
      showreel: 'Showreel',
      cinematic: 'Cinematic',
      identity: 'Identity',
      motion: 'Motion',
      tactical: 'Tactical'
    };
    return labels[filterSlug] || 'Portfolio';
  }

  function wireServiceDetailLinks() {
    document.querySelectorAll('.services .service-item').forEach((item) => {
      const title = item.querySelector('h3')?.textContent?.trim() || 'Service';
      const slug = slugify(title);

      item.querySelectorAll('a[href*="service-details.html"]').forEach((link) => {
        link.setAttribute('href', `service-details.html?service=${encodeURIComponent(slug)}`);
      });
    });
  }

  function wirePortfolioDetailLinks() {
    document.querySelectorAll('.portfolio .portfolio-item').forEach((item) => {
      const title = item.querySelector('.portfolio-info h4')?.textContent?.trim() || 'Portfolio Project';
      const summary = item.querySelector('.portfolio-info p')?.textContent?.trim() || '';
      const image = item.querySelector('img')?.getAttribute('src') || '';
      const previewLink = item.querySelector('.portfolio-info .preview-link');
      const media = previewLink?.getAttribute('href') || image;
      const mediaType = media.includes('player.vimeo.com/video/') ? 'video' : 'image';
      const filterClass = Array.from(item.classList).find((name) => name.startsWith('filter-')) || 'filter-showreel';
      const category = filterClass.replace('filter-', '');

      const params = new URLSearchParams({
        project: slugify(title),
        title,
        category,
        summary,
        image,
        mediaType,
        media
      });

      item.querySelectorAll('.details-link[href*="portfolio-details.html"]').forEach((link) => {
        link.setAttribute('href', `portfolio-details.html?${params.toString()}`);
      });
    });
  }

  function renderServiceDetailsPage() {
    if (!document.body.classList.contains('service-details-page')) {
      return;
    }

    const services = {
      'cinematic-content-strategy': {
        title: 'Cinematic Content Strategy',
        sideTitle: 'How the cinematic strategy works',
        sideText: 'We audit your market positioning, then engineer narrative sequences that combine authority visuals with conversion intent.',
        heading: 'Build attention with structured cinematic storytelling',
        intro: 'From hook design to pacing and post-production rhythm, every edit decision is aligned to business outcomes.',
        bullets: [
          'Offer-first narrative architecture for short-form and long-form assets.',
          'Performance-ready editing workflow for reels, ads, and launch videos.',
          'Consistent visual identity across all campaign deliverables.'
        ],
        bodyOne: 'You get a repeatable system that keeps content quality high while increasing speed of execution.',
        bodyTwo: 'The result is stronger trust, clearer positioning, and higher-quality inbound opportunities.'
      },
      'brand-identity-design': {
        title: 'Brand Identity Design',
        sideTitle: 'How identity design is executed',
        sideText: 'We translate your strategic position into visual systems that remain consistent from logo to campaign rollout.',
        heading: 'Design an identity system people recognize instantly',
        intro: 'Identity is not only a logo. It is the full visual language that carries your positioning into every touchpoint.',
        bullets: [
          'Logo direction, typography standards, and color logic.',
          'Campaign-safe templates for social, ad, and presentation use.',
          'Guidelines that keep teams aligned across channels.'
        ],
        bodyOne: 'This protects brand credibility as you scale content volume and team size.',
        bodyTwo: 'The outcome is a premium, coherent brand presence that improves recall and conversion.'
      },
      'performance-marketing-funnels': {
        title: 'Performance Marketing Funnels',
        sideTitle: 'How the funnel is constructed',
        sideText: 'We connect content, landing flow, and offer positioning so attention turns into qualified demand.',
        heading: 'Turn content views into measurable revenue actions',
        intro: 'Creative assets are mapped to awareness, consideration, and decision phases for cleaner user journeys.',
        bullets: [
          'Audience-specific content pillars and offer angles.',
          'Conversion-focused sequencing across paid and organic touchpoints.',
          'Iteration loops based on real performance signals.'
        ],
        bodyOne: 'The system reduces wasted spend and improves consistency in lead quality.',
        bodyTwo: 'You get a scalable growth framework built on strategy, not random posting.'
      },
      'social-campaign-execution': {
        title: 'Social Campaign Execution',
        sideTitle: 'How campaigns are deployed',
        sideText: 'We run campaign calendars with message discipline, visual consistency, and platform-fit content packaging.',
        heading: 'Execute social campaigns with speed and precision',
        intro: 'Each campaign is structured by objective, creative angle, and channel behavior to maximize relevance.',
        bullets: [
          'Weekly and monthly content planning by campaign goal.',
          'Creative production pipeline for reels, posters, and ad variants.',
          'Cross-platform publishing rhythm with quality control.'
        ],
        bodyOne: 'Execution becomes predictable, and your team gets clear production priorities.',
        bodyTwo: 'This creates momentum and keeps your brand consistently visible in the right market context.'
      },
      'post-production-systems': {
        title: 'Post-Production Systems',
        sideTitle: 'How post-production is systemized',
        sideText: 'We build editing and asset pipelines that reduce turnaround time without sacrificing visual standards.',
        heading: 'Scale content output with a high-quality post pipeline',
        intro: 'Post-production is treated as an operating system with naming, versioning, and delivery standards.',
        bullets: [
          'Template-driven edit stacks for recurring content types.',
          'File management, render presets, and handoff standards.',
          'Quality checks for consistency across all final exports.'
        ],
        bodyOne: 'You eliminate bottlenecks and maintain polish even under campaign pressure.',
        bodyTwo: 'The result is faster delivery cycles with brand-level consistency in every asset.'
      }
    };

    const requested = slugify(new URLSearchParams(window.location.search).get('service'));
    const selectedKey = services[requested] ? requested : 'cinematic-content-strategy';
    const selected = services[selectedKey];

    const pageTitle = document.querySelector('.page-title h1');
    const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
    const servicesListLinks = document.querySelectorAll('#service-details .services-list a');
    const sideTitle = document.querySelector('#service-details .col-lg-4 h4');
    const sideText = document.querySelector('#service-details .col-lg-4 p');
    const heading = document.querySelector('#service-details .col-lg-8 h3');
    const paragraphs = document.querySelectorAll('#service-details .col-lg-8 p');
    const bulletSpans = document.querySelectorAll('#service-details .col-lg-8 ul li span');

    if (pageTitle) pageTitle.textContent = selected.title;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = selected.title;
    document.title = `${selected.title} - Nahom Portfolio`;

    const serviceOrder = Object.keys(services);
    servicesListLinks.forEach((link, index) => {
      const key = serviceOrder[index] || selectedKey;
      link.textContent = services[key].title;
      link.setAttribute('href', `service-details.html?service=${encodeURIComponent(key)}`);
      link.classList.toggle('active', key === selectedKey);
    });

    if (sideTitle) sideTitle.textContent = selected.sideTitle;
    if (sideText) sideText.textContent = selected.sideText;
    if (heading) heading.textContent = selected.heading;
    if (paragraphs[0]) paragraphs[0].textContent = selected.intro;
    if (paragraphs[1]) paragraphs[1].textContent = selected.bodyOne;
    if (paragraphs[2]) paragraphs[2].textContent = selected.bodyTwo;

    bulletSpans.forEach((span, index) => {
      if (selected.bullets[index]) {
        span.textContent = selected.bullets[index];
      }
    });
  }

  function buildPortfolioGallery(category, selectedImage) {
    const galleries = {
      showreel: [
        'assets/img/portfolio/app-1.jpg',
        'assets/img/portfolio/product-1.jpg',
        'assets/img/portfolio/branding-1.jpg',
        'assets/img/portfolio/books-1.jpg'
      ],
      identity: [
        'assets/img/portfolio/avgym_management%20logo.png',
        'assets/img/portfolio/avmedia%20bussinescardfront%20view.png',
        'assets/img/portfolio/AV%20EVENTS%20bussines%20card%20back%20view.png'
      ],
      motion: [
        'assets/img/portfolio/avmedia%20instagram%20ad%20poster.jpg',
        'assets/img/portfolio/instagram%20photo%20poster.jpg',
        'assets/img/portfolio/BZ%20furniture%20tiktok%20photo%20poster.jpg',
        'assets/img/portfolio/BZ%20facebook%20cover%20image%20.jpg'
      ],
      tactical: [
        'assets/img/portfolio/AV%20Marketing%20Agency%20Promotion%20Flyer.png',
        'assets/img/portfolio/IC%20softwere%20solutions%20poster.jpg',
        'assets/img/portfolio/mobile%20app%20coming%20soon%20poster.png',
        'assets/img/portfolio/sun%20Dental%20Clinic%20happy%20ester%20poster.png'
      ],
      cinematic: [
        'assets/img/portfolio/detaled%20blackand%20white%20photgraphy.jpg',
        'assets/img/portfolio/photography%20.jpg',
        'assets/img/portfolio/abala%20mob.jpg',
        'assets/img/portfolio/mark%20brand%20banner%20.jpg'
      ]
    };

    const categoryImages = galleries[category] || galleries.showreel;
    const allImages = [selectedImage, ...categoryImages].filter(Boolean);
    return Array.from(new Set(allImages)).slice(0, 4);
  }

  function renderPortfolioDetailsPage() {
    if (!document.body.classList.contains('portfolio-details-page')) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const title = params.get('title') || 'Portfolio Project';
    const category = slugify(params.get('category') || 'showreel');
    const summary = params.get('summary') || 'Project crafted to improve brand visibility and conversion performance.';
    const image = params.get('image') || 'assets/img/portfolio/app-1.jpg';
    const mediaType = params.get('mediaType') || 'image';
    const media = params.get('media') || image;

    const pageTitle = document.querySelector('.page-title h1');
    const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
    const sliderWrapper = document.querySelector('#portfolio-details .swiper-wrapper');
    const infoList = document.querySelector('#portfolio-details .portfolio-info ul');
    const infoHeading = document.querySelector('#portfolio-details .portfolio-info h3');
    const descriptionHeading = document.querySelector('#portfolio-details .portfolio-description h2');
    const descriptionBody = document.querySelector('#portfolio-details .portfolio-description p');

    if (pageTitle) pageTitle.textContent = title;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = title;
    if (infoHeading) infoHeading.textContent = 'Project information';
    if (descriptionHeading) descriptionHeading.textContent = title;

    const categoryLabel = titleCaseFilter(category);
    const longSummary = `${summary} This execution was designed to strengthen positioning, trust, and measurable response across target channels.`;
    if (descriptionBody) descriptionBody.textContent = longSummary;
    document.title = `${title} - Nahom Portfolio`;

    if (infoList) {
      infoList.innerHTML = '';

      const rows = [
        ['Category', categoryLabel],
        ['Project', title],
        ['Media', mediaType === 'video' ? 'Video Campaign' : 'Visual Design']
      ];

      rows.forEach(([key, value]) => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = key;
        li.appendChild(strong);
        li.append(`: ${value}`);
        infoList.appendChild(li);
      });

      if (mediaType === 'video' && media.includes('player.vimeo.com/video/')) {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = 'Watch';
        li.appendChild(strong);
        li.append(': ');

        const a = document.createElement('a');
        a.href = media;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Open video preview';
        li.appendChild(a);
        infoList.appendChild(li);
      }
    }

    if (sliderWrapper) {
      sliderWrapper.innerHTML = '';
      const gallery = buildPortfolioGallery(category, image);

      gallery.forEach((src) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const img = document.createElement('img');
        img.src = src;
        img.alt = title;

        slide.appendChild(img);
        sliderWrapper.appendChild(slide);
      });
    }
  }

  wireServiceDetailLinks();
  wirePortfolioDetailLinks();
  renderServiceDetailsPage();
  renderPortfolioDetailsPage();

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