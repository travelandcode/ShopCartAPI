import { Request, Response } from "express";
import logger from "../logs/logger";
import { User } from "../models/d";
import { Calculations } from "../utils/calculations";
import { UserService } from "../services/userService";
import { hashSync } from "bcrypt";

export class AuthController{
    private _userService: UserService
    private calculations = new Calculations()

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
                token: this.calculations.generateToken()
            }
            const newUser = await this._userService.createUser(user)
            if(!newUser) return res.status(409).send("User already exists")
            logger.info("User was created")
            res.status(201).send({data: newUser, message: "User created"})
        }catch(error){
            logger.error(error)
        }
    }

    successfulLogin = (req: Request, res: Response) => {
        const user:any = req.user
        if (req.isAuthenticated()) {
            if(user.password === "") return res.status(403).send({user:user, message:"Please Enter Password For User"})
            logger.info("Login Attempt was successful")
            res.status(200).send({user:user, message:"Successful Login"})
        }
    }

    failedLogin = (req:Request, res:Response) => {
        logger.info("Login Attempt Failed")
        res.status(401).send("Login Attempt Failed")
    }

    logout = (req: Request, res: Response) => {
        req.logout(() => {
            logger.info("User Logged Out")
            res.send(200).send("Logged Out User")
        })
    }


}