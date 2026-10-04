import bcrypt from "bcryptjs";

export const generateHash =(planText:string)=>{
    const hash = bcrypt.hashSync(planText,10);
    return hash;
}

export const compareHash = async (password:string,hashPassword:string)=>{
    return await bcrypt.compare(password,hashPassword);
}