const express = require('express')
const router = express.Router();

router.use('/', express.static('../../public/html/interventions'));

module.exports = router;