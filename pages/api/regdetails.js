import { getDetails } from '@/lib/db';

export default function handler(req, res) {
  const { classid } = req.query;
  if (!classid) return res.status(400).json({ error: 'missing classid' });
  if (isNaN(Number(classid))) return res.status(400).json({ error: 'non-integer classid' });

  try {
    const data = getDetails(classid);
    if (!data.length) return res.status(404).json({ error: `no class with classid ${classid} exists` });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
