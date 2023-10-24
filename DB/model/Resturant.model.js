import mongoose, { Schema, Types, model } from "mongoose";
const ResturantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: [
      {
        type: String,
        required: true,
      },
    ],
    image: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON:{virtual:true},
    toObject:{virtual:true},
    timestamps: true,
  }
);

ResturantSchema.virtual('category',{

  localField:'_id',
  foreignField:'resturantId',
  ref:'Category',

});

const ResturantModel =
  mongoose.models.Resturant || model("Resturant", ResturantSchema);
export default ResturantModel;
