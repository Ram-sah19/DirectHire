const axios = require('axios');
const Job = require('../../../backend/src/models/Job');
const { inferWorkplaceMode, normalizeLocation, generateJobHash } = require('./utils/normalizer');

/**
 * Fetches and aggregates jobs from a company's Greenhouse job board.
 * @param {object} companyDoc - The Mongoose Company document
 */
async function scrapeGreenhouseJobs(companyDoc) {
  const { _id: companyId, boardToken, name: companyName } = companyDoc;
  
  // Greenhouse Job Board public API endpoint
  const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;

  console.log(`[SCRAPER] Fetching jobs for ${companyName} from Greenhouse...`);

  try {
    const response = await axios.get(url, { timeout: 15000 });
    
    if (!response.data || !Array.isArray(response.data.jobs)) {
      throw new Error(`Invalid response structure for company ${companyName}`);
    }

    const externalJobs = response.data.jobs;
    console.log(`[SCRAPER] Found ${externalJobs.length} jobs for ${companyName}.`);

    let insertedCount = 0;
    let updatedCount = 0;
    const activeJobHashes = [];

    for (const rawJob of externalJobs) {
      const normalizedLocation = normalizeLocation(rawJob.location);
      const workplaceMode = inferWorkplaceMode(rawJob.title, normalizedLocation, rawJob.content);
      const hash = generateJobHash(companyId.toString(), rawJob.id);
      
      activeJobHashes.push(hash);

      // Perform an idempotent upsert: update lastSeen if exists, insert if new.
      const jobData = {
        company: companyId,
        title: rawJob.title,
        description: rawJob.content || '',
        location: normalizedLocation,
        workplaceMode,
        rawApplicationUrl: rawJob.absolute_url,
        isActive: true,
        lastSeen: new Date()
      };

      // Find one and update. The rawResult option gives us metadata about update/insert
      const result = await Job.findOneAndUpdate(
        { jobHash: hash },
        { 
          $set: jobData,
          $setOnInsert: { dateFetched: new Date(), jobHash: hash }
        },
        { upsert: true, new: true, includeResultMetadata: true }
      );

      // Mongoose 8 returned result shape holds `lastErrorObject` under result.lastErrorObject or result.value
      // We can inspect result.lastErrorObject to check if it was an update or insert
      const wasExisting = result.lastErrorObject && result.lastErrorObject.updatedExisting;
      if (wasExisting) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    }

    // Soft-delete (mark inactive) any jobs for this company not present in the current scrape run
    const deactivateResult = await Job.updateMany(
      { company: companyId, jobHash: { $nin: activeJobHashes }, isActive: true },
      { $set: { isActive: false } }
    );

    console.log(`[SCRAPER] Finished scraping ${companyName}:`);
    console.log(`  - Inserted: ${insertedCount} new jobs`);
    console.log(`  - Updated/Seen: ${updatedCount} existing jobs`);
    console.log(`  - Deactivated: ${deactivateResult.modifiedCount} old jobs`);

    return {
      success: true,
      found: externalJobs.length,
      inserted: insertedCount,
      updated: updatedCount,
      deactivated: deactivateResult.modifiedCount
    };

  } catch (error) {
    console.error(`[SCRAPER ERROR] Failed to scrape ${companyName}:`, error.message);
    throw error;
  }
}

module.exports = {
  scrapeGreenhouseJobs
};
