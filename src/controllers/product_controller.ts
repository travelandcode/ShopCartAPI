import logger from '../logs/logger';
import { Products } from '../models/d'
import ProductsModel from '../models/products'


export const getProducts = async () =>{
    try{
        const products:Products[] = await ProductsModel.find({}) as Products[]
        return products
    }catch(error){
        logger.error(error)
    }
}
