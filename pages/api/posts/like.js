import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { postId, count } = req.body;

  // Fetch current likes
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('total_likes')
    .eq('id', postId)
    .single();

  if (fetchError || !post) return res.status(400).json({ error: fetchError || "Post not found" });

  const newLikes = (post.total_likes || 0) + (count || 1);

  const { error } = await supabase
    .from('posts')
    .update({ total_likes: newLikes })
    .eq('id', postId);

  if (error) return res.status(400).json({ error });
  res.status(200).json({ success: true, total_likes: newLikes });
} 