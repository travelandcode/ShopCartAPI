import { port } from 'shopcart-api/config/config'
import express from 'express'

const app = express()
const PORT = port

//Middleware
app.use(express.json())

app.listen(PORT,() =>{
    console.log(`Server is listening on port:${PORT}`)
})