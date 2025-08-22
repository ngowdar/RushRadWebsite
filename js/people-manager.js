/**
 * PeopleManager - Base class for managing faculty, residents, and fellows
 * Provides common functionality for loading data, rendering cards, and search
 */
class PeopleManager {
  constructor(baseImagePath = './images/people/') {
    this.baseImagePath = baseImagePath;
    this.placeholderImage = `${baseImagePath}placeholder.svg`;
    this.searchDebounceTime = 300;
    this.searchTimeout = null;
  }

  /**
   * Load JSON data from a file
   * @param {string} filename - The JSON filename to load
   * @returns {Promise<Object>} - Parsed JSON data
   */
  async loadData(filename) {
    try {
      const response = await fetch(`./data/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return null;
    }
  }

  /**
   * Get the image path for a person, with fallback to placeholder
   * @param {Object} person - Person object with headshot property
   * @param {string} category - Category (faculty, residents, fellows)
   * @returns {string} - Image path
   */
  getImagePath(person, category) {
    if (!person.headshot) {
      return this.placeholderImage;
    }
    return `${this.baseImagePath}${category}/${person.headshot}`;
  }

  /**
   * Setup search functionality for a container
   * @param {Array} people - Array of people objects
   * @param {string} containerId - Container ID for the grid
   * @param {string} searchInputId - Search input ID (optional, defaults to containerId + 'Search')
   */
  setupSearch(people, containerId, searchInputId = null) {
    const inputId = searchInputId || `${containerId}Search`;
    const searchInput = document.getElementById(inputId);
    
    if (!searchInput) {
      console.warn(`Search input with ID '${inputId}' not found`);
      return;
    }

    // Add event listener with debouncing
    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.filterAndReorder(people, e.target.value, containerId);
      }, this.searchDebounceTime);
    });

    // Initial load - show all
    this.filterAndReorder(people, '', containerId);
  }

  /**
   * Filter and reorder people based on search term
   * @param {Array} people - Array of people objects
   * @param {string} searchTerm - Search term
   * @param {string} containerId - Container ID for the grid
   */
  filterAndReorder(people, searchTerm, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID '${containerId}' not found`);
      return;
    }

    const cards = container.querySelectorAll('[data-person-id]');
    
    if (searchTerm.trim() === '') {
      // Show all cards in original order
      this.showAllCards(cards, people);
      return;
    }

    // Calculate relevance scores and filter matches
    const matches = this.calculateRelevanceScores(people, searchTerm.toLowerCase().trim());
    
    // Hide all cards first
    cards.forEach(card => card.style.display = 'none');

    // Show and reorder matched cards
    matches.forEach(({ person }) => {
      const card = container.querySelector(`[data-person-id="${person.id}"]`);
      if (card) {
        card.style.display = 'block';
        container.appendChild(card); // Move to end to create desired order
      }
    });
  }

  /**
   * Calculate relevance scores for search matches
   * @param {Array} people - Array of people objects
   * @param {string} searchTerm - Lowercase search term
   * @returns {Array} - Array of {person, score} objects, sorted by relevance
   */
  calculateRelevanceScores(people, searchTerm) {
    const matches = people.map(person => {
      let score = 0;
      let matched = false;

      // Search in name (highest priority)
      const name = person.name.toLowerCase();
      if (name.includes(searchTerm)) {
        score += name.startsWith(searchTerm) ? 100 : 50;
        matched = true;
      }

      // Search in title/position
      const title = (person.title || '').toLowerCase();
      if (title.includes(searchTerm)) {
        score += 20;
        matched = true;
      }

      // Search in clinical focus/research interests
      if (person.clinical_focus) {
        const focus = person.clinical_focus.join(' ').toLowerCase();
        if (focus.includes(searchTerm)) {
          score += 10;
          matched = true;
        }
      }

      // Search in research interests
      if (person.research_interests) {
        const research = person.research_interests.join(' ').toLowerCase();
        if (research.includes(searchTerm)) {
          score += 8;
          matched = true;
        }
      }

      // Search in academic rank
      const rank = (person.academic_rank || '').toLowerCase();
      if (rank.includes(searchTerm)) {
        score += 15;
        matched = true;
      }

      // Search in PGY level for residents
      const pgyLevel = (person.pgy_level || '').toLowerCase();
      if (pgyLevel.includes(searchTerm)) {
        score += 25;
        matched = true;
      }

      // Search in fellowship type for fellows
      const fellowshipType = (person.fellowship_type || '').toLowerCase();
      if (fellowshipType.includes(searchTerm)) {
        score += 25;
        matched = true;
      }

      return { person, score, matched };
    }).filter(item => item.matched);

    // Sort by relevance score (highest first)
    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * Show all cards in their original order
   * @param {NodeList} cards - All card elements
   * @param {Array} people - Array of people objects for ordering
   */
  showAllCards(cards, people) {
    const container = cards[0]?.parentElement;
    if (!container) return;

    // Show all cards
    cards.forEach(card => card.style.display = 'block');

    // Reorder cards according to original order
    people
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .forEach(person => {
        const card = container.querySelector(`[data-person-id="${person.id}"]`);
        if (card) {
          container.appendChild(card);
        }
      });
  }

  /**
   * Handle image loading errors by showing placeholder
   * @param {HTMLImageElement} img - Image element that failed to load
   */
  handleImageError(img) {
    img.src = this.placeholderImage;
    img.onerror = null; // Prevent infinite loop
  }

  /**
   * Setup bio toggle functionality for cards
   * @param {string} containerId - Container ID for the grid
   */
  setupBioToggles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle]');
      if (!toggleBtn) return;

      const bioId = toggleBtn.getAttribute('data-toggle');
      const bioElement = document.getElementById(bioId);
      if (!bioElement) return;

      bioElement.classList.toggle('hidden');
      toggleBtn.textContent = bioElement.classList.contains('hidden') ? 'View bio' : 'Hide bio';
    });
  }

  /**
   * Utility method to safely get nested property values
   * @param {Object} obj - Object to search
   * @param {string} path - Dot notation path (e.g., 'education.0.institution')
   * @returns {*} - Property value or undefined
   */
  getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Format array as comma-separated string
   * @param {Array} arr - Array to format
   * @returns {string} - Formatted string
   */
  formatArray(arr) {
    if (!Array.isArray(arr)) return '';
    return arr.join(', ');
  }

  /**
   * Create a standardized card container with data attributes
   * @param {Object} person - Person object
   * @param {string} cardClass - CSS class for the card
   * @param {string} content - HTML content for the card
   * @returns {string} - HTML string for the card
   */
  createCardContainer(person, cardClass, content) {
    return `
      <div class="${cardClass} card p-5" 
           data-person-id="${person.id}"
           data-name="${person.name}" 
           data-title="${person.title || ''}"
           data-order="${person.order || 0}">
        ${content}
      </div>
    `;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PeopleManager;
}