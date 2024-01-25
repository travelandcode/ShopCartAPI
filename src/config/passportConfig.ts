import { Strategy as PassportLocalStrategy } from 'passport-local'
import { Strategy as PassportGoogleStrategy }  from 'passport-google-oauth20'
import { compareSync} from 'bcrypt'
import logger from '../logs/logger'
import Config from './config'
import { UserService } from '../services/userService'
import { User } from '../models/d'

const config = new Config()
const _userService = new UserService()
export const LocalStrategy =  new PassportLocalStrategy(
    {usernameField: 'email',
    passwordField: 'password'},
    async function (email,password, done) {
      try{
        const user = await _userService.findUser(email)
        if(!user) return done(null, false, {message: "Incorrect Email"})
        if(!compareSync(password,user.password!)) return done(null, false,{message: "Incorrect Password"})
        return done(null,user)        
      }catch(error){
          logger.error(error)
      }
    }
)
  
export const GoogleStrategy = new PassportGoogleStrategy(
    {
        clientID: config.GOOGLE_CLIENT_ID || '',
        clientSecret: config.GOOGLE_CLIENT_SECRET || '',
        callbackURL: config.GOOGLE_CALLBACK_URL || '',
        scope: ['profile','email'],
        proxy: true
    },
    async function(accessToken,refreshToken,profile,done) {
        try{
            const user:User = {
                id: Number(profile.id),
                name: profile.name!.givenName,
                email: profile.emails![0].value,
                isEmailVerified: Boolean(profile._json.email_verified),
                token: 'fkjfjfkdjfdf',
                password: ''
            } 
            const existingUser = await _userService.findUser(user.email)
            !existingUser ? await _userService.createUser(user) : logger.info("User already exists")
            return done(null,user)
        }catch(error){
            logger.error(error)
        }
    }
)

export function serializeUser(user:any,done:any) {
    done(null,user)    
}

export async function deserializeUser(user:any,done:any){
    try {
        const serializedUser = await _userService.findUser(user.email)
        if(serializedUser) return done(null, serializedUser)
    } catch (error) {
        logger.error(error)
        done(error,null)
    }
}