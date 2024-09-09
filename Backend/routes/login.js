import { Router } from 'express';
import supabase from "../database/supabase.js";
import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import "dotenv/config";

const router = Router();

router.use(bodyParser.json());

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if all inputs are provided
        if (!(email && password)) {
            return res.status(400).json({ error: 'All inputs are required' });
        }

        // Fetch user from the database
        let { data: users, error } = await supabase
            .from('users')
            .select('id, user_name, password') // Ensure you select the necessary fields
            .eq('email', email)
            .single(); // Use .single() to get a single user

        // Handle database errors
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }

        // Check if user exists
        if (!users) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, users.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: users.id, user_name: users.user_name, email: email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Optional: Set an expiration time for the token
        );

        // Respond with the token
        res.json({ token }); // You can also set the token as a cookie if needed

    } catch (error) { // Log the error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;