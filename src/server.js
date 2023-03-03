import Express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./API/products/index.js";
import reviewsRouter from "./API/reviews/index.js"
import { join } from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorsHandlers.js"

const server = Express()
const port = 3001

const imagesProductsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "./public/img/products")

server.use("/public", Express.static(imagesProductsJSONPath))
server.use(Express.json());

server.use("/products", reviewsRouter)
server.use("/products", productsRouter)



server.use(badRequestHandler) 
server.use(unauthorizedHandler) 
server.use(notfoundHandler)
server.use(genericErrorHandler)

server.listen(port , () => {
  console.table(listEndpoints(server));
  console.log(`Server running on ${port} `)
})
