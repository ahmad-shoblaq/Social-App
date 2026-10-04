import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB";
import { ConflictException, ForbiddenException, generateExpiryDate, generateOTP, generateToken, NotFoundException, sendMail } from "../../utils";
import { compareHash } from "../../utils/hash";
import RegisterDTO, { LoginDTO, VerifyEmailDTO } from "./auth.dto";
import { AuthProvider } from "./auth.provider";
import { AuthFactoryService } from "./factory";

class AuthService{
    private userRepository = new UserRepository();
    private authFactoryService = new AuthFactoryService();

    constructor(){}
     register = async(req:Request,res:Response,next:NextFunction)=>{
        
        const registerDTO: RegisterDTO = req.body;


        const userExist = await this.userRepository.getOne({email:registerDTO.email});
        
        if(userExist){
            throw new ConflictException('User already exist');
        }
        
        const user = this.authFactoryService.register(registerDTO);

        const createdUser = await this.userRepository.create(user);

        await sendMail({
            to: user.email,
            subject:"Verify your email",
            html:`<h1>Your OTP is ${user.otp}</h1>`
        })

        const result = {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber
        }
        return res.status(201).json({message:"user created successfully",success:true,data:result});
    }

    verifyEmail = async(req:Request,res:Response,next:NextFunction)=>{

        const verifyEmailDTO:VerifyEmailDTO = req.body;

        await AuthProvider.checkOTP(verifyEmailDTO);

        await this.userRepository.update({email:verifyEmailDTO.email},{isVerified:true,$unset:{otp:'',otpExpiryAt:''}})
        
        return res.status(200).json({message:"Email verified successfully",success:true});
    }

    resendOtp = async(req:Request,res:Response)=>{
    const { email } = req.body;

    const userExist = await this.userRepository.getOne({ email });
    if(!userExist) throw new NotFoundException("User not found");
    if(userExist.isVerified) throw new ConflictException("Email already verified");

    const otp = generateOTP();
    const otpExpiryAt = generateExpiryDate(5*60*1000);

    await this.userRepository.update({ email }, { otp, otpExpiryAt });

    await sendMail({
        to: email,
        subject: "Verify your email",
        html: `<p>Your OTP is ${otp}</p>`
    });

    return res.status(200).json({ message: "OTP resent successfully", success: true });
}

    logIn = async(req:Request,res:Response)=>{
    // get data from body
    const loginDTO:LoginDTO = req.body;

    // check email exist
    const userExist = await this.userRepository.exist({email:loginDTO.email});
    if(!userExist){
        throw new ForbiddenException("invalid credentials");
    }
    // check password correct
    if(!(await compareHash(loginDTO.password, userExist.password))){
        throw new ForbiddenException("invalid credentials");
    }
    // check email is verified
    if(!userExist.isVerified){
        throw new ForbiddenException("Please verify your email first");
    }
    // generate token
    const accessToken = generateToken({payload:{_id:userExist._id,role:userExist.role},options:{expiresIn:"1d"}});
    // send res
    res.status(200).json({
        message:"login successfully",
        success:true,
        data:{accessToken}  
    })
}
}

export default new AuthService(); 