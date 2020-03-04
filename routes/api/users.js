const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const User = require("../../models/User");
const withAuth = require('./../../utils/middleware');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");



router.get('/checkToken', withAuth, (req, res) => { res.sendStatus(200) });

router.post('/logout', withAuth, (req, res) => {
  res.clearCookie('token');
  res.sendStatus(200);
});
// REGISTER
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({$or: [{email: req.body.email }, {username: req.body.username}]})
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
        const newUser = new User({
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => { 
                return res.status(200).json({}) 
              })
              .catch(err => {
                console.log(err);
                return res.status(400).json({});
              });
          });
        });
      }
  });
});
// LOGIN
// @route POST api/users/login
// @desc Login user and return JWT token
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);
  const username = req.body.username;
  const password = req.body.password;

  // Check validation
  if (!isValid)
    return res.status(400).json(errors);

  User.findOne({ username }).then(user => {
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