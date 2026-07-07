import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    // Bearer Token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Access token is required.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
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
