const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/usersmodel');

//login form
router.get('/login', (req, res) => {
    res.render('login');
});

//register form
router.get('/register', (req, res) => {
    res.render('register');
});

//register handle
router.post('/register', (req, res) => {
    //validating
    const { name, email, password, password2, admincode } = req.body;
    let errors = [];

    //check req fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all feilds' });
    }

    //check pwd match.
    if (password !== password2) {
        errors.push({ msg: 'Password do not match' });
    }

    //check pwd length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 char' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            admincode,
        });
    } else {
        //validaation passed
        User.findOne({ email: email })
            .exec()
            .then((user) => {
                if (user) {
                    //user exists
                    errors.push({ msg: 'Email already exists' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        admincode,
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                        admincode,
                    });
                    //admin access
                    if (admincode === 'naykeer') {
                        console.log(req.body);
                        newUser.isAdmin = true;
                    }

                    // console.log(newUser);
                    // res.send('Hello');
                    //hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            //Set pwd to hash
                            newUser.password = hash;

                            //save User
                            newUser
                                .save()
                                .then((user) => {
                                    req.flash('success_msg', 'You are registered and can login');
                                    res.redirect('/users/login');
                                })
                                .catch((err) => console.log(err));
                        })
                    );
                }
            });
    }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

//logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;