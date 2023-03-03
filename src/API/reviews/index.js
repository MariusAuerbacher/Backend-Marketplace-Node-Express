import Express from "express";
import fs from "fs-extra";
import { getReviews, writeReviews} from "../../lib/fs-tools.js"
import {dirname, join } from "path"
import { fileURLToPath } from "url";
import uniqid from "uniqid"
import { checkReviewsSchema, triggerBadRequest } from "./validation.js";


const reviewsRouter = Express.Router();

const reviewsJSONPATH = join(dirname(fileURLToPath(import.meta.url)), "reviews.json")

const reviewsArray = JSON.parse(fs.readFileSync(reviewsJSONPATH))

reviewsRouter.post("/:productId/reviews",checkReviewsSchema, triggerBadRequest, async (req, res) => {
  const newReview = {
   ...req.body,
   createdAt: new Date(),
   id: uniqid(),
   productId: req.params.productId
  }
 console.log(newReview)
 console.log(req.params)
  const reviewsArray = await getReviews()
  reviewsArray.push(newReview)
  
  await writeReviews(reviewsArray)
 
  res.status(201).send({ id: newReview.id })
 
 
 });
reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
   try{
  let reviewsArray = await getReviews()
  reviewsArray = reviewsArray.filter(review => review.productId == req.params.productId)
   res.send(reviewsArray)
 }catch (error){
   next(error)
 }
 });
 
 reviewsRouter.get("/:productId/reviews/:reviewId", triggerBadRequest, async (req, res, next) => {
  try{
    let reviewsArray = await getReviews()
    let  foundReview = reviewsArray.find(review => review.id == req.params.reviewId)
     res.send(foundReview)
   }catch (error){
     next(error)
   }
 });
 
 
 
 reviewsRouter.put("/:productId/reviews/:reviewId",  async (req, res, next) => {
 
  const reviewsArray = await getReviews()
 
  const index = reviewsArray.findIndex(review => review.id === req.params.reviewId)
 
  const oldReview = reviewsArray[index]
  const updatedReview = {
   ...oldReview,
   ...req.body,
   updatedAt: new Date()
  }
 
  reviewsArray[index] = updatedReview
 
  await writeReviews(reviewsArray)
 
  res.send(updatedReview)
 
 
 });

 reviewsRouter.delete("/:productId/reviews/:reviewId", async (req, res, next) => {
   try{
   const reviewsArray = await getReviews()
 
   const remainingReviews = reviewsArray.filter(review => review.id !== req.params.reviewId)
 
   if(reviewsArray.length !== remainingReviews.length){
 
     await writeReviews(remainingReviews)
     res.status(204).send()
 
   } else {
 
     next(createHttpError(404, `Review with id ${req.params.id} not found`))
   }
 }  catch (error) {
     next(error)
   }
  
 });




export default reviewsRouter;