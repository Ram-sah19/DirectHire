const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

/**
 * @route   GET /api/jobs
 * @desc    Get paginated, filtered list of active jobs with optional text-search
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      location, 
      workplaceMode 
    } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10))); // capped at 100
    const skip = (parsedPage - 1) * parsedLimit;

    // Base query to fetch active jobs
    const query = { isActive: true };

    // 1. Text Search Filter (Title & Description)
    if (search) {
      query.$text = { $search: search };
    }

    // 2. Workplace Mode Filter (comma separated: e.g. Remote,Hybrid)
    if (workplaceMode) {
      const modes = workplaceMode.split(',').map(m => m.trim());
      query.workplaceMode = { $in: modes };
    }

    // 3. Location Filter (Case-insensitive partial matching)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Determine sorting criteria
    // If full-text search is present, sort by relevance textScore, otherwise sort by latest fetch/seen date
    const sortOption = search 
      ? { score: { $meta: 'textScore' } } 
      : { lastSeen: -1 };

    // Execute query and count concurrently
    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate('company', 'name industry careerPageUrl')
        .sort(sortOption)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Job.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalJobs / parsedLimit);

    return res.json({
      success: true,
      meta: {
        totalJobs,
        currentPage: parsedPage,
        totalPages,
        limit: parsedLimit,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1
      },
      jobs
    });

  } catch (error) {
    console.error('[API ERROR] Failed to fetch jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching jobs',
      error: error.message
    });
  }
});

module.exports = router;
