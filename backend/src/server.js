require('dotenv').config();
const app = require('./app');
const connectDB = async () => {
  const conn = require('./config/db');
  await conn();
};

const PORT = process.env.PORT || 5000;

// Start server after connecting to database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[SERVER] CareerFetch API running on port ${PORT}`);
  });
}).catch(err => {
  console.error('[SERVER ERROR] Failed to connect to DB, server not started:', err);
  process.exit(1);
});
