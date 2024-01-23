import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import logger from "../logs/logger";
import { Product } from "../models/d";

export class ProductsController {
    private _productService: ProductService
    constructor({ productService }: { productService: ProductService }) {
        this._productService = productService;
    }

    getCatalogue = async (req: Request, res: Response) => {
        try {
            logger.info("Sending Products Information")
            const products = await this._productService.getAllProducts()
            res.status(200).send(
                {
                    data: products,
                    message: "Successfully retrieved the list of products."
                }
            )
        } catch (error) {
            logger.error(error)
            res.status(500).send("Internal Server Error")
        }
    }

    getProductById = async (req: Request, res: Response) => {
        try {
            logger.info("Fetching Product Information")
            const productId = Number(req.params.id)
            const product = await this._productService.findProductById(productId)
            if(!product)
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
    }

    getProductByName = async (req: Request, res: Response) => {
        try {
            logger.info("Fetching Product Information")
            const productName = req.params.name
            const formattedProductName = productName.replace(/\+/g, ' ')
            const product = await this._productService.findProductByName(formattedProductName)
            if(!product)
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
    }

    createProduct = async (req: Request, res: Response) => {
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
            const result = await this._productService.addProduct(product)
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
    }

    editProduct = async (req: Request, res: Response) => {
        try {
            logger.info("Updating Product Information")
            const productName = req.params.name
            const formattedProductName = productName.replace(/\+/g, ' ')
            const result = await this._productService.updateProduct(formattedProductName,req.body)
            if(!result?.updated && !result?.updatedProduct){
                logger.warn(`A ${formattedProductName}does not exist`)
                res.status(404).send("Product does not exist")
            }else{
                logger.info(`Product Information for "${result.updatedProduct?.name}" has been updated`)
                logger.info(result.updatedProduct)
                res.status(200).send({
                    data: result.updatedProduct,
                    message: "Product has been updated"
                })
            }
        } catch (error) {
            logger.error(error)
            res.status(500).send("Internal Server Error")
        }
    }

    deleteProduct = async (req: Request, res: Response) => {
        try {
            logger.info("Deleting Product")
            const productName = req.params.name
            const formattedProductName = productName.replace(/\+/g, ' ')
            const result = await this._productService.deleteProduct(formattedProductName)
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
    }


}