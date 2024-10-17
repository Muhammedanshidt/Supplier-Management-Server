import async_handler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { tapperJoi } from "../validation/tapper.joi.js"
import { tappers } from "../models/tappers.model.js"
import { supplierModel } from "../models/suppliers.model.js"
import { tappingAct } from "../models/tappingActivity.model.js"


// tapper Registration

const register = async_handler(async (req, res) => {

  console.log(req.body)

  const { error, value } = tapperJoi.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    const apiError = new ApiError(400, errors);
    return res.status(apiError.statusCode).json(apiError);
  }


  const addSupplier = await supplierModel.findOne({ Bone_id: req.body.supplier })

  const data = {
    ...value,
    username: value.phone,
    supplier: addSupplier?._id,
    password: hashPassword
  }


  addSupplier.updateOne({ tappers: data._id })



  await tappers.create(data)

  return res.json(new ApiResponse(data, 201, "tapper registered successfully"))
})

// tapping update

const updateTapping = async_handler(async (req, res) => {

  const id = req.params.id
 
  const tapperFind = await tappers.findById({ _id: id })
  console.log(tapperFind)
  const data = {
    tapper: id,
    supplier: tapperFind.supplier,
    completed: true,
    count: req.body.count ? req.body.count : null
  }

  const createAct = await tappingAct.create(data)
  console.log("-------------------------------")
  console.log(createAct,"")
  console.log("-------------------------------")

  await tappers.updateOne({ _id: id }, { $addToSet: { tappingData: createAct?._id } })
  await supplierModel.updateOne({ _id: tapperFind.supplier }, { $addToSet: { tappingData: createAct?._id } })
  return res.json(new ApiResponse(data, 201, "success"))
})


// get tapping days 

const getTappingActivity = async_handler(async (req, res) => {
  console.log("-------------------------------")
  const id = req.params.id
  console.log("-------------------------------")
  console.log(id);
  console.log("-------------------------------")
 
  try {
    const findTapper = await tappers.findById({ _id: id }).populate({
      path: "tappingData",
      select: "createdAt updatedAt"
    })
    console.log(findTapper)
    res.send(findTapper)
  } catch (error) {
    res.send(error)
  }
})


export default {
  register,
  updateTapping,
  getTappingActivity
}