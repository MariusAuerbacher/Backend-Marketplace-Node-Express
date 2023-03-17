import Express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./API/products/index.js";
/*import { join } from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";*/
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorsHandlers.js"
import mongoose from "mongoose";

const server = Express()
const port = process.env.PORT || 3001

/*const imagesProductsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "./public/img/products")

server.use("/public", Express.static(imagesProductsJSONPath))*/
server.use(Express.json());


server.use("/products", productsRouter)
//server.use("/products", reviewsRouter)




server.use(badRequestHandler) 
server.use(unauthorizedHandler) 
server.use(notfoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})