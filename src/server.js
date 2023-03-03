import Express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./API/products/index.js";

const server = Express()
const port = 3001


server.use(Express.json());

server.use("/products", productsRouter)

server.listen(port , () => {
  console.table(listEndpoints(server));
  console.log(`Server running on ${port} `)
})
