import { Request, Response } from "express";
import logger from "../logs/logger";
import { User } from "../models/d";
import { Calculations } from "../utils/calculations";
import { UserService } from "../services/userService";
import { hashSync } from "bcrypt";
import Config from "../config/config";

export class AuthController{
    private _userService: UserService
    private calculations = new Calculations()
    private config = new Config()

    constructor({ userService }: { userService: UserService }){
        this._userService = userService
    }

    signUp = async (req: Request, res: Response) => {
        try{
            logger.info("Registering User")
            const id = this.calculations.generateId()
            const user:User = {
                id: id,
                name: req.body.name,
                password: hashSync(req.body.password, 10),
                email: req.body.email,
                isEmailVerified: false,
                orders: [],
                cart: []
            }
            const newUser = await this._userService.createUser(user)
            if(!newUser) return res.status(409).send("User already exists")
            logger.info("User was created")
            res.status(201).send({data: newUser, message: "User created"})
        }catch(error){
            logger.error(error)
        }
    }

    successfulLocalLogin = (req: Request, res: Response) => {
        const user = req.user as User
        if (req.isAuthenticated()) {
            if(user.password === "") return res.status(403).send({data:user, message:"Please Enter Password For User"})
            logger.info("Login Attempt was successful")
            res.status(200).send({user:user, message:"Successful Login"}) 
        }
    }

    successfulGoogleLogin = (req: Request, res: Response) => {
        const user = req.user as User
        if (req.isAuthenticated()) {
            if(user.password === "") return res.status(403).send({data:user, message:"Please Enter Password For User"})
            logger.info("Login Attempt was successful")
            res.redirect(`${this.config.DOMAIN}/home`) 
        }
    }

    failedLogin = (req:Request, res:Response) => {
        logger.info("Login Attempt Failed")
        res.status(401).send({message:"Login Attempt Failed"})
    }

    logout = (req: Request, res: Response) => {
        const user = req.user as User
        logger.info(`${user.name} logged out`)
        req.logout(() => {
                res.status(200).send('Logged Out')
            }
        )
    }

}