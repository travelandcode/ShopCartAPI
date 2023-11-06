import express, { json } from 'express'
import passport from 'passport'
import Config from '../config/config'
import {  User } from '../models/models'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'
import { EMAIL, OPEN_ID, PROFILE, GOOGLE, GOOGLE_AUTH, GOOGLE_AUTH_REDIRECT, FAILURE, GOOGLE_AUTH_SUCCESS, TWITTER_AUTH, TWITTER, TWITTER_AUTH_REDIRECT, TWITTER_AUTH_SUCCESS, NOT_AUTHENTICATED, FACEBOOK_AUTH, FACEBOOK, FACEBOOK_AUTH_REDIRECT, FACEBOOK_AUTH_SUCCESS, AUTH_USER, MICROSOFT_AUTH, MICROSOFT, MICROSOFT_AUTH_REDIRECT, MICROSOFT_AUTH_SUCCESS, LOGOUT, EMPTY_USER } from '../constants/constants'
import { UserType } from '../models/enums'
import logger from '../logs/logger'


const router = express.Router()
const GoogleStategy = require('passport-google-oidc')
const config = new Config()

const users: {[key:string]: User} = {}
let activeUser: User = EMPTY_USER
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
                type: UserType.GOOGLE,
                email: profile.emails[0].value
            }
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
            let newUser: User = {
                id: profile.id,
                displayName: profile.displayName,
                type: UserType.TWITTER,
                email: 'defaultemail@gmail.com'
            }
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
                type: UserType.FACEBOOK,
                email: 'defaultemail@gmail.com'
            }
            users[profile.id] = newUser
            return done(null, newUser)
        }
    }
))

//Configure Microsoft Strategy
passport.use(new MicrosoftStrategy({
    clientID: config.MICROSOFT_CLIENT_ID,
    clientSecret: config.MICROSOFT_CLIENT_SECRET,
    callbackURL: config.MICROSOFT_CALLBACK_URL,
    scope: ['user.read'],
    authorizationURL: 'https://login.microsoftonline.com/6e4aab20-70ca-485b-8b19-ba77e89bd5e0/oauth2/v2.0/authorize',
    tokenURL: 'https://login.microsoftonline.com/6e4aab20-70ca-485b-8b19-ba77e89bd5e0/oauth2/v2.0/token',
  },
  (accessToken:any, refreshToken:any, profile:any, done:any) => {
    logger.info(JSON.stringify(profile))
    if(users[profile.id]){
        return done(null, users[profile.id])
    }else{
        const email = () =>{
            profile.emails[0].value
        }
        let newUser = {
            id: profile.id,
            displayName: profile.name.givenName,
            type: UserType.MICROSOFT,
            email: 'defaultemail@gmail.com'
        }
        
        users[profile.id] = newUser
        return done(null, newUser)
    }
  }
));

//Passport Session Setup
passport.serializeUser(function(user:any,done:any){
    done(null, user)
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
        logger.info('Google User has been authenticated')
        activeUser = req.user as User
        res.redirect('http://localhost:3000/')
      
    } else {
        logger.warn('Google User was not authenticated')
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
        logger.info('Twitter User has been authenticated')
        activeUser = req.user as User
        res.redirect(config.DOMAIN)
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
        logger.info('Facebook User has been authenticated')
        activeUser = req.user as User
        res.redirect(config.DOMAIN)
    } else {
        res.send(NOT_AUTHENTICATED)
    }
})

//Routes for Microsoft Authentication
router.get(MICROSOFT_AUTH, passport.authenticate(MICROSOFT))

router.get(MICROSOFT_AUTH_REDIRECT,passport.authenticate(MICROSOFT,
        {
            failureRedirect: FAILURE,
            successRedirect: MICROSOFT_AUTH_SUCCESS
        }
    )
)

router.get(MICROSOFT_AUTH_SUCCESS, (req:any, res) => {
    if (req.isAuthenticated()) {
        logger.info('Microsoft User has been authenticated')
        activeUser = req.user as User
        res.redirect('http://localhost:3000/')
    } else {
        res.send(NOT_AUTHENTICATED)
    }
})

//Send Login Information to Client
router.get(AUTH_USER,(req,res) =>{
    logger.info('Sending Active User Information to Login')
    logger.info(JSON.stringify(activeUser))
    activeUser.displayName === '' ? res.send(null) : res.json(activeUser)
})

router.get(FAILURE, (req,res) =>{
    logger.info('Login attempt failed')
    res.redirect(config.DOMAIN)
})

router.post(LOGOUT, (req,res) =>{
    logger.info('Logging out user')
    req.logout(() => {
        activeUser = EMPTY_USER
        res.redirect(config.DOMAIN)
        }
    );
})

export default router