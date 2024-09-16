import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import mail from '../components/mail.js';
import "dotenv/config";

const router = Router();

router.use(bodyParser.json());

router.get('/verify-link/:token', async (req, res) => {
    const { token } = req.params; 
    console.log(token);

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        console.log(data.email);

        // Send email and check for success
        await mail(data.email, token);
        res.status(200).send({message: 'Email sent successfully. Please verify'}); // Success response
    } catch (error) {
        console.error('Error during token verification or email sending:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;