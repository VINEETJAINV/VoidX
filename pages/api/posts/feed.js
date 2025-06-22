import { supabase } from '../../../utils/supabaseClient';

export default async function handler(_, res) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error });
  res.status(200).json(data);
} 