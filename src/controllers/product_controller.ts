import logger from '../logs/logger';
import { Product } from '../models/d'
import ProductsModel from '../models/products'


export const getProducts = async () =>{
    try{
        const products:Product[] = await ProductsModel.find({}) as Product[]
        return products
    }catch(error){
        logger.error(error)
    }
}
