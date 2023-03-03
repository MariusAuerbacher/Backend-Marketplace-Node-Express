import Express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getProducts, writeProducts} from "../../lib/fs-tools.js"
import createHttpError from "http-errors"
import { checkProductsSchema, triggerBadRequest } from "./validation.js";

const productsRouter = Express.Router();

const productsJSONPATH = join(dirname(fileURLToPath(import.meta.url)), "products.json")

const productsArray = JSON.parse(fs.readFileSync(productsJSONPATH))

productsRouter.post("/", checkProductsSchema, triggerBadRequest, async (req, res) => {
 const newProductPost = {
  ...req.body,
  createdAt: new Date(),
  updatedAt: new Date(),
  id: uniqid(),
 }

 const productsArray = await getProducts()
 productsArray.push(newProductPost)
 
 await writeProducts(productsArray)

 res.status(201).send({ id: newProductPost.id })


});
productsRouter.get("/", async (req, res, next) => {
  try{
 const productsArray = await getProducts()
  res.send(productsArray)
}catch (error){
  next(error)
}
});

productsRouter.get("/:id", async (req, res, next) => {
  try{
 const productsArray = await getProducts()

 const foundProducts = productsArray.find(product => product.id === req.params.id)

if(!foundProducts){
  next({ status: 400, message: "Product not found"})
  return
} 
 else {
  res.send(foundProducts)
}
  }
catch (error){
  next(error)
}
});



productsRouter.put("/:productId", async (req, res, next) => {

 const productsArray = await getProducts()

 const index = productsArray.findIndex(product => product.id === req.params.productId)

 const oldProduct = productsArray[index]
 const updatedProduct = {
  ...oldProduct,
  ...req.body,
  updatedAt: new Date()
 }

 productsArray[index] = updatedProduct

 await writeProducts(productsArray)

 res.send(updatedProduct)


});

productsRouter.delete("/:productId", async (req, res, next) => {
  try{
  const productsArray = await getProducts()

  const remainingProducts = productsArray.filter(product => product.id !== req.params.productId)

  if(productsArray.length !== remainingProducts.length){

    await writeProducts(remainingProducts)
    res.status(204).send()

  } else {

    next(createHttpError(404, `Product with id ${req.params.id} not found`))
  }
}  catch (error) {
    next(error)
  }



 
});



export default productsRouter;