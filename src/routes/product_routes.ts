import express, { Request } from 'express'
import logger from '../logs/logger'
import { EMPTY_PATH } from '../constants/constants'
import { getProduct, getProducts } from '../controllers/product_controller'


const router = express.Router()

router.get(EMPTY_PATH,async (req:any,res)  =>{
    try{
        const products = await getProducts()
        logger.info('Sending Products Information')
        res.json(products)
    }catch(error){
        logger.error(error)
    }
})

router.get("/:id", async (req:Request,res:any) => {
    try {
        const productId = req.params.id
        logger.info(productId)
        const product = await getProduct(productId)
        logger.info(product)
        res.send(product)
    } catch (error) {
        logger.error(error)
    }
})

export default router