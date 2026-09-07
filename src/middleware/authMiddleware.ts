import {type Request, type Response, type NextFunction} from "express";
import jwt from "jsonwebtoken";
import pool from "../db.ts";

interface JwtPayload {
    id: number;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({message: "JWT_SECRET is not configured"});
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;

        const user = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

        if (!user.rows[0]) {
            res.status(401).json({message: "User not found"});
            return;
        }

        req.user = user.rows[0];

        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({message: "Unauthorized"});
    }
};