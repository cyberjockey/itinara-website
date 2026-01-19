
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Environment Variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('Checking connection to:', supabaseUrl);

    const { data: posts, error } = await supabase
        .from('posts')
        .select('slug, title, status, published_at');

    if (error) {
        console.error('Error fetching posts:', error.message);
        return;
    }

    console.log(`Found ${posts.length} posts.`);
    posts.forEach(p => {
        console.log(`- [${p.status}] ${p.slug} (${p.title})`);
    });
}

checkData();
