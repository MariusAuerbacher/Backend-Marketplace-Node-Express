import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../API/products")

const productsJSONPath = join(dataFolderPath, "products.json")

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = productsArray => writeJSON(productsJSONPath, productsArray)