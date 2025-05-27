import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import userModel from "../model/user.model.js";

const authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userModel
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(401).json(new ApiError(401, "Invalid Access Token"));
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, error.message || "Invalid access token"));
  }
};

export { authUser };
