import Config, { connectDB } from './src/config/config'
import authRoutes from './src/routes/auth_routes'
import productRoutes from './src/routes/product_routes'
import stripeRoutes from './src/routes/stripe_routes'
import { SECRET } from './src/constants/constants'
import cors from 'cors'
import logger from './src/logs/logger'
import passport from 'passport'
import express from 'express'

const app = express()
const session = require('express-session')
const config = new Config()

const PORT = config.PORT

connectDB();

app.use(cors())

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", ["http://localhost:3000"]);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", '');

  // Pass to next layer of middleware
  next();
});

//Express setup
app.use(session({secret: SECRET, resave: true, saveUninitialized: true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Initialize Passport and Session
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use(authRoutes)
app.use('/products',productRoutes)
app.use('/checkout',stripeRoutes)

app.listen(PORT,() =>{
    logger.info(`Server is listening on port:${PORT}`);
})