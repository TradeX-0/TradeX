import { createClient } from '@supabase/supabase-js'
import "dotenv/config"

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.PROJECT_URL, process.env.API_KEY)


export default supabase;