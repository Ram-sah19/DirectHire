require('dotenv').config();
const dns = require('node:dns');
const axios = require('axios');

// Monkey-patch Node's DNS SRV resolver to bypass Windows local router DNS SRV blocking
const originalResolveSrv = dns.promises.resolveSrv;
dns.promises.resolveSrv = async function (hostname) {
  try {
    const srvUrl = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=SRV`;
    const res = await axios.get(srvUrl, { timeout: 5000 });
    if (res.data && res.data.Answer && res.data.Answer.length > 0) {
      console.log(`[DNS PATCH] Resolved SRV for ${hostname} via Google DoH.`);
      return res.data.Answer.map(item => {
        const parts = item.data.split(' ');
        return {
          name: parts[3].replace(/\.$/, ''),
          port: parseInt(parts[2], 10),
          priority: parseInt(parts[0], 10),
          weight: parseInt(parts[1], 10)
        };
      });
    }
  } catch (e) {
    console.warn(`[DNS PATCH] Google DoH fallback failed:`, e.message);
  }
  return originalResolveSrv.call(dns.promises, hostname);
};

const mongoose = require('mongoose');
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
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000
    });
    console.log('[WORKER] Database connection active and ready.');

    // 1. Seed comprehensive list of tech companies using Greenhouse ATS
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
      try {
        await Company.findOneAndUpdate(
          { boardToken: comp.boardToken },
          { $set: comp },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn(`[WORKER] Seed error for ${comp.name}:`, err.message);
      }
    }
    console.log(`[WORKER] Seeding completed for ${defaultCompanies.length} tech companies.`);

    // 2. Run DebugWithShubham Scraper
    try {
      await scrapeDebugWithShubhamJobs();
    } catch (err) {
      console.error('[WORKER ERROR] DebugWithShubham scraper failed:', err.message);
    }

    // 3. Fetch and scrape all Greenhouse company boards
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
