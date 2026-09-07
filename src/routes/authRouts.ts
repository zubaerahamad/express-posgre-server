import express, {type Router} from 'express';
import {register, login, logout} from "../controllers/authControllers.ts";

const router: Router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

export default router;