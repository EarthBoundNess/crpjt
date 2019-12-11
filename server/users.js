const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");

const SALT_WORK_FACTOR = 10;

//
// Users
//

const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  tokens: [],
});

userSchema.pre('save', async function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password'))
    return next();

  try {
    // generate a salt
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

    // hash the password along with our new salt
    const hash = await bcrypt.hash(this.password, salt);

    // override the plaintext password with the hashed one
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.tokens;
  return obj;
}

userSchema.methods.addToken = function(token) {
  this.tokens.push(token);
}

userSchema.methods.removeToken = function(token) {
  this.tokens = this.tokens.filter(t => t != token);
}

userSchema.methods.removeOldTokens = function() {
  this.tokens = auth.removeOldTokens(this.tokens);
}

const User = mongoose.model('User', userSchema);

const dataSchema = new mongoose.Schema({
  id: Number,
  username: String,
  gender: String,
  email: String,
  dob: String,
  desc: String,
  status: String
});

const Data = mongoose.model('Data', dataSchema);

// create a new user
router.post('/', async (req, res) => {
  console.log(req.body.username);
  if (!req.body.username || !req.body.password || !req.body.gender || !req.body.email || !req.body.dob)
    return res.status(400).send({
      message: "username and password are required"
    });


  try {

    //  check to see if username already exists
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (existingUser)
      return res.status(403).send({
        message: "username already exists"
      });

    // create new user
    const newId = await User.count();
    
    const user = new User({
      id: newId,
      username: req.body.username,
      password: req.body.password
    });
    await user.save();
    
    const data = new Data({
      id: newId,
      username: req.body.username,
      gender: req.body.gender,
      email: req.body.email,
      dob: req.body.dob,
      desc: "I am a new Blockmania user!",
      status: "Playin' games~"
    });
    await data.save();
    
    login(user, res);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// login
router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    //  lookup user record
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (!existingUser)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    // check password
    if (!await existingUser.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    login(existingUser, res);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Logout
router.delete("/", auth.verifyToken, async (req, res) => {
  // look up user account
  const user = await User.findOne({
    _id: req.user_id
  });
  if (!user)
    return res.clearCookie('token').status(403).send({
      error: "must login"
    });

  user.removeToken(req.token);
  await user.save();
  res.clearCookie('token');
  res.sendStatus(200);
});

// Get current user if logged in.
router.get('/', auth.verifyToken, async (req, res) => {
  // look up user account
  const user = await User.findOne({
    _id: req.user_id
  });
  if (!user)
    return res.status(403).send({
      error: "must login"
    });

  return res.send(user);
});

router.get('/getusername',async (req,res,next) => {
    var request = req.query.q;
    if (request !== null) {
        var fdata = await Data.findOne({id: Number(request)});
        
        if (fdata !== null) {
            var jsonresult = {"username": fdata.username};
            res.status(200).json(jsonresult);
        }
    }
});

router.get('/getid',async (req,res,next) => {
    var request = req.query.q;
    if (request !== null) {
        var fdata = await Data.findOne({username: request});
        
        if (fdata !== null) {
            var jsonresult = {"id": fdata.id};
            res.status(200).json(jsonresult);
        }
    }
});

router.get('/getuser',async (req,res,next) => {
    var request = req.query.q.toString().split(",");
    if (request !== null) {
        var jsonresult = null;
        if (request.length === 2) {
            var id = Number(request[1]);
            var ownId = Number(request[0]);
            
            const max = await Data.count();
            const fdata = await Data.findOne({id: id});
    
            if (fdata !== null) {
                if (id === ownId) {
                    jsonresult = {
                        "max": max,
                        "username": fdata.username,
                        "desc": fdata.desc,
                        "status": fdata.status,
                        "email": fdata.email,
                        "dob": fdata.dob,
                        "gender": fdata.gender
                    };
                }
                else {
                    jsonresult = {
                        "max": max,
                        "username": fdata.username,
                        "desc": fdata.desc,
                        "status": fdata.status,
                        "email": null
                    };
                }
                res.status(200).json(jsonresult);
            }
        }
    }
});

router.post('/statusreq',async (req,res,next) => {
    var request = req.body;
    if (request !== null) {
        try {
          var status = request.status;
          var id = request.id;
          var jsonresult = false;
          
          const fdata = await Data.findOne({id: id});
          
          jsonresult = true;
          fdata.status = status;
          
          await fdata.save();
              
          res.status(200).json(jsonresult);
        } catch (error) {
          console.log(error);
          return res.sendStatus(500);
        }
    }
});

router.post('/descreq',async(req,res,next) => {
    var request = req.body;
    if (request !== null) {
        try {
          var desc = request.desc;
          var id = request.id;
          var jsonresult = false;
          
          const fdata = await Data.findOne({id: id});
          
          jsonresult = true;
          fdata.desc = desc;
          
          await fdata.save();
              
          res.status(200).json(jsonresult);
        } catch (error) {
          console.log(error);
          return res.sendStatus(500);
        }
    }
});

module.exports = router;

async function login(user, res) {
  let token = auth.generateToken({
    id: user._id
  }, "24h");

  user.removeOldTokens();
  user.addToken(token);
  await user.save();

  return res
    .cookie("token", token, {
      expires: new Date(Date.now() + 86400 * 1000)
    })
    .status(200).send(user);
}