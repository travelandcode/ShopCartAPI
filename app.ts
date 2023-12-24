import Config, { connectDB } from './src/config/config'
import authRoutes from './src/routes/auth_routes'
import productRoutes from './src/routes/product_routes'
import stripeRoutes from './src/routes/stripe_routes'
import { AUTH, CHECKOUT, PRODUCTS} from './src/constants/constants'
import cors from 'cors'
import logger from './src/logs/logger'
import passport from 'passport'
import express from 'express'
import MongoStore from 'connect-mongo'

const app = express()
const session = require('express-session')
const config = new Config()

const PORT = config.PORT
const DOMAIN = config.DOMAIN

connectDB();

app.use(cors(
  {
    origin: DOMAIN,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'content-type'],
    credentials: true,
  }
))

//Express setup
app.use(session({secret: config.SESSION_SECRET, resave: true, saveUninitialized: true, cookie: { maxAge: 30 * 24 * 60 * 60 *1000}}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Initialize Passport and Session
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use(AUTH,authRoutes)
app.use(PRODUCTS,productRoutes)
app.use(CHECKOUT,stripeRoutes)

app.listen(PORT,() =>{
    logger.info(`Server is listening on port:${PORT}`)
})