import { getOverviews } from '@/lib/db';

export default function handler(req, res) {
  try {
    const data = getOverviews(req.query);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
