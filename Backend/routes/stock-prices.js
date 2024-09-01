import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';

const router = Router();

router.get('/stock-price/:symbol/:interval', async (req, res) => {
    try {
        const { symbol, interval } = req.params;
        const quote = await yahooFinance.chart(symbol, { period1: '2024-08-25', interval:  interval});
        
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