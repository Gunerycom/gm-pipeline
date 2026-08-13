import { put, head } from '@vercel/blob';

const STATE_FILE_PATH = 'state/gm-pipeline-state.json';

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

  // Check if token exists
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({
      fallback: true,
      message: 'Vercel Blob token not configured yet. Running in offline/localStorage mode.'
    });
  }

  try {
    if (req.method === 'GET') {
      try {
        const details = await head(STATE_FILE_PATH);
        if (details && details.url) {
          const fetchRes = await fetch(details.url, { cache: 'no-store' });
          if (fetchRes.ok) {
            const data = await fetchRes.json();
            return res.status(200).json(data);
          }
        }
      } catch (err) {
        // State file not created yet
      }
      return res.status(200).json({});
    }

    if (req.method === 'POST') {
      const stateData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

      let blob;
      try {
        blob = await put(STATE_FILE_PATH, stateData, {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/json'
        });
      } catch (err) {
        blob = await put(STATE_FILE_PATH, stateData, {
          access: 'private',
          addRandomSuffix: false,
          contentType: 'application/json'
        });
      }

      return res.status(200).json({ success: true, url: blob.url });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vercel State API error:', error);
    return res.status(500).json({ error: error.message || 'State operation failed' });
  }
}
