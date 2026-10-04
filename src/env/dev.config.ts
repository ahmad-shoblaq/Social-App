import { config } from "dotenv"

config()

export const devConfig={
    PORT : process.env.PORT,
    DB_URL : process.env.DB_URL,
    EMAIL: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASS,
    CLOUDINARY_API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    JWT_SECRET: process.env.JWT_SECRET as string,
}