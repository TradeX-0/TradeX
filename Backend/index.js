import express from "express";
import stockPriceRoutes from "./routes/stock-prices.js"
import currentstockPriceRoutes from "./routes/current-stock-price.js"
import quotesRoutes from "./routes/quotes.js"
import autocRoutes from "./routes/autoc.js"
import createUser from "./routes/register.js"
import verifyEmail from "./routes/email-verify.js"
import getUser from "./routes/getuser.js"
import loginUser from "./routes/login.js"
import userStokes from "./routes/user_stocks.js"
import verifyLink from "./routes/verify_link.js"
import Buy from "./routes/buy.js"
import Close from "./routes/close.js"
import Sell from "./routes/sell.js"
import mquotesRoutes from "./routes/mquotes.js"
import watchlist from "./routes/user_watchlist.js"
import remove from "./routes/removewatch.js"
import add from "./routes/add.js"
import transactions from "./routes/transactions.js"
import sendHistory from "./routes/send-history.js"
import cors from 'cors';



const app = express();
const port = 3000;

app.use(cors());

app.use('/api', stockPriceRoutes)
app.use('/api', currentstockPriceRoutes)
app.use('/api', quotesRoutes)
app.use('/api', autocRoutes)
app.use('/api', createUser)
app.use('/api', verifyEmail)
app.use('/api', getUser)
app.use('/api', loginUser)
app.use('/api', userStokes)
app.use('/api', verifyLink)
app.use('/api', Buy)
app.use('/api', Close)
app.use('/api', Sell)
app.use('/api', mquotesRoutes)
app.use('/api', watchlist)
app.use('/api', remove)
app.use('/api', add)
app.use('/api', transactions)
app.use('/api', sendHistory)

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
