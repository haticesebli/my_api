const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.user_signup = (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(409).json({
          message: "Mail exists!"
        });
      } else {
        //idea of salt (second parameter of hash method): we add random strings to that plaintext password before we hash it!
        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              })
          }
        });
      }
    })
    .catch();
}

exports.user_login = (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(404).json({
          message: "Mail not found ,user doesn\'t exist!"
        });
      }
      //compare(plaintext,hash,callback)
      //first paramater: plaintext
      //second paramater: hash
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        //jwt.sign(payload,secretOrPrivateKey,[options,callback])
        //payload: some data to pass into the token
        //secretKey: the key which is only known to the server
        //more options and callback
        if (result) {
          const token = jwt.sign({
              email: users[0].email,
              userId: users[0]._id
            },
            "jwt secret key is here", {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          })
        }
        res.status(401).json({
          message: "Auth failed"
        })
      });
    })
    .catch(err => {
      console.log(err);
      res.statts(500).json({
        error: err
      })
    })
}

exports.user_delete = (req, res, next) => {
  User.remove({
      _id: req.params.userId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted!"
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}
