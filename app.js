const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');

const bodyParser = require('body-parser');
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
// const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

//socket.io
//this is the syntax to use socket.io with express
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
const User = require('./api/models/usersmodel');

//const methodOverride = require('method-override');
mongoose.Promise = global.Promise;

//passport config
require('./api/config/passport')(passport);

//EJS
app.use(expressLayout);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('/'));
//app.use(methodOverride('_method'));

//Express session:
app.use(
    require('express-session')({
        secret: 'Cats is not a good movie',
        resave: false,
        saveUninitialized: false,
    })
);

//path for route files
const galleryRoute = require('./api/routes/gallery');
const homeRoute = require('./api/routes/home');
const auctionRoute = require('./api/routes/auction');
//const welcomeRoute = require('./api/routes/welcome');
const loginRoute = require('./api/routes/users');

//connecting DB
mongoose
    .connect(
        'mongodb://nayan:Narasimha@cluster0-shard-00-00-x4umn.mongodb.net:27017,cluster0-shard-00-01-x4umn.mongodb.net:27017,cluster0-shard-00-02-x4umn.mongodb.net:27017/mini?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log('connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });

//connect-flash
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//passport:
//passport-miidleware
app.use(passport.initialize());
app.use(passport.session());
// require('./api/config/passport')(passport);

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

//middlewear to create dynamic login
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('Error');
    res.locals.success = req.flash('Success');
    next();
});

// module.exports =

//routes
app.use('/gallery', galleryRoute);
app.use('/', homeRoute);
app.use('/auction', auctionRoute);
app.use('/users', loginRoute);

//app.use('/', welcomeRoute);

//if no route is found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//to handle all errors.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server Running');
});

//socket configuration
io.on('connection', (socket) => {
    console.log('Connected');
    //emit the id to the server (for the post request's link)

    socket.on('addData', (data) => {
        io.emit('addData', data);
    });

    socket.on('newAmt', (amt) => {
        io.emit('newAmt', amt);
    });
});