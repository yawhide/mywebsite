var express = require('express');
var router = express.Router();
var getNextSpawn = require('../lib/timer').getNextSpawn

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MS2 Boss Timers', times: JSON.stringify(getNextSpawn()), 'prefix': '/ms2bosstimers' });
});

module.exports = router;
