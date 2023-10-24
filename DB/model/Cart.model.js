import mongoose, {Schema,Types,model} from 'mongoose';
const CartSchema = new Schema ({

    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    },

   meals:[{
       mealId:{ type:Types.ObjectId,ref:'Meal',required:true,},
       qty:{type:Number,default:1,required:true,},
       
    }]

   
},
{
    timestamps:true
})
const CartModel = mongoose.models.Cart ||  model('Cart', CartSchema);
export default CartModel;