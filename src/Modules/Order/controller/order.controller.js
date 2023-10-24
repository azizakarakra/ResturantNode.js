import moment from "moment";
import MealModel from "../../../../DB/model/Meal.model.js";
import OrderModel from "../../../../DB/model/Order.model.js";
import CartModel from "../../../../DB/model/Cart.model.js";
import createInvoice from "../../../Services/pdf.js";
import { sendEmail } from "../../../Services/sendEmail.js";


export const createOrder = async (req, res, next) => {
  const { meals, address, phoneNumber, paymentType } = req.body;

  const finalMealList = [];
  const mealIds = [];
  let subTotal = 0;
  for (const meal of meals) {
    const checkMeal = await MealModel.findOne({
      _id: meal.mealId,
      deleted: false,
    });

    if (!checkMeal) {
      return next(new Error(`invalid meal`, { cause: 400 }));
    }

    meal.price = checkMeal.price;

    meal.name = checkMeal.name;
    subTotal += meal.price;
    mealIds.push(meal.mealId);
    finalMealList.push(meal);
  }

  const order = await OrderModel.create({
    userId: req.user._id,
    address,
    phoneNumber,
    meals: finalMealList,
    subTotal,
    paymentType,
    status: paymentType == "card" ? "approved" : "pending",
  });

  for (const meal of meals) {
    await MealModel.updateOne(
      { _id: meal.mealId },
    );
  }

  await CartModel.updateOne(
    { _id: req.user._id },
    {
      $pull: {
        meals: {
          mealId: { $in: mealIds },
        },
      },
    }
  );


  return res.status(201).json({ message: "success", order });
}

export const createOrderWithAllMealsFromCart = async (req, res, next) => {
  const { address, phoneNumber, paymentType } = req.body;

  const cart = await CartModel.findOne({ userId: req.user._id });

  if (!cart || cart.meals.length === 0) {
    return next(new Error(`Empty cart`, { cause: 400 }));
  }

  req.body.meals = cart.meals;

  const finalMealList = [];
  const mealIds = [];
  let subTotal = 0;
  for (let meal of req.body.meals) {
    const checkMeal = await MealModel.findOne({
      _id: meal.mealId,
      deleted: false,
    });

    if (!checkMeal) {
      return next(new Error(`invalid meal`, { cause: 400 }));
    }

    meal = meal.toObject();
    meal.name = checkMeal.name;
    meal.price = checkMeal.price;
    subTotal += meal.price;
    mealIds.push(meal.mealId);
    finalMealList.push(meal);
  }

  const order = await OrderModel.create({
    userId: req.user._id,
    address,
    phoneNumber,
    meals: finalMealList,
    subTotal,
    paymentType,
    status: paymentType == "card" ? "approved" : "pending",
  });

  await CartModel.updateOne(
    { _id: req.user._id },
    {
      meals: [],
    }
  );

  //////////////////////////////////////////////
  const invoice = {
    shipping: {
      name: req.user.userName,
      address,
      city: "Ramallah",
      state: "Al-Bereh",
      country: "Palestine",
      postal_code: 94111
    },
    items:order.meals,
    subTotal:order.price,
    total:order.price,
    invoice_nr: order._id,
  };
  
  createInvoice(invoice, "invoice.pdf");

  await sendEmail(req.user.email, 'infinity light - invoice', 'wlcome', {
    path:'invoice.pdf',
    contentType:'application/pdf',
  });

  return res.status(201).json({ message: "success", order });
}

export const cancelOrder = async(req, res, next) => {

    const {orderId} = req.params;
    const {resonReject} = req.body;

    const order = await OrderModel.findOne({_id: orderId, userId: req.user._id});
    if(!order || order.status!="pending" || order.paymentType!="cash"){
        return next(new Error(`can not cancel order`,{cause:400}));
    }

    await OrderModel.updateOne({_id: order._id},{status:"canceled",resonReject,updatedBy:req.user._id});

    return res.json({message:"success",order});

}

export const updateOrderStatusFromAdmin = async(req, res, next) => {
    const {orderId} = req.params;
    const {status} = req.body;

    const order = await OrderModel.findOne({_id: orderId});

    if(!order || order.status=="delivered"){
        return next(new Error(`can not update this order status`,{cause:400}));
    }

    const changeOrderStatus = await OrderModel.updateOne({_id:orderId},{status, updatedBy:req.user._id});
    if(!changeOrderStatus.matchedCount){
        return next(new Error(`fail to change status order`,{cause:400}));
    }
  
return res.status(200).json({message:"success",order});

}
