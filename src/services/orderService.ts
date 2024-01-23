import { Order } from '../models/d';
import logger from '../logs/logger';
import OrdersModel from '../models/orders'
import { OrderStatus } from '../models/enums';
import { Calculations } from '../utils/calculations';

export class OrderService{
    calculations = new Calculations()
    constructor(){
        this.getAllUserOrders = this.getAllUserOrders.bind(this)
        this.createOrder = this.createOrder.bind(this)
        this.findOrderById = this.findOrderById.bind(this)
        this.updateStatus = this.updateStatus.bind(this)
        this.updateShippingAddress = this.updateShippingAddress.bind(this)
        this.cancelOrder = this.cancelOrder.bind(this)
    }

    async getAllUserOrders(userId:number){
        try{
            const orders = await OrdersModel.find({userId: userId})
            return orders
        }catch(error){
            logger.error(error)
        }
    }

    async createOrder(order:Order){
        try{
            const createdOrder = await OrdersModel.create({
                id: order.id,
                userId: order.userId,
                products: order.products,
                subtotal: order.subtotal,
                shipping_address: order.shipping_address,
                status: order.status,
                deliveryCost: order.deliveryCost,
                discount: order.discount,
                tax: order.tax,
                total: order.total,
                createdAt: order.createdAt,
                shippedAt: order.shippedAt,
                deliveredAt: order.deliveredAt,
                cancelledAt: order.cancelledAt
            })
            return {created: true, createdOrder: createdOrder}

        }catch (error){
            logger.error(error)
        }
    }

    async findOrderById (orderId:number){
        try{
            const order:any = await OrdersModel.find({id: orderId})
            if(order.length === 0) return null
            return order
        }catch(error){
            logger.error(error)
        }
    }

    async updateStatus(orderId:number){
        try{
            let newStatus:OrderStatus
            let shippedAt
            let deliveredAt

            const existingOrder:any = await this.findOrderById(orderId)

            if(!existingOrder) return { updatedStatus: false, updatedOrder: null}
            const previousStatus = existingOrder[0].status
            switch(existingOrder[0].status){
                case OrderStatus.ORDER_PLACED:
                    newStatus = OrderStatus.SHIPPED
                    shippedAt = this.calculations.generateFormattedDate()
                    break
                case OrderStatus.SHIPPED:
                    newStatus = OrderStatus.DELIVERED
                    deliveredAt = this.calculations.generateFormattedDate()
                    break
                default:
                    newStatus = existingOrder[0].status
                    break
            }
            const updatedOrder = await OrdersModel.findOneAndUpdate(
                {id: existingOrder[0].id},
                {$set: {
                   status: newStatus,
                   shippedAt: (existingOrder[0].shippedAt === "") ? shippedAt : existingOrder[0].shippedAt,
                   deliveredAt: (existingOrder[0].deliveredAt === "") ? deliveredAt : existingOrder[0].deliveredAt
                }},
                {new: true}
            )
            if(previousStatus === newStatus) return {updatedStatus: false, updatedOrder: updatedOrder}
            return {updatedStatus: true, updatedOrder: updatedOrder}
        }catch (error){
            logger.error(error)
        }
    }

    async cancelOrder(orderId:number){
        try {
            const existingOrder:any = await this.findOrderById(orderId)
            if(!existingOrder) return null
            if(existingOrder[0].status === OrderStatus.CANCELLED) return { cancelled:true, cancelledOrder: null}
            if(existingOrder[0].status === OrderStatus.ORDER_PLACED){
                const cancelledOrder = await OrdersModel.findOneAndUpdate(
                    {id: orderId},
                    {$set: {
                        status: OrderStatus.CANCELLED,
                        cancelledAt: this.calculations.generateFormattedDate()
                    }},
                    {new: true}
                )
                return {cancelled: true, cancelledOrder: cancelledOrder}
            }else{
                return {cancelled: false, cancelledOrder: null}
            }    
        } catch (error) {
            logger.error(error)
        }
    }

    async updateShippingAddress(newAddress:string,orderId:number){
        try {
            const existingOrder:any = await this.findOrderById(orderId)
            if(!existingOrder) return null
            if(existingOrder[0].status === OrderStatus.ORDER_PLACED){
                const updatedOrder = await OrdersModel.findOneAndUpdate(
                    {id: orderId},
                    {$set: {
                        shipping_address: newAddress
                    }},
                    {new: true}
                )
                return { updatedShippingAddress: true, updatedOrder: updatedOrder}
            }else{
                return { updatedShippingAddress: false, updatedOrder: existingOrder[0]}
            }
        } catch (error) {
            logger.error(error)
        }
    }

}