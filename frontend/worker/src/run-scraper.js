const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../../backend/.env') });

const dns = require('node:dns');
const axios = require('axios');

// Set public DNS servers (Google & Cloudflare) to bypass Windows local router DNS blocking
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']);
  console.log('[DNS] Configured Google & Cloudflare DNS servers (8.8.8.8, 1.1.1.1)');
} catch (e) {
  console.warn('[DNS WARNING] Could not set custom DNS servers:', e.message);
}

// Helper to resolve SRV via Google DoH fallback
async function fetchSrvDoH(hostname) {
  const srvUrl = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=SRV`;
  const res = await axios.get(srvUrl, { timeout: 5000 });
  if (res.data && res.data.Answer && res.data.Answer.length > 0) {
    console.log(`[DNS PATCH] Resolved SRV for ${hostname} via Google DoH.`);
    return res.data.Answer.map(item => {
      const parts = item.data.split(' ');
      return {
        name: parts[3] ? parts[3].replace(/\.$/, '') : '',
        port: parseInt(parts[2], 10) || 27017,
        priority: parseInt(parts[0], 10) || 0,
        weight: parseInt(parts[1], 10) || 0
      };
    });
  }
  throw new Error(`DoH SRV empty for ${hostname}`);
}

// Helper to resolve TXT via Google DoH fallback
async function fetchTxtDoH(hostname) {
  const txtUrl = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=TXT`;
  const res = await axios.get(txtUrl, { timeout: 5000 });
  if (res.data && res.data.Answer && res.data.Answer.length > 0) {
    console.log(`[DNS PATCH] Resolved TXT for ${hostname} via Google DoH.`);
    return res.data.Answer.map(item => [item.data.replace(/^"|"$/g, '')]);
  }
  throw new Error(`DoH TXT empty for ${hostname}`);
}

// Patch Promise SRV resolver
const originalPromisesResolveSrv = dns.promises.resolveSrv;
dns.promises.resolveSrv = async function (hostname) {
  try {
    return await originalPromisesResolveSrv.call(dns.promises, hostname);
  } catch (err) {
    console.warn(`[DNS PATCH] Native SRV resolution failed for ${hostname}, trying Google DoH...`);
    try {
      return await fetchSrvDoH(hostname);
    } catch (dohErr) {
      throw err;
    }
  }
};

// Patch Callback SRV resolver
const originalResolveSrv = dns.resolveSrv;
dns.resolveSrv = function (hostname, callback) {
  originalResolveSrv.call(dns, hostname, (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      return callback(null, addresses);
    }
    fetchSrvDoH(hostname)
      .then(res => callback(null, res))
      .catch(() => callback(err, addresses));
  });
};

// Patch Promise TXT resolver
const originalPromisesResolveTxt = dns.promises.resolveTxt;
dns.promises.resolveTxt = async function (hostname) {
  try {
    return await originalPromisesResolveTxt.call(dns.promises, hostname);
  } catch (err) {
    console.warn(`[DNS PATCH] Native TXT resolution failed for ${hostname}, trying Google DoH...`);
    try {
      return await fetchTxtDoH(hostname);
    } catch (dohErr) {
      throw err;
    }
  }
};

// Patch Callback TXT resolver
const originalResolveTxt = dns.resolveTxt;
dns.resolveTxt = function (hostname, callback) {
  originalResolveTxt.call(dns, hostname, (err, records) => {
    if (!err && records && records.length > 0) {
      return callback(null, records);
    }
    fetchTxtDoH(hostname)
      .then(res => callback(null, res))
      .catch(() => callback(err, records));
  });
};

const connectDB = require('../../../backend/src/config/db');
const mongoose = require('../../../backend/node_modules/mongoose');
const Company = require('../../../backend/src/models/Company');
const { scrapeGreenhouseJobs } = require('./pipeline');
const { scrapeDebugWithShubhamJobs } = require('./scrapers/debugWithShubhamScraper');

async function run() {
  console.log('[WORKER] Connecting to database...');
  try {
    await connectDB();
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
