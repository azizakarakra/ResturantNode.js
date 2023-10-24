import { customAlphabet } from "nanoid";
import userModel from "../../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../../Services/generateAndVerifyToken.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";
import { sendEmail } from "../../../Services/sendEmail.js";
import { loginSchema, signupSchema } from "../Auth.validation.js";


export const signup= async (req,res,next)=>{

   
    const {userName,email,password} = req.body;
  
    const user = await userModel.findOne({email});
    if(user){
        return next(new Error("email already exists",{cause:409}));
    }

    const token = generateToken({email},process.env.TOKEN_SIGNATURE, 60*5);
    const refreshToken = generateToken({email},process.env.TOKEN_SIGNATURE, 60*60*24);

    const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const Rlink =`${req.protocol}://${req.headers.host}/auth/NewconfirmEmail/${refreshToken}`;

    const html = `<a href="${link}">verify your email</a> <br /> <br /> <br /> <a href="${Rlink}">send new email</a>`;
    await sendEmail(email,'confirm email',html);

     const HashPassword = hash(password);
    const createUser = await userModel.create({userName,email,password:HashPassword});


    return res.status(201).json({message:"success",user:createUser._id});

}

export const confirmEmail = async(req,res)=>{
    const {token} = req.params;

    const decoded = verifyToken(token,process.env.TOKEN_SIGNATURE);

    if(!decoded.email) {
        return next(new Error ("invalid token payload" , {cause:400}));
    }
    const user = await userModel.updateOne({email:decoded.email},{confirmEmail:true});
    if(user.modifiedCount){
        return res.status(200).redirect(`${process.env.FE_URL}`);
    }else{
        return next(new Error ("not register account or your account has been verified",{cause:400}));
    }
}


export const login = async(req,res,next)=>{
        const {email,password} = req.body;
      
        const user = await userModel.findOne({email});
        if(!user){
            return next(new Error("email not exists",{cause:404}));
        }else {
            if(!user.confirmEmail){
                return next(new Error("plz verify your email",{cause:400}));
            }
            const match = compare(password,user.password);
            if(!match){
                return next(new Error("invalid password",{cause:400}));
            }else {
                const token =generateToken({id:user._id,role:user.role},process.env.LOGIN_SIGNATURE,'1h');
                const RefreshToken =generateToken({id:user._id,role:user.role},process.env.LOGIN_SIGNATURE,60 * 60 * 24 * 365);
                return res.status(200).json({message:"Done",token,RefreshToken});
            }
        
    }
    
}

export const NewconfirmEmail = async (req, res, next) => {

    let {token} = req.params;

    const {email} = verifyToken(token,process.env.TOKEN_SIGNATURE);
    if(!email) {
        return next(new Error ("invalid token payload" , {cause:400}));
    }
    const user = await userModel.findOne({email: email});
    if(!user){
        return next(new Error ("not register account" , {cause:404}));
    }
    if(user.confirmEmail){
        return res.status(200).redirect(`${process.env.FE_URL}`);
    }
    token = generateToken({email},process.env.TOKEN_SIGNATURE, 60*5);

    const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const html = `<a href="${link}">verify your email</a>`;
    await sendEmail(email,'confirm email',html);

    return res.status(200).send(`<p>new confirm email send to your inbox </p>`);
}

export const sendCode = async (req, res, next) => {

    const {email} = req.body;

    let code = customAlphabet('1234567890ssABCDEFGHIJKLMNOPQRSTUVWXYZ',4); //this return function
    code = code();

    const user = await userModel.findOneAndUpdate({email: email},{forgetCode:code},{new:true});
    const html = `<p>code is ${code}</p>`;
    await sendEmail(email,`forgot your password`, html);
    return res.status(200).json({message:"success",user});
}

export const forgotPassword = async (req, res, next) => {

    const {email, password, code} = req.body;

    const user = await userModel.findOne({email: email});

    if(!user) {
        return next(new Error(`not registered account`,{cause:400}));
    }

    if(user.forgetCode!=code || !code) {
        return next(new Error(`invalid code`,{cause:400}));
    }

    user.password = hash(password);
    user.forgetCode = null;
    user.changePasswordTime = Date.now();
    await user.save();
    return res.status(200).json({message:"success",user});
}