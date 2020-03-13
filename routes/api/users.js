const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const User = require("../../models/User");
const sanitize          = require('mongo-sanitize');
const withAuth = require('./../../utils/middleware');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateResetSend = require("../../validation/resetSend");
const validateLoginInput = require("../../validation/login");
const Validator         = require("validator");
const passwordValidator = require('password-validator');

// Mailtrap
let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'dbbd9d0a415229',
        pass: 'd4ef0a653fe03c'
    }
});

// Validation
var schema = new passwordValidator();
schema
    .is().min(8)
    .is().max(30)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()


router.get('/checkToken', withAuth, (req, res) => { res.sendStatus(200) });

router.get('/logout', withAuth, (req, res) => {
  res.clearCookie('token');
  res.sendStatus(200);
});


router.get('/active/:token', async(req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({tokenMail: token});
        if (user){
            user.active = 1;
            user.tokenMail = '';
            user.save();
            return res.status(200).json({});
        } else throw new Error('Token not find');
    } catch(err){
        console.log(err);
        return res.status(400).json({});
    }
});

router.post('/reset/send', async(req, res) => {
    const { errors, isValid } = validateResetSend(req.body);
    // Check validation
    if (!isValid)
        return res.status(400).json(errors);
    try {
        const email = sanitize(req.body.email);
        const user = await User.findOne({email: email});
        if (user){
            // Token for mail
            let token = ((+new Date) + Math.random()* 100).toString(32);
            let hashtoken = crypto.createHash('md5').update(token).digest("hex");
            user.tokenReset = hashtoken;
            user.save();
            const message = {
                from: 'matcha@app.com',
                to: req.body.email,
                subject: 'Activate your account',
                text: `Hello ${user.username}!\nHere is the link to reset your password\nhttp://localhost:3000/users/reset/${hashtoken}`,
            };
            transport.sendMail(message, function(err, info) {
                if (err) console.log(err)
                else console.log(info);
            });
        }
        return res.status(200).json({});
    } catch(err){
        console.log(err);
        console.log(5);
        return res.status(400).json({});
    }
});

router.post('/reset/:token', async(req, res) => {
    let errors = {
        password: false,
        password_confirm: false
    };
    try {
        const token = sanitize(req.body.token);
        const user = await User.findOne({tokenReset: token});
        if (user){
            // check if the entries are valid
            let password = sanitize(req.body.password);
            let password_confirm = sanitize(req.body.password_confirm);
            if (password && !schema.validate(password))
                errors.password = "Password must contain at least one uppercase, one number and one symbol, and at least 8 characters."
            if (password && password_confirm && !Validator.equals(password, password_confirm))
                errors.password_confirm = "Passwords must match";
            if (!errors.password && !errors.password_confirm){
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err)
                            throw new Error(err);
                        user.tokenReset = '';
                        user.password = hash;
                        user.save();
                        return res.status(200).json({});
                    })
                });
            }
            else
                throw new Error('Error password');
        } else
            throw new Error('Token not find');
    } catch(err){
        console.log(err);
        if (errors.password || errors.password_confirm)
            return res.status(400).json({errors: errors});
        return res.status(400).json({});
    }
});


router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid)
    return res.status(400).json(errors);

  User.findOne({$or: [{email: sanitize(req.body.email) }, {username: sanitize(req.body.username)}]})
    .then((err, user) => {
      if (err) {
        console.log(err);
        if (err.username && err.username === req.body.username){
          if (err.email && err.email === req.body.email)
            return res.status(400).json({same_username: true, same_email: true});
          return res.status(400).json({same_username: true, same_email: false});
        }
        return res.status(400).json({same_username: false, same_email: true});
      } 
      else {
          // Token for mail
        let token = ((+new Date) + Math.random()* 100).toString(32);
        let hashtoken = crypto.createHash('md5').update(token).digest("hex");

        const newUser = new User({
          username: sanitize(req.body.username),
          firstname: sanitize(req.body.firstname),
          lastname: sanitize(req.body.lastname),
          email: sanitize(req.body.email),
          password: sanitize(req.body.password),
          tokenMail: hashtoken,
          tokenReset: null
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(async(user) => {
                try {
                  const userFind = await User.findOne({_id: user.id});
                  if (userFind) {
                    jwt.sign({id: userFind._id}, keys.secretOrKey, {expiresIn: 31556926},
                        (err, token) => {
                          if (!err) {
                            // Send cookies
                            res.cookie('token', token, {maxAge: 2 * 60 * 60 * 1000, domain: 'localhost'});
                            // Send mail activation
                            const message = {
                              from: 'matcha@app.com',
                              to: req.body.email,
                              subject: 'Activate your account',
                              text: `Hello ${user.username}!\nHere is the link to confirm your account\n http://localhost:3000/users/active/${hashtoken}`,
                            };
                            transport.sendMail(message, function(err, info) {
                              if (err) console.log(err)
                              else console.log(info);
                            });
                            return res.status(200).json({});
                          }
                          if (err) throw new Error(err)
                        })
                  }
                } catch (err) {
                  console.log(err);
                  return res.status(400).json({})
                }
              })
              .catch(err => { console.log(err); return res.status(400).json({}) });
          });
        });
      }
  });
});

// @route POST api/users/login
router.post("/login", async(req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);
  const username = req.body.username;
  let password = req.body.password;

  // Check validation
  if (!isValid)
    return res.status(400).json(errors);

  User.findOne({ username }).then(async(user) => {
      if (!user)
        return res.status(400).json({});
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        // User matched
        if (isMatch) {
          const payload = { id: user.id };
          // Sign token
          jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 },
            (err, token) => {
              if (!err){
                res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, domain:'localhost'});
                return res.status(200).json({});
              }
             return res.status(400).json({});
            }
          )
        }
        else
          return res.status(400).json({});
      });
  });
});

module.exports = router;