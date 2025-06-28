import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  try {
    console.log('Profile Get API called');
    console.log('Request query:', req.query);
    const { userId } = req.query;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
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
