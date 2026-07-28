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

module.exports = {
  inferWorkplaceMode,
  normalizeLocation,
  generateJobHash
};
