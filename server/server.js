require('rootpath')();
var express = require('express');
var ejs = require('ejs');
var app = express();
var compression = require('compression');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var config = require('config.json');

/* var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sunil.rnsit@gmail.com',
        pass: 'Playa9956'
    }
});

var mailOptions = {
  from: 'sunil.rnsit@gmail.com',
  to: 'sunil.rnsit@gmail.com',
  subject: 'PhotoHub Email Functionality',
  text: 'That was easy! Welcome to Photo Hub and congratulations on booking your first photographer.'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});  */

// enable ejs templates to have .html extension
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// set default views folder
app.set('views', __dirname + '/../client');

// enable gzip compression
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: config.secret,
    store: new MongoStore({ url: config.connectionString }),
    resave: false,
    saveUninitialized: true
}));

// redirect to the install page if first time running
app.use(function (req, res, next) {
    if (!config.installed && req.path !== '/install') {
        return res.redirect('/install');
    }

    next();
});

// api routes
app.use('/api/contact', require('./controllers/api/contact.controller'));
app.use('/api/pages', require('./controllers/api/pages.controller'));
app.use('/api/posts', require('./controllers/api/posts.controller'));
app.use('/api/redirects', require('./controllers/api/redirects.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make JWT token available to angular app
app.get('/token', function (req, res) { 
    res.send(req.session.token);
});

// standalone pages
//app.use('/install', require('./controllers/install.controller'));
app.use('/security/login', require('./controllers/login.controller'));
app.use('/security/register', require('./controllers/register.controller'));

// photohubuser section
app.use('/photohubuser', require('./controllers/photohubuser.controller'));

// photohubhome front end
app.use('/', require('./controllers/photohubhome.controller'));

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 3030;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});