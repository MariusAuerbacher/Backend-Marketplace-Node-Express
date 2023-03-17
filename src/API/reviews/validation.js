/*import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const reviewsSchema = {

  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is a mandatory field and needs to be a string!",
    }
  },
  rate: {
    in: ["body"],
    isNumber: {
      errorMessage: "Rate is a mandatory field and needs to be a number!",
    }
  },
  productId: {
    in: ["body"],
    isString: {
      errorMessage: "ProductId is a mandatory field and needs to be a string!",
    }
  },
 

}


export const checkReviewsSchema = checkSchema(reviewsSchema);

export const triggerBadRequest = (req, res, next) => {

  const errors = validationResult(req);

  console.log(errors.array());

  if (errors.isEmpty()) {

    next();
  } else {
    next(
      createHttpError(400, "Errors during blog validation", {
        errorsList: errors.array(),
      })
    );
  }
};*/