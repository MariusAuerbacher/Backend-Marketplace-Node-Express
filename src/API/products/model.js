import mongoose from "mongoose"

const { Schema, model } = mongoose

const reviewsSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, required: true, min: 1, max: 5 },
  }
);


const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String},
    reviews: [reviewsSchema]
   
  },
  { timestamps: true }
)

export default model("Products", productsSchema)




