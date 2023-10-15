import { port } from './src/config/config'
import express from 'express'
import logger from './src/logs/logger'

const app = express()
const PORT = port

//Middleware
app.use(express.json())

app.listen(PORT,() =>{
    logger.info(`Server is listening on port:${PORT}`);
})