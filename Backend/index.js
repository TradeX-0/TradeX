import express from "express";
import stockPriceRoutes from "./routes/stock-prices.js"
import currentstockPriceRoutes from "./routes/current-stock-price.js"
import quotesRoutes from "./routes/quotes.js"
import autocRoutes from "./routes/autoc.js"
import createUser from "./routes/register.js"
import verifyEmail from "./routes/email-verify.js"
import cors from 'cors';



const app = express();
const port = 3000;

app.use(cors());

app.use('/api', stockPriceRoutes);
app.use('/api', currentstockPriceRoutes);
app.use('/api', quotesRoutes)
app.use('/api', autocRoutes)
app.use('/api', createUser)
app.use('/api', verifyEmail)


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
