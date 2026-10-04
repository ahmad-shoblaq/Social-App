import { User } from "../../DB";
import { UserRepository } from "../../DB";
import { BadRequestException, NotFoundException } from "../../utils";
import { VerifyEmailDTO } from "./auth.dto";

export const AuthProvider={
    async checkOTP(verifyEmailDTO:VerifyEmailDTO){

        const userRepository = new UserRepository();
        const userExist = await userRepository.getOne({email:verifyEmailDTO.email})

        if(!userExist) throw new NotFoundException('User is not found');
        
        // check otp 
        if(userExist?.otp != verifyEmailDTO.otp) throw new BadRequestException('invalid otp');
        
        // otp expired at 

        if(userExist.otpExpiryAt < new Date()) throw new BadRequestException('expired otp');
    }
}