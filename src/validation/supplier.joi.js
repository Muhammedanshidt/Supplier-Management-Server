import Joi from 'joi';

export const supplierJoi = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.base": `name must be a string`,
        "string.empty": "Name is required",
        "string.min": `name must be at least 3 characters long`,
        "string.max": `name must be at most 30 characters long`,
        "any.required": `name is required`
    }),
    password: Joi.string().min(4).max(10).messages({
        "string.base": `password must be a string`,
        "string.empty": "Password is required",
        "string.min": `password must be at least 4 characters long`,
        "string.max": `password must be at most 10 characters long`
    }),
    phone: Joi.string().pattern(new RegExp("^((\\+91)|(91))?[6-9]\\d{9}$")).required().messages({
        "string.base": "Phone number should be a type of text",
        "string.empty": "Phone number is required",
        "string.pattern.base": "Enter a valid phone number"
    }),
    Bone_id: Joi.string().required().messages({
        "string.base": "Bone id must be a string",
        "any.required": "Bone id is required"
    }),
    address: Joi.string().required().messages({
        "string.base": `address must be a string`,
        "string.empty": "Address is required",
        "any.required": `address is required`
    }),
    location: Joi.string().required().messages({
        "string.base": `location must be a string`,
        "string.empty": "Location is required",
        "any.required": `location is required`
    }),
    category: Joi.string().valid("Daily Collection",
        "Alternative Day Collection",
        "Barrel Collection",
        "Lease Plantation",
        "Slaughter Plantation").required().messages({
            "string.base": `category must be a string`,
            "string.empty": "Category is required",
            "any.required": `category is required`,
            "any.allowOnly": `category must be one of ["Daily Collection",
                    "Alternative Day Collection",
                    "Barrel Collection",
                    "Lease Plantation",
                    "Slaughter Plantation"]`
        }),
    GST: Joi.string().allow(''),
    state: Joi.string().allow(''),
    state_code: Joi.number().optional(),
    account_no: Joi.string().allow(''),
    ifsc: Joi.string().allow(''),
    RBD_no: Joi.string().allow(''),
    remarks: Joi.string().allow(''),
    refresh_token: Joi.string().allow(''),
    min_latex: Joi.number().optional(),
    tappername:Joi.string().optional().allow(''),
    tapperphone:Joi.string().optional().allow(''),
    tapperplace:Joi.string().optional().allow(''),
})
