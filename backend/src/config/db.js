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

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000
    });
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE ERROR] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
