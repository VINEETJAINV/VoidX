import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { user_id, content, image_url, user_name, user_avatar } = req.body;
  if (!user_id || !content || !image_url) {
    return res.status(400).json({ error: "Missing user_id, content, or image_url" });
  }
  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id, content, image_url, user_name, user_avatar }]);
  if (error) return res.status(400).json({ error });
  res.status(200).json(data);
} 