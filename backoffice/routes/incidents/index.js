const express = require('express')
const router = express.Router();

router.use('/', express.static('public/html/incidents'));

module.exports = router;