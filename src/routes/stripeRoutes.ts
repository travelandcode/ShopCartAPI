import express from 'express'
import { EMPTY_PATH } from '../utils/constants'
import { StripeController } from '../controllers/stripeController'
import { ProductService } from '../services/productService'
import { StripeService } from '../services/stripeService'

const router = express.Router()
const productService = new ProductService()
const stripeService = new StripeService()
const controller = new StripeController({productService,stripeService})

router.post(EMPTY_PATH, controller.makeStripePayment)

export default router