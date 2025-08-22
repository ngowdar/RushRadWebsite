/**
 * FacultyManager - Specialized class for managing faculty data and display
 * Extends PeopleManager with faculty-specific functionality
 */
class FacultyManager extends PeopleManager {
  constructor(baseImagePath = './images/people/') {
    super(baseImagePath);
    this.facultyData = null;
  }

  /**
   * Load faculty data from JSON file
   * @param {string} division - Division name (e.g., 'body-imaging')
   * @returns {Promise<Array>} - Array of faculty objects
   */
  async loadFaculty(division = 'body-imaging') {
    try {
      this.facultyData = await this.loadData('faculty.json');
      if (!this.facultyData) {
        console.error('Failed to load faculty data');
        return [];
      }

      const divisionData = this.facultyData.divisions[division];
      if (!divisionData) {
        console.error(`Division '${division}' not found in faculty data`);
        return [];
      }

      return divisionData.faculty || [];
    } catch (error) {
      console.error('Error loading faculty:', error);
      return [];
    }
  }

  /**
   * Get division information
   * @param {string} division - Division name
   * @returns {Object|null} - Division info object
   */
  getDivisionInfo(division = 'body-imaging') {
    if (!this.facultyData) return null;
    return this.facultyData.divisions[division] || null;
  }

