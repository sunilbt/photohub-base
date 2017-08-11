var express = require('express');
var router = express.Router();
var request = require('request');
var userService = require('services/user.service');

router.get('/', function (req, res) {
    res.render('security/register/index');
});

router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    userService.create(req.body)
        //success
        .then(function () {
            // return to login page with success message
            req.session.success = 'Registration successful';
            return res.redirect('/security/login');                    
        })
        //failure
        .catch(function (err) {

            if (res.statusCode == 200) {
                return res.render('security/register', {
                    error: 'Username exists, Please try to use an other username',
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    photographer: req.body.value
                });
            }

           if (res.statusCode !== 200) {
                return res.render('security/register', {
                    error: response.body,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    photographer: req.body.value
                });
            }

            return res.render('security/register', { error: 'An error occurred' });

        });
});

module.exports = router; 