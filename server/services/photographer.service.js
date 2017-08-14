var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var slugify = require('helpers/slugify');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('photographers');

var service = {};

service.getAll = getAll;
service.getByUrl = getByUrl;
service.getByUserId = getByUserId;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();
    db.photographers.find().toArray(function (err, posts) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(posts);
    });

    return deferred.promise;
}

function getByUserId(userid) {
    var deferred = Q.defer();

    db.photographers.findOne({
        userid: userid
    }, function (err, post) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(post);
    });

    return deferred.promise;
}


function getByUrl(year, month, day, slug) {
    var deferred = Q.defer();

    return deferred.promise;
}

function getById(id) {
    var deferred = Q.defer();

    db.photographers.findById(id, function (err, post) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(post);
    });

    return deferred.promise;
}


function create(postParam) {
    var deferred = Q.defer();

    // generate slug from title if empty
    postParam.slug = postParam.slug || slugify(postParam.title);

    db.photographers.insert(
        postParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, postParam) {
    var deferred = Q.defer();

    // generate slug from title if empty
    postParam.slug = postParam.slug || slugify(postParam.title);

    // fields to update
    var set = _.omit(postParam, '_id');

    db.photographers.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.photographers.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}