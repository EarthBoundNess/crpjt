var express = require('express');
const mongoose = require('mongoose');
var fs = require('fs');
//var request = require('request');
var router = express.Router();
//const { parse } = require('querystring');

function strcmp(str1,str2) {
    return (((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1)) == 0);
}

router.use(express.urlencoded());
router.use(express.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root:  '../public' });
});

router.get('/profile', function(req, res, next) {
  res.sendFile('profile.html', { root:  '../public/pages' });
});

router.get('/forum', function(req, res, next) {
  res.sendFile('forum.html', { root:  '../public/pages' });
});

router.get('/games', function(req, res, next) {
  res.sendFile('games.html', { root:  '../public/pages' });
});

router.get('/login', function(req, res, next) {
  res.sendFile('login.html', { root:  '../public/pages' });
});

router.get('/register', function(req, res, next) {
  res.sendFile('register.html', { root:  '../public/pages' });
});

router.get('/thread',function(req,res,next) {
    var file = fs.readFile(__dirname + '/data.json', function(err,data) {
        if(err) throw err;
        var json = JSON.parse(data.toString());
        
        var jsonresult = json.posts;
        res.status(200).json(jsonresult);
    });
});

router.post('/postreq',function(req,res,next) {
    var request = JSON.parse(req.body.posts);
    if (request !== null) {
        fs.readFile(__dirname + '/data.json', function(err,data) {
            if(err) throw err;
            var jsonresult = false;
            var json = JSON.parse(data.toString());
            
            if (json !== null) {
               jsonresult = true;
               json.posts = request;
               
               fs.writeFile(__dirname + '/data.json', JSON.stringify(json), function(err,data) {
                   if(err) throw err;
               }); 
            }
            res.status(200).json(jsonresult);
        });
    }
});

module.exports = router;