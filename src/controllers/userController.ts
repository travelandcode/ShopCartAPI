import { NextFunction, Request, Response } from "express";
import logger from "../logs/logger";
import { User } from "../models/d";
import { UserService } from "../services/userService";

export class UserController{
    private _userService: UserService

    constructor({ userService }: { userService: UserService }){
        this._userService = userService
    }

    authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
        if(req.isAuthenticated()){
            return next()
        }
        res.status(401).send('Unauthorized')
    }

    editUser= async (req: Request, res: Response) => {
        const user = await this._userService.findUser(req.body.oldEmail) as User
        const updatedUser: User = {
            id: user.id,
            email: req.body.email || user.email,
            name: req.body.name || user.name,
            password: req.body.password || user.password,
            isEmailVerified: false,
            cart: user.cart,
            orders: user.orders
        }
        const editedUser = await this._userService.editUser(user.email,updatedUser) as User
        if(!editedUser) res.status(404).send("Could not update User")
        logger.info(`${editedUser.name}'s user information was successfully updated`)
        res.status(200).send({data:editedUser})

    }


    fetchUser = async (req: Request, res: Response) => {
        try {
            res.status(200).send({data: req.user})
        } catch (error) {
            logger.error(error)
        }
    }

    fetchCart = async (req: Request, res: Response) => {
        try {
            const user =  req.user as User
            const userCart = await this._userService.findUser(user.email) as User
            if(!userCart) res.status(404).send("Could not find user")
            logger.info(`Successfully fetched ${userCart.name}'s cart`)
            res.status(200).send({data:userCart.cart})
        } catch (error) {
            logger.error(error)
        }
    }

    updateCart = async (req: Request, res: Response) => {
        try {
            const updatedUserCart: User = await this._userService.updateCart(req.body.email,req.body.cartProducts) as User
            if(!updatedUserCart) res.status(404).send("User was not created")
            logger.info(`${updatedUserCart.name}'s cart was updated`)
            res.status(200).send({data:updatedUserCart.cart})
        } catch (error) {
            logger.error(error)
        }
    }



}