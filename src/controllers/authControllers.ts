import {type Request, type Response} from 'express';
import bcrypt from "bcryptjs";
import pool from "../db.ts";
import {generateToken} from "../utils/generateToken.ts";

const register = async (req: Request, res: Response): Promise<void> => {
    const {name, email, password} = req.body;

    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExist.rows.length > 0) {
        res.status(400).json({message: "User already exists"});
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3) RETURNING *`,
        [name, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0].id, res);

    res.status(201).json({
        status: "Success",
        data: {
            user: {
                id: newUser.rows[0].id,
                name: name,
                email: email,
            }
        },
        token
    });

};

const login = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length <= 0) {
        res.status(400).json({message: "Invalid credentials"});
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

    if (!isPasswordValid) {
        res.status(400).json({message: "Invalid credentials"});
        return;
    }

    const token = generateToken(user.rows[0].id, res);

    res.status(201).json({
        status: "Success",
        data: {
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: email,
            }
        },
        token
    });
};

const logout = async (req: Request, res: Response): Promise<void> => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(201).json({
        status: "Success",
        message: "Logged out successfully",
    });
};

export {register, login, logout};