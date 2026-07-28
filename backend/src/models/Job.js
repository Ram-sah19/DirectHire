const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  workplaceMode: {
    type: String,
    enum: ['Remote', 'Onsite', 'Hybrid'],
    required: true,
    default: 'Onsite'
  },
  rawApplicationUrl: {
    type: String,
    required: true,
    trim: true
  },
  dateFetched: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  jobHash: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create text index for full-text search on title and description
JobSchema.index({ title: 'text', description: 'text' });
// Add normal indexes for efficient filtering and sorting
JobSchema.index({ company: 1 });
JobSchema.index({ workplaceMode: 1 });
JobSchema.index({ location: 1 });
JobSchema.index({ isActive: 1 });
JobSchema.index({ lastSeen: -1 });

module.exports = mongoose.model('Job', JobSchema);
