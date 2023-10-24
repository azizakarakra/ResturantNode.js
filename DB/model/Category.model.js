import mongoose, {Schema,Types,model} from 'mongoose';
const categorySchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    resturantId:{
        type:Types.ObjectId,
        ref:'Restaurant',
        required:true,
    },
    createdBy:{
        type:
            Types.ObjectId, 
            ref:'User',
            required:true,
    },
    updatedBy:{
        type:
            Types.ObjectId, 
            ref:'User',
            required:true,
    },
},
{
    toJSON:{virtual:true},
    toObject:{virtual:true},
    timestamps:true
});


categorySchema.virtual('meal',{

    localField:'_id',
    foreignField:'categoryId',
    ref:'Meal',
  
  });

const categoryModel = mongoose.models.Category ||  model('Category', categorySchema);
export default categoryModel;