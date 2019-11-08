var express = require('express');
var fs = require('fs');
var request = require('request');
var router = express.Router();
const { parse } = require('querystring');

function strcmp(str1,str2) {
    return (((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1)) == 0);
}

router.use(express.urlencoded());
router.use(express.json());

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

router.get('/getusername',function(req,res,next) {
    var request = req.query.q;
    if (request !== null) {
        var file = fs.readFile(__dirname + '/data.json', function(err,data) {
            if(err) throw err;
            var json = JSON.parse(data.toString());
            var accounts = json.accounts;
        
            var id = Number(request);
            var jsonresult = null;
            
            if (id < accounts.length && id >= 0) {
                jsonresult = {"username": accounts[id].username};
            }
            res.status(200).json(jsonresult);
        });
    }
});

router.get('/getid',function(req,res,next) {
    var request = req.query.q;
    if (request !== null) {
        var file = fs.readFile(__dirname + '/data.json', function(err,data) {
            if(err) throw err;
            var json = JSON.parse(data.toString());
            var accounts = json.accounts;
        
            var username = request;
            var jsonresult = null;
            
            for(var i = 0; i < accounts.length; i++) {
                if(strcmp(accounts[i].username.toLowerCase(),username.toLowerCase())) {
                    jsonresult = {"id": accounts[i].id};
                    break;
                }
            }
            res.status(200).json(jsonresult);
        });
    }
});

router.get('/user',function(req,res,next) {
    var request = req.query.q.toString().split(",");
    if (request !== null) {
        var file = fs.readFile(__dirname + '/data.json', function(err,data) {
            if(err) throw err;
            var json = JSON.parse(data.toString());
            var accounts = json.accounts;
            
            var jsonresult = null;
            if (request.length === 2) {
                var id = Number(request[1]);
                var ownId = Number(request[0]);
                
                if (id < accounts.length && id >= 0) {
                    if (id === ownId) {
                        jsonresult = {
                            "max": accounts.length - 1,
                            "username": accounts[id].username,
                            "desc": accounts[id].data.desc,
                            "status": accounts[id].data.status,
                            "email": accounts[id].data.email,
                            "dob": accounts[id].data.dob,
                            "gender": accounts[id].data.gender
                        };
                    }
                    else {
                        jsonresult = {
                            "max": accounts.length - 1,
                            "username": accounts[id].username,
                            "desc": accounts[id].data.desc,
                            "status": accounts[id].data.status,
                            "email": null
                        };
                    }
                }
            }
            res.status(200).json(jsonresult);
            
        });
    }
});

router.get('/thread',function(req,res,next) {
    var file = fs.readFile(__dirname + '/data.json', function(err,data) {
        if(err) throw err;
        var json = JSON.parse(data.toString());
        
        var jsonresult = json.posts;
        res.status(200).json(jsonresult);
    });
});

router.post('/loginreq',function(req,res,next) {
    var request = req.body;
    if (request !== null) {
        var file = fs.readFile(__dirname + '/data.json', function(err,data) {
            if(err) throw err;
            var json = JSON.parse(data.toString());
            var accounts = json.accounts;
        
            var username = request.username;
            var password = request.password;
            var jsonresult = null;
            for(var i = 0; i < accounts.length; i++) {
                if(strcmp(accounts[i].username.toLowerCase(),username.toLowerCase()) && strcmp(accounts[i].data.password,password)) {
                    jsonresult = {"id": accounts[i].id};
                    break;
                }
            }
            res.status(200).json(jsonresult);
        });
    }
});

router.post('/registerreq',function(req,res,next) {
    var request = req.body;
    if (request !== null) {
        fs.readFile(__dirname + '/data.json', function(err,data) {
            if(err) throw err;
            var jsonresult = null;
            var alreadyUsed = false;
            var json = JSON.parse(data.toString());
            var username = request.username;
            
            if (json !== null) {
                for(var i = 0; i < json.accounts.length; i++) {
                    if(strcmp(json.accounts[i].username.toLowerCase(),username.toLowerCase())) {
                        alreadyUsed = true;
                        break;
                    }
                }
                
                if (!alreadyUsed) {
                   jsonresult = {"id": json.accounts.length};
                   var newAccount = {
                        "data": {
                            "gender": request.gender,
                            "password": request.password,
                            "email": request.email,
                            "dob": request.dob,
                            "desc": "I am a new Blockmania user!",
                            "status": "Playin' games~"
                        },
                        "username": request.username,
                        "id": json.accounts.length
                   };
                   json.accounts.push(newAccount);
                   
                   fs.writeFile(__dirname + '/data.json', JSON.stringify(json), function(err,data) {
                       if(err) throw err;
                   }); 
                }
            }
            res.status(200).json(jsonresult);
        });
    }
});

router.post('/statusreq',function(req,res,next) {
    var request = req.body;
    if (request !== null) {
        var file = fs.readFile(__dirname + '/data.json', function(err,data) {
            if(err) throw err;
            var json = JSON.parse(data.toString());
            var accounts = json.accounts;
        
            var status = request.status;
            var id = request.id;
            var jsonresult = false;
            
            if (id < accounts.length && id >= 0) {
                jsonresult = true;
                json.accounts[id].data.status = status;
                
                fs.writeFile(__dirname + '/data.json', JSON.stringify(json), function(err,data) {
                    if(err) throw err;
                });
            }
            res.status(200).json(jsonresult);
        });
    }
});

router.post('/descreq',function(req,res,next) {
    var request = req.body;
    if (request !== null) {
        var file = fs.readFile(__dirname + '/data.json', function(err,data) {
            if(err) throw err;
            var json = JSON.parse(data.toString());
            var accounts = json.accounts;
        
            var desc = request.desc;
            var id = request.id;
            var jsonresult = false;
            
            if (id < accounts.length && id >= 0) {
                jsonresult = true;
                json.accounts[id].data.desc = desc;
                
                fs.writeFile(__dirname + '/data.json', JSON.stringify(json), function(err,data) {
                    if(err) throw err;
                });
            }
            res.status(200).json(jsonresult);
        });
    }
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