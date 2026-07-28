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
const { scrapeDebugWithShubhamJobs } = require('./scrapers/debugWithShubhamScraper');

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

    // 1. Scrape curated portal debugwithshubham.com/jobs
    try {
      await scrapeDebugWithShubhamJobs();
    } catch (err) {
      console.error('[WORKER ERROR] DebugWithShubham scraper failed:', err.message);
    }

    // 2. Seed comprehensive list of tech companies using Greenhouse ATS
    const defaultCompanies = [
      { name: 'Figma', industry: 'Design & Software', careerPageUrl: 'https://www.figma.com/careers/', atsType: 'greenhouse', boardToken: 'figma' },
      { name: 'Flexport', industry: 'Logistics Tech', careerPageUrl: 'https://www.flexport.com/careers/', atsType: 'greenhouse', boardToken: 'flexport' },
      { name: 'Cloudflare', industry: 'Cloud & Infrastructure', careerPageUrl: 'https://www.cloudflare.com/careers/', atsType: 'greenhouse', boardToken: 'cloudflare' },
      { name: 'Coinbase', industry: 'Fintech & Crypto', careerPageUrl: 'https://www.coinbase.com/careers', atsType: 'greenhouse', boardToken: 'coinbase' },
      { name: 'DoorDash', industry: 'Consumer Tech', careerPageUrl: 'https://careers.doordash.com/', atsType: 'greenhouse', boardToken: 'doordash' },
      { name: 'Discord', industry: 'Social & Communication', careerPageUrl: 'https://discord.com/careers', atsType: 'greenhouse', boardToken: 'discord' },
      { name: 'Retool', industry: 'Developer Tools', careerPageUrl: 'https://retool.com/careers', atsType: 'greenhouse', boardToken: 'retool' },
      { name: 'Airtable', industry: 'Productivity Tech', careerPageUrl: 'https://airtable.com/careers', atsType: 'greenhouse', boardToken: 'airtable' },
      { name: 'Webflow', industry: 'Web & Visual Dev', careerPageUrl: 'https://webflow.com/careers', atsType: 'greenhouse', boardToken: 'webflow' }
    ];

    for (const comp of defaultCompanies) {
      await Company.findOneAndUpdate(
        { boardToken: comp.boardToken },
        { $set: comp },
        { upsert: true, new: true }
      );
    }
    console.log(`[WORKER] Seeding completed for ${defaultCompanies.length} tech companies.`);

    // 3. Fetch all Greenhouse companies
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
