import { Request, Response } from "express";
import { CartProduct, Product } from '../models/d'
import { ProductService } from '../services/productService'
import { StripeService } from "../services/stripeService";
import Stripe from "stripe";

export class StripeController {

  private _productService: ProductService
  private _stripeService: StripeService
  constructor({ productService, stripeService }: { productService: ProductService, stripeService: StripeService }) {
      this._productService = productService;
      this._stripeService = stripeService
  }

    makeStripePayment = async (req: Request, res: Response) => {
        try {
            const products = await this._productService.getAllProducts() as Product[]
            const cartProducts = req.body.cartProducts
            const shippingRate = await this._stripeService.createShippingRate(Number(req.body.shipping)) as Stripe.ShippingRate
            const taxRate = await this._stripeService.createTaxRate() as Stripe.TaxRate
            const storeProducts = cartProducts.map((product:CartProduct) => {
              const storeItem = products.find((item:Product) => item.id === product.id)
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
          const session = await this._stripeService.createSession(shippingRate.id,storeProducts,req.headers.origin!) as Stripe.Checkout.Session
          res.json({session:session.id})
          } catch (error) {
            res.status(500).json({ error: error })
          }
    }
}