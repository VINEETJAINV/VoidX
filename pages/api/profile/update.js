import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id, name, bio, avatar_url } = req.body;
  const { data, error } = await supabase
    .from('users')
    .upsert([{ id, name, bio, avatar_url }]);
  if (error) {
    console.error("Supabase error:", error);
    return res.status(400).json({ error });
  }
  res.status(200).json(data);
}
