import { OrderStatus } from "./enums"

export interface Product{
    id: number,
    name: string,
    description: string,
    price: number,
    tags: string[],
    img_src: string[],
    isDeal: boolean
}

export interface CartProduct{
    id: number,
    quantity: number
}

export interface User{
    id: number,
    name: string,
    password: string,
    email: string,
    isEmailVerified: boolean,
    token: string
}


export interface Order{
    id: number,
    userId: number,
    products: Array<{id: number,quantity: number}>,
    shipping_address: string,
    discount: number,
    status: OrderStatus,
    deliveryCost: number,
    subtotal: number,
    tax: number,
    total: number,
    createdAt: string,
    shippedAt: string,
    deliveredAt: string,
    cancelledAt: string
}

export interface Token{
    userId: string,
    token: string,
    createdAt: string,
    expiresAt: string
}
