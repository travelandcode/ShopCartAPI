import { ProductService } from '../controllers/productService';
import app from '../../app' 
import { Product } from '../models/d';

describe('Products Service', () =>{

    let productService:any
    let updatedInformation:any
    let server:any
    let newProduct: Product

    beforeEach(() => {
        productService = new ProductService();
        newProduct = {
            id: 111,
            name: "Test Product",
            description: "This is the description for Test Product 1",
            price: 1000,
            tags: ["test","product"],
            img_src: ["https://i.imgur.com/D6aOJWH.png"],
            isDeal: false
        }
        updatedInformation = {
            description: "This is the new description for Test Product 2",
            price: 777
        }
        server = app.listen(5000)
        
    })

    afterEach((done) =>{
        server.close(done)
    })

    test('should get all products',async () => {
       const products = await productService.getAllProducts()
       expect(products.length).toBe(24)
    })

    test('should add new product',async () => {
        const {createdProduct,created} = await productService.addProduct(newProduct)
        expect(created).toBe(true)
        expect(createdProduct.name).toBe("Test Product")
        expect(createdProduct.id).toBe(111)
        expect(createdProduct.price).toBe(1000)
    })

    test('should not create existing product',async () => {
       const {created} = await productService.addProduct(newProduct)
       expect(created).toBe(false)
    })

    test('should get product using id', async() => {
        const product = await productService.findProductById(newProduct.id)
        expect(product[0].id).toBe(newProduct.id)
        expect(product[0].name).toBe(newProduct.name)
        expect(product[0].price).toBe(newProduct.price)
        expect(product[0].description).toBe(newProduct.description)
    })

    test('should get product using name', async() => {
        const product = await productService.findProductByName(newProduct.name)
        expect(product[0].id).toBe(newProduct.id)
        expect(product[0].name).toBe(newProduct.name)
        expect(product[0].price).toBe(newProduct.price)
        expect(product[0].description).toBe(newProduct.description)
    })

    test('should update product', async() =>{
       const {updatedProduct,updated} = await productService.updateProduct(newProduct.name,updatedInformation)
       expect(updated).toBe(true)
       expect(updatedProduct.description).toBe(updatedInformation.description)
       expect(updatedProduct.price).toBe(777)
    })

    test('should delete product',async () => {
        const {deleted} = await productService.deleteProduct(newProduct.name,updatedInformation)
        expect(deleted).toBe(true)
    })

    test('should not get any information if product does not exist',async () => {
        const product = await productService.findProductById(newProduct.id)
        expect(product).toEqual([])
    })
})