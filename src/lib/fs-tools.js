import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../API/products")

const dataFolderPath1 = join(dirname(fileURLToPath(import.meta.url)), "../API/reviews")

const productsJSONPath = join(dataFolderPath, "products.json")
const reviewsJSONPath = join(dataFolderPath1, "reviews.json")

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = productsArray => writeJSON(productsJSONPath, productsArray)

export const getReviews = () => readJSON(reviewsJSONPath)
export const writeReviews = reviewsArray => writeJSON(reviewsJSONPath, reviewsArray)