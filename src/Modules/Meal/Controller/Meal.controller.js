import MealModel from "../../../../DB/model/Meal.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createMeal = async(req,res,next)=>{
    const {name,price,resturantId,categoryId,deleted} = req.body;
    
    const checkCategory = await categoryModel.findOne({_id:categoryId,resturantId:resturantId});

    if(!checkCategory){
        return next(new Error(`invalid resturant or category`,{cause:400}));
    }
    
    req.body.price = price;

    const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/meal`});
    const meal = await MealModel.create({name,price,resturantId,categoryId,deleted:false,image:{
        public_id,secure_url  
    },createdBy:req.user._id,updatedBy:req.user._id});
    
if(!meal){
    return next(new Error(`failed to create meal`,{cause:400}));
}
return res.json({message:"success",meal});

}

export const updateMeal = async (req, res, next) =>{
    const {mealId} = req.params;

    const newMeal = await MealModel.findById(mealId);
    if(!newMeal){
        return next(new Error(`meal not found`,{cause:400}));
    }

    const {name,price,resturantId,categoryId} = req.body;

    if(resturantId && categoryId){
        const checkCategory = await categoryModel.findOne({_id:categoryId,resturantId:resturantId});
        if(checkCategory){
            newMeal.categoryId = categoryId;
            newMeal.resturantId = resturantId;
        }else{
            return next(new Error(`Resturant id or Category id not found`,{cause:400}));
        }
       
    }else if(categoryId){
        const checkCategory = await categoryModel.findOne({_id:categoryId});
        if(checkCategory){
            newMeal.categoryId = categoryId;
        }else{
            return next(new Error(`Category id not found`,{cause:400}));
        }
    }

    if(name){
        newMeal.name = name;
    }
    if(req.body.description){
        newMeal.description = req.body.description;
    }
    if(price){
        newMeal.price = price;
    }
    
    if(req.file){
        const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/meal`});
        await cloudinary.uploader.destroy(newMeal.image.public_id);
        newMeal.image.secure_url = secure_url;
        newMeal.image.public_id = public_id;
    }

    newMeal.updatedBy = req.user._id;

    const meal = await newMeal.save();
    if(!meal){
        return next(new Error(`fail to update meal`,{cause:409}));
    }
    return res.status(200).json({message:"success", meal});
} 

export const softDelete = async (req, res, next) => {
    const {mealId} = req.params;

    const meal = await MealModel.findByIdAndUpdate({_id:mealId, deleted:false},{deleted:true},{new:true});
    if(!meal){
        return next(new Error(`meal not found`,{cause:400}));
    }

    return res.status(200).json({message:"success", meal});

}

export const forceDelete = async (req, res, next) => {
    const {mealId} = req.params;

    const meal = await MealModel.findByIdAndDelete({_id:mealId, deleted:true});
    if(!meal){
        return next(new Error(`meal not found`,{cause:400}));
    }

    return res.status(200).json({message:"success", meal});
}

export const restore = async (req, res, next) => {

    const {mealId} = req.params;

    const meal = await MealModel.findByIdAndUpdate({_id:mealId, deleted:true},{deleted:false},{new:true});
    if(!meal){
        return next(new Error(`meal not found`,{cause:400}));
    }
    return res.status(200).json({message:"success", meal});

}

export const getSoftDelete = async (req, res, next) => {

    const meal = await MealModel.find({deleted:true});
    return res.status(200).json({message:"success", meal});
}

export const getMeal = async (req,res,next) => {

    const {mealId} = req.params;

    const meal = await MealModel.findOne({_id:mealId});
    if(!meal){
        return next(new Error(`meal not found`,{cause:400}));
    }
    return res.status(200).json({message:"success", meal});

    
}

export const getMeals = async (req,res,next) => {

let {page, size} = req.query;

if(!page || page<=0){
    page = 1;
}
if(!size || size<=0){
    size = 3;
}
const skip = (page-1)*size;
const excQueryParams = ['page', 'size', 'sort', 'search'];
const filterQuery = {...req.query};
excQueryParams.map(params =>{
delete filterQuery[params];
});
   const query =  JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|eq|neq|in|nin)/g,match => `$${match}`));
    const mongoQuery =  MealModel.find(query).limit(size).skip(skip).sort(req.query.sort?.replaceAll(',', ' '));
   if(req.query.search){
    const meals = await mongoQuery.find({
       $or:[
      {name:{$regex:req.query.search, $options:'i'}},
        {description:{$regex:req.query.search, $options:'i'}},
       ]

    });
    req.body.meals = meals;
}else{
    const meals = await mongoQuery;
    req.body.meals = meals;
}
const meals = req.body.meals;
    if(!meals){
        return next(new Error(`meals not found`,{cause:400}));
    }

    return res.status(200).json({message:"success", meals});
}