const crypto = require('crypto');

/**
 * Infers the workplace mode (Remote, Hybrid, Onsite) based on keywords in title, location and description.
 * @param {string} title 
 * @param {string} location 
 * @param {string} description 
 * @returns {'Remote' | 'Hybrid' | 'Onsite'}
 */
function inferWorkplaceMode(title = '', location = '', description = '') {
  const text = `${title} ${location} ${description}`.toLowerCase();
  
  if (
    text.includes('remote') || 
    text.includes('anywhere') || 
    text.includes('work from home') || 
    text.includes('wfh') ||
    text.includes('virtual')
  ) {
    return 'Remote';
  }
  
  if (
    text.includes('hybrid') || 
    text.includes('flexible onsite') || 
    text.includes('partial remote') ||
    text.includes('work from office 3 days') ||
    text.includes('work from office 2 days')
  ) {
    return 'Hybrid';
  }
  
  return 'Onsite';
}

/**
 * Standardizes a location name.
 * @param {object} locObj 
 * @returns {string}
 */
function normalizeLocation(locObj) {
  if (!locObj || !locObj.name) return 'Remote / Unknown';
  return locObj.name.trim();
}

/**
 * Generates an idempotent SHA-256 hash for a job posting.
 * @param {string} companyId - MongoDB ObjectId string
 * @param {string|number} externalId - Job ID from the ATS (Greenhouse)
 * @returns {string} SHA-256 Hash
 */
function generateJobHash(companyId, externalId) {
  return crypto
    .createHash('sha256')
    .update(`${companyId}_${externalId}`)
    .digest('hex');
}

/**
 * Cleans and normalizes raw HTML job descriptions from ATS providers.
 * Fixes invalid heading hierarchy (h1/h2 -> h3), cleans raw &nbsp; entities,
 * and fixes invalid nested list structures.
 * @param {string} rawHtml 
 * @returns {string}
 */
function cleanJobDescription(rawHtml = '') {
  if (!rawHtml) return '';
  
  let cleaned = rawHtml;

  // Unescape entity-encoded HTML tags if present (e.g. &lt;p&gt; -> <p>)
  if (cleaned.includes('&lt;') || cleaned.includes('&gt;')) {
    cleaned = cleaned
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&amp;/gi, '&');
  }

  cleaned = cleaned
    // Convert <h1> and <h2> inside description body to <h3> for correct hierarchy
    .replace(/<h[12]([^>]*)>/gi, '<h3$1>')
    .replace(/<\/h[12]>/gi, '</h3>')
    // Replace non-breaking spaces with standard space
    .replace(/&nbsp;/gi, ' ')
    // Fix invalid direct <ul><ul> nesting
    .replace(/<\/li>\s*<ul>/gi, '<ul>')
    .trim();

  return cleaned;
}

module.exports = {
  inferWorkplaceMode,
  normalizeLocation,
  generateJobHash,
  cleanJobDescription
};
