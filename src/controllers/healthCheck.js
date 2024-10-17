import ApiResponse from "../utils/ApiResponse.js";
import  async_handler  from "../utils/asyncHandler.js";
const healthcheck = async_handler(async (req, res) => {
    
    return res.status(200).
        json(new ApiResponse(200, " ok ", 'passed'))
})
export default healthcheck;

