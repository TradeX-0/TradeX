import { Router } from 'express';
import jwt from "jsonwebtoken"
import "dotenv/config"

const router = Router();

router.get('/getuser/:token', async (req, res) => {
    try {
        const { token } = req.params
        const user = jwt.verify(token, process.env.JWT_SECRET)
        res.json(user)
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the quote.");
    }
});

export default router;