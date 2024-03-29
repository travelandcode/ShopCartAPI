import logger from '../logs/logger'
import Config from '../config/config'
import {Stripe} from 'stripe'

const config = new Config()
const stripe = new Stripe(config.STRIPE_API_KEY)

export class StripeService {
    constructor(){
        this.createTaxRate = this.createTaxRate.bind(this)
        this.createShippingRate = this.createShippingRate.bind(this)
        this.createSession = this.createSession.bind(this)
    }

    async createShippingRate(amount:number){
        try{
            const shippingRate = await stripe.shippingRates.create({
                display_name: 'Delivery',
                type: 'fixed_amount',
                fixed_amount: {
                  amount: amount * 100,
                  currency: 'usd',
                },
            })
            return shippingRate
        }catch(error){
            logger.error(error)
        }
    }

    async createTaxRate(){
        try{
            const taxRate = await stripe.taxRates.create({
                display_name: 'Tax',
                inclusive: false,
                percentage: 15,
                country: 'US',
                description: 'Sales Tax',
            })
            return taxRate
        }catch(error){
            logger.error(error)
        }
    }
    async createSession(shippingRateId:string, storeProducts: Stripe.Checkout.SessionCreateParams.LineItem[], domain:string){
        try{
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                shipping_options: [
                  {
                    shipping_rate: shippingRateId,
                  },
                ],
                shipping_address_collection: {
                  allowed_countries: ['US'],
                },
                line_items: storeProducts, 
                success_url: `${domain}/success?session={CHECKOUT_SESSION_ID}`,
                cancel_url: 'http://localhost:3000/',
          
            })
            return session
        }catch(error){
            logger.error(error)
        }
    }
}