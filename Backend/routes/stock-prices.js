import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';

const router = Router();

router.get('/stock-price/:symbol/:interval', async (req, res) => {
    try {
        const { symbol, interval } = req.params;
        

        function getDate(days) {
            // Get the current date
            const currentDate = new Date();
          
            // Subtract 6 days
            currentDate.setDate(currentDate.getDate() - days);
          
            // Format the date to yyyy-mm-dd
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(currentDate.getDate()).padStart(2, '0');
          
            return `${year}-${month}-${day}`;
          }
          
          let period = '0'

          if(interval == '1m'){
                period = getDate(6)
          }
          else if(interval == '5m' || interval == '15m' || interval == '1h'){
            const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
            period = currentTime - 2505600;
          }

          

        const quote = await yahooFinance.chart(symbol, { period1: period, interval:  interval});
        
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