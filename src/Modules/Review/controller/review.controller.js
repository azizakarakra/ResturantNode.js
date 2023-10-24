import OrderModel from "../../../../DB/model/Order.model.js";
import ReviewModel from "../../../../DB/model/Review.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createReview = async(req,res,next)=>{

    const {mealId} = req.params;
    const {rating,comment} = req.body;

    const order = await OrderModel.findOne({
        userId: req.user._id,
        status: 'delivered',
        "meals.mealId": mealId,
    });

    if(!order){
        return next(new Error(`can not review meal before receive it`,{cause:400}));
    }

    const checkReview = await ReviewModel.findOne({createdBy:req.user._id,mealId});
    if(checkReview){
        return next(new Error(`already review by you`,{cause:400}));
    }
   
    const review = await ReviewModel.create({
        createdBy:req.user._id,
        orderId:order._id,
        mealId:mealId,
        comment,
        rating,
    });

    return res.status(201).json({message:"success",review});
    
}

export const updateReview = async(req, res, next) => {

    const {mealId, reviewId} = req.params;

    const review = await ReviewModel.findByIdAndUpdate({_id:reviewId, createdBy:req.user._id, mealId:mealId},req.body,{new:true});

    return res.status(200).json({message:"success",review});
}

