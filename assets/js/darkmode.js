/**
 * Dark Mode Toggle Functionality
 * Manages dark mode state with localStorage persistence
 */

(function() {
  "use strict";

  // Prevent transition flash on page load
  document.body.classList.add('preload');
  
  // Check for saved dark mode preference or default to light mode
  const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
  
  // Apply dark mode immediately if it was previously enabled
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
  }
  
  // Remove preload class after a brief delay to enable transitions
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.body.classList.remove('preload');
    }, 100);
  });

  /**
   * Toggle dark mode on/off
   */
  function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (isDarkMode) {
      localStorage.setItem('darkMode', 'enabled');
      updateToggleIcon('moon');
    } else {
      localStorage.setItem('darkMode', 'disabled');
      updateToggleIcon('sun');
    }
    
    // Trigger animation
    animateToggle();
  }

  /**
   * Update the toggle button icon
   */
  function updateToggleIcon(mode) {
    const icon = document.querySelector('.dark-mode-toggle i');
    if (!icon) return;
    
    if (mode === 'moon') {
      // Show moon icon when in dark mode
      icon.classList.remove('bi-moon-stars-fill');
      icon.classList.add('bi-sun-fill');
    } else {
      // Show sun icon when in light mode
      icon.classList.remove('bi-sun-fill');
      icon.classList.add('bi-moon-stars-fill');
    }
  }

  /**
   * Animate the toggle button
   */
  function animateToggle() {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) return;
    
    toggle.style.transform = 'scale(0.9)';
    setTimeout(function() {
      toggle.style.transform = 'scale(1)';
    }, 150);
  }

  /**
   * Initialize dark mode toggle button
   */
  function initDarkModeToggle() {
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'dark-mode-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    toggleButton.setAttribute('title', 'Toggle dark mode');
    
    // Create icon
    const icon = document.createElement('i');
    icon.className = document.body.classList.contains('dark-mode') 
      ? 'bi bi-sun-fill' 
      : 'bi bi-moon-stars-fill';
    
    toggleButton.appendChild(icon);
    document.body.appendChild(toggleButton);
    
    // Add click event listener
    toggleButton.addEventListener('click', toggleDarkMode);
    
    // Add keyboard support
    toggleButton.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDarkMode();
      }
    });
  }

  /**
   * Initialize on DOM ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkModeToggle);
  } else {
    initDarkModeToggle();
  }

  /**
   * Optional: Listen for system dark mode preference changes
   */
  if (window.matchMedia) {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeMediaQuery.addEventListener('change', function(e) {
      // Only auto-switch if user hasn't manually set a preference
      const userPreference = localStorage.getItem('darkMode');
      
      if (!userPreference) {
        if (e.matches) {
          document.body.classList.add('dark-mode');
          updateToggleIcon('moon');
        } else {
          document.body.classList.remove('dark-mode');
          updateToggleIcon('sun');
        }
      }
    });
  }

})();
