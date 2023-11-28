import express from 'express'
import logger from '../logs/logger'
import ProductsModel from '../models/products'
import { Products } from '../models/d'
import { EMPTY_PATH } from '../constants/constants'


const router = express.Router()

router.get(EMPTY_PATH,async (req:any,res)  =>{
    try{
        const products:Products[] = await ProductsModel.find({});
        logger.info('Sending Products Information')
        res.json(products)
    }catch(error){
        logger.error(error)
    }
})

export default router