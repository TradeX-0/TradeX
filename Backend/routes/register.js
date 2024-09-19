import { Router } from 'express';
import supabase from "../database/supabase.js";
import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import "dotenv/config";

const router = Router();

router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    try {
        const { user_name, email, password } = req.body;

        // Check if all inputs are provided
        if (!(user_name && email && password)) {
            return res.status(400).json({ error: 'All inputs are required' });
        }

        // Hash the password
        const encPass = await bcrypt.hash(password, 10);

        // Insert user into the database
        const { data, error } = await supabase
            .from('users')
            .insert({ user_name, email, password: encPass })
            .select();

        // Handle insertion errors
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Database error' });
        }

        // Generate JWT token
        const id = data[0].id;
        if (id) {
            const token = jwt.sign(
                { id, user_name, email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } // Optional: Set an expiration time for the token
            );

            res.json(token); 
        }

    } catch (error) {
        res.status(500);
    }
});

export default router;
