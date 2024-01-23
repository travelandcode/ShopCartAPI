import express from 'express'
import { OrderService } from '../services/orderService'
import { OrdersController } from '../controllers/ordersController'

const orderService = new OrderService()
const controller = new OrdersController({orderService})
const router = express.Router()

router.get('/:orderId',controller.getOrder)

router.get("/order-history/:userId",controller.getOrderHistory)

router.post("/create", controller.createOrder)

router.put('/update-status/:orderId', controller.updateOrderStatus)

router.put('/cancel/:orderId', controller.cancelOrder)

router.put('/update-shipping/:orderId', controller.updateOrderShippingAddress)

export default router