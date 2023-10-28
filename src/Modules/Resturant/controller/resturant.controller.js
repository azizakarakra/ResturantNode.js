import ResturantModel from "../../../../DB/model/Resturant.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createResturant = async(req,res,next)=>{
    const name = req.body.name.toLowerCase();
    const slug = slugify(name);
    const {phoneNumber} = req.body;

    if(await ResturantModel.findOne({name})){
        return next(new Error("duplicated resturant name",{cause:409}));
    }
  
    const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/resturant`});
    const resturant = await ResturantModel.create({name,slug,phoneNumber,image:{
        public_id,secure_url  
    },createdBy:req.user._id,updatedBy:req.user._id});
    return res.status(201).json({message:'success',resturant});
}

export const updateResturant = async (req, res, next) =>{

    const resturant = await ResturantModel.findById(req.params.resturantId);

    if(!resturant){
        return next(new Error (`invalid resturant id ${req.params.resturantId}`, {cause:400}));
    }

    if(req.body.name){

        if(resturant.name == req.body.name){
            return next(new Error("old resturant name match new name",{cause:409}));
        }

        if(await ResturantModel.findOne({name:req.body.name})){
            return next(new Error("duplicated resturant name",{cause:409}));
        }

        resturant.name = req.body.name;
        resturant.slug = slugify(req.body.name);


    }

    if(req.file){
        const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/resturant`});
        await cloudinary.uploader.destroy(resturant.image.public_id);

        resturant.image = {public_id,secure_url};
    }

    resturant.updatedBy = req.user._id;
    await resturant.save();
    return res.json({message:'success',resturant});
} 

export const getSpecificResturant = async (req,res,next) => {

    const {resturantId} = req.params;
    const resturant = await ResturantModel.findById(resturantId);
    if(!resturant){
        return next(new Error("dont find any resturant with this id",{cause:409}));
    }

    return res.status(200).json({message:"success",resturant});
}

export const getResturants = async (req,res,next) => {

    const resturants = await ResturantModel.find();
    return res.status(200).json({message:"success",resturants});
}