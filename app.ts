import express from 'express'
import logger from './src/logs/logger'
import passport from 'passport'
import Config from './src/config/config'
import authRoutes from './src/routes/auth_routes'
import { DOMAIN, SECRET } from './src/constants/constants'
import cors from 'cors'

const app = express()
const session = require('express-session')
const config = new Config()

const PORT = config.PORT

const allowedOrigins = ['http://localhost:3000/', DOMAIN];

app.use(cors({
    origin: function (origin:any, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));

//Express setup
app.use(session({secret: SECRET, resave: true, saveUninitialized: true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Initialize Passport and Session
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use(authRoutes)

app.listen(PORT,() =>{
    logger.info(`Server is listening on port:${PORT}`);
})