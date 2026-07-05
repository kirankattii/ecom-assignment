// src/utils/generateToken.ts
import jwt from "jsonwebtoken";
const generateToken = ({ id, email }) => {
    return jwt.sign({
        id,
        email,
    }, process.env.JWT_SECRET, {
        expiresIn: (process.env.JWT_EXPIRES || "7d"),
    });
};
export default generateToken;
