import { getOverviews } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const data = await getOverviews(req.query);   // ✅ await
    res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('regoverviews error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
