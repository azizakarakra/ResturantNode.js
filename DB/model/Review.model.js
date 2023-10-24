import mongoose, { Schema, Types, model } from "mongoose";
const ReviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    mealId: {
      type: Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const ReviewModel = mongoose.models.Review || model("Review", ReviewSchema);
export default ReviewModel;
