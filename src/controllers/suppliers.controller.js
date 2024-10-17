import bcrypt from "bcrypt"
import async_handler from "../utils/asyncHandler.js";
import { supplierJoi } from "../validation/supplier.joi.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { supplierModel } from "../models/suppliers.model.js";
import { tappers } from "../models/tappers.model.js"



const registration = async_handler(async (req, res) => {
  const BoneID = req.body.Bone_id;
  
console.log(BoneID)
  const existingUser = await supplierModel.findOne({ Bone_id: BoneID });

  if (existingUser) {
    const apiError = new ApiError(400, "Supplier already exists");
    return res.status(apiError.statusCode).json(apiError);
  }

  const { error, value } = supplierJoi.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    const apiError = new ApiError(400, errors);
    return res.status(apiError.statusCode).json(apiError);
  }

  const { tappername, tapperphone, tapperplace, ...filterValues } = value;

  const generatePassword = Math.floor(1000 + Math.random() * 9000);
  const password = value.Bone_id + generatePassword;
  const hashPassword = await bcrypt.hash(password, 10);

  const generatePasswordTapper = Math.floor(1000 + Math.random() * 9000);
  const hashPasswordTapper = await bcrypt.hash(generatePasswordTapper.toString(), 10);

  const data = {
    name: tappername,
    phone: tapperphone,
    place: tapperplace,
    password: hashPasswordTapper,
    username: tapperphone
  };

  console.log(req.body)

  let tapper 
if(value.tappername !== ""){
   tapper = await tappers.create(data);
}


  // Then create the supplier
   const supplierCreated = await supplierModel.create({
    ...filterValues,
    password: hashPassword,
    tapper: tapper?tapper._id:null
  });

if(tapper){
  await tappers.updateOne(
    {_id:tapper._id},
    {$set:{supplier:supplierCreated._id}}
  ) ;
}
 
  return res.json(new ApiResponse(value, 201, "Supplier registered successfully", password));
});


//supplier login
const login = async_handler(async (req, res) => {
  const { error } = (req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    const apiError = new ApiError(400, { message: "Validation error", errors });
    return res.status(apiError.statusCode).json(apiError);
  }
  const { Bone_id, password } = req.body;
  const user = await supplierModel.findOne({ Bone_id });
  if (!user) {
    const apiError = new ApiError(400, "Invalid Bone_id");
    return res.status(apiError.statusCode).json(apiError);
  }
  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const apiError = new ApiError(400, "Invalid password ");
    return res.status(apiError.statusCode).json(apiError);
  }
  return res.json(new ApiResponse(200, "Success"))

})

// const supplierTapperRegistration = async_handler(async (req,res) => {
//   const BoneID = req.body.Bone_id;
//   const existingUser = await supplierModel.findOne({ Bone_id: BoneID });
//   if (existingUser) {
//     const apiError = new ApiError(400, "Supplier already exists");
//     return res.status(apiError.statusCode).json(apiError);
//   }
// })

export const supplier = {
  registration,
  login
}
