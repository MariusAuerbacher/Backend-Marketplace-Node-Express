import Express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getProducts, writeProducts} from "../../lib/fs-tools.js"
import createHttpError from "http-errors"
import { checkProductsSchema, triggerBadRequest } from "./validation.js";
import multer from "multer"
import { extname } from "path"

const productsRouter = Express.Router();

const productsJSONPATH = join(dirname(fileURLToPath(import.meta.url)), "products.json")




const imagesProductsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/products")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesProductsJSONPath)
  },
  filename: function (req, file, cb) {
    const originalFileExtension = extname(file.originalname)
    cb(null, req.params.id + originalFileExtension)
  }
})

const upload = multer({ storage: storage })



productsRouter.post("/", checkProductsSchema, triggerBadRequest, async (req, res) => {
 const newProduct = {
  ...req.body,
  createdAt: new Date(),
  updatedAt: new Date(),
  id: uniqid(),
 }

 const productsArray = await getProducts()
 productsArray.push(newProduct)
 
 await writeProducts(productsArray)

 res.status(201).send({ id: newProduct.id })


});
productsRouter.get("/", async (req, res, next) => {
  try{
 const productsArray = await getProducts()
  res.send(productsArray)
}catch (error){
  next(error)
}
});

productsRouter.get("/:id", triggerBadRequest, async (req, res, next) => {
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


productsRouter.post("/:id/upload", upload.single("image"),  async (req, res) => {
  const image = `http://localhost:3001/public/${req.params.id}${ extname(req.file.originalname)}`

  const productsArray = await getProducts()

  const index = productsArray.findIndex(product => product.id === req.params.id)
 
  const oldProduct = productsArray[index]
  const updatedProduct = {
   ...oldProduct,
   image,
   updatedAt: new Date()
  }
 
  productsArray[index] = updatedProduct
 
  await writeProducts(productsArray)
 
  res.send(updatedProduct)
})
 


export default productsRouter;