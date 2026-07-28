const axios = require('axios');
const Job = require('../../../../backend/src/models/Job');
const Company = require('../../../../backend/src/models/Company');
const { inferWorkplaceMode, normalizeLocation, generateJobHash } = require('../utils/normalizer');

/**
 * Scrapes curated tech job listings from debugwithshubham.com/jobs
 */
async function scrapeDebugWithShubhamJobs() {
  const targetUrl = 'https://debugwithshubham.com/jobs';
  console.log(`[SCRAPER] Fetching listings from ${targetUrl}...`);

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000
    });

    const html = response.data;
    
    // Extract Next.js data JSON script if present
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
    let jobItems = [];

    if (nextDataMatch && nextDataMatch[1]) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        // Extract jobs list from pageProps if present
        const pageProps = nextData?.props?.pageProps;
        if (pageProps?.jobs && Array.isArray(pageProps.jobs)) {
          jobItems = pageProps.jobs;
        }
      } catch (err) {
        console.warn('[SCRAPER] NextData JSON parse fallback:', err.message);
      }
    }

    console.log(`[SCRAPER] Parsed ${jobItems.length} jobs from DebugWithShubham.`);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const rawJob of jobItems) {
      const companyName = rawJob.company || rawJob.companyName || 'Verified Corporate Board';
      
      // Ensure company exists in MongoDB
      let companyDoc = await Company.findOne({ name: companyName });
      if (!companyDoc) {
        companyDoc = await Company.create({
          name: companyName,
          industry: rawJob.industry || 'Technology & Software',
          careerPageUrl: rawJob.applyUrl || rawJob.link || targetUrl,
          atsType: 'other',
          boardToken: companyName.toLowerCase().replace(/\s+/g, '-')
        });
      }

      const externalId = rawJob._id || rawJob.id || `${companyName}_${rawJob.title}`;
      const hash = generateJobHash(companyDoc._id.toString(), externalId);
      const normalizedLocation = normalizeLocation({ name: rawJob.location || 'India / Remote' });
      const workplaceMode = inferWorkplaceMode(rawJob.title, normalizedLocation, rawJob.description || '');

      const jobData = {
        company: companyDoc._id,
        title: rawJob.title || 'Software Engineering Role',
        description: rawJob.description || rawJob.summary || `<p>Verified listing from ${companyName}. Click direct apply to view requirements on official career site.</p>`,
        location: normalizedLocation,
        workplaceMode,
        rawApplicationUrl: rawJob.applyUrl || rawJob.link || targetUrl,
        isActive: true,
        lastSeen: new Date()
      };

      const result = await Job.findOneAndUpdate(
        { jobHash: hash },
        { 
          $set: jobData,
          $setOnInsert: { dateFetched: new Date(), jobHash: hash }
        },
        { upsert: true, new: true, includeResultMetadata: true }
      );

      const wasExisting = result.lastErrorObject && result.lastErrorObject.updatedExisting;
      if (wasExisting) {
        updatedCount++;
      } else {
        insertedCount++;
      }
    }

    console.log(`[SCRAPER] DebugWithShubham ingestion finished: ${insertedCount} inserted, ${updatedCount} updated.`);
    return { inserted: insertedCount, updated: updatedCount };

  } catch (error) {
    console.error(`[SCRAPER ERROR] Failed to scrape ${targetUrl}:`, error.message);
    throw error;
  }
}

module.exports = {
  scrapeDebugWithShubhamJobs
};
