var express = require('express');
var fs = require('fs');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root:  'public' });
});

router.get('/profile', function(req, res, next) {
  res.sendFile('profile.html', { root:  'public/pages' });
});

router.get('/forum', function(req, res, next) {
  res.sendFile('forum.html', { root:  'public/pages' });
});

router.get('/games', function(req, res, next) {
  res.sendFile('games.html', { root:  'public/pages' });
});

router.get('/login', function(req, res, next) {
  res.sendFile('login.html', { root:  'public/pages' });
});

router.get('/register', function(req, res, next) {
  res.sendFile('register.html', { root:  'public/pages' });
});

router.get('/loadreq',function(req,res,next) {
    res.status(200).sendFile('data.json', { root: 'routes' });
});

router.get('/loginreq',function(req,res,next) {
    var jsonresult = [];
    var data = fs.readFile('data.json', function(err,data) {
        if(err) throw err;
        var request = new RegExp("^" + req.query.q);
        request = request.split(',');
        if (request.length === 2) {
            var username = request[0];
            var password = request[1];
            for(var i = 0; i < data.accounts.length; i++) {
                var result = data.accounts[i].search(username);
                if(result != -1) {
                    if (data.accounts[i].data.password === password) {
                        jsonresult.push(data.accounts[i]);
                    }
                }
            }
        }
    });
    res.status(200).json(jsonresult);
});

/*router.get('/getcity',function(req,res,next) {
    fs.readFile(__dirname + '/cities.dat.txt',function(err,data) {
        if(err) throw err;
        var myRe = new RegExp("^" + req.query.q);
        var cities = data.toString().split("\n");
        var jsonresult = [];
        for(var i = 0; i < cities.length; i++) {
            var result = cities[i].search(myRe);
            if(result != -1) {
                jsonresult.push({city:cities[i]});
            }
        }
        res.status(200).json(jsonresult);
    });
});*/

module.exports = router;