import { GENDER } from "../../utils";

export default interface RegisterDTO{
        fullName?:string;
        email:string;
        password:string;
        phoneNumber?:string;
        gender:GENDER;
}

export interface  VerifyEmailDTO{
        email:string;
        otp:string;
}

export interface LoginDTO{
        email:string;
        password:string;
}