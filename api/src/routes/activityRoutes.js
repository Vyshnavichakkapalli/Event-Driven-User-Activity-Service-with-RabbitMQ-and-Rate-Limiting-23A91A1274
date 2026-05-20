const express = require('express');
const { ingestActivity } = require('../controllers/activityController');
const { validateActivity } = require('../middlewares/validator');
const { rateLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/', rateLimiter, validateActivity, ingestActivity);

module.exports = router;
