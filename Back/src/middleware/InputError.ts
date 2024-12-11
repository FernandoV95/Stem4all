import { validationResult } from "express-validator"
import { Request,Response,NextFunction } from "express"

export const InputErrors = (req:Request,res:Response,next:NextFunction)=>{
    let error = validationResult(req)
    if(!error.isEmpty()){
        res.status(400).json({error:error.array()})
        return
    }
    next()
}
