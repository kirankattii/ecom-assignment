import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
}

const generateToken = ({ id, email }: TokenPayload): string => {
  return jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES || "7d") as any,
    },
  );
};

export default generateToken;
