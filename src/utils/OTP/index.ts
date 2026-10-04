export const generateOTP = ()=>{
    return JSON.stringify(Math.floor(Math.random()*900000+100000));
}

export const generateExpiryDate = (time:number)=>{
    return Date.now() + time ;
}