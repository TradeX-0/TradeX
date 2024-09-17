import { Router } from 'express';
import supabase from "../database/supabase.js";
import bodyParser from 'body-parser';

const router = Router();

router.use(bodyParser.json());

router.post('/close', async (req, res) => {
    const { id, symbol, balance } = req.body; // Get data from request body
    try {

        // Update the user's balance
        const { error: balanceError } = await supabase
            .from('users')
            .update({ wallet: balance.toFixed(2) }) // Update the user's balance
            .eq('id', id);

        if (balanceError) {
            console.error('Error updating user balance:', balanceError);
            return res.status(500).json({ error: 'Failed to update user balance' });
        }

        
        // Insert the purchased stock into the 'stocks' table
        const { data: stockData, error: stockError } = await supabase
            .from('stocks')
            .delete()
            .eq('user_id', id)
            .eq('stock_name', symbol)
            

        if (stockError) {
            console.error('Error inserting stocks:', stockError);
            return res.status(500).json({ error: 'Error buying stocks' });
        }

        

        return res.json({ response: 'Stock purchased successfully', stockData });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
