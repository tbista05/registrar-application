import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

export default function Details() {
  const { query } = useRouter();
  const { data, error } = useSWR(query.classid ? `/api/regdetails?classid=${query.classid}` : null, fetcher);

  if (error) return <p>Error loading details</p>;
  if (!data) return <p>Loading...</p>;
  if (data.error) return <p>{data.error}</p>;

  const d = data.data[0];
  return (
    <main className="p-4">
      <a href="/">← Back</a>
      <h1 className="text-xl mb-2">{d.title}</h1>
      <p><strong>Dept:</strong> {d.dept}</p>
      <p><strong>Professor:</strong> {d.profname}</p>
      <p><strong>Description:</strong> {d.descrip}</p>
    </main>
  );
}
