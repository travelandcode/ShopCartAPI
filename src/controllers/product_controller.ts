import logger from '../logs/logger';
import { Product } from '../models/d'
import ProductsModel from '../models/products'


export async function getProducts() {
    try{
        const products:Product[] = await ProductsModel.find({}) as Product[]
        return products
    }catch(error){
        logger.error(error)
    }
}

export async function getProduct (productId:String) {
    try {
        const product = await ProductsModel.find({id:productId}) 
        return product
    } catch (error) {
        logger.error(error)
    }
}

