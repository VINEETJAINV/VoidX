import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  try {
    console.log('Create Post API called');
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    if (req.method !== 'POST') return res.status(405).end();
    const { user_id, content, image_url, user_name, user_avatar } = req.body;
    if (!user_id || !content || !image_url) {
      console.error('Missing fields:', { user_id, content, image_url });
      return res.status(400).json({ error: "Missing user_id, content, or image_url" });
    }
    const { data, error } = await supabase
      .from('posts')
      .insert([{ user_id, content, image_url, user_name, user_avatar }]);
    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
} 