import { Request, Response } from "express";
import { Product } from '../models/d'
import { ProductService } from '../services/productService'
import { StripeService } from "../services/stripeService";

const _productService = new ProductService()
const _stripeService = new StripeService()

export class StripeController {

    makeStripePayment = async (req: Request, res: Response) => {
        try {
            const products = await _productService.getAllProducts() as Product[]
            const cartProducts = req.body.cartProducts
            const shippingRate = _stripeService.createShippingRate(Number(req.body.shipping)) as any
            const taxRate = _stripeService.createTaxRate() as any
            const storeProducts = cartProducts.map((product:any) => {
              const storeItem = products.find((item:any) => item.id === product.id)
              return {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: storeItem!.name,
                    images: [storeItem!.img_src[0]]
                  },
                  unit_amount: Number((storeItem!.price * 100).toFixed(2)),
                },
                quantity: product.quantity,
                tax_rates: [taxRate.id]
              }
            })
          const session = _stripeService.createSession(shippingRate.id,storeProducts,req.headers.origin!) as any
          res.json({session:session.id})
          } catch (error:any) {
            res.status(500).json({ error: error.message })
          }
    }
}