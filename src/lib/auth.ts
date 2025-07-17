import jwt from "jsonwebtoken";

const TOKEN_SECRET = process.env.TOKEN_SECRET!;

export const generateToken = (payload: object) => {
    return jwt.sign(payload, TOKEN_SECRET, {expiresIn: '1d'});
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, TOKEN_SECRET);
}