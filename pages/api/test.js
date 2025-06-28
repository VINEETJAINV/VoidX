import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  try {
    console.log('Test API called');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('Cloudinary Upload Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    // Test Supabase connection
    const { data, error } = await supabase
      .from('posts')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase test error:', error);
      return res.status(500).json({ 
        error: error.message,
        env: {
          supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          cloudinaryPreset: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        }
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Supabase connection working',
      data: data,
      env: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        cloudinaryPreset: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      }
    });
  } catch (err) {
    console.error('Test API error:', err);
    res.status(500).json({ 
      error: err.message,
      env: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        cloudinaryPreset: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      }
    });
  }
} 