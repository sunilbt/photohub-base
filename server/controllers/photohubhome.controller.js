var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var path = require('path');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var config = require('config.json');
var photographerService = require('services/photographer.service');
var redirectService = require('services/redirect.service');
var slugify = require('helpers/slugify');
var pager = require('helpers/pager');

var basePath = path.resolve('../client/photohubhome');
var indexPath = basePath + '/index';
var metaTitleSuffix = " | PhotoHub - The power of common people";
var oneWeekSeconds = 60 * 60 * 24 * 7;
var oneWeekMilliseconds = oneWeekSeconds * 1000;

/* STATIC ROUTES
---------------------------------------*/

router.use('/_dist', express.static(basePath + '/_dist'));
router.use('/_content', express.static(basePath + '/_content', { maxAge: oneWeekMilliseconds }));

/* MIDDLEWARE
---------------------------------------*/

// check for redirects
router.use(function (req, res, next) {
    var host = req.get('host');
    var url = req.url.toLowerCase();

    // redirects entered into cms
    redirectService.getByFrom(url)
        .then(function (redirect) {
            if (redirect) {
                // 301 redirect to new url
                return res.redirect(301, redirect.to);
            } 

            next();
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });
});

// add shared data to vm
router.use(function (req, res, next) {
    var vm = req.vm = {};

    vm.loggedIn = !!req.session.token;
    vm.domain = req.protocol + '://' + req.get('host');
    vm.url = vm.domain + req.path;
    vm.googleAnalyticsAccount = config.googleAnalyticsAccount;

    photographerService.getAll()
        .then(function (photographers) {
            // if admin user is logged in return all posts, otherwise return only published posts
            vm.photographers = vm.loggedIn ? photographers : _.filter(photographers, {});
            next();
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });

});

/* ROUTES
---------------------------------------*/

// home route
router.get('/', function (req, res, next) {
    var vm = req.vm;

    var currentPage = req.query.page || 1;
    vm.pager = pager(vm.photographers.length, currentPage);
    vm.photographers = vm.photographers.slice(vm.pager.startIndex, vm.pager.endIndex + 4 );

    render('home/index.view.html', req, res);
});


// contact route
router.get('/contact', function (req, res, next) {
    var vm = req.vm;

    // meta tags
    vm.metaTitle = 'Contact Me' + metaTitleSuffix;
    vm.metaDescription = 'Contact Me' + metaTitleSuffix;

    render('contact/index.view.html', req, res);
});

// contact thanks route
router.get('/contact-thanks', function (req, res, next) {
    var vm = req.vm;

    // meta tags
    vm.metaTitle = 'Contact Me' + metaTitleSuffix;
    vm.metaDescription = 'Contact Me' + metaTitleSuffix;

    render('contact/thanks.view.html', req, res);
});

/* PROXY ROUTES
---------------------------------------*/

// google analytics
router.get('/analytics.js', function (req, res, next) {
    proxy('http://www.google-analytics.com/analytics.js', basePath + '/_content/analytics.js', req, res);
});

// carbon ads
router.get('/carbonads.js', function (req, res, next) {
    proxy('http://cdn.carbonads.com/carbon.js', basePath + '/_content/carbonads.js', req, res);
});

module.exports = router;

/* PRIVATE HELPER FUNCTIONS
---------------------------------------*/

// render template
function render(templateUrl, req, res) {
    var vm = req.vm;

    vm.xhr = req.xhr;
    vm.templateUrl = templateUrl;

    // render view only for ajax request or whole page for full request
    var renderPath = req.xhr ? basePath + '/' + vm.templateUrl : indexPath;
    return res.render(renderPath, vm);
}

// proxy file from remote url for page speed score
function proxy(fileUrl, filePath, req, res) {
    // ensure file exists and is less than 1 hour old
    fs.stat(filePath, function (err, stats) {
        if (err) {
            // file doesn't exist so download and create it
            updateFileAndReturn();
        } else {
            // file exists so ensure it's not stale
            if (moment().diff(stats.mtime, 'minutes') > 60) {
                updateFileAndReturn();
            } else {
                returnFile();
            }
        }
    });

    // update file from remote url then send to client
    function updateFileAndReturn() {
        request(fileUrl, function (error, response, body) {
            fs.writeFileSync(filePath, body);
            returnFile();
        });
    }

    // send file to client
    function returnFile() {
        res.set('Cache-Control', 'public, max-age=' + oneWeekSeconds);
        res.sendFile(filePath);
    }
}