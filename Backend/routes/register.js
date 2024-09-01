import { Router } from 'express';
import supabase from "../database/supabase.js"
import bodyParser from 'body-parser';
import bcrypt from"bcrypt"
import jwt from 'jsonwebtoken';
import "dotenv/config"
import mail from '../components/mail.js';

const router = Router();


router.use(bodyParser.json());
router.post('/register', async (req, res) => {
    try {
        const { user_name, email, password } = req.body;
        if (!(user_name && email && password)) {
            return res.status(400).json({ error: 'All inputs are required' });
          }
        const encPass = await bcrypt.hash(password, 10)
        const { data, error } = await supabase
  .from('users')
  .insert({user_name : user_name, email: email, password : encPass})
  .select()
        if(error){
            console.error(error)
        }
        const id = data[0].id
        if(id){
            const token = jwt.sign(
                {id : id, email: email},
                process.env.JWT_SECRET
            );
            
            await mail(email, token).catch(console.error)
            res.cookie('token', token)
            res.status(200).send("User registered")
        }
        


    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the quote.");
    }
});

export default router;