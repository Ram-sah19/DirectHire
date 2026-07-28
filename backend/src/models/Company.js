const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  careerPageUrl: {
    type: String,
    required: true,
    trim: true
  },
  atsType: {
    type: String,
    enum: ['greenhouse', 'lever', 'other'],
    required: true,
    default: 'greenhouse'
  },
  boardToken: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);
