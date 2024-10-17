import async_handler from "../utils/asyncHandler.js";
import { drivers } from "../models/drivers.model.js";
import { driverjoi } from "../validation/driver.joi.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"


const register = async_handler(async (req, res) => {

    console.log(req.body)
  
    const { error, value } = driverjoi.validate(req.body, { abortEarly: false });

    if (error) {

      const errors = error.details.map(detail => detail.message);
      const apiError = new ApiError(400, errors);
      return res.status(apiError.statusCode).json(apiError);
      
    }

  const generatePassword = Math.floor(1000 + Math.random() * 9000);
  const hashPassword = await bcrypt.hash(generatePassword.toString(), 10);
  
    const data = {
      ...value,
      password: hashPassword,
      passwordREAL:generatePassword
    }
  
    const  {passwordREAL,...createdata} = data

    await drivers.create(createdata)
  
    return res.json(new ApiResponse(data, 201, "tapper registered successfully"))

  })

  export const driver = {
    register
  }