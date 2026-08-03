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

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[DATABASE ERROR] MONGODB_URI is not set in environment variables.');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000
    });
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[DATABASE ERROR] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;


