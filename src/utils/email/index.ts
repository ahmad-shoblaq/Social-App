import nodemailer from 'nodemailer';
import { devConfig } from '../../env/dev.config';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';

export const sendMail= async(mailOptions:MailOptions)=>{
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: devConfig.EMAIL,
            pass: devConfig.PASSWORD,
        }
    })
    await transporter.sendMail({
        from: `"Social-App" <${devConfig.EMAIL}>`,
        ...mailOptions,
    });
}