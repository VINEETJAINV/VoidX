import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  const { userId } = req.query;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return res.status(400).json({ error });
  res.status(200).json(data);
}
