import { Router } from 'express';
import supabase from "../database/supabase.js"
import "dotenv/config"
import jwt from "jsonwebtoken"

const router = Router();

router.get('/email_verify/:token', async (req, res) => {
    const { token } = req.params
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    var userId = decoded.id;
    if(!decoded){
        res.json({response: "not ok"})
    }
    
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ email_Verified: "true" })
            .eq('id', userId)
            .select();

        if (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ error: 'Failed to update user' });
        }
        res.json({response: "ok"});
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }

});

export default router;