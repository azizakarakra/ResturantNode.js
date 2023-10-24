import CartModel from "../../../../DB/model/Cart.model.js";
import MealModel from "../../../../DB/model/Meal.model.js";

export const createCart = async(req,res,next)=>{

    const {mealId,qty} = req.body;

    const meal = await MealModel.findById(mealId);
    if(!meal){
        return next(new Error(`meal not found`,{cause:400}));
    }

    const cart = await CartModel.findOne({userId:req.user._id});
    if(!cart){

        const newCart = await CartModel.create({
            userId:req.user._id,
            meals:[{mealId,qty}]
        });
        return res.status(200).json({message:"success",newCart});
    }

    let matchMeal = false;
    for(let i=0; i<cart.meals.length; i++){
        if(cart.meals[i].mealId.toString() === mealId){
            cart.meals[i].qty = qty;
            matchMeal = true;
            break;
        }
    }

    if(!matchMeal){
        cart.meals.push({mealId,qty});
    }
await cart.save();
  return res.status(200).json({message:"success",cart});
   
}

export const deleteMeal = async(req, res, next) => {
    const {mealIds} = req.body;

    const meal = await MealModel.findOne({_id:mealIds});
    if(!meal){
       return next(new Error("no meal found",{cause:404}));
    }

   await CartModel.updateOne(
        { userId: req.user._id },
        {
          $pull: {
            meals: {
              mealId: mealIds, 
            },
          },
        }
      );

      return res.status(200).json({message:"success"});
}

export const clearCart = async(req, res, next) => {
    await CartModel.updateOne({userId: req.user._id},{
        meals:[],
    });
    return res.status(200).json({message:"success"});
}

export const getCart = async(req, res, next) => {

    const cart = await CartModel.findOne({userId: req.user._id});
    return res.json({message:"success",cart});
}

