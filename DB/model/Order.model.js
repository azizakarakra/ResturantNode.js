import mongoose, { Schema, Types, model } from "mongoose";
const OrderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: [
      {
        type: String,
        required: true,
      },
    ],
    meals: [
      {
        name:{type: String, required: true },
        mealId: { type: Types.ObjectId, ref: "Meal", required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      default: "cash",
      enum: ["cash", "card"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "canceled", "approved", "onWay", "delivered"],
    },
    resonReject: String,
    note: String,
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const OrderModel = mongoose.models.Order || model("Order", OrderSchema);
export default OrderModel;
