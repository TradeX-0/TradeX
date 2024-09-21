import { Router } from 'express';
import supabase from "../database/supabase.js";
import bodyParser from 'body-parser';

const router = Router();

router.use(bodyParser.json());

router.post('/remove', async (req, res) => {
    try {
        const { id, symbol } = req.body; // Get user ID from request body

        // Fetch stocks from the database for the specific user
        const { data, error } = await supabase
            .from('watchlist')
            .delete()
            .eq('user_id', id)
            .eq('symbol', symbol) // Filter by user ID


        if (error) {
            console.error("Error fetching stocks:", error);
            return res.status(500).json({ error: 'Error fetching stocks' });
        }

        // Check if there are stocks
            return res.send([]); // Send the fetched datazz
    } catch (error) {
        console.error('Error during fetching user stocks:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;