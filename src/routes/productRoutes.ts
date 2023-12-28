import express, { Request, Response } from 'express'
import logger from '../logs/logger'
import { ProductService } from '../controllers/productService'
import { Product } from '../models/d'

const productService = new ProductService()
const router = express.Router()

router.get("/",async (req:any,res)  =>{
    try{
        const products = await productService.getAllProducts()
        logger.info('Sending Products Information')
        res.status(200).send(
            {
                data: products,
                message: "Successfully retrieved the list of products."
            }
        )
    }catch(error){
        logger.error(error)
        res.status(500).send("Internal Server Error");
    }
})

router.get("/product/:id", async (req:Request,res:Response) => {
    try {
        const productId = Number(req.params.id)
        const product = await productService.findProductById(productId)
        if(product!.length === 0)
        {
            logger.error(`Product with id:${productId} was not found`)
            res.status(404).send('Product was not found')
        }else{
            res.status(200).send({
                data:product,
                message: "Successfully retrieved product"
            })
        }
    } catch (error) {
        logger.error(error)
        res.status(500).send("Internal Server Error");
    }
})

router.get("/:name", async (req:Request,res:Response) => {
    try {
        const productName = req.params.name
        const formattedProductName = productName.replace(/\+/g, ' ')
        const product = await productService.findProductByName(formattedProductName)
        if(product!.length === 0)
        {
            logger.error(`${formattedProductName} was not found`)
            res.status(404).send('Product was not found')
        }else{
            res.status(200).send({
                data:product,
                message: "Successfully retrieved product"
            })
        }
    } catch (error) {
        logger.error(error)
        res.status(500).send("Internal Server Error");
    }
})

router.post("/addProduct", async (req: Request, res:Response) => {
    try {
        logger.info("Adding New Product")
        const generatedNumber = Math.floor(Math.random()* (999 - 100 + 1) + 100)
        const newProductId = generatedNumber+''+Date.now()
        const product:Product = {
            id:  Number(newProductId),
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            tags: req.body.tags,
            img_src: req.body.img_src,
            isDeal: false
        }
        const result = await productService.addProduct(product)
        if(!result?.created && !result?.createdProduct){
            logger.warn(`A ${product.name} already exists`)
            res.status(409).send("Product already exists")
        }else{
            logger.info("Product was created")
            logger.info(result?.createdProduct)
            res.status(201).send({
                message:"Product was successfully created",
                data: result.createdProduct
            })
        }
    } catch (error) {
        logger.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.put("/updateProduct/:name",async (req:Request,res:Response) =>{
    try {
        const productName = req.params.name
        const formattedProductName = productName.replace(/\+/g, ' ')
        const result = await productService.updateProduct(formattedProductName,req.body)
        if(!result?.updated && !result?.updatedProduct){
            logger.warn(`A ${formattedProductName}does not exist`)
            res.status(404).send("Product does not exist")
        }else{
            logger.info(`Product Information for "${result.updatedProduct?.name}" has been updated`)
            logger.info(result.updatedProduct)
            res.status(200).send({
                data:result.updatedProduct,
                message: "Product has been updated"
            })
        }
    } catch (error) {
        logger.error(error)
        res.status(500).send("Internal Server Error")
    }
})

router.delete("/deleteProduct/:name",async (req:Request,res:Response) =>{
    try {
        const productName = req.params.name
        const formattedProductName = productName.replace(/\+/g, ' ')
        const result = await productService.deleteProduct(formattedProductName)
        if(!result?.deleted && !result?.deletedProduct){
            logger.warn(`A ${formattedProductName}does not exist`)
            res.status(404).send("Product does not exist")
        }else{
            logger.info(`"${formattedProductName}" was deleted`)
            res.status(204).send()
        }
    } catch (error) {
        logger.error(error)
        res.status(500).send("Internal Server Error")
    }
})

export default router