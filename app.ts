import express from 'express'
import { port } from './src/config/config'

const app = express()
const PORT = port

//Middleware
app.use(express.json())

app.listen(PORT,() =>{
    console.log(`Server is listening on port:${PORT}`)
})