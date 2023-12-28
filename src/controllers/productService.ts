import logger from '../logs/logger';
import { Product } from '../models/d'
import ProductsModel from '../models/products'

export class ProductService{
    async getAllProducts() {
        try{
            const products = await ProductsModel.find({})
            return products
        }catch(error){
            logger.error(error)
        }
    }

    async findProductById (productId:Number) {
        try {
            const product = await ProductsModel.find({id:productId}) 
            return product
        } catch (error) {
            logger.error(error)
        }
    }

    async findProductByName (productName:String){
        try {
            const product = await ProductsModel.find({name:productName}) 
            return product
        } catch (error) {
            logger.error(error)
        }
    }

    async addProduct (product:Product) {
        try{
            const existingProduct:any = await this.findProductByName(product.name)
            if(existingProduct.length !== 0) return { created:false, createdProduct: null}
            const createdProduct = await ProductsModel.create({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                tags: product.tags,
                img_src: product.img_src,
                isDeal: product.isDeal
            })
            return {created: true, createdProduct: createdProduct}
        }catch (error) {
            logger.error(error)
        }
    }

    async updateProduct(productName:String, update:any) {
        try {
            const existingProduct:any = await this.findProductByName(productName)
            if(existingProduct.length === 0) return { updated: false, updatedProduct: null}
            const updatedProduct = await ProductsModel.findOneAndUpdate(
                {name: existingProduct[0].name},
                {$set: {
                    name: update.name,
                    description: update.description,
                    price: update.price,
                    tags: update.tags,
                    img_src: update.img_src,
                    isDeal: update.isDeal
                }},
                { new: true } 
            )
            return { updated: true, updatedProduct: updatedProduct}
        } catch (error) {
            logger.error(error)
        }
    }

    async deleteProduct(productName:String){
        try {
            const existingProduct:any = await this.findProductByName(productName)
            if(existingProduct.length === 0) return { deleted: false, deletedProduct: null}
            const deletedProduct = await ProductsModel.findOneAndDelete({name:existingProduct[0].name})
            return {deleted: true, deletedProduct: deletedProduct}
        } catch (error) {
            logger.error(error)
        }
    }
}

