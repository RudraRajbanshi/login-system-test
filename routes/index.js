var express = require('express');
var router = express.Router();
var User = require('../models/user');


router.post('/register', function(req, res, next) {

    console.log(req.body);
    var personInfo = req.body;


    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.fullName) {
        res.send("Please fill all the required fields");
    } else {
        if (personInfo.password == personInfo.passwordConf) {

            User.findOne({ username: personInfo.username }, function(err, data) {
                if (!data) {
                    var c;
                    User.findOne({}, function(err, data) {

                        if (data) {
                            console.log("if");
                            c = data.unique_id + 1;
                        } else {
                            c = 1;
                        }

                        var newPerson = new User({
                            unique_id: c,
                            fullName: personInfo.fullName,
                            email: personInfo.email,
                            username: personInfo.username,
                            password: personInfo.password,
                            passwordConf: personInfo.passwordConf
                        });

                        newPerson.save(function(err, Person) {
                            if (err)
                                console.log(err);
                            else
                                console.log('Success');
                        });

                    }).sort({ _id: -1 }).limit(1);
                    res.send("Registered Successfully, You can now login.");
                } else {
                    res.send("Username already taken. Please try other username");
                }

            });
        } else {
            res.send({ "Success": "Confirm password does not match" });
        }
    }
});

router.post('/login', function(req, res, next) {
    //console.log(req.body);
    User.findOne({ username: req.body.username }, function(err, data) {
        if (data) {

            if (data.password == req.body.password) {
                //console.log("Done Login");
                req.session.userId = data.unique_id;
                //console.log(req.session.userId);
                res.send("Login Success!");

            } else {
                res.send("Invalid Username/Password!");
            }
        } else {
            res.send("Username is not registered");
        }
    });
});

router.get('/logout', function(req, res, next) {
    console.log("logout")
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }
});

module.exports = router;