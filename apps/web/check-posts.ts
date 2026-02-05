
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// FORCE ANON KEY to test public access
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Using Key ending in:', supabaseKey?.slice(-6));

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPosts() {
    console.log('Checking posts join...');

    // Test the specific query we are using
    const { data, error } = await supabase
        .from('posts')
        .select(`
        id,
        title,
        author:profiles(full_name, avatar_url)
    `)
        .limit(1);

    if (error) {
        console.error('Error fetching posts with join:', JSON.stringify(error, null, 2));
        return;
    }

    console.log('Success with alias:', JSON.stringify(data, null, 2));
}

checkPosts();
