require('dotenv').config();
const dns = require('node:dns');
const mongoose = require('mongoose');

// Bypass local DNS server SRV lookup failures by forcing public DNS
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {
  console.warn('[WORKER] Failed to override DNS servers:', e.message);
}

const Company = require('../../../backend/src/models/Company');
const { scrapeGreenhouseJobs } = require('./pipeline');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[WORKER ERROR] MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  console.log('[WORKER] Connecting to database...');
  try {
    await mongoose.connect(uri, { family: 4 });
    console.log('[WORKER] Database connection successful.');

    // Seed a test company if none exist
    let companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log('[WORKER] Seeding default test company (Figma)...');
      await Company.create({
        name: 'Figma',
        industry: 'Software & Design Tools',
        careerPageUrl: 'https://www.figma.com/careers/',
        atsType: 'greenhouse',
        boardToken: 'figma'
      });
      console.log('[WORKER] Figma seeded successfully.');
    }

    // Fetch all Greenhouse companies
    const companies = await Company.find({ atsType: 'greenhouse' });
    console.log(`[WORKER] Found ${companies.length} Greenhouse company boards to scrape.`);

    for (const company of companies) {
      try {
        await scrapeGreenhouseJobs(company);
      } catch (err) {
        console.error(`[WORKER ERROR] Scraper failed for company ${company.name}:`, err.message);
      }
    }

    console.log('[WORKER] All scraping runs completed.');
  } catch (error) {
    console.error('[WORKER FATAL] Scraper run crashed:', error);
  } finally {
    console.log('[WORKER] Disconnecting from database...');
    await mongoose.disconnect();
    console.log('[WORKER] Database disconnected. Exiting.');
  }
}

run();
