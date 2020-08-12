const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//to reach welcome page
router.get('/', (req, res) => {
    res.render('home');
});

//to get to about page
router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;