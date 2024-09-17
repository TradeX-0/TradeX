import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';

const router = Router();

router.post('/mquotes', async (req, res) => {
    try {
        const symbols = Object.keys(req.body); // Expecting an object with stock names as keys
        
        console.log(symbols); // Log received symbols for debugging
        
        if (symbols.length === 0) {
            return res.status(400).send("No symbols provided.");
        }

        const quotes = await yahooFinance.quote(symbols, { fields:  ["regularMarketPrice", "currency"] });
        
        if (quotes && Object.keys(quotes).length > 0) {
            res.json(quotes);
        } else {
            res.status(404).send("Market prices not found for the provided symbols.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the quotes.");
    }
});

export default router;