import BlogEditor from '@/components/blog/BlogEditor';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !post) {
        notFound();
    }

    return <BlogEditor initialPost={post} />;
}
