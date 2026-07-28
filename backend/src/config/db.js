const dns = require('node:dns');
const mongoose = require('mongoose');

// Bypass local DNS server SRV lookup failures by forcing public DNS
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {
  console.warn('[DATABASE] Failed to override DNS servers:', e.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4 // Force IPv4 resolution
    });
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE ERROR] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
