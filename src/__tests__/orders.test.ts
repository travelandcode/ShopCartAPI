import { OrderService } from '../services/orderService';
import { Order } from '../models/d';
import { Calculations } from '../utils/calculations';
import { OrderStatus } from '../models/enums';
import mongoose from 'mongoose';
import Config from '../config/config';

describe('Orders Service', () =>{

    let orderService:any
    let order1: Order
    let order2: Order
    let order3: Order
    const calculations = new Calculations()
    const id1 = Number(calculations.generateId())
    const id2 = Number(calculations.generateId())
    const id3 = Number(calculations.generateId())

    beforeAll(async () => {
        const config = new Config()
        orderService = new OrderService();
        order1 = {
            id: id1,
            userId: 222,
            products: [{id:1, quantity:3},{id:2, quantity:5}],
            status: OrderStatus.ORDER_PLACED,
            subtotal: 1500,
            deliveryCost: 100,
            discount: 0,
            tax: 150,
            total: 1750,
            createdAt: calculations.generateFormattedDate(),
            shippedAt: "",
            deliveredAt: "",
            cancelledAt: "",
            shipping_address: "Digicel, Ocean Boulevard"
        }
        order2 = {
            id: id2,
            userId: 222,
            products: [{id:1, quantity:3},{id:2, quantity:5}],
            status: OrderStatus.ORDER_PLACED,
            subtotal: 2000,
            deliveryCost: 100,
            discount: 0,
            tax: 150,
            total: 2250,
            createdAt: calculations.generateFormattedDate(),
            shippedAt: "",
            deliveredAt: "",
            cancelledAt: "",
            shipping_address: "Kingston College, 2A North Street"
        }
        order3 = {
            id: id3,
            userId: 222,
            products: [{id:1, quantity:3},{id:2, quantity:5}],
            status: OrderStatus.ORDER_PLACED,
            subtotal: 2500,
            deliveryCost: 100,
            discount: 0,
            tax: 150,
            total: 2750,
            createdAt: calculations.generateFormattedDate(),
            shippedAt: "",
            deliveredAt: "",
            cancelledAt: "",
            shipping_address: "Altamont Crescent, New Kingston"
        }
        mongoose.connect(config.MONGODB_URI,{
            autoIndex: true,
            dbName: "shopcart"
        })
    })

    afterAll(async()=>{
        await mongoose.connection.close()
    })

    test('should create order for a user', async () =>{
        const createdOrder1 = await orderService.createOrder(order1)
        expect(createdOrder1.created).toBe(true)
        expect(createdOrder1.createdOrder.id).toBe(id1)
        expect(createdOrder1.createdOrder.status).toBe(OrderStatus.ORDER_PLACED)
        expect(createdOrder1.createdOrder.shipping_address).toBe("Digicel, Ocean Boulevard")
    })

    test('should get all orders for user',async () => {
       const orders = await orderService.getAllUserOrders(222)
       expect(orders.length).toBe(1)
    })

    test('should get order using id', async() => {
        const order = await orderService.findOrderById(order1.id)
        expect(order[0].id).toBe(order1.id)
        expect(order[0].userId).toBe(order1.userId)
        expect(order[0].status).toBe(order1.status)
        expect(order[0].shipping_address).toBe(order1.shipping_address)
    })

    test('should return null if order does not exist', async() => {
        const order = await orderService.findOrderById(1)
        expect(order).toBe(null)
    })

    test('should update order status', async() =>{
        const updatedOrder = await orderService.updateStatus(id1)
        expect(updatedOrder.updatedStatus).toBe(true)
        expect(updatedOrder.updatedOrder.status).toBe(OrderStatus.SHIPPED)
    })

    test('should cancel order status', async() =>{
        await orderService.createOrder(order2)
        const cancelledOrder = await orderService.cancelOrder(order2.id)
        expect(cancelledOrder.cancelled).toBe(true)
        expect(cancelledOrder.cancelledOrder.status).toBe(OrderStatus.CANCELLED)
    })

    test('should not cancel if order has been shipped for delivery', async() =>{
        const cancelledOrder = await orderService.cancelOrder(order1.id)
        expect(cancelledOrder.cancelled).toBe(false)
        expect(cancelledOrder.cancelledOrder).toBe(null)
    })

    test('should update shipping address', async() =>{
        await orderService.createOrder(order3)
        const newAddress = "876 MindYoBusiness Ave"
        const updatedOrder = await orderService.updateShippingAddress(newAddress,order3.id)
        expect(updatedOrder.updatedShippingAddress).toBe(true)
        expect(updatedOrder.updatedOrder.shipping_address).toBe(newAddress)
    })

    test('should not update shipping addres if order has been',async() =>{
        const newAddress = "876 MindYoBusiness Ave"
        const updatedOrder = await orderService.updateShippingAddress(newAddress,order1.id)
        expect(updatedOrder.updatedShippingAddress).toBe(false)
    })
})