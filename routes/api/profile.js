const express = require("express");
const passport = require('passport');
const mongoose = require('mongoose');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();

// @route   POST /api/profile/
// @desc    create or edit your profile
// @access  Private
router.post(
  '/', 
  passport.authenticate("jwt", {session: false}),
  (req, res) => {


    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== "undefined"){
      profileFields.skills = req.body.skills.split(",");
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
      .then((profile) => {
        
        if (profile){
          //update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields},
            { new: true }
          ).then(profile => res.json(profile));

        } else {
          //create
          Profile.findOne({handle: profileFields.handle})
            .then(profile => {
              if (profile){
                return res.status(400).json({handle: 'That handle already exists!'});
              }

              // Save profile
              new Profile(profileFields)
                .save()
                .then(profile => res.json(profile));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile){
          return res.status(404).json({noprofile: "There is no profile for this user"});
        }

        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description,
        };

        profile.experience.unshift(newExp);
        profile.save()
          .then(profile => res.json(profile));

    })
  });

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    

    Profile.findOne({ user: req.user.id }).then((profile) => {

      if (!profile) {
        return res.status(404).json({ noprofile: "There is no profile for this user" });
      }
      
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then((profile) => res.json(profile));
    });
  }
);

module.exports = router;
