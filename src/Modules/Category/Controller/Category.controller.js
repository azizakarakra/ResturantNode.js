import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createCategory = async(req,res,next)=>{

    const {resturantId} = req.params;
    const {name} = req.body;

    const slug = slugify(name);
    if(await categoryModel.findOne({name})){
        return next(new Error("duplicated category name",{cause:409}));
    }
  
    const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`});
    const Category = await categoryModel.create({name,slug,resturantId,image:{
        public_id,secure_url  
    },createdBy:req.user._id,updatedBy:req.user._id});
    return res.status(201).json({message:'success',Category});
}

export const updateCategory = async (req, res, next) =>{

const {resturantId,categoryId} = req.params;

    const Category = await categoryModel.findOne({_id:categoryId,resturantId});

    if(!Category){
        return next(new Error (`invalid Category id ${req.params.categoryId}`, {cause:400}));
    }

    if(req.body.name){

        if(Category.name == req.body.name){
            return next(new Error("old Category name match new name",{cause:409}));
        }

        if(await categoryModel.findOne({name:req.body.name})){
            return next(new Error("duplicated Category name",{cause:409}));
        }

        Category.name = req.body.name;
        Category.slug = slugify(req.body.name);


    }

    if(req.file){
        const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`});
        await cloudinary.uploader.destroy(Category.image.public_id);

        Category.image = {public_id,secure_ur};
    }

    req.body.updatedBy = req.user._id;
    await Category.save();
    return res.json({message:'success',Category});
} 

export const getSpecificCattegory = async (req,res,next) => {

    const {categoryId,resturantId} = req.params;
    const Category = await categoryModel.findOne({_id:categoryId,resturantId});
    if(!Category){
        return next(new Error("dont find any Category with this id",{cause:409}));
    }

    return res.status(200).json({message:"success",Category});
}

export const getCategories = async (req,res,next) => {

    const {resturantId} = req.params;

    const Categories = await categoryModel.find({resturantId});
    return res.status(200).json({message:"success",Categories});
}

// export const getProducts = async (req,res,next) => {

//     const {subCategoryId} = req.params;

//     const products = await SubCategoryModel.findById(subCategoryId).populate({
//         path:"products",
//         match:{deleted:{$eq:false}},
//         select:"name -subCategoryId",
//         populate:{path:'review'},
//     });

//     return res.status(200).json({message:"success", products});
// }
