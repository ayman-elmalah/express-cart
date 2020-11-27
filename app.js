var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var messages = require('express-messages');
var fileUpload = require('express-fileupload');
var passport = require('passport');

var config_database = require('./config/database');
var config_passport = require('./config/passport')(passport);

var Page = require('./models/page');
var Category = require('./models/category');

// Connect to db
mongoose.connect(config_database.database, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to mongoDB");
});

// Init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set global errors
app.locals.errors = null;

// Get page model
Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});

// Get categories
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});

// Express file upload
app.use(fileUpload());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// Express messages middleware
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = messages(req, res);
    next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
});

// Set routes
var adminRoutes = require('./routes/admin');
var webRoutes = require('./routes/web');
var authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', webRoutes);

// Start the server
var port = 3000;
app.listen(port, function () {
    console.log(`Server listening at http://localhost:${port}`);
});