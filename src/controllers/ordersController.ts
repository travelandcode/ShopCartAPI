import { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import logger from "../logs/logger";
import { Order } from "../models/d";
import { Calculations } from "../utils/calculations";
import { OrderStatus } from "../models/enums";

export class OrdersController{
    private _orderService: OrderService
    private calculations = new Calculations()

    constructor({ orderService }: { orderService: OrderService }){
        this._orderService = orderService
    }

    getOrderHistory = async (req: Request, res:Response) => {
        try{
            logger.info("Fetching User's Orders")
            const userId = Number(req.params.userId)
            const orders = await this._orderService.getAllUserOrders(userId)
            logger.info("Successfully Fetched User's Orders")
            res.status(200).send({
                data: orders,
                message: "Successfully retrieved orders"
            })
        }catch(error){
            logger.error(error)
            res.status(500).send("Internal Server Error");
        }
    }

    getOrder = async (req: Request, res: Response) => {
        try{
            logger.info("Fetching Order Information")
            const orderId = Number(req.params.orderId)
            const orders = await this._orderService.findOrderById(orderId)
            if(!orders){
                logger.warn("Order was not found")
                res.status(404).send({
                    data: orders,
                    message: "Order was not found"
                })
            }else{
                logger.info("Successfully fetched order information")
                res.status(200).send({
                    data: orders,
                    message: "Successfully retrieved order"
                })
            }
        }catch(error){
            logger.error(error)
            res.status(500).send("Internal Server Error")
        }
    }

    createOrder = async (req: Request, res: Response) => {
        try{
            logger.info("Adding New Order")
            const orderId = Number(this.calculations.generateId())
            const order: Order = {
                id: orderId,
                userId: req.body.userId,
                products: req.body.products,
                shipping_address: req.body.address,
                subtotal: req.body.subtotal,
                deliveryCost: req.body.shipping,
                discount: req.body.discount,
                status: OrderStatus.ORDER_PLACED,
                tax: req.body.tax,
                total: req.body.total,
                createdAt: this.calculations.generateFormattedDate(),
                shippedAt: "",
                deliveredAt: "",
                cancelledAt: ""
            }
            const result = await this._orderService.createOrder(order)
            if(result?.created){
                logger.info("Order was created")
                logger.info(result?.createdOrder)
                res.status(201).send({
                    message:"Order was successfully created",
                    data: result.createdOrder
                })
            }
    
        }catch(error){
            logger.error(error)
            res.status(500).send("Internal Server Error")
        }
    }

    updateOrderStatus = async (req: Request, res:Response) => {
        try{
            const orderId = Number(req.params.orderId)
            const updatedOrder:any = await this._orderService.updateStatus(orderId)
            if(updatedOrder.updatedStatus && updatedOrder.updatedOrder){
                logger.info("Order was updated")
                res.status(200).send({
                    data: updatedOrder.updatedOrder,
                    message: "Successfully updated the order"
                })
            }else if(!updatedOrder.updatedOrder && !updatedOrder.updatedStatus){
                logger.info("Order was not found")
                res.status(404).send({
                    data: updatedOrder.updatedOrder,
                    message: "Order was not found"
                })
            }else if(updatedOrder.updatedOrder && !updatedOrder.updatedStatus){
                logger.info("Order was not modified/updated")
                res.status(304).send()
            }
        }catch(error){
            logger.error(error)
            res.status(500).send("Internal Server Error")
        }
    }

    cancelOrder = async (req: Request, res: Response) => {
        try{
            const orderId = Number(req.params.orderId)
            const cancelledOrder: any = await this._orderService.cancelOrder(orderId)
            if(!cancelledOrder) {
                logger.warn("Order was not found")
                return res.status(404).send({data:null, message:'Order was not found'})
            }
            if(cancelledOrder.cancelled && !cancelledOrder.cancelledOrder){
                logger.warn("Order was not cancelled")
                res.status(304).send()
            }
            if(cancelledOrder.cancelled && cancelledOrder.cancelledOrder){
                logger.info("Order was cancelled")
                res.status(200).send({
                    data: cancelledOrder.cancelledOrder,
                    message: "Order was successfully cancelled"
                })
            }else if(!cancelledOrder.cancelled && !cancelledOrder.cancelledOrder){
                logger.warn("Order cannot be cancelled")
                res.status(200).send({
                    data: cancelledOrder.cancelledOrder,
                    message: "Order cannot be cancelled. It already been shipped for delivery!"
                })
            }
        }catch(error){
            logger.error(error)
            res.status(500).send("Internal Server Error")
        }
    }

    updateOrderShippingAddress = async (req: Request, res: Response) => {
        try{
            logger.info("Updating Shipping Information")
            const orderId = Number(req.params.orderId)
            const newShippingAddress = req.body.shippingAddress
            const updatedOrder: any = await this._orderService.updateShippingAddress(newShippingAddress,orderId)
            if(!updatedOrder){
                logger.info("Order was not found")
                return res.status(404).send({data:null, message:'Order was not found'})
            } 
            if(updatedOrder.updatedShippingAddress && updatedOrder.updatedOrder){
                logger.info("Shipping Information has been updated")
                res.status(200).send(
                    {
                        data: updatedOrder.updatedOrder,
                        message: "Order's shipping address has been updated"
                    }
                )
            }else{
                logger.info("Shipping Information cannot be changed")
                res.status(200).send(
                    {
                        data: null,
                        message: "Order's shipping address cannot be changed. It has already been shipped for delivery!"
                    }
                )
            }
            
        }catch(error){
            logger.error(error)
            res.status(500).send("Internal Server Error")
        }
    }

}