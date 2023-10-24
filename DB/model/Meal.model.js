import mongoose, {Schema,Types,model} from 'mongoose';
const MealSchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:Object,
        required:true,
    },
    description:String,
    deleted:{
        type:Boolean,
        default:false,
    },

    resturantId:{
        type:Types.ObjectId,
        ref:'Restaurant',
        required:true,
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
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
    timestamps:true
});


const MealModel = mongoose.models.Meal ||  model('Meal', MealSchema);
export default MealModel;