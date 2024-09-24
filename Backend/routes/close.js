import { Router } from 'express';
import supabase from "../database/supabase.js";
import bodyParser from 'body-parser';

const router = Router();

router.use(bodyParser.json());

router.post('/close', async (req, res) => {
    const { id, symbol, balance, stock_name, price, quantity, close_price, type} = req.body; // Get data from request body
    try {
        let PL
        if(type == "BUY"){
            PL = ((close_price - price)*quantity).toFixed(2) 
        } else{
            PL = ((price - close_price)*quantity).toFixed(2)
        }
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
        


        const { error: transactionserror } = await supabase
            .from('transactions')
            .insert([
                {
                    "user_id": id,
                    "symbol": symbol,
                    "stock_name": stock_name,
                    "type": "BUY",
                    "open_price": price,
                    "close_price": close_price,
                    "quantity": quantity,
                    "total": (price*quantity).toFixed(2),
                    "PL": PL
                }
            ]);
            if (transactionserror) {
                console.error('Error inserting stocks:', quantity);
                return res.status(500).json({ error: 'Error buying stocks' });
            }
        

        return res.json({ response: 'Stock purchased successfully', stockData });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
