import express from 'express'
import logger from '../logs/logger'
import { EMPTY_PATH } from '../constants/constants'
import { getProducts } from '../controllers/product_controller'


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

export default router