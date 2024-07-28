import express from "express";
import stockPriceRoutes from "./routes/stock-prices.js"
import currentstockPriceRoutes from "./routes/current-stock-price.js"
import cors from 'cors';
const app = express();
const port = 3000;

app.use(cors());

app.use('/api', stockPriceRoutes);
app.use('/api', currentstockPriceRoutes);


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
