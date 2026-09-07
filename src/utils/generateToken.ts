import jwt from 'jsonwebtoken';
import {type Response} from 'express';

export const generateToken = (userId: number, res: Response) => {
    const payload = {id: userId};

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '10m'
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1000 * 60 * 10,
    });

    return token;
}

/**
 * openssl rand -base64 32
 * creates a random string of 32 characters
 */