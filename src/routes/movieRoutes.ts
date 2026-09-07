import express, {type Router, type Request, type Response} from "express";
import {authMiddleware} from "../middleware/authMiddleware.ts";

const router: Router = express.Router();

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response): Promise<void> => {

    const user = req.user;

    res.status(200).json({
        message: "Hello from movie routes",
        data: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {

    const user = req.user;
    const urlId = req.params.id;

    res.status(200).json({
        message: "Movie Deleted Successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            url_id: urlId
        }
    });
});

export default router;