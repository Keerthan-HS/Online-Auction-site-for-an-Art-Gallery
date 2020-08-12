const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//loaduser model
const User = require('../models/usersmodel');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Match user
            User.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            message: 'That email is not registered',
                        });
                    }
                    //match pwd
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Pwd Incorrect' });
                        }
                    });
                })
                .catch((err) => console.log(err));
        })
    );
    //serializing and deserializing users to create cookies
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};
// app.use((req, res, next) => {
//     res.locals.currentUser = req.User;
//     res.locals.error = req.flash('Error');
//     res.locals.success = req.flash('Success');
//     next();
// });