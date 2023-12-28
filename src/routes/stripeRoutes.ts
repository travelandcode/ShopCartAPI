import express from 'express'
import logger from '../logs/logger'
import ProductsModel from '../models/products'
import { Product } from '../models/d'
import { EMPTY_PATH } from '../constants/constants'
import Config from '../config/config'
import { ProductService } from '../controllers/productService'

const router = express.Router()
const config = new Config()
const stripe = require("stripe")(config.STRIPE_API_KEY)
const productService = new ProductService()

router.post(EMPTY_PATH,async (req:any,res)  =>{
    try {
        const products = await productService.getAllProducts() as Product[]
        const cartProducts = req.body.cartProducts
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          shipping_address_collection: {
            allowed_countries: ['US'],
          },
          line_items: cartProducts.map((product:any) => {
            const storeItem = products.find((item:any) => item.id === product.id)
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: storeItem!.name,
                  images: [storeItem!.img_src[0]]
                },
                unit_amount: storeItem!.price * 100,
              },
              quantity: product.quantity,
            }
          }),
          success_url: `${req.headers.origin}/success?session={CHECKOUT_SESSION_ID}`,
          cancel_url: 'http://localhost:3000/',
    
        })
        res.json({session:session.id})
      } catch (error:any) {
        res.status(500).json({ error: error.message })
      }
})

export default router