import express from 'express'
import { UserService } from '../services/userService'
import { UserController } from '../controllers/userController'

const userService = new UserService()
const controller = new UserController({userService})
const router = express.Router()

router.get("/",controller.authenticateUser,controller.fetchUser)

router.post("/update", controller.editUser)

router.get("/cart", controller.fetchCart)

router.get("/cart/update", controller.updateCart)

export default router