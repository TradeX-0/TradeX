import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';

const router = Router();

router.get('/stock-price/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const quote = await yahooFinance.chart(symbol, { period1: '2024-08- 15', interval: '1m' });
        
        if (quote !== undefined) {
            res.json(quote)
        } else {
            res.status(404).send("Regular market price not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the quote.");
    }
});

export default router;