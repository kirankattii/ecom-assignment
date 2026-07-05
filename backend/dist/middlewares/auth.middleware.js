// src/middlewares/auth.middleware.ts
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
const verifyJWT = (req, res, next) => {
    try {
        let token;
        // Bearer Token
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            throw new ApiError(401, "Access token is required.");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new ApiError(401, "Token has expired."));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError(401, "Invalid access token."));
        }
        next(error);
    }
};
export default verifyJWT;
