import express, { Request, Response } from 'express'
import logger from '../logs/logger'
import { ProductService } from '../services/productService'
import { Product } from '../models/d'
import { ProductsController } from '../controllers/productsController'

const productService = new ProductService()
const controller = new ProductsController({productService})
const router = express.Router()

router.get("/",controller.getCatalogue)

router.get("/product/:id", controller.getProductById)

router.get("/:name", controller.getProductByName)

router.post("/create", controller.createProduct)

router.put("/update/:name", controller.editProduct)

router.delete("/delete/:name", controller.deleteProduct)

export default router