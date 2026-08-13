import { put, del, list } from '@vercel/blob';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if BLOB_READ_WRITE_TOKEN is available
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({
      fallback: true,
      message: 'Vercel Blob storage token not detected. Using local storage mode.'
    });
  }

  try {
    if (req.method === 'POST') {
      const filename = req.query.filename || `gm-take-${Date.now()}.webm`;
      const contentType = req.headers['content-type'] || 'audio/webm';

      const blob = await put(`voiceovers/${filename}`, req, {
        access: 'public',
        contentType
      });

      return res.status(200).json(blob);
    }

    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: 'voiceovers/' });
      return res.status(200).json(blobs);
    }

    if (req.method === 'DELETE') {
      const { url } = req.query;
      if (url) {
        await del(url);
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vercel Blob API error:', error);
    return res.status(500).json({ error: error.message || 'Blob operation failed' });
  }
}
