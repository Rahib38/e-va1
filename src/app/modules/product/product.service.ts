import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { IProduct } from "./product.interface";

const createProduct = async(userId:string,payload:IProduct)=>{

    const userExists = await prisma.user.findUniqueOrThrow(
        {
            where:{
                id:userId
            }
        }
    )

    if(!userExists){
        throw new ApiError(httpStatus.NOT_FOUND,"user not found")
    }

    if(userExists.role !== "ADMIN"){
        throw new ApiError(httpStatus.FORBIDDEN,"Only admin can create products")
    }

    const productData={
        name:payload.name,
        price:payload.price

    }

    const result = await prisma.product.create({
        data:productData
    })
    return result
}


const getAllProduct=async()=>{
    const result = await prisma.product.findMany()
    return result
}

export const ProductService={
    createProduct,getAllProduct
} 