import { SYS_ROLE, USER_AGENT } from "../../../utils/common/enum";
import { generateHash } from "../../../utils/hash";
import { generateExpiryDate, generateOTP } from "../../../utils/OTP";
import RegisterDTO from "../auth.dto";
import { User } from "../entity";

export class AuthFactoryService{

    register=(registerDTO:RegisterDTO)=>{
        let user = new User();
        user.fullName = registerDTO.fullName as string;
        user.email = registerDTO.email;
        user.password = generateHash(registerDTO.password) as unknown as string;
        user.gender = registerDTO.gender;
        user.phoneNumber = registerDTO.phoneNumber as string;
        user.otp = generateOTP();
        user.otpExpiryAt = generateExpiryDate(5*60*1000) as unknown as Date;
        user.credentialUpdatedAt = Date.now() as unknown as Date;
        user.role = SYS_ROLE.user;
        user.user_agent = USER_AGENT.local;
        user.isVerified=false;
        return user;
    }
    

}   