import { Admin } from "../models/admin.model.js";
import async_handler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import { supplierModel } from "../models/suppliers.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { latex } from "../models/latex.model.js";
import { tappers } from "../models/tappers.model.js";
import { drivers } from "../models/drivers.model.js";


// create_admin-----------------------------------------
const admin_creating = async_handler(async (req, res) => {
   const { username, password } = req.body;

   const hashedPassword = await bcrypt.hash(password, 10);
   const newAdmin = new Admin({ username, password: hashedPassword });
   await newAdmin.save();
   res.status(201).json({ message: 'Admin registered successfully' });
});

// admin login------------------------------------------
const admin_login = async_handler(async (req, res) => {

   const { username, password } = req.body

   const admin = await Admin.findOne({ username });
   if (!admin) return res.status(400).json({ error: 'Invalid username' });

   const isMatch = await bcrypt.compare(password, admin.password);
   if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

   const adminToken = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

   res.json({
      message: "Admin logined successfully",
      adminToken
   });
})

// suppliers listing----------------------------------------
const supplier_listing = async_handler(async (req, res) => {
   try {
      const data = await supplierModel.find().select('id Bone_id name location category phone createdAt isActive');
      if (!data || data.length === 0) {
         const apiError = new ApiError(404, "No suppliers found");
         return res.status(apiError.statusCode).json(apiError);
      }
      return res.json(new ApiResponse(data, 200, "Suppliers retrieved successfully"));

   } catch (error) {
      const apiError = new ApiError(500, "An error occurred while retrieving suppliers");
      return res.status(apiError.statusCode).json(apiError);
   }
});


// get specific supplier---------------------------------
const supplier_find = async_handler(async (req, res) => {
   const id = req.params.id
   const supplierProfile = await supplierModel.findOne({ Bone_id: id })
   return res.json(new ApiResponse(supplierProfile, 200, "Suppliers retrieved successfully"));
})


// Add latex

const daily_latex_add = async_handler(async (req, res) => {
   try {
      const body = req.body.data.slice(1);
      const date = req.body.data[0];
      const createDataArray = [];
      const supplierLatexUpdates = [];

      for (const supplier of body) {
         const findSupplier = await supplierModel.findOne({ Bone_id: supplier.supplierCode });

         if (!findSupplier) {
            console.error(`Supplier not found for code: ${supplier.supplierCode}`);
            continue;
         }

         const jars = parseInt(supplier.bigJarsCount) + parseInt(supplier.smallJarsCount);

         const createData = {
            owner: findSupplier._id,
            supplierName: supplier.supplierName,
            supplierCode: supplier.supplierCode,
            total_weight: supplier.grossWeight,
            jars,
            small_jar: supplier.smallJarsCount,
            big_jar: supplier.bigJarsCount,
            jars_weight: supplier.jarsWeight ? supplier.jarsWeight.toFixed(2) : 0,
            latex_weight: supplier.latexWeight ? supplier.latexWeight.toFixed(2) : 0,
            date
         };

         createDataArray.push(createData);
      }

      if (createDataArray.length > 0) {

         const insertedLatex = await latex.insertMany(createDataArray, { ordered: false });

         for (const inserted of insertedLatex) {
            supplierLatexUpdates.push({
               updateOne: {
                  filter: { Bone_id: inserted.supplierCode },
                  update: { $addToSet: { latex: inserted._id } }
               }
            });
         }

         if (supplierLatexUpdates.length > 0) {
            await supplierModel.bulkWrite(supplierLatexUpdates);
         }

         return res.json(new ApiResponse(createDataArray, 200, "Latex added successfully"));

      }
      else {
         return res.json(new ApiResponse([], 200, "No valid suppliers found"));
      }

   }
   catch (error) {
      console.error("Error adding latex data:", error);
      const apiError = new ApiError(500, "An error occurred while adding latex data");
      return res.status(apiError.statusCode).json(apiError);
   }
});



// update supplier profile-------------------------------------
const upadteSupplierProfile = async_handler(async (req, res) => {
   const { id } = req.params
   const updatedSupplier = await supplierModel
      .findByIdAndUpdate({ _id: id }, req.body, { new: true })
      .populate("tappers");
   if (!updatedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
   }
   return res.json(new ApiResponse(updatedSupplier, 200, "Profile updated successfully"))
})

// Delete Supplier----------------------------------------
const deleteSupplier = async_handler(async (req, res) => {
   const { id } = req.params
   const deletedSupplier = await supplierModel.findByIdAndDelete({ _id: id })
   return res.json(new ApiResponse(deletedSupplier, 200, "Supplier deleted successfully"))
})

//Get Tapper

