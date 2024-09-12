import { Router } from 'express';
import jwt from "jsonwebtoken"
import "dotenv/config"
import supabase from '../database/supabase.js';

const router = Router();

router.get('/getuser/:token', async (req, res) => {
    try {
        const { token } = req.params
        const user = jwt.verify(token, process.env.JWT_SECRET)
        let { data, error } = await supabase
            .from('users')
            .select('id, user_name, email, wallet') // Ensure you select the necessary fields
            .eq('email', user.email)
            .single(); // Use .single() to get a single user
        res.json(data)
    } catch (error) {
        res.status(500).send("An error occurred while fetching the quote.");
    }
});

export default router;