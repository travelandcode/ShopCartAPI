import express from 'express'
import { EMPTY_PATH } from '../utils/constants'
import { StripeController } from '../controllers/stripeController'

const router = express.Router()
const controller = new StripeController()

router.post(EMPTY_PATH, controller.makeStripePayment)

export default router