const tappersFind = async_handler(async (req, res) => {
   try {
      const data = await tappers.find().select('id name phone supplier  createdAt place');
      if (!data || data.length === 0) {
         const apiError = new ApiError(404, "No suppliers found");
         return res.status(apiError.statusCode).json(apiError);
      }
      const aggregateData = await tappers.find()
         .populate('supplier')
      return res.json(new ApiResponse(aggregateData, 200, "tappers retrieved successfully"));
   } catch (error) {
      const apiError = new ApiError(500, "An error occurred while retrieving suppliers");
      return res.status(apiError.statusCode).json(apiError);
   }
})

// find specific tapper

const tapperFind = async_handler(async (req, res) => {
   try {
      const id = req.params.id
      const data = await tappers.findById(id).populate("tappingData")
      return res.json(new ApiResponse(data, 200, "tapper retrieved successfully"));
   } catch (error) {
      const apiError = new ApiError(500, "An error occurred while retrieving suppliers");
      return res.status(apiError.statusCode).json(apiError);
   }
})


// update tapper

const tapperUpdate = async_handler(async (req, res) => {
   try {
      const id = req.query.id;
      const body = req.body;
      const tapper = await tappers.findOne({ _id: id });
      if (!tapper) {
         const apiError = new ApiError(404, "Tapper not found");
         return res.status(apiError.statusCode).json(apiError);
      }
      await tapper.updateOne(body);
      return res.json(new ApiResponse(tapper, 200, "Tapper Update Successfully"));
   } catch (error) {
      const apiError = new ApiError(500, "Tapper Update Failed");
      return res.status(apiError.statusCode).json(apiError);
   }
});


// get all drivers

const driver_listing = async_handler(async (req, res) => {
   const data = await drivers.find().select('-password')
   if (data) {
      return res.json(new ApiResponse(data, 200, "get drivers Successfully"));
   } else {
      const apiError = new ApiError(404, "drivers not found");
      return res.status(apiError.statusCode).json(apiError);
   }
})


// add drivers area 

const add_driver_area = async_handler(async (req, res) => {
   try {
      const id = req.query.id
      const body = req.body
      const findDriver = await drivers.findById(id);
      const existingArea = findDriver.latex_area
      if (findDriver) {
         const newAreas = body.latexarea.filter(area => !existingArea.includes(area))
         if (newAreas.length > 0) {
            const update = await drivers.updateOne(
               { _id: id }, { $push: { latex_area: { $each: newAreas } } }
            )
            return res.json(new ApiResponse(update, 200, "Area update success"))
         }
         else {
            return res.json(new ApiError(400, "No new areas to add"));
         }
      } else {
         return res.json(new ApiError(404, "no driver"))
      }
   } catch (error) {
      const apiError = new ApiError(500, "Area Update Failed");
      return res.status(apiError.statusCode).json(apiError);
   }
})

// get driver area supplier

const driver_supplier = async_handler(
   async (req, res) => {
      const id = req.query.id;
      try {
         const driver = await drivers.findById(id);
         const DriverArea = driver.latex_area;
         const suppliers = await supplierModel.find();
         const resArray = [];
         DriverArea.forEach(place => {
            suppliers.forEach(supplier => {
               if (supplier.location.toLowerCase() === place.toLowerCase()) {
                  if (!resArray.some(existingSupplier => existingSupplier._id.toString() === supplier._id.toString())) {
                     resArray.push(supplier);
                  }
               }
            });
         });

         res.send(resArray);
      } catch (error) {
         return res.json(new ApiError(404, "Supplier retrieval failed"));
      }
   }
);


// get latex retrival data

const supplier_latexdata = async_handler(async (req, res) => {

   const { supplierId, start, end } = req.query;

   console.log(req.query)

   let dates = {};

   const startDate = start ? new Date(start) : null;

   console.log(startDate)

   const endDate = end ? new Date(end) : null;
   console.log(endDate)

   if (startDate && endDate) {
      dates = {
         date: {
            $gte: startDate,
            $lte: endDate,
         },
      };
   } else if (startDate) {
      dates = {
         date: {
            $gte: startDate,
         },
      };
   } else if (endDate) {
      dates = {
         date: {
            $lte: endDate,
         },
      };
   }

   console.log(supplierId,"----------------")

   try {
        const supplier = await supplierModel.findOne({ Bone_id: supplierId }).populate({
          path: 'latex',
          match: dates
        });
      console.log(supplier);
      return res.status(200).json(new ApiResponse(supplier, 200, "Latex retrieval successful"));
   } catch (error) {
      console.error("Error retrieving latex: ", error);
      return res.status(500).json(new ApiError(500, "Latex retrieval failed"));
   }
});

// add drcupdation

const drc_updation = async_handler ( async (req,res) => {
console.log(res.body)
})

export default {
   admin_login,
   supplier_listing,
   supplier_find,
   daily_latex_add,
   upadteSupplierProfile,
   deleteSupplier,
   tappersFind,
   tapperFind,
   tapperUpdate,
   driver_listing,
   add_driver_area,
   driver_supplier,
   supplier_latexdata,
   drc_updation
}
