import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  try {
    console.log('Profile Update API called');
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    if (req.method !== 'POST') return res.status(405).end();
    const { id, name, bio, avatar_url } = req.body;
    const { data, error } = await supabase
      .from('users')
      .upsert([{ id, name, bio, avatar_url }]);
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
