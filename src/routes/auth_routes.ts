import express, { Router } from 'express'
import passport from 'passport'
import Config from '../config/config'
import {  User } from '../models/models'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as InstagramStrategy } from 'passport-instagram'
import { EMAIL, OPEN_ID, PROFILE, GOOGLE, GOOGLE_AUTH, GOOGLE_AUTH_REDIRECT, FAILURE, GOOGLE_AUTH_SUCCESS, TWITTER_AUTH, TWITTER, TWITTER_AUTH_REDIRECT, TWITTER_AUTH_SUCCESS, NOT_AUTHENTICATED, FACEBOOK_AUTH, FACEBOOK, FACEBOOK_AUTH_REDIRECT, FACEBOOK_AUTH_SUCCESS, AUTH_USER, INSTAGRAM_AUTH, INSTAGRAM, INSTAGRAM_AUTH_REDIRECT, INSTAGRAM_AUTH_SUCCESS } from '../constants/constants'
import { UserType } from '../models/enums'


const router = express.Router()
const GoogleStategy = require('passport-google-oidc')
const config = new Config()

const users: {[key:string]: User} = {}
let activeUser: User = {
    displayName: '',
    id: '',
    type: UserType.GOOGLE
}

//Configure Google Strategy
passport.use(new GoogleStategy(
    {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL
    },
    function(issuer:any,profile:any,done:any) {
        if(users[profile.id]){
            return done(null, users[profile.id])
        }else{
            let newUser: User = {
                id: profile.id,
                displayName: profile.name.givenName,
                type: UserType.GOOGLE
            }
            activeUser = newUser
            users[profile.id] = newUser
            return done(null, newUser)
        }
    }
))

//Configure Twitter Strategy
passport.use(new TwitterStrategy(
    {
        consumerKey: config.TWITTER_CLIENT_ID,
        consumerSecret: config.TWITTER_CLIENT_SECRET,
        callbackURL: config.TWITTER_CALLBACK_URL
    },
    (token:any, tokenSecret:any, profile:any, done:any) =>{
        if(users[profile.id]){
            return done(null, users[profile.id])
        }else{
            let newUser = {
                id: profile.id,
                displayName: profile.displayName,
                type: UserType.TWITTER
            }
            activeUser = newUser
            users[profile.id] = newUser
            return done(null, newUser)
        }
    }
))

//Configure Facebook Strategy
passport.use(new FacebookStrategy(
    {
        clientID: config.FACEBOOK_CLIENT_ID,
        clientSecret: config.FACEBOOK_CLIENT_SECRET,
        callbackURL: config.FACEBOOK_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
        if(users[profile.id]){
            return done(null, users[profile.id])
        }else{
            let newUser = {
                id: profile.id,
                displayName: profile.displayName,
                type: UserType.FACEBOOK
            }
            activeUser = newUser
            users[profile.id] = newUser
            return done(null, newUser)
        }
    }
))

//Configure Instagram Strategy
passport.use(new InstagramStrategy(
    {
        clientID: config.FACEBOOK_CLIENT_ID,
        clientSecret: config.FACEBOOK_CLIENT_SECRET,
        callbackURL: INSTAGRAM_AUTH_REDIRECT
    },
    (accessToken, refreshToken, profile, done) => {
        if(users[profile.id]){
            return done(null, users[profile.id])
        }else{
            let newUser = {
                id: profile.id,
                displayName: profile.displayName,
                type: UserType.FACEBOOK
            }
            activeUser = newUser
            users[profile.id] = newUser
            return done(null, newUser)
        }
    }
))

//Passport Session Setup
passport.serializeUser(function(user:any,done:any){
    done(null, user.id)
})

passport.deserializeUser(function(user:any,done:any){
    done(null,user)
})

//Routes for Google Authentication
router.get(GOOGLE_AUTH, passport.authenticate(GOOGLE,{ scope: [OPEN_ID, PROFILE, EMAIL] }));

router.get(GOOGLE_AUTH_REDIRECT, passport.authenticate(GOOGLE, 
        {
            failureRedirect: FAILURE,
            successRedirect: GOOGLE_AUTH_SUCCESS
        }
    )
)

router.get(GOOGLE_AUTH_SUCCESS, (req:any,res) =>{
    if (req.isAuthenticated()) {
      req.session.user = req.user as User
      res.redirect('http://localhost:3000/')
      
    } else {
      res.send(NOT_AUTHENTICATED)
    }
})


//Routes for Twitter Authentication
router.get(TWITTER_AUTH, passport.authenticate(TWITTER))

router.get(TWITTER_AUTH_REDIRECT,passport.authenticate(TWITTER,
        {
            failureRedirect: FAILURE,
            successRedirect: TWITTER_AUTH_SUCCESS
        }
    )
)

router.get(TWITTER_AUTH_SUCCESS, (req:any, res) => {
    if (req.isAuthenticated()) {
        req.session.user = req.user as User
        res.redirect('http://localhost:3000/')
      } else {
        res.send(NOT_AUTHENTICATED)
      }
})

//Routes for Facebook Authentication
router.get(FACEBOOK_AUTH, passport.authenticate(FACEBOOK))

router.get(FACEBOOK_AUTH_REDIRECT,passport.authenticate(FACEBOOK,
        {
            failureRedirect: FAILURE,
            successRedirect: FACEBOOK_AUTH_SUCCESS
        }
    )
)

router.get(FACEBOOK_AUTH_SUCCESS, (req:any, res) => {
    if (req.isAuthenticated()) {
        req.session.user = req.user as User
        res.redirect('http://localhost:3000/')
    } else {
        res.send(NOT_AUTHENTICATED)
    }
})

//Routes for Facebook Authentication
router.get(INSTAGRAM_AUTH, passport.authenticate(INSTAGRAM))

router.get(INSTAGRAM_AUTH_REDIRECT,passport.authenticate(INSTAGRAM,
        {
            failureRedirect: FAILURE,
            successRedirect: INSTAGRAM_AUTH_SUCCESS
        }
    )
)

router.get(INSTAGRAM_AUTH_SUCCESS, (req:any, res) => {
    if (req.isAuthenticated()) {
        req.session.user = req.user as User
        res.redirect('http://localhost:3000/')
    } else {
        res.send(NOT_AUTHENTICATED)
    }
})

//Send Login Information to Client
router.get(AUTH_USER,(req,res) =>{
    res.send(activeUser)
})

router.get(FAILURE, (req,res) =>{
    res.send('Failed to Login')
})

export default router