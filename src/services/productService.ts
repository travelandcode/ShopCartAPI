import logger from '../logs/logger';
import { Product } from '../models/d'
import ProductsModel from '../models/products'

export class ProductService{
    constructor(){
        this.getAllProducts = this.getAllProducts.bind(this)
        this.findProductById = this.findProductById.bind(this)
        this.findProductByName = this.findProductByName.bind(this)
        this.addProduct = this.addProduct.bind(this)
        this.updateProduct = this.updateProduct.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
    }

    async getAllProducts(){
        try{
            const products = await ProductsModel.find({})
            return products
        }catch(error){
            logger.error(error)
        }
    }

    async findProductById (productId:number){
        try {
            const product = await ProductsModel.findOne({id:productId}) 
            return product
        } catch (error) {
            logger.error(error)
        }
    }

    async findProductByName (productName:string){
        try {
            const product = await ProductsModel.findOne({name:productName}) 
            return product
        } catch (error) {
            logger.error(error)
        }
    }

    async addProduct (product:Product){
        try{
            const existingProduct = await this.findProductByName(product.name)
            if(existingProduct) return null
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

    async updateProduct(productName:string, update:any){
        try {
            const existingProduct:any = await this.findProductByName(productName)
            if(!existingProduct) return { updated: false, updatedProduct: null}
            const updatedProduct = await ProductsModel.findOneAndUpdate(
                {name: existingProduct.name},
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

    async deleteProduct(productName:string){
        try {
            const existingProduct:any = await this.findProductByName(productName)
            if(!existingProduct) return { deleted: false, deletedProduct: null}
            const deletedProduct = await ProductsModel.findOneAndDelete({name:existingProduct.name})
            return {deleted: true, deletedProduct: deletedProduct}
        } catch (error) {
            logger.error(error)
        }
    }
}

