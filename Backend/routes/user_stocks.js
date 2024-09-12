import { Router } from 'express';
import supabase from "../database/supabase.js";
import bodyParser from 'body-parser';

const router = Router();

router.use(bodyParser.json());

router.post('/user-stocks', async (req, res) => {
    try {
        const { id } = req.body; // Get user ID from request body

        // Fetch stocks from the database for the specific user
        const { data, error } = await supabase
            .from('stocks')
            .select('*') // Select all columns
            .eq('user_id', id); // Filter by user ID


        if (error) {
            console.error("Error fetching stocks:", error);
            return res.status(500).json({ error: 'Error fetching stocks' });
        }

        // Check if there are stocks
        if (data.length === 0) {
            return res.send([]); // Send an empty array if no stocks found
        } else {
            return res.send(data); // Send the fetched data
        }
    } catch (error) {
        console.error('Error during fetching user stocks:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;