  /**
   * Render a single faculty card
   * @param {Object} faculty - Faculty member object
   * @returns {string} - HTML string for the faculty card
   */
  renderFacultyCard(faculty) {
    const imagePath = this.getImagePath(faculty, 'faculty');
    const clinicalFocus = this.formatArray(faculty.clinical_focus);
    
    const cardContent = `
      <div class="flex items-center gap-4">
        <img src="${imagePath}" 
             alt="Headshot of ${faculty.name}, ${faculty.degree}" 
             class="headshot" 
             onerror="this.src='${this.placeholderImage}'" />
        <div>
          <div class="font-semibold">${faculty.name}, ${faculty.degree}</div>
          <div class="text-sm text-slate-500">${faculty.title}</div>
          ${faculty.academic_rank !== faculty.title ? 
            `<div class="text-xs text-slate-400">${faculty.academic_rank}</div>` : ''}
        </div>
      </div>
      
      <div class="mt-3 space-y-2">
        ${clinicalFocus ? `
          <p class="text-sm text-slate-600">
            <span class="text-slate-500">Clinical focus:</span> ${clinicalFocus}
          </p>
        ` : ''}
        
        ${faculty.office ? `
          <p class="text-sm text-slate-600">
            <span class="text-slate-500">Office:</span> ${faculty.office}
          </p>
        ` : ''}
        
        ${faculty.phone ? `
          <p class="text-sm text-slate-600">
            <span class="text-slate-500">Phone:</span> 
            <a href="tel:${faculty.phone}" class="hover:underline">${faculty.phone}</a>
          </p>
        ` : ''}
        
        ${faculty.email ? `
          <p class="text-sm text-slate-600">
            <span class="text-slate-500">Email:</span> 
            <a href="mailto:${faculty.email}" class="hover:underline text-[color:var(--rush-green)]">${faculty.email}</a>
          </p>
        ` : ''}
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button class="btn btn-ghost px-0 mt-2 text-[color:var(--rush-green)]" data-toggle="bio-${faculty.id}">
          View bio
        </button>
        
        ${faculty.publications_count ? `
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            ${faculty.publications_count} publications
          </span>
        ` : ''}
        
        ${faculty.years_at_rush ? `
          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            ${faculty.years_at_rush} years at Rush
          </span>
        ` : ''}
      </div>

      <div id="bio-${faculty.id}" class="hidden text-sm text-slate-700 mt-4 p-3 bg-slate-50 rounded-lg">
        <div class="mb-3">
          <strong>Biography:</strong>
          <p class="mt-1">${faculty.bio}</p>
        </div>
        
        ${faculty.research_interests && faculty.research_interests.length > 0 ? `
          <div class="mb-3">
            <strong>Research Interests:</strong>
            <p class="mt-1">${this.formatArray(faculty.research_interests)}</p>
          </div>
        ` : ''}
        
        ${faculty.education && faculty.education.length > 0 ? `
          <div class="mb-3">
            <strong>Education:</strong>
            <ul class="mt-1 list-disc list-inside space-y-1">
              ${faculty.education.map(edu => `
                <li>${edu.degree}, ${edu.institution} (${edu.year})</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${faculty.board_certifications && faculty.board_certifications.length > 0 ? `
          <div>
            <strong>Board Certifications:</strong>
            <p class="mt-1">${this.formatArray(faculty.board_certifications)}</p>
          </div>
        ` : ''}
      </div>
    `;

    return this.createCardContainer(
      faculty, 
      'faculty-card', 
      cardContent
    );
  }

  /**
   * Render the complete faculty grid
   * @param {Array} faculty - Array of faculty objects
   * @param {string} containerId - Container ID for the grid
   */
  renderFacultyGrid(faculty, containerId = 'facultyGrid') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID '${containerId}' not found`);
      return;
    }

    // Sort faculty by order
    const sortedFaculty = [...faculty].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Generate HTML for all faculty cards
    const facultyHTML = sortedFaculty
      .filter(f => f.status === 'active')
      .map(f => this.renderFacultyCard(f))
      .join('');

    // Insert into container
    container.innerHTML = facultyHTML;

    // Setup bio toggles
    this.setupBioToggles(containerId);
  }

  /**
   * Initialize faculty display for a specific division and container
   * @param {string} division - Division name
   * @param {string} containerId - Container ID for the grid
   * @param {string} searchInputId - Search input ID (optional)
   * @returns {Promise<void>}
   */
  async initializeFacultyDisplay(division = 'body-imaging', containerId = 'facultyGrid', searchInputId = null) {
    try {
      // Load faculty data
      const faculty = await this.loadFaculty(division);
      
      if (faculty.length === 0) {
        console.warn(`No faculty found for division: ${division}`);
        return;
      }

      // Render faculty grid
      this.renderFacultyGrid(faculty, containerId);

      // Setup search functionality
      this.setupSearch(faculty, containerId, searchInputId);

      console.log(`Loaded ${faculty.length} faculty members for ${division}`);
      
    } catch (error) {
      console.error('Error initializing faculty display:', error);
    }
  }

  /**
   * Filter faculty by academic rank
   * @param {Array} faculty - Array of faculty objects
   * @param {string} rank - Academic rank to filter by
   * @returns {Array} - Filtered faculty array
   */
  filterByRank(faculty, rank) {
    return faculty.filter(f => f.academic_rank === rank);
  }

  /**
   * Get faculty statistics for a division
   * @param {Array} faculty - Array of faculty objects
   * @returns {Object} - Statistics object
   */
  getFacultyStats(faculty) {
    const stats = {
      total: faculty.length,
      professors: faculty.filter(f => f.academic_rank === 'Professor').length,
      associateProfessors: faculty.filter(f => f.academic_rank === 'Associate Professor').length,
      assistantProfessors: faculty.filter(f => f.academic_rank === 'Assistant Professor').length,
      clinicalInstructors: faculty.filter(f => f.academic_rank === 'Clinical Instructor').length,
      totalPublications: faculty.reduce((sum, f) => sum + (f.publications_count || 0), 0),
      averageYearsAtRush: faculty.reduce((sum, f) => sum + (f.years_at_rush || 0), 0) / faculty.length
    };

    return stats;
  }

  /**
   * Export faculty data to CSV format
   * @param {Array} faculty - Array of faculty objects
   * @returns {string} - CSV formatted string
   */
  exportToCSV(faculty) {
    const headers = [
      'Name', 'Degree', 'Title', 'Academic Rank', 'Email', 'Phone', 
      'Clinical Focus', 'Years at Rush', 'Publications Count'
    ];

    const rows = faculty.map(f => [
      f.name,
      f.degree,
      f.title,
      f.academic_rank,
      f.email || '',
      f.phone || '',
      this.formatArray(f.clinical_focus),
      f.years_at_rush || '',
      f.publications_count || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FacultyManager;
}