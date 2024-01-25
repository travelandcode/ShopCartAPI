import Config, { connectDB } from './src/config/config'
import authRoutes from './src/routes/authRoutes'
import productRoutes from './src/routes/productRoutes'
import stripeRoutes from './src/routes/stripeRoutes'
import orderRoutes from './src/routes/orderRoutes'
import { AUTH, CHECKOUT, ORDERS, PRODUCTS} from './src/utils/constants'
import cors from 'cors'
import logger from './src/logs/logger'
import passport from 'passport'
import express from 'express'
import session from 'express-session'
import { GoogleStrategy, LocalStrategy, deserializeUser, serializeUser } from './src/config/passportConfig'

const app = express()
const config = new Config()

const PORT = config.PORT
const DOMAIN = config.DOMAIN

connectDB();

app.use(cors(
  {
    origin: DOMAIN,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    exposedHeaders: ['access-control-allow-credentials']
  }
))

//Express setup
app.use(session({secret: config.SESSION_SECRET, resave: true, saveUninitialized: true, cookie: { maxAge: 30 * 24 * 60 * 60 *1000}}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Initialize Passport and Session
app.use(passport.initialize())
app.use(passport.session())

//Passport Strategies
passport.use(LocalStrategy)
passport.use(GoogleStrategy)

//Passport Session Setup
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

//Routes
app.use(AUTH,authRoutes)
app.use(PRODUCTS,productRoutes)
app.use(CHECKOUT,stripeRoutes)
app.use(ORDERS,orderRoutes)

app.listen(PORT,() =>{
    logger.info(`Server is listening on port:${PORT}`)
})

export default app