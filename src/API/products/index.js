import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import createHttpError from "http-errors";
import productsModel from "./model.js"
import multer from "multer";


const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
   /*const { reviewId, ...productsData } = req.body;
    const review = await reviewsModel.findById(reviewId);
    if (!review) {
      return next(
        createHttpError(404, `Review with id ${reviewId} not found!`)
      );
    }
    const newProduct = new productsModel({
      ...productsData,
      review: productId,
    });  */ 
    const newProduct = new productsModel(req.body)
    const { _id } = await newProduct.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query)
    const review = await productsModel
      .find(mongoQuery.criteria, mongoQuery.options.fields)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.options.limit)
      .sort(mongoQuery.options.sort)
      //.populate("Reviews");
    res.send(review);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const user = await productsModel.findById(req.params.productId);
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await productsModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedProduct = await productsModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Product with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "u4-w1-solo-project/public",
    },
  }),
}).single("productImg");

productsRouter.post(
  "/:productId/uploadImage",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const product = await productsModel.findById(req.params.productId);
      product.imageUrl = req.file.path;
      await product.save();
      if (product) {
        res.send({ message: "File uploaded successfully" });
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.productId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const newReview = req.body;
    const addReview = {
      ...newReview,
    };
    const updatedProduct = await productsModel.findByIdAndUpdate(
      req.params.productId,
      {
        $push: { reviews: addReview },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const review = await productsModel.findById(req.params.productId);
    if (review) {
      res.send(review.reviews);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await productsModel.findById(req.params.productId);
    if (review) {
      const selectedReview = review.reviews.find(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (selectedReview) {
        res.send(selectedReview);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await productsModel.findById(req.params.productId);
    if (review) {
      const index = review.reviews.findIndex(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (index !== -1) {
        review.reviews[index] = {
          ...review.reviews[index].toObject(),
          ...req.body,
        };
        await review.save();
        res.send(review);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(
        req.params.productId,
        { $pull: { reviews: { _id: req.params.reviewId } } },
        { new: true, runValidators: true }
      );
      if (updatedProduct) {
        res.send(updatedProduct);
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.productId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
